import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safely initialize to prevent crash if environment variables are not yet configured
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithOAuth: async () => {
          return { 
            error: new Error("Supabase credentials not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.") 
          };
        }
      }
    };
