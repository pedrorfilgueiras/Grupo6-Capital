
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

// Save a company to Supabase
export const saveCompany = async (data: CompanyData): Promise<CompanyData> => {
  try {
    const newCompany = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: Date.now()
    };
    
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
    } else {
      // Add new company
      const { data: insertedCompany, error } = await supabase
        .from('companies')
        .insert(newCompany)
        .select()
        .single();
      
      if (error) throw error;
      result = insertedCompany;
    }
    
    return result as CompanyData;
  } catch (error) {
    console.error('Error saving company:', error);
    throw error;
  }
};

// Get all companies from Supabase
export const getCompanies = async (): Promise<CompanyData[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    
    return data as CompanyData[];
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

// Get a specific company by ID
export const getCompanyById = async (id: string): Promise<CompanyData | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as CompanyData;
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    return null;
  }
};

// Get a specific company by CNPJ
export const getCompanyByCNPJ = async (cnpj: string): Promise<CompanyData | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('cnpj', cnpj)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data as CompanyData || null;
  } catch (error) {
    console.error('Error fetching company by CNPJ:', error);
    return null;
  }
};

// Delete a company
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting company:', error);
    return false;
  }
};
