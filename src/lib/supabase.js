import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://fagblbogumttcrsbletc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZ2JsYm9ndW10dGNyc2JsZXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NDg4OTksImV4cCI6MjA3MTQyNDg5OX0.PNQpiOsctCqIrH20BdylDtzVVKOJW4KmBo79w2izioo'

const isDevelopment = import.meta.env.DEV

// Production check for missing credentials
if (!isDevelopment && (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project.supabase.co' || 
    supabaseAnonKey === 'your-anon-key')) {
  console.error('❌ Supabase credentials are missing or invalid!')
  console.error('Please set VITE_PUBLIC_SUPABASE_URL and VITE_PUBLIC_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection test error:', error)
    return false
  }
}
