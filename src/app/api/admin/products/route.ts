import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth';

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        sub_category:sub_categories(id, name, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse({ data });
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products');
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { 
      name, 
      slug, 
      description, 
      short_description,
      image, 
      images,
      features,
      specifications,
      is_active, 
      sub_category_id,
      meta_title,
      meta_description
    } = body;

    if (!name || !slug) {
      return errorResponse('Name and slug are required', 400);
    }

    if (!sub_category_id) {
      return errorResponse('Sub-category ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{ 
        name, 
        slug, 
        description, 
        short_description,
        image, 
        images: images || [],
        features: features || [],
        specifications: specifications || {},
        is_active: is_active ?? true,
        sub_category_id,
        meta_title,
        meta_description
      }])
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Product created successfully' }, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return errorResponse('Failed to create product');
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { 
      id,
      name, 
      slug, 
      description, 
      short_description,
      image, 
      images,
      features,
      specifications,
      is_active, 
      sub_category_id,
      meta_title,
      meta_description
    } = body;

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ 
        name, 
        slug, 
        description, 
        short_description,
        image, 
        images,
        features,
        specifications,
        is_active,
        sub_category_id,
        meta_title,
        meta_description
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return errorResponse('Failed to update product');
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return errorResponse('Failed to delete product');
  }
}
