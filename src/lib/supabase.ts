
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/storageService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found. Please make sure you have set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initializeSupabase = async () => {
  // Check if the 'companies' table exists, if not create it
  const { error } = await supabase
    .from('companies')
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') {
    console.log('Companies table does not exist. Please create it in the Supabase dashboard.');
  }
};

// Call initialization
initializeSupabase();
