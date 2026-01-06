/**
 * MongoDB to Supabase Migration Script
 * 
 * This script migrates all data from MongoDB to Supabase
 * Run with: node scripts/migrate-to-supabase.mjs
 */

import mongoose from 'mongoose';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// CONFIGURATION
// =====================================================
const MONGODB_URI = 'mongodb+srv://lovosis:Lovosis2025@dahuadb.azz5lsj.mongodb.net/dahuadb?appName=dahuadb';
const SUPABASE_URL = 'https://aijmdajuebprtroohuos.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpam1kYWp1ZWJwcnRyb29odW9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTM1MiwiZXhwIjoyMDgzMTgxMzUyfQ.21I9GMBEAeGKyRBvfvl9owrVZtsIzfTx4qMr3COoh0s';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ID Mapping (MongoDB ObjectId -> Supabase UUID)
const idMapping = {
  navbarCategories: new Map(),
  categories: new Map(),
  subCategories: new Map(),
  products: new Map(),
};

// =====================================================
// MONGODB SCHEMAS (inline for migration script)
// =====================================================

const NavbarCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  href: String,
  order: Number,
  isActive: Boolean,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  imagePublicId: String,
  navbarCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavbarCategory' },
  isActive: Boolean,
  order: Number,
}, { timestamps: true });

const SubCategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  imagePublicId: String,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  navbarCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavbarCategory' },
  isActive: Boolean,
  order: Number,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  keyFeatures: [String],
  images: [{
    url: String,
    publicId: String,
  }],
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  navbarCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavbarCategory' },
  isActive: Boolean,
  order: Number,
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  companyName: String,
  subject: String,
  message: String,
  productName: String,
  productSlug: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  enquiryType: String,
  status: String,
}, { timestamps: true });

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

async function clearSupabaseTables() {
  log('Clearing existing Supabase data...', 'warning');
  
  // Delete in reverse order of dependencies
  await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sub_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('navbar_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  log('Cleared all existing data', 'success');
}

// =====================================================
// MIGRATION FUNCTIONS
// =====================================================

async function migrateNavbarCategories(NavbarCategory) {
  log('Migrating Navbar Categories...');
  
  const mongoData = await NavbarCategory.find({}).lean();
  log(`Found ${mongoData.length} navbar categories in MongoDB`);
  
  for (const item of mongoData) {
    const supabaseData = {
      name: item.name,
      slug: item.slug,
      href: item.href,
      order: item.order || 0,
      is_active: item.isActive !== false,
      created_at: item.createdAt || new Date(),
      updated_at: item.updatedAt || new Date(),
    };
    
    const { data, error } = await supabase
      .from('navbar_categories')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      log(`Error migrating navbar category "${item.name}": ${error.message}`, 'error');
    } else {
      idMapping.navbarCategories.set(item._id.toString(), data.id);
      log(`✓ Migrated navbar category: ${item.name}`, 'success');
    }
  }
  
  log(`Navbar Categories migration complete: ${idMapping.navbarCategories.size} migrated`, 'success');
}

async function migrateCategories(Category) {
  log('Migrating Categories...');
  
  const mongoData = await Category.find({}).lean();
  log(`Found ${mongoData.length} categories in MongoDB`);
  
  for (const item of mongoData) {
    const navbarCategoryId = idMapping.navbarCategories.get(item.navbarCategoryId?.toString());
    
    if (!navbarCategoryId) {
      log(`Skipping category "${item.name}" - navbar category not found`, 'warning');
      continue;
    }
    
    const supabaseData = {
      name: item.name,
      slug: item.slug,
      description: item.description || null,
      image: item.image || null,
      image_public_id: item.imagePublicId || null,
      navbar_category_id: navbarCategoryId,
      is_active: item.isActive !== false,
      order: item.order || 0,
      created_at: item.createdAt || new Date(),
      updated_at: item.updatedAt || new Date(),
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      log(`Error migrating category "${item.name}": ${error.message}`, 'error');
    } else {
      idMapping.categories.set(item._id.toString(), data.id);
      log(`✓ Migrated category: ${item.name}`, 'success');
    }
  }
  
  log(`Categories migration complete: ${idMapping.categories.size} migrated`, 'success');
}

