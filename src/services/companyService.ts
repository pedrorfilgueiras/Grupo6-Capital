
import { CompanyData } from './types';
import { supabase } from '@/lib/supabase';
import { showSuccessToast, showErrorToast } from './storageUtils';

// Salvar uma empresa no Supabase
export const saveCompany = async (data: CompanyData): Promise<CompanyData> => {
  try {
    const newCompany = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    console.log("Salvando no Supabase:", newCompany);
    
    // Verificar se a empresa com este CNPJ já existe
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('cnpj', data.cnpj)
      .maybeSingle();
    
    let result;
    
    if (existingCompany) {
      // Atualizar empresa existente
      const { data: updatedCompany, error } = await supabase
        .from('companies')
        .update(newCompany)
        .eq('id', existingCompany.id)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao atualizar no Supabase:", error);
        throw error;
      }
      result = updatedCompany;
      
      showSuccessToast("Empresa atualizada com sucesso no Supabase!");
    } else {
      // Adicionar nova empresa
      const { data: insertedCompany, error } = await supabase
        .from('companies')
        .insert(newCompany)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir no Supabase:", error);
        throw error;
      }
      result = insertedCompany;
      
      showSuccessToast("Empresa cadastrada com sucesso no Supabase!");
    }
    
    return result as CompanyData;
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    showErrorToast("Ocorreu um erro ao salvar os dados da empresa.");
    
    // Fallback para localStorage em caso de erro
    try {
      console.warn('Usando localStorage como fallback para armazenamento.');
      
      const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      const newCompany = {
        ...data,
        id: data.id || crypto.randomUUID(),
        createdAt: Date.now()
      };
      
      const existingIndex = existingCompanies.findIndex((c: CompanyData) => c.cnpj === data.cnpj);
      
      if (existingIndex >= 0) {
        existingCompanies[existingIndex] = newCompany;
      } else {
        existingCompanies.push(newCompany);
      }
      
      localStorage.setItem('companies', JSON.stringify(existingCompanies));
      showSuccessToast("Dados salvos localmente (modo fallback).");
      
      return newCompany;
    } catch (localError) {
      console.error('Erro ao usar fallback:', localError);
      throw error;
    }
  }
};

// Obter todas as empresas do Supabase
export const getCompanies = async (): Promise<CompanyData[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as CompanyData[];
  } catch (error) {
    console.error('Erro ao carregar as empresas do Supabase:', error);
    showErrorToast("Erro ao carregar empresas. Usando dados locais como fallback.");
    
    // Fallback para localStorage
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    return companies;
  }
};

// Obter empresa específica por ID
export const getCompanyById = async (id: string): Promise<CompanyData | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data as CompanyData || null;
  } catch (error) {
    console.error('Erro ao carregar empresa por ID:', error);
    
    // Fallback para localStorage
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    return companies.find((c: CompanyData) => c.id === id) || null;
  }
};

// Obter empresa específica por CNPJ
export const getCompanyByCNPJ = async (cnpj: string): Promise<CompanyData | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('cnpj', cnpj)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data as CompanyData || null;
  } catch (error) {
    console.error('Erro ao carregar empresa por CNPJ:', error);
    
    // Fallback para localStorage
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    return companies.find((c: CompanyData) => c.cnpj === cnpj) || null;
  }
};

// Excluir uma empresa
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccessToast("Empresa excluída com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    showErrorToast("Erro ao excluir empresa. Tentando excluir localmente.");
    
    // Fallback para localStorage
    try {
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const filteredCompanies = companies.filter((c: CompanyData) => c.id !== id);
      localStorage.setItem('companies', JSON.stringify(filteredCompanies));
      return true;
    } catch (localError) {
      console.error('Erro ao excluir localmente:', localError);
      return false;
    }
  }
};
