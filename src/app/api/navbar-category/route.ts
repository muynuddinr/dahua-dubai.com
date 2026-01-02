import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import NavbarCategory from '@/models/Navbar-category';
import { checkAdminAuth } from '@/app/api/middleware/adminAuth';

// GET - Fetch all navbar categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await NavbarCategory.find({}).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching navbar categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch navbar categories',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Create new navbar category
export async function POST(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, slug, href, order, isActive } = body;

    // Validation
    if (!name || !slug || !href) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, slug, and href are required fields',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await NavbarCategory.findOne({ slug });
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
    const category = await NavbarCategory.create({
      name,
      slug,
      href,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Navbar category created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating navbar category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create navbar category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update navbar category
export async function PUT(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    const { _id, name, slug, href, order, isActive } = body;

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
      const existingCategory = await NavbarCategory.findOne({ 
        slug, 
        _id: { $ne: _id } 
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

    const category = await NavbarCategory.findByIdAndUpdate(
      _id,
      {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(href && { href }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Navbar category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Navbar category updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating navbar category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update navbar category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete navbar category
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

    const category = await NavbarCategory.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Navbar category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Navbar category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting navbar category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete navbar category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
