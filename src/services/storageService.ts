
// Types
export interface CompanyData {
  id?: string;
  cnpj: string;
  razaoSocial: string;
  faturamentoAnual: number;
  margem: number;
  ebitda: number;
  qsa: QuadroSocietario[];
  createdAt?: number;
}

export interface QuadroSocietario {
  id: string;
  nome: string;
  documento: string;
  participacao: number;
}

// Use localStorage for now as a demonstration
// In a real app, you would replace this with an API service

// Save a company to storage
export const saveCompany = (data: CompanyData): CompanyData => {
  const companies = getCompanies();
  
  // Generate a unique ID if none exists
  const newCompany = {
    ...data,
    id: data.id || `company_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now()
  };
  
  // Check if company with this CNPJ already exists
  const existingIndex = companies.findIndex(company => company.cnpj === data.cnpj);
  
  if (existingIndex >= 0) {
    // Update existing company
    companies[existingIndex] = newCompany;
  } else {
    // Add new company
    companies.push(newCompany);
  }
  
  // Save to localStorage
  localStorage.setItem('grupo6_companies', JSON.stringify(companies));
  
  return newCompany;
};

// Get all companies from storage
export const getCompanies = (): CompanyData[] => {
  const companiesData = localStorage.getItem('grupo6_companies');
  return companiesData ? JSON.parse(companiesData) : [];
};

// Get a specific company by ID
export const getCompanyById = (id: string): CompanyData | null => {
  const companies = getCompanies();
  return companies.find(company => company.id === id) || null;
};

// Get a specific company by CNPJ
export const getCompanyByCNPJ = (cnpj: string): CompanyData | null => {
  const companies = getCompanies();
  return companies.find(company => company.cnpj === cnpj) || null;
};

// Delete a company
export const deleteCompany = (id: string): boolean => {
  const companies = getCompanies();
  const filteredCompanies = companies.filter(company => company.id !== id);
  
  if (filteredCompanies.length < companies.length) {
    localStorage.setItem('grupo6_companies', JSON.stringify(filteredCompanies));
    return true;
  }
  
  return false;
};
