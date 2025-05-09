import { DueDiligenceItem, DueDiligenceFilter, StatusDD, NivelRisco } from './dueDiligenceTypes';
import { supabase } from '@/lib/supabase';
import { showSuccessToast, showErrorToast } from './storageUtils';

// Interface para mapear os tipos do Supabase
interface SupabaseDueDiligenceItem {
  id?: string;
  empresa_id: string;
  tipo_dd: string;
  item: string;
  status: string;
  risco: string;
  recomendacao?: string;
  documento_nome?: string;
  documento_url?: string;
  criado_em?: number;
  atualizado_em?: number;
}

// Converter para formato do Supabase
const toSupabaseFormat = (data: DueDiligenceItem): SupabaseDueDiligenceItem => {
  return {
    id: data.id,
    empresa_id: data.empresa_id,
    tipo_dd: data.tipo_dd,
    item: data.item,
    status: data.status,
    risco: data.risco,
    recomendacao: data.recomendacao,
    documento_nome: data.documento_nome,
    documento_url: data.documento,
    criado_em: data.criado_em,
    atualizado_em: data.atualizado_em
  };
};

// Converter de formato do Supabase
const fromSupabaseFormat = (data: any): DueDiligenceItem => {
  return {
    id: data.id,
    empresa_id: data.empresa_id,
    tipo_dd: data.tipo_dd,
    item: data.item,
    status: data.status,
    risco: data.risco,
    recomendacao: data.recomendacao || '',
    documento: data.documento_url,
    documento_nome: data.documento_nome,
    criado_em: data.criado_em,
    atualizado_em: data.atualizado_em
  };
};

// Salvar um item de due diligence
export const saveDueDiligenceItem = async (data: DueDiligenceItem): Promise<DueDiligenceItem> => {
  try {
    const timestamp = Date.now();
    const itemToSave = {
      ...data,
      id: data.id || crypto.randomUUID(),
      criado_em: data.criado_em || timestamp,
      atualizado_em: timestamp
    };
    
    console.log('Salvando item de DD no Supabase:', itemToSave);
    
    // Converter para o formato do Supabase
    const supabaseData = toSupabaseFormat(itemToSave);
    
    let result;
    
    if (data.id) {
      // Atualizar item existente
      const { data: updatedItem, error } = await supabase
        .from('modulo_dd')
        .update(supabaseData)
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao atualizar item de DD:", error);
        throw error;
      }
      
      result = updatedItem;
      showSuccessToast("Item de Due Diligence atualizado com sucesso!");
    } else {
      // Inserir novo item
      const { data: insertedItem, error } = await supabase
        .from('modulo_dd')
        .insert(supabaseData)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir item de DD:", error);
        throw error;
      }
      
      result = insertedItem;
      showSuccessToast("Item de Due Diligence adicionado com sucesso!");
    }
    
    return fromSupabaseFormat(result);
  } catch (error) {
    console.error('Erro ao salvar item de Due Diligence:', error);
    showErrorToast("Ocorreu um erro ao salvar o item de Due Diligence.");
    
    // Fallback para localStorage
    try {
      const timestamp = Date.now();
      const savedItem = {
        ...data,
        id: data.id || crypto.randomUUID(),
        criado_em: data.criado_em || timestamp,
        atualizado_em: timestamp
      };
      
      const ddItems = JSON.parse(localStorage.getItem('dueDiligenceItems') || '[]');
      
      if (data.id) {
        const index = ddItems.findIndex((item: DueDiligenceItem) => item.id === data.id);
        if (index >= 0) {
          ddItems[index] = savedItem;
        } else {
          ddItems.push(savedItem);
        }
      } else {
        ddItems.push(savedItem);
      }
      
      localStorage.setItem('dueDiligenceItems', JSON.stringify(ddItems));
      showSuccessToast("Dados salvos localmente (modo fallback).");
      
      return savedItem;
    } catch (localError) {
      console.error('Erro ao usar fallback local:', localError);
      throw error;
    }
  }
};

// Obter itens de due diligence por filtros
export const getDueDiligenceItems = async (filters?: DueDiligenceFilter): Promise<DueDiligenceItem[]> => {
  try {
    let query = supabase
      .from('modulo_dd')
      .select('*');
    
    if (filters) {
      if (filters.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters.tipo_dd) {
        query = query.eq('tipo_dd', filters.tipo_dd);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.risco) {
        query = query.eq('risco', filters.risco);
      }
    }
    
    const { data, error } = await query.order('criado_em', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => fromSupabaseFormat(item));
  } catch (error) {
    console.error('Erro ao carregar itens de Due Diligence:', error);
    showErrorToast("Erro ao carregar itens de Due Diligence.");
    
    // Fallback para localStorage
    const items = JSON.parse(localStorage.getItem('dueDiligenceItems') || '[]');
    if (filters) {
      return items.filter((item: DueDiligenceItem) => {
        let match = true;
        if (filters.empresa_id) match = match && item.empresa_id === filters.empresa_id;
        if (filters.tipo_dd) match = match && item.tipo_dd === filters.tipo_dd;
        if (filters.status) match = match && item.status === filters.status;
        if (filters.risco) match = match && item.risco === filters.risco;
        return match;
      });
    }
    return items;
  }
};

// Obter um item de due diligence por ID
export const getDueDiligenceItemById = async (id: string): Promise<DueDiligenceItem | null> => {
  try {
    const { data, error } = await supabase
      .from('modulo_dd')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    if (!data) return null;
    
    return fromSupabaseFormat(data);
  } catch (error) {
    console.error('Erro ao carregar item de DD por ID:', error);
    
    // Fallback para localStorage
    const items = JSON.parse(localStorage.getItem('dueDiligenceItems') || '[]');
    return items.find((item: DueDiligenceItem) => item.id === id) || null;
  }
};

// Excluir um item de due diligence
export const deleteDueDiligenceItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccessToast("Item de Due Diligence excluído com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao excluir item de DD:', error);
    showErrorToast("Erro ao excluir item. Tentando excluir localmente.");
    
    // Fallback para localStorage
    try {
      const items = JSON.parse(localStorage.getItem('dueDiligenceItems') || '[]');
      const filteredItems = items.filter((item: DueDiligenceItem) => item.id !== id);
      localStorage.setItem('dueDiligenceItems', JSON.stringify(filteredItems));
      return true;
    } catch (localError) {
      console.error('Erro ao excluir localmente:', localError);
      return false;
    }
  }
};

// Atualizar o status de um item de DD
export const updateStatus = async (id: string, novoStatus: StatusDD): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .update({ status: novoStatus, atualizado_em: Date.now() })
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccessToast(`Status do item atualizado para ${novoStatus}`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    showErrorToast("Não foi possível atualizar o status.");
    return false;
  }
};

// Atualizar o nível de risco de um item de DD
export const updateRisco = async (id: string, novoRisco: NivelRisco): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .update({ risco: novoRisco, atualizado_em: Date.now() })
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccessToast(`Nível de risco atualizado para ${novoRisco}`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar nível de risco:', error);
    showErrorToast("Não foi possível atualizar o nível de risco.");
    return false;
  }
};

// Obter URL de um documento - agora simplesmente retorna o link
export const getDocumentoURL = async (link: string): Promise<string | null> => {
  // Agora apenas retornamos o link diretamente, sem necessidade de gerar URLs assinadas
  return link || null;
};
