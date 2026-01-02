import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SubCategory from '@/models/SubCategory';
import Category from '@/models/Category';
import NavbarCategory from '@/models/Navbar-category';
import { checkAdminAuth } from '@/app/api/middleware/adminAuth';

// GET - Fetch all sub-categories
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const navbarCategoryId = searchParams.get('navbarCategoryId');

    let query: any = {};
    if (categoryId) query.categoryId = categoryId;
    if (navbarCategoryId) query.navbarCategoryId = navbarCategoryId;

    const subCategories = await SubCategory.find(query)
      .populate('categoryId', 'name slug')
      .populate('navbarCategoryId', 'name slug href')
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: subCategories,
    });
  } catch (error: any) {
    console.error('SubCategory GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sub-categories' },
      { status: 500 }
    );
  }
}

// POST - Create new sub-category
export async function POST(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { name, slug, description, image, imagePublicId, categoryId, navbarCategoryId, isActive, order } = body;

    // Validate required fields
    if (!name || !slug || !categoryId || !navbarCategoryId) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, category, and navbar category are required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if navbar category exists
    const navbarCategoryExists = await NavbarCategory.findById(navbarCategoryId);
    if (!navbarCategoryExists) {
      return NextResponse.json(
        { success: false, error: 'Navbar category not found' },
        { status: 404 }
      );
    }

    // Check if slug already exists
    const existingSubCategory = await SubCategory.findOne({ slug });
    if (existingSubCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub-category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new sub-category
    const subCategory = await SubCategory.create({
      name,
      slug,
      description,
      image,
      imagePublicId,
      categoryId,
      navbarCategoryId,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    // Populate references before returning
    await subCategory.populate('categoryId', 'name slug');
    await subCategory.populate('navbarCategoryId', 'name slug href');

    return NextResponse.json({
      success: true,
      data: subCategory,
      message: 'Sub-category created successfully',
    });
  } catch (error: any) {
    console.error('SubCategory POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create sub-category' },
      { status: 500 }
    );
  }
}

// PUT - Update sub-category
export async function PUT(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();

    const body = await request.json();
    const { _id, name, slug, description, image, imagePublicId, categoryId, navbarCategoryId, isActive, order } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Sub-category ID is required' },
        { status: 400 }
      );
    }

    // Check if sub-category exists
    const existingSubCategory = await SubCategory.findById(_id);
    if (!existingSubCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub-category not found' },
        { status: 404 }
      );
    }

    // If slug is being updated, check for duplicates
    if (slug && slug !== existingSubCategory.slug) {
      const duplicateSlug = await SubCategory.findOne({ slug, _id: { $ne: _id } });
      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: 'Sub-category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update sub-category
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      _id,
      {
        name,
        slug,
        description,
        image,
        imagePublicId,
        categoryId,
        navbarCategoryId,
        isActive,
        order,
      },
      { new: true, runValidators: true }
    )
      .populate('categoryId', 'name slug')
      .populate('navbarCategoryId', 'name slug href');

    return NextResponse.json({
      success: true,
      data: updatedSubCategory,
      message: 'Sub-category updated successfully',
    });
  } catch (error: any) {
    console.error('SubCategory PUT error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update sub-category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete sub-category
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
        { success: false, error: 'Sub-category ID is required' },
        { status: 400 }
      );
    }

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return NextResponse.json(
        { success: false, error: 'Sub-category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sub-category deleted successfully',
    });
  } catch (error: any) {
    console.error('SubCategory DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete sub-category' },
      { status: 500 }
    );
  }
}
