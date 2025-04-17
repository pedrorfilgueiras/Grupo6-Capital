
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/colors.css'
import { toast } from '@/components/ui/use-toast'

// Check for Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the root and render the application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Show a helpful message if Supabase keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  // Wait a bit to ensure the toast component is mounted
  setTimeout(() => {
    toast({
      title: "Supabase Configuration Required",
      description: "Please connect your app to Supabase using the green Supabase button in the top right, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
      duration: 10000,
    });
  }, 2000);
}