async function migrateSubCategories(SubCategory) {
  log('Migrating Sub Categories...');
  
  const mongoData = await SubCategory.find({}).lean();
  log(`Found ${mongoData.length} sub categories in MongoDB`);
  
  for (const item of mongoData) {
    const categoryId = idMapping.categories.get(item.categoryId?.toString());
    const navbarCategoryId = idMapping.navbarCategories.get(item.navbarCategoryId?.toString());
    
    if (!categoryId || !navbarCategoryId) {
      log(`Skipping sub category "${item.name}" - parent not found`, 'warning');
      continue;
    }
    
    const supabaseData = {
      name: item.name,
      slug: item.slug,
      description: item.description || null,
      image: item.image || null,
      image_public_id: item.imagePublicId || null,
      category_id: categoryId,
      navbar_category_id: navbarCategoryId,
      is_active: item.isActive !== false,
      order: item.order || 0,
      created_at: item.createdAt || new Date(),
      updated_at: item.updatedAt || new Date(),
    };
    
    const { data, error } = await supabase
      .from('sub_categories')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      log(`Error migrating sub category "${item.name}": ${error.message}`, 'error');
    } else {
      idMapping.subCategories.set(item._id.toString(), data.id);
      log(`✓ Migrated sub category: ${item.name}`, 'success');
    }
  }
  
  log(`Sub Categories migration complete: ${idMapping.subCategories.size} migrated`, 'success');
}

async function migrateProducts(Product) {
  log('Migrating Products...');
  
  const mongoData = await Product.find({}).lean();
  log(`Found ${mongoData.length} products in MongoDB`);
  
  let migratedCount = 0;
  
  for (const item of mongoData) {
    const subcategoryId = idMapping.subCategories.get(item.subcategoryId?.toString());
    const categoryId = idMapping.categories.get(item.categoryId?.toString());
    const navbarCategoryId = idMapping.navbarCategories.get(item.navbarCategoryId?.toString());
    
    if (!subcategoryId || !categoryId || !navbarCategoryId) {
      log(`Skipping product "${item.name}" - parent not found`, 'warning');
      continue;
    }
    
    const supabaseData = {
      name: item.name,
      slug: item.slug,
      description: item.description || null,
      key_features: item.keyFeatures || [],
      images: item.images || [],
      subcategory_id: subcategoryId,
      category_id: categoryId,
      navbar_category_id: navbarCategoryId,
      is_active: item.isActive !== false,
      order: item.order || 0,
      created_at: item.createdAt || new Date(),
      updated_at: item.updatedAt || new Date(),
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      log(`Error migrating product "${item.name}": ${error.message}`, 'error');
    } else {
      idMapping.products.set(item._id.toString(), data.id);
      migratedCount++;
      if (migratedCount % 10 === 0) {
        log(`Migrated ${migratedCount} products...`);
      }
    }
  }
  
  log(`Products migration complete: ${idMapping.products.size} migrated`, 'success');
}

async function migrateContacts(Contact) {
  log('Migrating Contacts...');
  
  const mongoData = await Contact.find({}).lean();
  log(`Found ${mongoData.length} contacts in MongoDB`);
  
  let migratedCount = 0;
  
  for (const item of mongoData) {
    const productId = item.productId ? idMapping.products.get(item.productId.toString()) : null;
    
    const supabaseData = {
      name: item.name,
      email: item.email,
      mobile: item.mobile,
      company_name: item.companyName || null,
      subject: item.subject || null,
      message: item.message || null,
      product_name: item.productName || null,
      product_slug: item.productSlug || null,
      product_id: productId,
      enquiry_type: item.enquiryType || 'general',
      status: item.status || 'new',
      created_at: item.createdAt || new Date(),
      updated_at: item.updatedAt || new Date(),
    };
    
    const { data, error } = await supabase
      .from('contacts')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      log(`Error migrating contact "${item.name}": ${error.message}`, 'error');
    } else {
      migratedCount++;
    }
  }
  
  log(`Contacts migration complete: ${migratedCount} migrated`, 'success');
}

// =====================================================
// MAIN MIGRATION FUNCTION
// =====================================================

async function runMigration() {
  console.log('\n');
  log('='.repeat(60));
  log('  MONGODB TO SUPABASE MIGRATION');
  log('='.repeat(60));
  console.log('\n');
  
  try {
    // Connect to MongoDB
    log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB', 'success');
    
    // Create models
    const NavbarCategory = mongoose.models.NavbarCategory || mongoose.model('NavbarCategory', NavbarCategorySchema);
    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema);
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
    
    // Clear existing Supabase data
    await clearSupabaseTables();
    
    console.log('\n');
    
    // Migrate in order of dependencies
    await migrateNavbarCategories(NavbarCategory);
    console.log('\n');
    
    await migrateCategories(Category);
    console.log('\n');
    
    await migrateSubCategories(SubCategory);
    console.log('\n');
    
    await migrateProducts(Product);
    console.log('\n');
    
    await migrateContacts(Contact);
    console.log('\n');
    
    // Summary
    log('='.repeat(60));
    log('  MIGRATION SUMMARY');
    log('='.repeat(60));
    log(`Navbar Categories: ${idMapping.navbarCategories.size}`);
    log(`Categories: ${idMapping.categories.size}`);
    log(`Sub Categories: ${idMapping.subCategories.size}`);
    log(`Products: ${idMapping.products.size}`);
    log('='.repeat(60));
    log('MIGRATION COMPLETED SUCCESSFULLY!', 'success');
    
  } catch (error) {
    log(`Migration failed: ${error.message}`, 'error');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
runMigration();
