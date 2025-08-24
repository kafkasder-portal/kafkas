import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    console.log('✅ Connecting to Supabase...');

    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "table not found" which is ok for now
      console.log(
        '⚠️ Supabase table test failed (table might not exist yet):',
        error.message
      );
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('⚠️ Application will continue with Supabase client only');
  }
};

// Export supabase client for use in routes
export { supabase };
