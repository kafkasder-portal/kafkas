import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

const isDevelopment = import.meta.env.DEV;

// Check for missing credentials
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase credentials are missing!';
  console.error('❌', errorMessage);
  console.error('Please ensure the following environment variables are set:');
  console.error('- VITE_PUBLIC_SUPABASE_URL');
  console.error('- VITE_PUBLIC_SUPABASE_ANON_KEY');
  
  if (!isDevelopment) {
    throw new Error(errorMessage);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Supabase connection test error:', error);
    return false;
  }
};
