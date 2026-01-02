import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import Product from '@/models/Product';
import { checkAdminAuth } from '@/app/api/middleware/adminAuth';

// GET - Fetch all product enquiries (admin only)
export async function GET(request: NextRequest) {
  // Check admin authentication
  const auth = checkAdminAuth(request);
  if (!auth.isValid) {
    return auth.error;
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (productId) {
      query.productId = productId;
    }

    const enquiries = await Contact.find(query)
      .populate('productId', 'name slug images')
      .sort({ createdAt: -1 });

    return NextResponse.json(enquiries);
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { message: 'Failed to fetch enquiries', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new enquiry (product or general)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, mobile, companyName, subject, message, productName, productSlug, productId, enquiryType } = body;

    // Validate required fields
    if (!name || !email || !mobile) {
      return NextResponse.json(
        { message: 'Name, email, and mobile are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verify product exists if productId is provided
    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Create new enquiry
    const newEnquiry = await Contact.create({
      name,
      email,
      mobile,
      companyName,
      subject,
      message,
      productName,
      productSlug,
      productId,
      enquiryType: enquiryType || 'general',
      status: 'new',
    });

    return NextResponse.json(
      { message: 'Enquiry submitted successfully', enquiry: newEnquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { message: 'Failed to submit enquiry', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update enquiry status
export async function PUT(request: NextRequest) {
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
        { message: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (status && !['new', 'read', 'responded', 'closed'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updatedEnquiry = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('productId', 'name slug images');

    if (!updatedEnquiry) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEnquiry);
  } catch (error: any) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { message: 'Failed to update enquiry', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete enquiry
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    const deletedEnquiry = await Contact.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { message: 'Failed to delete enquiry', error: error.message },
      { status: 500 }
    );
  }
}
