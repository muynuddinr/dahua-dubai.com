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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse({ data });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return errorResponse(error?.message || 'Failed to fetch categories');
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
    const { name, slug, description, image, is_active } = body;

    if (!name || !slug) {
      return errorResponse('Name and slug are required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([{ 
        name, 
        slug, 
        description: description || null, 
        image: image || null, 
        is_active: is_active ?? true
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return successResponse({ data, message: 'Category created successfully' }, 201);
  } catch (error: any) {
    console.error('Error creating category:', error);
    return errorResponse(error?.message || 'Failed to create category');
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
    const { id, name, slug, description, image, is_active } = body;

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ 
        name, 
        slug, 
        description: description || null, 
        image: image || null, 
        is_active 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Category updated successfully' });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return errorResponse(error?.message || 'Failed to update category');
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
