import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API - No auth required
// Returns SEO metadata for categories, sub-categories, or products by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug is required' },
        { status: 400 }
      );
    }

    // Try to find in categories first
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('name, description')
      .eq('slug', slug)
      .maybeSingle();

    if (category && !catError) {
      return NextResponse.json({
        success: true,
        data: {
          metaTitle: `${category.name} | Dahua Dubai`,
          metaDescription: category.description || `Explore ${category.name} products`,
          metaKeywords: `${category.name}, Dahua, security, surveillance`
        }
      });
    }

    // Try sub-categories
    const { data: subCategory, error: subError } = await supabaseAdmin
      .from('sub_categories')
      .select('name, description')
      .eq('slug', slug)
      .maybeSingle();

    if (subCategory && !subError) {
      return NextResponse.json({
        success: true,
        data: {
          metaTitle: `${subCategory.name} | Dahua Dubai`,
          metaDescription: subCategory.description || `Explore ${subCategory.name} products`,
          metaKeywords: `${subCategory.name}, Dahua, security, surveillance`
        }
      });
    }

    // Try products
    const { data: product, error: prodError } = await supabaseAdmin
      .from('products')
      .select('name, description, meta_title, meta_description')
      .eq('slug', slug)
      .maybeSingle();

    if (product && !prodError) {
      return NextResponse.json({
        success: true,
        data: {
          metaTitle: product.meta_title || `${product.name} | Dahua Dubai`,
          metaDescription: product.meta_description || product.description || `${product.name} - Dahua security product`,
          metaKeywords: `${product.name}, Dahua, security, surveillance`
        }
      });
    }

    // Not found - return generic SEO data
    return NextResponse.json({
      success: true,
      data: {
        metaTitle: 'Dahua Dubai - Authorized Dealer',
        metaDescription: 'Dahua authorized dealer in UAE - Security cameras, surveillance systems, and more',
        metaKeywords: 'Dahua, Dubai, UAE, security, surveillance, CCTV'
      }
    });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    // Return default SEO on error instead of failing
    return NextResponse.json({
      success: true,
      data: {
        metaTitle: 'Dahua Dubai - Authorized Dealer',
        metaDescription: 'Dahua authorized dealer in UAE',
        metaKeywords: 'Dahua, Dubai, security'
      }
    });
  }
}
