
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
export const isDefaultConfig = 
  supabaseUrl === 'https://your-project-url.supabase.co' || 
  supabaseAnonKey === 'your-anon-key';

// Initialize Supabase connection
export const initializeSupabase = async (): Promise<boolean> => {
  try {
    // Skip initialization if using default credentials
    if (isDefaultConfig) {
      console.warn('⚠️ Usando credenciais padrão do Supabase. Os dados NÃO serão salvos no banco de dados compartilhado.');
      console.warn('Usando apenas localStorage como armazenamento. Os dados NÃO serão compartilhados entre usuários.');
      return false;
    }

    console.log('Inicializando conexão com Supabase:', supabaseUrl);
    
    // Test connection with a simple query
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao conectar ao Supabase:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao Supabase. Verifique suas credenciais.",
        variant: "destructive",
        duration: 8000,
      });
      return false;
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
      return false;
    } else {
      console.log('Supabase inicializado com sucesso!');
      toast({
        title: "Supabase Conectado",
        description: "Conexão com banco de dados estabelecida com sucesso.",
        duration: 5000,
      });
      return true;
    }
  } catch (err) {
    console.error('Error during Supabase initialization:', err);
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao inicializar o Supabase. Verifique o console para mais detalhes.",
      variant: "destructive",
      duration: 8000,
    });
    return false;
  }
};

// Auto-initialize Supabase if credentials are available
if (!isDefaultConfig) {
  console.log('Credenciais do Supabase detectadas, inicializando conexão...');
  initializeSupabase()
    .then(success => {
      if (success) {
        console.log('🟢 Supabase inicializado automaticamente com sucesso!');
      } else {
        console.warn('🟡 Inicialização automática do Supabase falhou, usando localStorage como fallback.');
      }
    })
    .catch(err => {
      console.error('🔴 Erro durante inicialização automática do Supabase:', err);
    });
} else {
  console.warn('⚠️ Usando credenciais padrão do Supabase. Conecte ao Supabase para habilitar armazenamento remoto.');
}
