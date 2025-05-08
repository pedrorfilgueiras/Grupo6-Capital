
export type StatusDD = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
export type NivelRisco = 'baixo' | 'medio' | 'alto' | 'critico';

export interface DueDiligenceItem {
  id?: string;
  empresa_id: string;
  tipo_dd: string;
  item: string;
  status: StatusDD;
  risco: NivelRisco;
  recomendacao: string;
  documento_url?: string;
  documento_nome?: string;
  criado_em?: number;
  atualizado_em?: number;
}

export interface DueDiligenceFilter {
  empresa_id?: string;
  tipo_dd?: string;
  status?: StatusDD;
  risco?: NivelRisco;
}

// Mapeamento de cores para os níveis de risco
export const riscoColors: Record<NivelRisco, string> = {
  baixo: '#F2FCE2', // verde claro
  medio: '#FDF9E2', // amarelo claro
  alto: '#FEC6A1', // laranja claro
  critico: '#FDEDEE', // vermelho claro
};

// Mapeamento de cores para os status
export const statusColors: Record<StatusDD, string> = {
  pendente: '#EEEEEE',
  em_andamento: '#E3F0FF',
  concluido: '#F2FCE2',
  cancelado: '#FDEDEE',
};

// Categorias comuns de due diligence
export const categoriasDueDiligence = [
  'Legal',
  'Financeiro',
  'Tributário',
  'Trabalhista',
  'Regulatório',
  'Ambiental',
  'Propriedade Intelectual',
  'Operacional',
  'TI e Segurança da Informação',
  'Comercial',
  'Outro'
];
