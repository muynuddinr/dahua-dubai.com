import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth';

// GET - Fetch all sub-categories
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { data, error } = await supabaseAdmin
      .from('sub_categories')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse({ data });
  } catch (error: any) {
    console.error('Error fetching sub-categories:', error);
    return errorResponse(error?.message || 'Failed to fetch sub-categories');
  }
}

// POST - Create new sub-category
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { name, slug, description, image, is_active, category_id } = body;

    if (!name || !slug) {
      return errorResponse('Name and slug are required', 400);
    }

    if (!category_id) {
      return errorResponse('Category ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('sub_categories')
      .insert([{ 
        name, 
        slug, 
        description: description || null, 
        image: image || null, 
        is_active: is_active ?? true,
        category_id 
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return successResponse({ data, message: 'Sub-category created successfully' }, 201);
  } catch (error: any) {
    console.error('Error creating sub-category:', error);
    return errorResponse(error?.message || 'Failed to create sub-category');
  }
}

// PUT - Update sub-category
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { id, name, slug, description, image, is_active, category_id } = body;

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('sub_categories')
      .update({ 
        name, 
        slug, 
        description: description || null, 
        image: image || null, 
        is_active, 
        category_id 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Sub-category updated successfully' });
  } catch (error: any) {
    console.error('Error updating sub-category:', error);
    return errorResponse(error?.message || 'Failed to update sub-category');
  }
}

// DELETE - Delete sub-category
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
      .from('sub_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ message: 'Sub-category deleted successfully' });
  } catch (error) {
    console.error('Error deleting sub-category:', error);
    return errorResponse('Failed to delete sub-category');
  }
}
