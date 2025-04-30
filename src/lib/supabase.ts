
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/storageService';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log warning if using default credentials in development
if (import.meta.env.DEV && 
    (supabaseUrl === 'https://your-project-url.supabase.co' || 
     supabaseAnonKey === 'your-anon-key')) {
  console.warn('Using default Supabase credentials for development. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables for production use.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeSupabase = async () => {
  try {
    // Check if the 'companies' table exists
    const { error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
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
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
};

// Call initialization
initializeSupabase().catch(err => {
  console.error('Error during Supabase initialization:', err);
});
