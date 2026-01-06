import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API - No auth required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategoryId');

    let query = supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(id, name, slug, href)
      `)
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (navbarCategoryId) {
      query = query.eq('navbar_category_id', navbarCategoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform to match frontend expected format
    const transformedData = data?.map(item => ({
      _id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      image: item.image,
      order: item.order,
      isActive: item.is_active,
      navbarCategoryId: item.navbar_category ? {
        _id: item.navbar_category.id,
        name: item.navbar_category.name,
        slug: item.navbar_category.slug,
        href: item.navbar_category.href
      } : null
    })) || [];

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
