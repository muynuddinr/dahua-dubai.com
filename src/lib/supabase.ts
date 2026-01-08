// =====================================================
// SUPABASE CLIENT CONFIGURATION
// =====================================================

import { createClient } from '@supabase/supabase-js';

// =====================================================
// ENVIRONMENT VARIABLES
// =====================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// =====================================================
// SUPABASE PUBLIC CLIENT (Client-side with RLS)
// =====================================================

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// =====================================================
// SUPABASE ADMIN CLIENT (Server-side with full access)
// =====================================================

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get the admin Supabase client (server-side only)
 * Use this for admin operations that bypass RLS
 */
export function getSupabaseAdmin() {
  return supabaseAdmin;
}

/**
 * Get the public Supabase client
 * Use this for client-side or RLS-protected operations
 */
export function getSupabaseClient() {
  return supabase;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

// =====================================================
// TYPE EXPORTS (for backwards compatibility)
// =====================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  image_public_id: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  image_public_id: string | null;
  category_id: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  key_features: string[];
  images: ProductImage[];
  subcategory_id: string;
  category_id: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  mobile: string;
  company_name: string | null;
  subject: string | null;
  message: string | null;
  product_name: string | null;
  product_slug: string | null;
  product_id: string | null;
  enquiry_type: 'general' | 'product';
  status: 'new' | 'read' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
}

// Default export for backwards compatibility
export default supabaseAdmin;
