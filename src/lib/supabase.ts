
import { createClient } from '@supabase/supabase-js';
import type { CompanyData } from '@/services/types';
import { toast } from '@/components/ui/use-toast';
import { verifySupabaseTables } from '@/services/storageUtils';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Use o cliente Supabase da integração nativa
export const supabase = supabaseClient;

// Verificar se o Supabase está disponível
export const isDefaultConfig = false;

// Inicializar conexão Supabase
export const initializeSupabase = async (): Promise<boolean> => {
  try {
    console.log('Inicializando conexão com Supabase...');
    
    // Testar conexão com uma consulta simples
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
    
    console.log('Supabase inicializado com sucesso!');
    toast({
      title: "Supabase Conectado",
      description: "Conexão com banco de dados estabelecida com sucesso.",
      duration: 5000,
    });
    return true;
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

// Auto-inicializar Supabase
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
