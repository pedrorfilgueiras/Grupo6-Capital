
// Types for company data and related interfaces
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

// Type for ranking weights
export interface RankingWeights {
  nota: number;
  margemEbitda: number;
  crescimentoReceita: number;
  valuationMultiplo: number;
  riscoOperacional: number;
}

// Type for filter responses
export interface FilterResponse {
  sectors: string[];
  subsectors: string[];
}

