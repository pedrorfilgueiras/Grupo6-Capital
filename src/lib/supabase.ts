
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/types';
import { toast } from '@/components/ui/use-toast';
import { verifySupabaseTables } from '@/services/storageUtils';

// Get Supabase credentials from environment variables
const supabaseUrl = 'https://spzbgghheklhxupfmtax.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwemJnZ2hoZWtsaHh1cGZtdGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTgzMzIsImV4cCI6MjA2MDQ3NDMzMn0.jHyXZe0fqVMJCrdEy0VEaD7ROGt2Xvu4At6zRWsDpks';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isDefaultConfig = false;

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
