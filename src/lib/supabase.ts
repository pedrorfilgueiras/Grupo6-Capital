
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/storageService';

// Provide default values for development environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Log warning if using default credentials
if (import.meta.env.DEV && 
    (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
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
      console.log('Companies table does not exist. Please create it in the Supabase dashboard.');
    }
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
  }
};

// Call initialization
initializeSupabase().catch(err => {
  console.error('Error during Supabase initialization:', err);
});
