import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API - No auth required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    let query = supabaseAdmin
      .from('sub_categories')
      .select(`
        *,
        category:categories(
          id, name, slug,
          navbar_category:navbar_categories(id, name, slug, href)
        )
      `)
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
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
      imagePublicId: item.image_public_id,
      order: item.order,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      categoryId: item.category ? {
        _id: item.category.id,
        name: item.category.name,
        slug: item.category.slug,
        navbarCategoryId: item.category.navbar_category ? {
          _id: item.category.navbar_category.id,
          name: item.category.navbar_category.name,
          slug: item.category.navbar_category.slug,
          href: item.category.navbar_category.href
        } : null
      } : null,
      navbarCategoryId: item.category?.navbar_category ? {
        _id: item.category.navbar_category.id,
        name: item.category.navbar_category.name,
        slug: item.category.navbar_category.slug,
        href: item.category.navbar_category.href
      } : null
    })) || [];

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sub-categories' },
      { status: 500 }
    );
  }
}
