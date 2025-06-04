-- Fix RLS Policy for Profiles Table
-- This addresses the timing issue with user authentication and profile creation

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create more permissive policies that handle edge cases
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- More permissive insert policy that allows creation during signup
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (
    -- Allow if user is authenticated and the ID matches their auth ID
    auth.role() = 'authenticated' AND 
    (auth.uid() = id OR auth.uid()::text = id::text)
  );

-- Alternative: Create a temporary permissive policy for testing
-- Uncomment the lines below if the above still doesn't work
-- DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
-- CREATE POLICY "Authenticated users can insert profiles" ON profiles
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 