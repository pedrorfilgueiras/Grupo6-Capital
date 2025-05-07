
import { z } from 'zod';
import { StatusDD, NivelRisco } from '@/services/dueDiligenceTypes';

// Schema de validação para o formulário
export const formSchema = z.object({
  tipo_dd: z.string().min(1, { message: 'Tipo de DD é obrigatório' }),
  item: z.string().min(3, { message: 'Descrição do item deve ter pelo menos 3 caracteres' }),
  status: z.enum(['pendente', 'em_andamento', 'concluido', 'cancelado'] as const),
  risco: z.enum(['baixo', 'medio', 'alto', 'critico'] as const),
  recomendacao: z.string().optional(),
  empresa_id: z.string().min(1, { message: 'Empresa é obrigatória' }),
});

export type FormData = z.infer<typeof formSchema>;

export interface DDFormProps {
  ddId?: string; // Para edição de item existente
  empresaId?: string; // Para pré-seleção de empresa
  onSuccess?: () => void;
}
