
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/colors.css'
import { toast } from '@/components/ui/use-toast'
import { isDefaultConfig } from '@/lib/supabase'

// Create the root and render the application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Show a helpful message if Supabase keys are missing, but only once
if (isDefaultConfig) {  
  // Set a flag in localStorage to track if we've shown the message
  const hasShownSupabaseMessage = localStorage.getItem('hasShownSupabaseMessage');
  
  if (!hasShownSupabaseMessage) {
    // Wait a bit to ensure the toast component is mounted
    setTimeout(() => {
      toast({
        title: "Configuração do Supabase Necessária",
        description: "Por favor, conecte seu app ao Supabase usando o botão verde do Supabase no canto superior direito, ou defina as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
        duration: 10000,
      });
      
      // Set flag to avoid showing the message again in this session
      localStorage.setItem('hasShownSupabaseMessage', 'true');
    }, 2000);
  }
}
