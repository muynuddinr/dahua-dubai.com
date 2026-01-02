import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import NavbarCategory from '@/models/Navbar-category';
import { checkAdminAuth } from '@/app/api/middleware/adminAuth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('subcategoryId');
    const categoryId = searchParams.get('categoryId');
    const navbarCategoryId = searchParams.get('navbarCategoryId');

    let query: any = {};

    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (navbarCategoryId) {
      query.navbarCategoryId = navbarCategoryId;
    }

    const products = await Product.find(query)
      .populate('subcategoryId', 'name slug')
      .populate('categoryId', 'name slug')
      .populate('navbarCategoryId', 'name slug href')
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await connectDB();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      keyFeatures,
      images,
      subcategoryId,
      categoryId,
      navbarCategoryId,
      order,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !slug || !subcategoryId || !categoryId || !navbarCategoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, slug, subcategory, category, and navbar category are required',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product with this slug already exists',
        },
        { status: 400 }
      );
    }

    // Verify subcategory exists
    const subcategory = await SubCategory.findById(subcategoryId);
    if (!subcategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'SubCategory not found',
        },
        { status: 404 }
      );
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    // Verify navbar category exists
    const navbarCategory = await NavbarCategory.findById(navbarCategoryId);
    if (!navbarCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Navbar Category not found',
        },
        { status: 404 }
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      keyFeatures: keyFeatures || [],
      images: images || [],
      subcategoryId,
      categoryId,
      navbarCategoryId,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('subcategoryId', 'name slug')
      .populate('categoryId', 'name slug')
      .populate('navbarCategoryId', 'name slug href');

    return NextResponse.json({
      success: true,
      data: populatedProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await connectDB();

    const body = await request.json();
    const { _id, slug, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    // If slug is being updated, check if it already exists
    if (slug) {
      const existingProduct = await Product.findOne({
        slug,
        _id: { $ne: _id },
      });

      if (existingProduct) {
        return NextResponse.json(
          {
            success: false,
            error: 'Product with this slug already exists',
          },
          { status: 400 }
        );
      }
      updateData.slug = slug;
    }

    const product = await Product.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('subcategoryId', 'name slug')
      .populate('categoryId', 'name slug')
      .populate('navbarCategoryId', 'name slug href');

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}
