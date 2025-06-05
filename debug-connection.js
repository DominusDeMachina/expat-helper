const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('Key length:', supabaseKey ? supabaseKey.length : 0);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔌 Attempting connection...');
    
    // Test 1: Simple health check
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database query failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Test auth
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Auth session:', session ? 'exists' : 'none');
    
    return true;
  } catch (err) {
    console.error('🚨 Connection error:', err.message);
    return false;
  }
}

testConnection().then((success) => {
  if (success) {
    console.log('🎉 Supabase connection is working!');
  } else {
    console.log('💥 Supabase connection failed');
  }
  process.exit(success ? 0 : 1);
}); 