
import { supabase } from '@/lib/supabase';
import { DueDiligenceItem, DueDiligenceFilter, StatusDD, NivelRisco } from './dueDiligenceTypes';
import { isSupabaseAvailable, showSuccessToast, showErrorToast } from './storageUtils';

// Salvar um item de due diligence
export const saveDueDiligenceItem = async (data: DueDiligenceItem): Promise<DueDiligenceItem> => {
  try {
    const currentTime = Date.now();
    const newItem = {
      ...data,
      id: data.id || crypto.randomUUID(),
      atualizado_em: currentTime,
      criado_em: data.criado_em || currentTime
    };
    
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      // Se o Supabase estiver disponível, salvar no banco de dados
      console.log("Salvando item DD no Supabase:", newItem);
      
      let result;
      
      if (data.id) {
        // Atualizar item existente
        const { data: updatedItem, error } = await supabase
          .from('modulo_dd')
          .update(newItem)
          .eq('id', data.id)
          .select()
          .single();
        
        if (error) {
          console.error("Erro ao atualizar item DD no Supabase:", error);
          throw error;
        }
        
        result = updatedItem;
        showSuccessToast("Item de DD atualizado com sucesso!");
      } else {
        // Adicionar novo item
        const { data: insertedItem, error } = await supabase
          .from('modulo_dd')
          .insert(newItem)
          .select()
          .single();
        
        if (error) {
          console.error("Erro ao inserir item DD no Supabase:", error);
          throw error;
        }
        
        result = insertedItem;
        showSuccessToast("Item de DD cadastrado com sucesso!");
      }
      
      return result as DueDiligenceItem;
    } else {
      // Fallback para localStorage
      console.warn('Usando localStorage como fallback para armazenamento de DD. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      
      // Obter itens existentes do localStorage
      const existingItems = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      
      // Verificar se o item já existe
      const existingIndex = existingItems.findIndex((item: DueDiligenceItem) => item.id === data.id);
      
      if (existingIndex >= 0) {
        // Atualizar item existente
        existingItems[existingIndex] = newItem;
        showSuccessToast("Item de DD atualizado com sucesso (localStorage)!");
      } else {
        // Adicionar novo item
        existingItems.push(newItem);
        showSuccessToast("Item de DD cadastrado com sucesso (localStorage)!");
      }
      
      // Salvar itens atualizados no localStorage
      localStorage.setItem('due_diligence_items', JSON.stringify(existingItems));
      
      return newItem;
    }
  } catch (error) {
    console.error('Erro ao salvar item DD:', error);
    showErrorToast("Ocorreu um erro ao salvar o item de due diligence.");
    throw error;
  }
};

// Obter todos os itens de due diligence com filtros opcionais
export const getDueDiligenceItems = async (filters?: DueDiligenceFilter): Promise<DueDiligenceItem[]> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      // Construir a query com filtros
      let query = supabase.from('modulo_dd').select('*');
      
      if (filters?.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      
      if (filters?.tipo_dd) {
        query = query.eq('tipo_dd', filters.tipo_dd);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.risco) {
        query = query.eq('risco', filters.risco);
      }
      
      // Ordenar por data de atualização
      query = query.order('atualizado_em', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as DueDiligenceItem[];
    } else {
      // Fallback para localStorage
      console.warn('Usando localStorage como fallback para buscar itens DD. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      
      const items: DueDiligenceItem[] = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      
      // Aplicar filtros localmente
      let filteredItems = [...items];
      
      if (filters?.empresa_id) {
        filteredItems = filteredItems.filter(item => item.empresa_id === filters.empresa_id);
      }
      
      if (filters?.tipo_dd) {
        filteredItems = filteredItems.filter(item => item.tipo_dd === filters.tipo_dd);
      }
      
      if (filters?.status) {
        filteredItems = filteredItems.filter(item => item.status === filters.status);
      }
      
      if (filters?.risco) {
        filteredItems = filteredItems.filter(item => item.risco === filters.risco);
      }
      
      // Ordenar por data de atualização (decrescente)
      return filteredItems.sort((a, b) => (b.atualizado_em || 0) - (a.atualizado_em || 0));
    }
  } catch (error) {
    console.error('Erro ao buscar itens DD:', error);
    showErrorToast("Ocorreu um erro ao carregar os itens de due diligence.");
    return [];
  }
};

