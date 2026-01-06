import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(id, name, slug)
      `)
      .order('order', { ascending: true });

    if (error) throw error;

    return successResponse({ data });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories');
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { name, slug, description, image, order, is_active, navbar_category_id } = body;

    if (!name || !slug) {
      return errorResponse('Name and slug are required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{ 
        name, 
        slug, 
        description, 
        image, 
        order: order || 0, 
        is_active: is_active ?? true,
        navbar_category_id 
      }])
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Category created successfully' }, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse('Failed to create category');
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { id, name, slug, description, image, order, is_active, navbar_category_id } = body;

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ name, slug, description, image, order, is_active, navbar_category_id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse('Failed to update category');
  }
}

// DELETE - Delete category
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
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse('Failed to delete category');
  }
}
