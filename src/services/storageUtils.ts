
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

