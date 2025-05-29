
// Serviço para dados inteligentes das empresas analisadas
export interface SmartDataCompany {
  id: string;
  name: string;
  ticker: string;
  revenue: number;
  growth: number;
  ebitdaMargin: number;
  riskLevel: string;
}

export const getSmartDataCompanies = (): SmartDataCompany[] => {
  return [
    {
      id: 'lfmd',
      name: 'LifeMD',
      ticker: 'LFMD',
      revenue: 213.4,
      growth: 43,
      ebitdaMargin: 4.24,
      riskLevel: 'Moderado'
    },
    {
      id: 'irmd',
      name: 'IRadimed Corporation',
      ticker: 'IRMD',
      revenue: 73.2,
      growth: 12,
      ebitdaMargin: 0, // N/A
      riskLevel: 'Baixo'
    },
    {
      id: 'talk',
      name: 'Talkspace Inc.',
      ticker: 'TALK',
      revenue: 187.6,
      growth: 25,
      ebitdaMargin: 3.73,
      riskLevel: 'Médio'
    },
    {
      id: 'ccel',
      name: 'Cryo-Cell International Inc.',
      ticker: 'CCEL',
      revenue: 67.8,
      growth: 8,
      ebitdaMargin: 15.2,
      riskLevel: 'Baixo'
    },
    {
      id: 'dffn',
      name: 'Diffusion Pharmaceuticals Inc.',
      ticker: 'DFFN',
      revenue: 2.1,
      growth: -12,
      ebitdaMargin: -450.0,
      riskLevel: 'Alto'
    },
    {
      id: 'atxi',
      name: 'Avenue Therapeutics Inc.',
      ticker: 'ATXI',
      revenue: 0.5,
      growth: -25,
      ebitdaMargin: -800.0,
      riskLevel: 'Crítico'
    },
    {
      id: 'rgnx',
      name: 'REGENXBIO Inc.',
      ticker: 'RGNX',
      revenue: 89.3,
      growth: 35,
      ebitdaMargin: -15.6,
      riskLevel: 'Médio'
    },
    {
      id: 'cgem',
      name: 'Cullinan Oncology Inc.',
      ticker: 'CGEM',
      revenue: 12.4,
      growth: 180,
      ebitdaMargin: -120.0,
      riskLevel: 'Alto'
    },
    {
      id: 'aneb',
      name: 'Anebulo Pharmaceuticals Inc.',
      ticker: 'ANEB',
      revenue: 3.2,
      growth: 45,
      ebitdaMargin: -250.0,
      riskLevel: 'Alto'
    },
    {
      id: 'fbrx',
      name: 'Forte Biosciences Inc.',
      ticker: 'FBRX',
      revenue: 1.8,
      growth: -30,
      ebitdaMargin: -400.0,
      riskLevel: 'Crítico'
    }
  ];
};

export const saveCompanyToStorage = async (company: SmartDataCompany): Promise<void> => {
  try {
    // Primeiro verificar se a empresa já existe no localStorage
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    const existingIndex = companies.findIndex((c: any) => c.id === company.id);
    
    const companyToSave = {
      id: company.id,
      razaoSocial: `${company.name} (${company.ticker})`,
      cnpj: `${company.ticker}-SMART-DATA`,
      setor: 'Análise Inteligente',
      createdat: Date.now()
    };
    
    if (existingIndex >= 0) {
      companies[existingIndex] = companyToSave;
    } else {
      companies.push(companyToSave);
    }
    
    localStorage.setItem('companies', JSON.stringify(companies));
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
  }
};

// Função para salvar todas as empresas dos dados inteligentes
export const saveAllSmartCompaniesToStorage = async (): Promise<void> => {
  const smartCompanies = getSmartDataCompanies();
  for (const company of smartCompanies) {
    await saveCompanyToStorage(company);
  }
};
