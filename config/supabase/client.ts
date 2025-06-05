import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh for mobile apps
    autoRefreshToken: true,
    // Persist session in local storage
    persistSession: true,
    // Disable session detection in URL for mobile apps
    detectSessionInUrl: false,
  },
})

// Test network connectivity to Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('🔌 Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    
    // Simple health check - try to get the time from the database
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful')
    return { success: true, error: null }
  } catch (err) {
    console.error('🚨 Network error testing Supabase:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Export types for TypeScript
export type { Session, User } from '@supabase/supabase-js'
