import { supabase } from './client'

/**
 * Test Supabase connection and basic functionality
 * Run this after setting up your Supabase project and environment variables
 */
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...')
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      console.error('❌ Supabase connection error:', error)
      return false
    }
    
    console.log('✅ Basic connection successful!')
    
    // Test 2: Authentication status
    console.log('2. Testing authentication...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log('✅ Auth check complete. Current session:', session ? 'Logged in' : 'Not logged in')
    
    // Test 3: Storage access
    console.log('3. Testing storage access...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.warn('⚠️ Storage access limited (this is normal for new projects):', storageError.message)
    } else {
      console.log('✅ Storage accessible. Buckets:', buckets?.length || 0)
    }
    
    console.log('🎉 Supabase setup test completed successfully!')
    console.log('📝 Next steps:')
    console.log('   1. Run the database schema (config/supabase/schema.sql)')
    console.log('   2. Set up storage buckets for product images')
    console.log('   3. Configure authentication providers')
    
    return true
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error)
    console.log('🔧 Troubleshooting:')
    console.log('   1. Check your .env file has correct EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY')
    console.log('   2. Verify your Supabase project is active')
    console.log('   3. Check your internet connection')
    return false
  }
}

/**
 * Test authentication flow
 */
export async function testAuthentication(email: string, password: string) {
  console.log('🔐 Testing authentication flow...')
  
  try {
    // Test sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (signUpError) {
      console.error('❌ Sign up error:', signUpError.message)
      return false
    }
    
    console.log('✅ Sign up successful!')
    
    // Test sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (signInError) {
      console.error('❌ Sign in error:', signInError.message)
      return false
    }
    
    console.log('✅ Sign in successful!')
    
    // Test sign out
    const { error: signOutError } = await supabase.auth.signOut()
    
    if (signOutError) {
      console.error('❌ Sign out error:', signOutError.message)
      return false
    }
    
    console.log('✅ Sign out successful!')
    console.log('🎉 Authentication flow test completed!')
    
    return true
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    return false
  }
}

/**
 * Test database operations (requires schema to be set up)
 */
export async function testDatabaseOperations() {
  console.log('🗄️ Testing database operations...')
  
  try {
    // Test reading supermarkets
    console.log('1. Testing supermarkets table...')
    const { data: supermarkets, error: supermarketsError } = await supabase
      .from('supermarkets')
      .select('*')
      .limit(5)
    
    if (supermarketsError) {
      console.error('❌ Supermarkets query error:', supermarketsError.message)
      return false
    }
    
    console.log('✅ Supermarkets table accessible. Found:', supermarkets?.length || 0, 'records')
    
    // Test reading products
    console.log('2. Testing products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Products query error:', productsError.message)
      return false
    }
    
    console.log('✅ Products table accessible. Found:', products?.length || 0, 'records')
    
    // Test reading product ratings
    console.log('3. Testing product_ratings table...')
    const { data: ratings, error: ratingsError } = await supabase
      .from('product_ratings')
      .select('*')
      .limit(5)
    
    if (ratingsError) {
      console.error('❌ Product ratings query error:', ratingsError.message)
      return false
    }
    
    console.log('✅ Product ratings table accessible. Found:', ratings?.length || 0, 'records')
    
    console.log('🎉 Database operations test completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error)
    console.log('💡 Make sure you have run the database schema (config/supabase/schema.sql)')
    return false
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Running complete Supabase test suite...\n')
  
  const connectionTest = await testSupabaseConnection()
  if (!connectionTest) {
    console.log('❌ Connection test failed. Stopping here.')
    return false
  }
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  const dbTest = await testDatabaseOperations()
  if (!dbTest) {
    console.log('⚠️ Database test failed. This is expected if schema is not set up yet.')
  }
  
  console.log('\n🏁 Test suite completed!')
  return connectionTest
} 