
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Check if Supabase is configured and available
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // First check if we have valid credentials
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'https://your-project-url.supabase.co' || 
        supabaseAnonKey === 'your-anon-key') {
      console.warn('Credenciais do Supabase inválidas ou não configuradas. Usando localStorage como fallback.');
      return false;
    }
    
    // Then try to connect to the database
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    
    if (error) {
      console.error('Erro ao conectar ao Supabase:', error.message);
      return false;
    }
    
    console.log('Supabase conectado com sucesso!');
    return true;
  } catch (err) {
    console.error('Supabase não disponível:', err);
    return false;
  }
};

// Verify Supabase tables and create them if needed
export const verifySupabaseTables = async (): Promise<boolean> => {
  try {
    // Check if Supabase is available
    const supabaseAvailable = await isSupabaseAvailable();
    if (!supabaseAvailable) {
      return false;
    }
    
    console.log('Verificando tabelas do Supabase...');
    
    // Check if companies table exists
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
      
    if (companiesError && companiesError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Criando tabela "companies"...');
      const createCompaniesSQL = `
        CREATE TABLE IF NOT EXISTS public.companies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          cnpj TEXT NOT NULL,
          razaoSocial TEXT NOT NULL,
          setor TEXT,
          subsetor TEXT,
          arrFy24 NUMERIC,
          receitaBrutaFy24 NUMERIC,
          faturamentoAnual NUMERIC,
          margem NUMERIC,
          margemEbitda NUMERIC,
          crescimentoReceita NUMERIC,
          ebitda NUMERIC,
          valuationMultiplo NUMERIC,
          riscoOperacional TEXT,
          insightsQualitativos TEXT,
          nota NUMERIC,
          statusAprovacao TEXT,
          qsa JSONB,
          createdAt BIGINT,
          weightedScore NUMERIC
        );
        CREATE UNIQUE INDEX IF NOT EXISTS companies_cnpj_idx ON public.companies (cnpj);
        ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow full access to companies" ON public.companies USING (true) WITH CHECK (true);
      `;
      
      try {
        // Use .then().catch() instead of .catch() directly
        await supabase.rpc('exec', { sql: createCompaniesSQL }).then(null, (e) => {
          console.error('Erro ao criar tabela companies:', e);
          toast({
            title: "Erro",
            description: "Não foi possível criar tabela companies. Por favor, siga as instruções de SQL no console.",
            variant: "destructive",
            duration: 10000,
          });
        });
      } catch (e) {
        console.error('Erro ao executar RPC:', e);
        return false;
      }
    }
    
    // Check if modulo_dd table exists
    const { data: ddData, error: ddError } = await supabase
      .from('modulo_dd')
      .select('id')
      .limit(1);
      
    if (ddError && ddError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Criando tabela "modulo_dd"...');
      const createDDSQL = `
        CREATE TABLE IF NOT EXISTS public.modulo_dd (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          empresa_id UUID NOT NULL,
          tipo_dd TEXT NOT NULL,
          item TEXT NOT NULL,
          status TEXT NOT NULL,
          risco TEXT NOT NULL,
          recomendacao TEXT,
          documento TEXT,
          documento_nome TEXT,
          criado_em BIGINT,
          atualizado_em BIGINT,
          FOREIGN KEY (empresa_id) REFERENCES public.companies(id) ON DELETE CASCADE
        );
        ALTER TABLE public.modulo_dd ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow full access to modulo_dd" ON public.modulo_dd USING (true) WITH CHECK (true);
      `;
      
      try {
        // Use .then().catch() instead of .catch() directly
        await supabase.rpc('exec', { sql: createDDSQL }).then(null, (e) => {
          console.error('Erro ao criar tabela modulo_dd:', e);
          toast({
            title: "Erro",
            description: "Não foi possível criar tabela modulo_dd. Por favor, siga as instruções de SQL no console.",
            variant: "destructive",
            duration: 10000,
          });
        });
      } catch (e) {
        console.error('Erro ao executar RPC:', e);
        return false;
      }
    }
    
    // Check if storage bucket exists
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .getBucket('documentos');
      
    if (bucketError && bucketError.message.includes('The resource was not found')) {
      console.log('Criando bucket "documentos"...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('documentos', {
          public: true
        });
        
      if (createBucketError) {
        console.error('Erro ao criar bucket documentos:', createBucketError);
        toast({
          title: "Erro",
          description: "Não foi possível criar o bucket de armazenamento. Execute manualmente pelo console do Supabase.",
          variant: "destructive",
          duration: 10000,
        });
      }
    }
    
    console.log('Verificação de tabelas concluída com sucesso!');
    return true;
  } catch (err) {
    console.error('Erro ao verificar tabelas do Supabase:', err);
    return false;
  }
};

// Show a success toast message
export const showSuccessToast = (message: string) => {
  toast({
    title: "Sucesso",
    description: message,
  });
};

// Show an error toast message
export const showErrorToast = (message: string) => {
  toast({
    title: "Erro",
    description: message,
    variant: "destructive"
  });
};
