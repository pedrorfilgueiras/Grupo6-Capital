
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
    }
  ];
};

export const saveCompanyToStorage = (company: SmartDataCompany): void => {
  try {
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
