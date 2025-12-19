import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import NavbarCategory from '@/models/Navbar-category';
import Product from '@/models/Product';
import SubCategory from '@/models/SubCategory';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'dahuva-categories';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// Migration endpoint to convert local image paths to Cloudinary URLs
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    let totalUpdated = 0;

    // Update categories with local image paths to proper Cloudinary URLs
    const categories = await Category.find({
      $or: [
        { image: /^\/image\/upload/ },
        { image: /^image\/upload/ },
      ]
    });

    for (const category of categories) {
      if (category.imagePublicId) {
        const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${category.imagePublicId}`;
        category.image = cloudinaryUrl;
        await category.save();
        totalUpdated++;
      }
    }

    // Update sub-categories with local image paths to proper Cloudinary URLs
    const subCategories = await SubCategory.find({
      $or: [
        { image: /^\/image\/upload/ },
        { image: /^image\/upload/ },
      ]
    });

    for (const subCategory of subCategories) {
      if (subCategory.imagePublicId) {
        const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${subCategory.imagePublicId}`;
        subCategory.image = cloudinaryUrl;
        await subCategory.save();
        totalUpdated++;
      }
    }

    // Update products with local image paths or missing publicId
    const products = await Product.find({
      $or: [
        { 'images.url': /^\/image\/upload/ },
        { 'images.url': /^image\/upload/ },
      ]
    });

    for (const product of products) {
      let modified = false;
      for (const img of product.images) {
        if (typeof img.url === 'string' && (img.url.includes('/image/upload') || !img.publicId)) {
          // Try to extract public ID from URL if it's a Cloudinary path
          if (img.url.includes('/image/upload/')) {
            const urlParts = img.url.split('/image/upload/');
            if (urlParts.length > 1) {
              const pubId = urlParts[1].split('.')[0];
              img.publicId = pubId;
              img.url = `https://res.cloudinary.com/${cloudName}/image/upload/${pubId}`;
              modified = true;
            }
          }
        }
      }
      if (modified) {
        await product.save();
        totalUpdated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migrated ${totalUpdated} images to Cloudinary URLs`,
      data: { updatedCount: totalUpdated }
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No public ID provided' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
