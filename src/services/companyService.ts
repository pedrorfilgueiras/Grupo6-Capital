
import { CompanyData } from './types';
import { supabase } from '@/lib/supabase';
import { showSuccessToast, showErrorToast } from './storageUtils';
import { Json } from '@/integrations/supabase/types';

// Interface para mapear os tipos do Supabase
interface SupabaseCompanyData {
  id?: string;
  cnpj: string;
  razaosocial: string;
  setor?: string;
  subsetor?: string;
  arrfy24?: number;
  receitabrutafy24?: number;
  faturamentoanual?: number;
  margem?: number;
  margemebitda?: number;
  crescimentoreceita?: number;
  ebitda?: number;
  valuationmultiplo?: number;
  riscooperacional?: string;
  insightsqualitativos?: string;
  nota?: number;
  statusaprovacao?: string;
  qsa?: Json;
  createdat?: number;
  weightedscore?: number;
}

// Função para converter CompanyData para o formato do Supabase
const toSupabaseFormat = (data: CompanyData): SupabaseCompanyData => {
  return {
    id: data.id,
    cnpj: data.cnpj,
    razaosocial: data.razaoSocial,
    setor: data.setor,
    subsetor: data.subsetor,
    arrfy24: data.arrFy24,
    receitabrutafy24: data.receitaBrutaFy24,
    faturamentoanual: data.faturamentoAnual,
    margem: data.margem,
    margemebitda: data.margemEbitda,
    crescimentoreceita: data.crescimentoReceita,
    ebitda: data.ebitda,
    valuationmultiplo: data.valuationMultiplo,
    riscooperacional: data.riscoOperacional,
    insightsqualitativos: data.insightsQualitativos,
    nota: data.nota,
    statusaprovacao: data.statusAprovacao,
    qsa: data.qsa as unknown as Json,
    createdat: data.createdAt,
    weightedscore: data.weightedScore
  };
};

// Função para converter dados do Supabase para o formato do aplicativo
const fromSupabaseFormat = (data: any): CompanyData => {
  return {
    id: data.id,
    cnpj: data.cnpj,
    razaoSocial: data.razaosocial,
    setor: data.setor || '',
    subsetor: data.subsetor || '',
    arrFy24: data.arrfy24 || 0,
    receitaBrutaFy24: data.receitabrutafy24 || 0,
    faturamentoAnual: data.faturamentoanual || 0,
    margem: data.margem || 0,
    margemEbitda: data.margemebitda || 0,
    crescimentoReceita: data.crescimentoreceita || 0,
    ebitda: data.ebitda || 0,
    valuationMultiplo: data.valuationmultiplo || 0,
    riscoOperacional: data.riscooperacional || 'Médio',
    insightsQualitativos: data.insightsqualitativos || '',
    nota: data.nota || 0,
    statusAprovacao: data.statusaprovacao || 'Em Avaliação',
    qsa: (data.qsa as any[] || []).map(s => ({
      id: s.id,
      nome: s.nome,
      documento: s.documento,
      participacao: s.participacao
    })),
    createdAt: data.createdat,
    weightedScore: data.weightedscore
  };
};

// Salvar uma empresa no Supabase
export const saveCompany = async (data: CompanyData): Promise<CompanyData> => {
  try {
    const newCompany = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: Date.now()
    };
    
    console.log("Salvando no Supabase:", newCompany);
    
    // Converter para o formato do Supabase
    const supabaseData = toSupabaseFormat(newCompany);
    
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
        .update(supabaseData)
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
        .insert(supabaseData)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao inserir no Supabase:", error);
        throw error;
      }
      result = insertedCompany;
      
      showSuccessToast("Empresa cadastrada com sucesso no Supabase!");
    }
    
    return fromSupabaseFormat(result);
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
      .order('createdat', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => fromSupabaseFormat(item));
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
    
    if (!data) return null;
    
    return fromSupabaseFormat(data);
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
    
    if (!data) return null;
    
    return fromSupabaseFormat(data);
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
