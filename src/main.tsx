
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/colors.css'
import { toast } from '@/components/ui/use-toast'

// Create the root and render the application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Check for Supabase environment variables (only show message once)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Show a helpful message if Supabase keys are missing, but only once
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project-url.supabase.co' || 
    supabaseAnonKey === 'your-anon-key') {
  
  // Set a flag in localStorage to track if we've shown the message
  const hasShownSupabaseMessage = localStorage.getItem('hasShownSupabaseMessage');
  
  if (!hasShownSupabaseMessage) {
    // Wait a bit to ensure the toast component is mounted
    setTimeout(() => {
      toast({
        title: "Supabase Configuration Required",
        description: "Please connect your app to Supabase using the green Supabase button in the top right, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
        duration: 10000,
      });
      
      // Set flag to avoid showing the message again in this session
      localStorage.setItem('hasShownSupabaseMessage', 'true');
    }, 2000);
  }
}
