import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdmin, unauthorizedResponse, errorResponse, successResponse } from '@/lib/auth';

// GET - Fetch all navbar categories
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    return successResponse({ data });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return errorResponse('Failed to fetch navbar categories');
  }
}

// POST - Create new navbar category
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { name, slug, href, order, is_active } = body;

    if (!name || !slug) {
      return errorResponse('Name and slug are required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .insert([{ name, slug, href, order: order || 0, is_active: is_active ?? true }])
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Navbar category created successfully' }, 201);
  } catch (error) {
    console.error('Error creating navbar category:', error);
    return errorResponse('Failed to create navbar category');
  }
}

// PUT - Update navbar category
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return unauthorizedResponse(authResult.error);
    }

    const body = await request.json();
    const { id, name, slug, href, order, is_active } = body;

    if (!id) {
      return errorResponse('ID is required', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .update({ name, slug, href, order, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse({ data, message: 'Navbar category updated successfully' });
  } catch (error) {
    console.error('Error updating navbar category:', error);
    return errorResponse('Failed to update navbar category');
  }
}

// DELETE - Delete navbar category
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
      .from('navbar_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse({ message: 'Navbar category deleted successfully' });
  } catch (error) {
    console.error('Error deleting navbar category:', error);
    return errorResponse('Failed to delete navbar category');
  }
}
