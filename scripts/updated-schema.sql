-- =====================================================
-- UPDATED SUPABASE SCHEMA FOR DAHUA DUBAI PROJECT
-- Run this in your Supabase SQL Editor to update the schema
-- This removes the navbar_category dependency
-- =====================================================

-- =====================================================
-- STEP 1: Drop navbar_category_id constraints from tables
-- =====================================================

-- Remove foreign key constraints from categories table
ALTER TABLE IF EXISTS categories 
DROP CONSTRAINT IF EXISTS categories_navbar_category_id_fkey;

-- Remove foreign key constraints from sub_categories table  
ALTER TABLE IF EXISTS sub_categories
DROP CONSTRAINT IF EXISTS sub_categories_navbar_category_id_fkey;

-- Remove foreign key constraints from products table
ALTER TABLE IF EXISTS products
DROP CONSTRAINT IF EXISTS products_navbar_category_id_fkey;

-- =====================================================
-- STEP 2: Drop navbar_category_id columns
-- =====================================================

ALTER TABLE IF EXISTS categories 
DROP COLUMN IF EXISTS navbar_category_id;

ALTER TABLE IF EXISTS sub_categories
DROP COLUMN IF EXISTS navbar_category_id;

ALTER TABLE IF EXISTS products
DROP COLUMN IF EXISTS navbar_category_id;

-- =====================================================
-- STEP 3: Drop indexes related to navbar_category
-- =====================================================

DROP INDEX IF EXISTS idx_categories_navbar_category;
DROP INDEX IF EXISTS idx_sub_categories_navbar_category;
DROP INDEX IF EXISTS idx_products_navbar_category;

-- =====================================================
-- STEP 4: Drop navbar_categories table
-- =====================================================

DROP TABLE IF EXISTS navbar_categories CASCADE;

-- =====================================================
-- VERIFICATION: Check that columns are removed
-- =====================================================
-- Run this to verify changes:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'categories';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'sub_categories';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'products';

-- Done! Your database is now updated.
    image TEXT,
    image_public_id TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sub_categories_category ON sub_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_sub_categories_order_active ON sub_categories(category_id, "order", is_active);

-- =====================================================
-- PRODUCTS TABLE (Updated)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    key_features TEXT[] DEFAULT '{}',
    images JSONB DEFAULT '[]',
    subcategory_id UUID NOT NULL REFERENCES sub_categories(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_order ON products("order", created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- =====================================================
-- CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    product_name VARCHAR(255),
    product_slug VARCHAR(255),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    enquiry_type VARCHAR(20) DEFAULT 'general' CHECK (enquiry_type IN ('general', 'product')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);

-- =====================================================
-- ADMIN_SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    admin_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read access for categories
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories
    FOR SELECT USING (true);

-- Public read access for sub_categories
DROP POLICY IF EXISTS "Allow public read sub_categories" ON sub_categories;
CREATE POLICY "Allow public read sub_categories" ON sub_categories
    FOR SELECT USING (true);

-- Public read access for products
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products
    FOR SELECT USING (true);

-- Public insert access for contacts
DROP POLICY IF EXISTS "Allow public insert contacts" ON contacts;
CREATE POLICY "Allow public insert contacts" ON contacts
    FOR INSERT WITH CHECK (true);
