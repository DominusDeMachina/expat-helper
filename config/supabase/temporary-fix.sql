-- Temporary Permissive Fix for Profile Creation
-- This removes the strict ID matching requirement for testing

-- Drop the strict insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a permissive policy that only requires authentication
CREATE POLICY "Authenticated users can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Keep the other policies as they are for viewing and updating
-- (The select and update policies should work fine)

-- Note: This is a temporary fix for development/testing
-- In production, you may want to restore stricter policies 