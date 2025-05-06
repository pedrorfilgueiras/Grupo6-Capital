
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/types';
import { toast } from '@/components/ui/use-toast';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
const isDefaultConfig = 
  supabaseUrl === 'https://your-project-url.supabase.co' || 
  supabaseAnonKey === 'your-anon-key';

// Show warning if using default credentials
if (isDefaultConfig) {
  console.warn('⚠️ Usando credenciais padrão do Supabase. Os dados NÃO serão salvos no banco de dados compartilhado.');
  // Show toast notification only once when the app loads
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      toast({
        title: "Configuração do Supabase Necessária",
        description: "Por favor, conecte seu app ao Supabase usando o botão verde do Supabase no canto superior direito, ou defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
        duration: 10000,
      });
    }, 1000);
  }
}

export const initializeSupabase = async () => {
  try {
    // Skip initialization if using default credentials
    if (isDefaultConfig) {
      console.warn('Usando apenas localStorage como armazenamento. Os dados NÃO serão compartilhados entre usuários.');
      return;
    }

    // Check if the 'companies' table exists
    const { error: errorCompanies } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (errorCompanies && errorCompanies.code === '42P01') {
      console.log('Companies table does not exist. Creating schema...');
      console.log(`
To create the required companies table in Supabase, run this SQL in the Supabase SQL editor:

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

-- Add a unique constraint on cnpj
CREATE UNIQUE INDEX IF NOT EXISTS companies_cnpj_idx ON public.companies (cnpj);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow full access to companies" ON public.companies
    USING (true)
    WITH CHECK (true);
      `);
    }
    
    // Check if the 'modulo_dd' table exists
    const { error: errorDD } = await supabase
      .from('modulo_dd')
      .select('id')
      .limit(1);

    if (errorDD && errorDD.code === '42P01') {
      console.log('Modulo_dd table does not exist. Creating schema...');
      console.log(`
To create the required modulo_dd table in Supabase, run this SQL in the Supabase SQL editor:

CREATE TABLE IF NOT EXISTS public.modulo_dd (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    tipo_dd TEXT NOT NULL,
    item TEXT NOT NULL,
    status TEXT NOT NULL,
    risco TEXT NOT NULL,
    recomendacao TEXT,
    documento TEXT,
    documento_nome TEXT,
    criado_em BIGINT,
    atualizado_em BIGINT
);

-- Enable Row Level Security
ALTER TABLE public.modulo_dd ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow full access to modulo_dd" ON public.modulo_dd
    USING (true)
    WITH CHECK (true);

-- Create a bucket for document storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', true)
ON CONFLICT DO NOTHING;

-- Set up a policy to allow file access
CREATE POLICY "Allow public access to documents" ON storage.objects
    FOR ALL
    USING (bucket_id = 'documentos')
    WITH CHECK (bucket_id = 'documentos');
      `);
    }
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
};

// Call initialization
initializeSupabase().catch(err => {
  console.error('Error during Supabase initialization:', err);
});
