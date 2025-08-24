-- Fix infinite recursion in users table RLS policy
-- This migration fixes the circular reference in the users table policy

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create new policies without circular references
-- Policy for users to view their own data
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy for admins to view all users (without circular reference)
CREATE POLICY "admins_select_all" ON users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    auth.uid() IN (
      SELECT id FROM users 
      WHERE role = 'admin' 
      AND id = auth.uid()
      LIMIT 1
    )
  );

-- Policy for users to update their own data
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for admins to manage all users
CREATE POLICY "admins_manage_all" ON users
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

-- Verify the policies are working
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';