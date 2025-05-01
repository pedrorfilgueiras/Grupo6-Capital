
import { CompanyData } from './types';
import { supabase } from '@/lib/supabase';
import { isSupabaseAvailable, showSuccessToast, showErrorToast } from './storageUtils';

// Save a company to Supabase or localStorage as fallback
export const saveCompany = async (data: CompanyData): Promise<CompanyData> => {
  try {
    const newCompany = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      console.log("Salvando no Supabase:", newCompany);
      
      // Check if company with this CNPJ already exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('cnpj', data.cnpj)
        .maybeSingle();
      
      let result;
      
      if (existingCompany) {
        // Update existing company
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
        // Add new company
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
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      
      // Get existing companies from localStorage
      const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      // Check if company with this CNPJ already exists
      const existingIndex = existingCompanies.findIndex((c: CompanyData) => c.cnpj === data.cnpj);
      
      if (existingIndex >= 0) {
        // Update existing company
        existingCompanies[existingIndex] = newCompany;
        showSuccessToast("Empresa atualizada com sucesso (localStorage)!");
      } else {
        // Add new company
        existingCompanies.push(newCompany);
        showSuccessToast("Empresa cadastrada com sucesso (localStorage)!");
      }
      
      // Save updated companies to localStorage
      localStorage.setItem('companies', JSON.stringify(existingCompanies));
      
      return newCompany;
    }
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    showErrorToast("Ocorreu um erro ao salvar os dados da empresa.");
    throw error;
  }
};

// Get all companies from Supabase or localStorage as fallback
export const getCompanies = async (): Promise<CompanyData[]> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      return data as CompanyData[];
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies;
    }
  } catch (error) {
    console.error('Erro ao carregar as empresas:', error);
    showErrorToast("Ocorreu um erro ao carregar as empresas.");
    return [];
  }
};

// Get a specific company by ID
export const getCompanyById = async (id: string): Promise<CompanyData | null> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as CompanyData;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.id === id) || null;
    }
  } catch (error) {
    console.error('Erro ao carregar empresa por ID:', error);
    return null;
  }
};

// Get a specific company by CNPJ
export const getCompanyByCNPJ = async (cnpj: string): Promise<CompanyData | null> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('cnpj', cnpj)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data as CompanyData || null;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.cnpj === cnpj) || null;
    }
  } catch (error) {
    console.error('Erro ao carregar empresa por CNPJ:', error);
    return null;
  }
};

// Delete a company
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } else {
      // Fallback to localStorage
      console.warn('Usando localStorage como fallback para armazenamento. OS DADOS NÃO SERÃO COMPARTILHADOS ENTRE USUÁRIOS.');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const filteredCompanies = companies.filter((c: CompanyData) => c.id !== id);
      localStorage.setItem('companies', JSON.stringify(filteredCompanies));
      return true;
    }
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    return false;
  }
};

