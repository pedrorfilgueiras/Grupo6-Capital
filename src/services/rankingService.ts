
import { CompanyData, RankingWeights, FilterResponse } from './types';
import { getCompanies } from './companyService';

// Get sectors and subsectors for filtering
export const getSectorsAndSubsectors = async (): Promise<FilterResponse> => {
  try {
    const companies = await getCompanies();
    
    // Extract unique sectors and subsectors
    const sectors = [...new Set(companies.map(c => c.setor).filter(Boolean))];
    const subsectors = [...new Set(companies.map(c => c.subsetor).filter(Boolean))];
    
    return { sectors, subsectors };
  } catch (error) {
    console.error('Erro ao obter setores e subsetores:', error);
    return { sectors: [], subsectors: [] };
  }
};

// Utility function for ranking companies based on criteria
export const getRankedCompanies = (companies: CompanyData[], weights: Partial<RankingWeights> = {}): CompanyData[] => {
  // Default weights if not provided
  const defaultWeights = {
    nota: 30,              // Score weight
    margemEbitda: 20,      // EBITDA margin weight
    crescimentoReceita: 20, // Revenue growth weight
    valuationMultiplo: 15, // Valuation multiple weight
    riscoOperacional: 15   // Operational risk weight (will be converted to number)
  };
  
  // Merge provided weights with defaults
  const finalWeights = { ...defaultWeights, ...weights };
  
  // Convert risk level to numeric value
  const riskToNumber = (risk: string): number => {
    switch(risk.toLowerCase()) {
      case 'baixo': return 10;  // Low risk
      case 'médio': return 5;   // Medium risk
      case 'alto': return 1;    // High risk
      default: return 5;        // Default medium
    }
  };
  
  // Calculate weighted score for each company
  const companiesWithRank = companies.map(company => {
    // Convert risk to numeric value
    const riskScore = riskToNumber(company.riscoOperacional || 'médio');
    
    // Calculate weighted score components
    const scoreComponent = (company.nota || 0) * (finalWeights.nota / 100);
    const marginComponent = (company.margemEbitda || 0) * (finalWeights.margemEbitda / 100);
    const growthComponent = (company.crescimentoReceita || 0) * (finalWeights.crescimentoReceita / 1000); // Adjust for percentage
    const valuationComponent = 10 - Math.min((company.valuationMultiplo || 0), 10) * (finalWeights.valuationMultiplo / 100); // Lower is better
    const riskComponent = riskScore * (finalWeights.riscoOperacional / 100);
    
    // Calculate total weighted score
    const weightedScore = scoreComponent + marginComponent + growthComponent + valuationComponent + riskComponent;
    
    return {
      ...company,
      weightedScore: parseFloat(weightedScore.toFixed(2))
    };
  });
  
  // Sort by weighted score (descending)
  return companiesWithRank.sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0));
};

