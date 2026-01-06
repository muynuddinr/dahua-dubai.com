import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public API - No auth required
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .select('*')
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) throw error;

    // Transform to match frontend expected format
    const transformedData = data?.map(item => ({
      _id: item.id,
      name: item.name,
      slug: item.slug,
      href: item.href,
      order: item.order,
      isActive: item.is_active
    })) || [];

    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch navbar categories' },
      { status: 500 }
    );
  }
}
