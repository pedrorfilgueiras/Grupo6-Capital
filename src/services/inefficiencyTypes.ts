
export interface InefficientyEntry {
  id: string;
  description: string;
  category: InefficientyCategory;
  severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Identificada' | 'Em Análise' | 'Em Resolução' | 'Resolvida';
  source: 'Manual' | 'IA';
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

export interface InefficientyVersion {
  id: string;
  logId: string;
  entries: InefficientyEntry[];
  changes: VersionChange[];
  createdAt: number;
  createdBy: string;
  description: string;
}

export interface VersionChange {
  type: 'added' | 'updated' | 'removed';
  entryId: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

export type InefficientyCategory = 
  | 'RH' 
  | 'TI' 
  | 'Financeiro' 
  | 'Operacional' 
  | 'Marketing' 
  | 'Vendas' 
  | 'Jurídico' 
  | 'Logística' 
  | 'Qualidade' 
  | 'Outros';

export interface InefficientyLog {
  id: string;
  companyId: string;
  title: string;
  entries: InefficientyEntry[];
  aiPrompt?: string;
  aiResponse?: string;
  createdAt: number;
  updatedAt: number;
  currentVersion: number;
}

export const INEFFICIENCY_CATEGORIES: { value: InefficientyCategory; label: string }[] = [
  { value: 'RH', label: 'Recursos Humanos' },
  { value: 'TI', label: 'Tecnologia da Informação' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Operacional', label: 'Operacional' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Vendas', label: 'Vendas' },
  { value: 'Jurídico', label: 'Jurídico' },
  { value: 'Logística', label: 'Logística' },
  { value: 'Qualidade', label: 'Qualidade' },
  { value: 'Outros', label: 'Outros' }
];
