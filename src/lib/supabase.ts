
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/types';
import { toast } from '@/components/ui/use-toast';
import { verifySupabaseTables } from '@/services/storageUtils';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
const isDefaultConfig = 
  supabaseUrl === 'https://your-project-url.supabase.co' || 
  supabaseAnonKey === 'your-anon-key';

// Show warning if using default credentials, but only in console
if (isDefaultConfig) {
  console.warn('⚠️ Usando credenciais padrão do Supabase. Os dados NÃO serão salvos no banco de dados compartilhado.');
  // Removed toast notification from here to prevent duplicate notifications
}

export const initializeSupabase = async () => {
  try {
    // Skip initialization if using default credentials
    if (isDefaultConfig) {
      console.warn('Usando apenas localStorage como armazenamento. Os dados NÃO serão compartilhados entre usuários.');
      return;
    }

    // Verify and create tables if needed
    const tablesVerified = await verifySupabaseTables();
    
    if (!tablesVerified) {
      console.warn('Não foi possível verificar ou criar as tabelas do Supabase. Usando localStorage como fallback.');
      toast({
        title: "Atenção",
        description: "Não foi possível inicializar o Supabase. Os dados serão salvos apenas localmente.",
        variant: "destructive",
        duration: 8000,
      });
    } else {
      console.log('Supabase inicializado com sucesso!');
      toast({
        title: "Supabase Conectado",
        description: "Conexão com banco de dados estabelecida com sucesso.",
        duration: 5000,
      });
    }
  } catch (err) {
    console.error('Error during Supabase initialization:', err);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao inicializar o Supabase. Verifique o console para mais detalhes.",
      variant: "destructive",
      duration: 8000,
    });
  }
};

// Call initialization
initializeSupabase().catch(err => {
  console.error('Error during Supabase initialization:', err);
});
