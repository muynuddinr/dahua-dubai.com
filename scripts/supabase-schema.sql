-- =====================================================
-- SUPABASE SCHEMA FOR DAHUA DUBAI PROJECT
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. NAVBAR CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS navbar_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    href VARCHAR(255) NOT NULL,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT navbar_categories_name_min_length CHECK (char_length(name) >= 2)
);

-- Index for faster queries
CREATE INDEX idx_navbar_categories_order_active ON navbar_categories("order", is_active);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    image TEXT,
    image_public_id TEXT,
    navbar_category_id UUID NOT NULL REFERENCES navbar_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT categories_name_min_length CHECK (char_length(name) >= 2)
);

-- Indexes
CREATE INDEX idx_categories_navbar_category ON categories(navbar_category_id);
CREATE INDEX idx_categories_order_active ON categories("order", is_active);

-- =====================================================
-- 3. SUB CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    image_public_id TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    navbar_category_id UUID NOT NULL REFERENCES navbar_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sub_categories_category ON sub_categories(category_id);
CREATE INDEX idx_sub_categories_navbar_category ON sub_categories(navbar_category_id);
CREATE INDEX idx_sub_categories_order_active ON sub_categories(category_id, "order", is_active);

-- =====================================================
-- 4. PRODUCTS TABLE
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
    navbar_category_id UUID NOT NULL REFERENCES navbar_categories(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_navbar_category ON products(navbar_category_id);
CREATE INDEX idx_products_order ON products("order", created_at DESC);
CREATE INDEX idx_products_slug ON products(slug);

-- =====================================================
-- 5. CONTACTS TABLE (Enquiries)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    company_name VARCHAR(255),
    subject VARCHAR(500),
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
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_enquiry_type ON contacts(enquiry_type);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- =====================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_navbar_categories_updated_at
    BEFORE UPDATE ON navbar_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_categories_updated_at
    BEFORE UPDATE ON sub_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE navbar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read access for navbar_categories, categories, sub_categories, products
CREATE POLICY "Allow public read access" ON navbar_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sub_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Only service role can insert/update/delete (admin operations)
CREATE POLICY "Allow service role full access" ON navbar_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON sub_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON products FOR ALL USING (auth.role() = 'service_role');

-- Contacts: public can insert, service role can do everything
CREATE POLICY "Allow public to create enquiry" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role full access" ON contacts FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 8. VIEWS FOR EASIER QUERYING (Optional)
-- =====================================================

-- Products with all relations
CREATE OR REPLACE VIEW products_with_relations AS
SELECT 
    p.*,
    sc.name as subcategory_name,
    sc.slug as subcategory_slug,
    c.name as category_name,
    c.slug as category_slug,
    nc.name as navbar_category_name,
    nc.slug as navbar_category_slug,
    nc.href as navbar_category_href
FROM products p
LEFT JOIN sub_categories sc ON p.subcategory_id = sc.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN navbar_categories nc ON p.navbar_category_id = nc.id;

-- Categories with navbar category
CREATE OR REPLACE VIEW categories_with_navbar AS
SELECT 
    c.*,
    nc.name as navbar_category_name,
    nc.slug as navbar_category_slug,
    nc.href as navbar_category_href
FROM categories c
LEFT JOIN navbar_categories nc ON c.navbar_category_id = nc.id;

-- Sub categories with all relations
CREATE OR REPLACE VIEW sub_categories_with_relations AS
SELECT 
    sc.*,
    c.name as category_name,
    c.slug as category_slug,
    nc.name as navbar_category_name,
    nc.slug as navbar_category_slug
FROM sub_categories sc
LEFT JOIN categories c ON sc.category_id = c.id
LEFT JOIN navbar_categories nc ON sc.navbar_category_id = nc.id;

-- =====================================================
-- DONE! Schema created successfully
-- =====================================================
