import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import NavbarCategory from '@/models/Navbar-category';
import { checkAdminAuth } from '@/app/api/middleware/adminAuth';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const navbarCategoryId = searchParams.get('navbarCategoryId');

    let query = {};
    if (navbarCategoryId) {
      query = { navbarCategoryId };
    }

    const categories = await Category.find(query)
      .populate('navbarCategoryId', 'name slug href')
      .sort({ order: 1 });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();
    const body = await request.json();

    const { name, slug, description, image, imagePublicId, navbarCategoryId, order, isActive } = body;

    // Validation
    if (!name || !slug || !navbarCategoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, slug, and navbar category are required fields',
        },
        { status: 400 }
      );
    }

    // Check if navbar category exists
    const navbarCategory = await NavbarCategory.findById(navbarCategoryId);
    if (!navbarCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Selected navbar category does not exist',
        },
        { status: 404 }
      );
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'A category with this slug already exists',
        },
        { status: 409 }
      );
    }

    // Create new category
    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      imagePublicId: imagePublicId || '',
      navbarCategoryId,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    // Populate navbar category info
    await category.populate('navbarCategoryId', 'name slug href');

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();
    const body = await request.json();

    const { _id, name, slug, description, image, imagePublicId, navbarCategoryId, order, isActive } = body;

    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category ID is required',
        },
        { status: 400 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existingCategory = await Category.findOne({
        slug,
        _id: { $ne: _id },
      });

      if (existingCategory) {
        return NextResponse.json(
          {
            success: false,
            error: 'A category with this slug already exists',
          },
          { status: 409 }
        );
      }
    }

    // If navbar category is being changed, verify it exists
    if (navbarCategoryId) {
      const navbarCategory = await NavbarCategory.findById(navbarCategoryId);
      if (!navbarCategory) {
        return NextResponse.json(
          {
            success: false,
            error: 'Selected navbar category does not exist',
          },
          { status: 404 }
        );
      }
    }

    const category = await Category.findByIdAndUpdate(
      _id,
      {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(imagePublicId !== undefined && { imagePublicId }),
        ...(navbarCategoryId && { navbarCategoryId }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    ).populate('navbarCategoryId', 'name slug href');

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category ID is required',
        },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
