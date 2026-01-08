import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API - No auth required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subCategoryId = searchParams.get('subCategoryId') || searchParams.get('subcategoryId');
    const slug = searchParams.get('slug');

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        sub_category:sub_categories!subcategory_id(
          id, name, slug,
          category:categories(id, name, slug)
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subCategoryId) {
      query = query.eq('subcategory_id', subCategoryId);
    }

    if (slug) {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform to match frontend expected format
    const transformedData = data?.map(item => {
      return {
        _id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        shortDescription: item.short_description,
        image: item.image,
        images: item.images?.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url,
          publicId: typeof img === 'string' ? '' : img.publicId
        })) || [],
        features: item.key_features || [],
        keyFeatures: item.key_features || [],
        specifications: item.specifications || {},
        isActive: item.is_active,
        order: 0,
        metaTitle: item.meta_title,
        metaDescription: item.meta_description,
        categoryId: item.sub_category?.category ? {
          _id: item.sub_category.category.id,
          name: item.sub_category.category.name,
          slug: item.sub_category.category.slug
        } : null,
        subcategoryId: item.sub_category ? {
          _id: item.sub_category.id,
          name: item.sub_category.name,
          slug: item.sub_category.slug,
          categoryId: item.sub_category.category ? {
            _id: item.sub_category.category.id,
            name: item.sub_category.category.name,
            slug: item.sub_category.category.slug
          } : null
        } : null
      };
    }) || [];

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
