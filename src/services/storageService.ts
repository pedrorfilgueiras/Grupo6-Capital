
// Types
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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

// Fallback to localStorage if Supabase is not available
const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // First check if we have valid credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-url.supabase.co' || 
        supabaseAnonKey === 'your-anon-key') {
      return false;
    }
    
    // Then try to connect to the database
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    return !error;
  } catch (err) {
    console.error('Supabase not available:', err);
    return false;
  }
};

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
        
        if (error) throw error;
        result = updatedCompany;
        
        toast({
          title: "Sucesso",
          description: "Empresa atualizada com sucesso no Supabase!",
        });
      } else {
        // Add new company
        const { data: insertedCompany, error } = await supabase
          .from('companies')
          .insert(newCompany)
          .select()
          .single();
        
        if (error) throw error;
        result = insertedCompany;
        
        toast({
          title: "Sucesso",
          description: "Empresa cadastrada com sucesso no Supabase!",
        });
      }
      
      return result as CompanyData;
    } else {
      // Fallback to localStorage
      console.warn('Using localStorage as fallback for Supabase');
      
      // Get existing companies from localStorage
      const existingCompanies = JSON.parse(localStorage.getItem('companies') || '[]');
      
      // Check if company with this CNPJ already exists
      const existingIndex = existingCompanies.findIndex((c: CompanyData) => c.cnpj === data.cnpj);
      
      if (existingIndex >= 0) {
        // Update existing company
        existingCompanies[existingIndex] = newCompany;
        toast({
          title: "Sucesso", 
          description: "Empresa atualizada com sucesso (localStorage)!"
        });
      } else {
        // Add new company
        existingCompanies.push(newCompany);
        toast({
          title: "Sucesso", 
          description: "Empresa cadastrada com sucesso (localStorage)!"
        });
      }
      
      // Save updated companies to localStorage
      localStorage.setItem('companies', JSON.stringify(existingCompanies));
      
      return newCompany;
    }
  } catch (error) {
    console.error('Error saving company:', error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao salvar os dados da empresa.",
      variant: "destructive"
    });
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
      console.warn('Using localStorage as fallback for Supabase');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies;
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao carregar as empresas.",
      variant: "destructive"
    });
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
      console.warn('Using localStorage as fallback for Supabase');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.id === id) || null;
    }
  } catch (error) {
    console.error('Error fetching company by ID:', error);
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
      console.warn('Using localStorage as fallback for Supabase');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      return companies.find((c: CompanyData) => c.cnpj === cnpj) || null;
    }
  } catch (error) {
    console.error('Error fetching company by CNPJ:', error);
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
      console.warn('Using localStorage as fallback for Supabase');
      const companies = JSON.parse(localStorage.getItem('companies') || '[]');
      const filteredCompanies = companies.filter((c: CompanyData) => c.id !== id);
      localStorage.setItem('companies', JSON.stringify(filteredCompanies));
      return true;
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    return false;
  }
};
