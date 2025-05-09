
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Verificar se Supabase está disponível
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // Testar conexão com uma consulta simples
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
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

// Verificar existência das tabelas no Supabase
export const verifySupabaseTables = async (): Promise<boolean> => {
  try {
    // Verificar se podemos acessar a tabela companies
    const { error: errorCompanies } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
      
    // Verificar se podemos acessar a tabela modulo_dd
    const { error: errorDD } = await supabase
      .from('modulo_dd')
      .select('id')
      .limit(1);

    // Se houver erro que não seja de dados não encontrados, relatamos
    if ((errorCompanies && errorCompanies.code !== 'PGRST116') || 
        (errorDD && errorDD.code !== 'PGRST116')) {
      console.error('Erro ao verificar tabelas:', errorCompanies || errorDD);
      return false;
    }
    
    // Verificar acesso ao bucket de armazenamento
    try {
      const { data: bucketData } = await supabase
        .storage
        .getBucket('documentos');
        
      if (!bucketData) {
        console.warn('Bucket de documentos não encontrado.');
        return false;
      }
    } catch (storageErr) {
      console.error('Erro ao verificar bucket de documentos:', storageErr);
      return false;
    }
    
    console.log('Verificação de tabelas concluída com sucesso!');
    return true;
  } catch (err) {
    console.error('Erro ao verificar tabelas do Supabase:', err);
    return false;
  }
};

// Mostrar mensagem de sucesso
export const showSuccessToast = (message: string) => {
  toast({
    title: "Sucesso",
    description: message,
  });
};

// Mostrar mensagem de erro
export const showErrorToast = (message: string) => {
  toast({
    title: "Erro",
    description: message,
    variant: "destructive"
  });
};
