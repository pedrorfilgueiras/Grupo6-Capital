
import { supabase } from '@/lib/supabase';
import { DueDiligenceItem, DueDiligenceFilter, StatusDD, NivelRisco } from './dueDiligenceTypes';
import { showSuccessToast, showErrorToast } from './storageUtils';

// Salvar um item de due diligence
export const saveDueDiligenceItem = async (data: DueDiligenceItem): Promise<DueDiligenceItem> => {
  try {
    console.log("Iniciando salvamento do item DD:", data);
    const currentTime = Date.now();
    const newItem = {
      ...data,
      id: data.id || crypto.randomUUID(),
      atualizado_em: currentTime,
      criado_em: data.criado_em || currentTime
    };
    
    console.log("Salvando item DD no Supabase:", newItem);
    
    // Preparar para upload do documento
    let documento_url = data.documento;
    
    let result;
    
    if (data.id) {
      // Atualizar item existente
      const { data: updatedItem, error } = await supabase
        .from('modulo_dd')
        .update({
          ...newItem,
          documento_url: documento_url
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao atualizar item DD no Supabase:", error);
        throw error;
      }
      
      result = { 
        ...updatedItem, 
        documento: updatedItem.documento_url 
      };
      
      showSuccessToast("Item de DD atualizado com sucesso!");
    } else {
      // Adicionar novo item
      const { data: insertedItem, error } = await supabase
        .from('modulo_dd')
        .insert({
          ...newItem,
          documento_url: documento_url
        })
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir item DD no Supabase:", error);
        throw error;
      }
      
      result = {
        ...insertedItem,
        documento: insertedItem.documento_url
      };
      
      showSuccessToast("Item de DD cadastrado com sucesso!");
    }
    
    return result as DueDiligenceItem;
  } catch (error) {
    console.error('Erro ao salvar item DD:', error);
    showErrorToast("Ocorreu um erro ao salvar o item de due diligence.");
    
    // Fallback para localStorage
    try {
      const existingItems = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      const newItem = {
        ...data,
        id: data.id || crypto.randomUUID(),
        atualizado_em: Date.now(),
        criado_em: data.criado_em || Date.now()
      };
      
      const existingIndex = existingItems.findIndex((item: DueDiligenceItem) => item.id === newItem.id);
      
      if (existingIndex >= 0) {
        existingItems[existingIndex] = newItem;
      } else {
        existingItems.push(newItem);
      }
      
      localStorage.setItem('due_diligence_items', JSON.stringify(existingItems));
      showSuccessToast("Item de DD salvo localmente (modo fallback).");
      
      return newItem;
    } catch (localError) {
      console.error('Erro ao usar fallback:', localError);
      throw error;
    }
  }
};

// Obter todos os itens de due diligence com filtros opcionais
export const getDueDiligenceItems = async (filters?: DueDiligenceFilter): Promise<DueDiligenceItem[]> => {
  try {
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
    
    // Mapear os dados para o formato esperado pela aplicação
    return (data as any[]).map(item => ({
      ...item,
      documento: item.documento_url,
      documento_nome: item.documento_nome
    }));
  } catch (error) {
    console.error('Erro ao buscar itens DD:', error);
    showErrorToast("Erro ao carregar itens de DD. Usando dados locais como fallback.");
    
    // Fallback para localStorage
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
};

// Deletar um item de due diligence
export const deleteDueDiligenceItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccessToast("Item de DD excluído com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao deletar item DD:', error);
    showErrorToast("Erro ao excluir item de DD. Tentando excluir localmente.");
    
    // Fallback para localStorage
    try {
      const items = JSON.parse(localStorage.getItem('due_diligence_items') || '[]');
      const filteredItems = items.filter((item: DueDiligenceItem) => item.id !== id);
      localStorage.setItem('due_diligence_items', JSON.stringify(filteredItems));
      return true;
    } catch (localError) {
      console.error('Erro ao excluir localmente:', localError);
      return false;
    }
  }
};

// Upload de um documento para o Supabase Storage
export const uploadDocumento = async (
  file: File, 
  empresaId: string, 
  itemId: string
): Promise<string | null> => {
  try {
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
  } catch (error) {
    console.error('Erro ao fazer upload de documento:', error);
    showErrorToast("Ocorreu um erro ao fazer upload do documento.");
    
    // Simulação de caminho para fallback local
    return `simulado://documentos/due_diligence/${empresaId}/${itemId}/${file.name}`;
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
    const { data } = await supabase
      .storage
      .from('documentos')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Erro ao obter URL do documento:', error);
    return null;
  }
};

// Atualizar o status de um item
export const updateStatus = async (itemId: string, novoStatus: StatusDD): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .update({ status: novoStatus, atualizado_em: Date.now() })
      .eq('id', itemId);
    
    if (error) throw error;
    
    showSuccessToast(`Status atualizado para: ${novoStatus}`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    showErrorToast("Ocorreu um erro ao atualizar o status.");
    
    // Fallback para localStorage
    try {
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
    } catch (localError) {
      console.error('Erro ao atualizar localmente:', localError);
      return false;
    }
  }
};

// Atualizar o nível de risco de um item
export const updateRisco = async (itemId: string, novoRisco: NivelRisco): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modulo_dd')
      .update({ risco: novoRisco, atualizado_em: Date.now() })
      .eq('id', itemId);
    
    if (error) throw error;
    
    showSuccessToast(`Nível de risco atualizado para: ${novoRisco}`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar nível de risco:', error);
    showErrorToast("Ocorreu um erro ao atualizar o nível de risco.");
    
    // Fallback para localStorage
    try {
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
    } catch (localError) {
      console.error('Erro ao atualizar localmente:', localError);
      return false;
    }
  }
};
