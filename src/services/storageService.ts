// Types
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface CompanyData {
  id?: string;
  cnpj: string;
  razaoSocial: string;
  setor: string;
  subsetor: string;
  arrFy24: number; // Annual Recurring Revenue FY24 (US$)
  receitaBrutaFy24: number; // Gross Revenue FY24 (US$)
  faturamentoAnual: number; // Legacy field
  margem: number; // Legacy field - EBITDA Margin (%)
  margemEbitda: number; // EBITDA Margin (%)
  crescimentoReceita: number; // Revenue Growth (%)
  ebitda: number; // Legacy field
  valuationMultiplo: number; // EV/Revenue multiple
  riscoOperacional: string; // Operational Risk (Alto, Médio, Baixo)
  insightsQualitativos: string; // Qualitative Insights
  nota: number; // Score (0-10)
  statusAprovacao: string; // Approval Status (Aprovado, Em Avaliação, Não Aprovado)
  qsa: QuadroSocietario[];
  createdAt?: number;
  weightedScore?: number; // Added to fix TypeScript error in RankingSystem component
}

export interface QuadroSocietario {
  id: string;
  nome: string;
  documento: string;
  participacao: number;
}

// Checar se o Supabase está configurado e disponível
const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // First check if we have valid credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-url.supabase.co' || 
        supabaseAnonKey === 'your-anon-key') {
      console.warn('Credenciais do Supabase inválidas ou não configuradas. Usando localStorage como fallback.');
      return false;
    }
    
    // Then try to connect to the database
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error.message);
      return false;
    }
    
    console.log('Supabase conectado com sucesso!');
    return true;
  } catch (err) {
    console.error('Supabase não disponível:', err);
    return false;
  }
};

// Save a company to Supabase or localStorage as fallback
export const saveCompany = async (data: CompanyData): Promise<CompanyData> => {
  try {
    const newCompany = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      console.log("Salvando no Supabase:", newCompany);
      
      // Check if company with this CNPJ already exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('cnpj', data.cnpj)
        .maybeSingle();
      
      let result;
      
      if (existingCompany) {
        // Update existing company
        const { data: updatedCompany, error } = await supabase
          .from('companies')
          .update(newCompany)
          .eq('id', existingCompany.id)
          .select()
          .single();
        
        if (error) {
          console.error("Erro ao atualizar no Supabase:", error);
          throw error;
        }
        result = updatedCompany;
        
        toast({
          title: "Sucesso",
          description: "Empresa atualizada com sucesso no Supabase!",
        });
      } else {
        // Add new company
        const { data: insertedCompany, error } = await supabase
          .from('companies')
          .insert(newCompany)
          .select()
          .single();
        
        if (error) {
          console.error("Erro ao inserir no Supabase:", error);
          throw error;
        }
        result = insertedCompany;
        
        toast({
          title: "Sucesso",
          description: "Empresa cadastrada com sucesso no Supabase!",
        });
      }
      
      return result as CompanyData;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      
      // Get existing companies from localStorage
      const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      // Check if company with this CNPJ already exists
      const existingIndex = existingCompanies.findIndex((c: CompanyData) => c.cnpj === data.cnpj);
      
      if (existingIndex >= 0) {
        // Update existing company
        existingCompanies[existingIndex] = newCompany;
        toast({
          title: "Sucesso", 
          description: "Empresa atualizada com sucesso (localStorage)!"
        });
      } else {
        // Add new company
        existingCompanies.push(newCompany);
        toast({
          title: "Sucesso", 
          description: "Empresa cadastrada com sucesso (localStorage)!"
        });
      }
      
      // Save updated companies to localStorage
      localStorage.setItem('companies', JSON.stringify(existingCompanies));
      
      return newCompany;
    }
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao salvar os dados da empresa.",
      variant: "destructive"
    });
    throw error;
  }
};

// Get all companies from Supabase or localStorage as fallback
export const getCompanies = async (): Promise<CompanyData[]> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      return data as CompanyData[];
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies;
    }
  } catch (error) {
    console.error('Erro ao carregar as empresas:', error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao carregar as empresas.",
      variant: "destructive"
    });
    return [];
  }
};

// Get a specific company by ID
export const getCompanyById = async (id: string): Promise<CompanyData | null> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as CompanyData;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.id === id) || null;
    }
  } catch (error) {
    console.error('Erro ao carregar empresa por ID:', error);
    return null;
  }
};

// Get a specific company by CNPJ
export const getCompanyByCNPJ = async (cnpj: string): Promise<CompanyData | null> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('cnpj', cnpj)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data as CompanyData || null;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.cnpj === cnpj) || null;
    }
  } catch (error) {
    console.error('Erro ao carregar empresa por CNPJ:', error);
    return null;
  }
};

// Delete a company
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const filteredCompanies = companies.filter((c: CompanyData) => c.id !== id);
      localStorage.setItem('companies', JSON.stringify(filteredCompanies));
      return true;
    }
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    return false;
  }
};

// Utility function for ranking companies based on criteria
export const getRankedCompanies = (companies: CompanyData[], weights: Record<string, number> = {}): CompanyData[] => {
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

// Get sectors and subsectors for filtering
export const getSectorsAndSubsectors = async (): Promise<{sectors: string[], subsectors: string[]}> => {
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
