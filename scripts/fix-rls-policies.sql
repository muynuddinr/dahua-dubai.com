-- =====================================================
-- FIX RLS POLICIES FOR ADMIN DASHBOARD
-- Run this in Supabase SQL Editor
-- =====================================================

-- Option 1: DISABLE RLS (Simplest - Good for development/admin dashboards)
-- This allows all operations without policy checks

ALTER TABLE navbar_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- =====================================================
-- ALTERNATIVE: Keep RLS but allow all operations
-- Uncomment below if you want to keep RLS enabled
-- =====================================================

/*
-- Re-enable RLS first
ALTER TABLE navbar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON navbar_categories;
DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow public read access" ON sub_categories;
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public read access on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public to create enquiry" ON contacts;
DROP POLICY IF EXISTS "Allow update on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow delete on contacts" ON contacts;
DROP POLICY IF EXISTS "Allow service role full access" ON navbar_categories;
DROP POLICY IF EXISTS "Allow service role full access" ON categories;
DROP POLICY IF EXISTS "Allow service role full access" ON sub_categories;
DROP POLICY IF EXISTS "Allow service role full access" ON products;
DROP POLICY IF EXISTS "Allow service role full access" ON contacts;

-- Create permissive policies for all operations
CREATE POLICY "Allow all" ON navbar_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sub_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON contacts FOR ALL USING (true) WITH CHECK (true);
*/