// Deletar um item de due diligence
export const deleteDueDiligenceItem = async (id: string): Promise<boolean> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('modulo_dd')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showSuccessToast("Item de DD excluído com sucesso!");
      return true;
    } else {
      // Fallback para localStorage
      const items = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      const filteredItems = items.filter((item: DueDiligenceItem) => item.id !== id);
      localStorage.setItem('due_diligence_items', JSON.stringify(filteredItems));
      
      showSuccessToast("Item de DD excluído com sucesso (localStorage)!");
      return true;
    }
  } catch (error) {
    console.error('Erro ao deletar item DD:', error);
    showErrorToast("Ocorreu um erro ao excluir o item de due diligence.");
    return false;
  }
};

// Upload de um documento para o Supabase Storage
export const uploadDocumento = async (
  file: File, 
  empresaId: string, 
  itemId: string
): Promise<string | null> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const filePath = `due_diligence/${empresaId}/${itemId}/${file.name}`;
      
      const { data, error } = await supabase
        .storage
        .from('documentos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Retornar o caminho do arquivo salvo
      return filePath;
    } else {
      // Como não podemos salvar arquivos no localStorage de forma eficiente,
      // apenas simularemos o sucesso e retornaremos um caminho "fictício"
      console.warn('Armazenamento de arquivos requer Supabase. Usando URL simulada.');
      return `simulado://documentos/due_diligence/${empresaId}/${itemId}/${file.name}`;
    }
  } catch (error) {
    console.error('Erro ao fazer upload de documento:', error);
    showErrorToast("Ocorreu um erro ao fazer upload do documento.");
    return null;
  }
};

// Obter URL pública de um documento
export const getDocumentoURL = async (filePath: string): Promise<string | null> => {
  if (!filePath) return null;
  
  // Se for um caminho simulado, apenas retorne-o
  if (filePath.startsWith('simulado://')) {
    return filePath;
  }
  
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data } = await supabase
        .storage
        .from('documentos')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter URL do documento:', error);
    return null;
  }
};

// Atualizar o status de um item
export const updateStatus = async (itemId: string, novoStatus: StatusDD): Promise<boolean> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('modulo_dd')
        .update({ status: novoStatus, atualizado_em: Date.now() })
        .eq('id', itemId);
      
      if (error) throw error;
      
      showSuccessToast(`Status atualizado para: ${novoStatus}`);
      return true;
    } else {
      // Fallback para localStorage
      const items = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      const itemIndex = items.findIndex((item: DueDiligenceItem) => item.id === itemId);
      
      if (itemIndex >= 0) {
        items[itemIndex].status = novoStatus;
        items[itemIndex].atualizado_em = Date.now();
        localStorage.setItem('due_diligence_items', JSON.stringify(items));
        
        showSuccessToast(`Status atualizado para: ${novoStatus} (localStorage)`);
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    showErrorToast("Ocorreu um erro ao atualizar o status.");
    return false;
  }
};

// Atualizar o nível de risco de um item
export const updateRisco = async (itemId: string, novoRisco: NivelRisco): Promise<boolean> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('modulo_dd')
        .update({ risco: novoRisco, atualizado_em: Date.now() })
        .eq('id', itemId);
      
      if (error) throw error;
      
      showSuccessToast(`Nível de risco atualizado para: ${novoRisco}`);
      return true;
    } else {
      // Fallback para localStorage
      const items = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      const itemIndex = items.findIndex((item: DueDiligenceItem) => item.id === itemId);
      
      if (itemIndex >= 0) {
        items[itemIndex].risco = novoRisco;
        items[itemIndex].atualizado_em = Date.now();
        localStorage.setItem('due_diligence_items', JSON.stringify(items));
        
        showSuccessToast(`Nível de risco atualizado para: ${novoRisco} (localStorage)`);
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Erro ao atualizar nível de risco:', error);
    showErrorToast("Ocorreu um erro ao atualizar o nível de risco.");
    return false;
  }
};

