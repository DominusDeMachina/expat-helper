#!/usr/bin/env node

/**
 * Script to run Supabase tests in Node.js environment
 * This allows us to test Supabase connection without running the full Expo app
 */

// Load environment variables
require('dotenv').config();

async function runTests() {
  try {
    console.log('🚀 Starting Supabase tests...\n');
    
    // Check environment variables first
    if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing environment variables!');
      console.log('Please create a .env file in the project root with:');
      console.log('EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
      console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
      console.log('\nYou can get these values from your Supabase project dashboard at https://supabase.com/dashboard');
      process.exit(1);
    }
    
    console.log('✅ Environment variables found');
    console.log('📡 Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log('🔑 Anon Key:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...\n');
    
    // Import Supabase client directly
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    );
    
    // Run basic connection test
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      console.error('❌ Supabase connection error:', error);
      return false;
    }
    
    console.log('✅ Basic connection successful!');
    
    // Test 2: Authentication status
    console.log('2. Testing authentication...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ Auth check complete. Current session:', session ? 'Logged in' : 'Not logged in');
    
    // Test 3: Storage access
    console.log('3. Testing storage access...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.warn('⚠️ Storage access limited (this is normal for new projects):', storageError.message);
    } else {
      console.log('✅ Storage accessible. Buckets:', buckets?.length || 0);
    }
    
    console.log('🎉 Supabase setup test completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Run the database schema (config/supabase/schema.sql)');
    console.log('   2. Set up storage buckets for product images');
    console.log('   3. Configure authentication providers');
    
    return true;
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check your .env file has correct EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   2. Verify your Supabase project is active');
    console.log('   3. Check your internet connection');
    return false;
  }
}

runTests().then(success => {
  if (success) {
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Tests failed. Check the output above for details.');
    process.exit(1);
  }
}); 