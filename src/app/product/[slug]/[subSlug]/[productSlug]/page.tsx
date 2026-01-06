import { notFound } from 'next/navigation';
import ProductDetailPageClient from './ProductDetailClient';
import type { Metadata } from 'next';

// Helper function to get proper image URL
const getImageUrl = (url?: string, publicId?: string): string => {
  if (!url) return '';
  
  // If it's already a full Cloudinary URL, return as-is
  if (url.startsWith('https://res.cloudinary.com')) {
    return url;
  }
  
  // If it's a local path but we have publicId, reconstruct Cloudinary URL
  if (publicId) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'websitedata123';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
  
  // Fallback to original URL
  return url;
};

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  href: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategoryId: NavbarCategory;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category;
  navbarCategoryId: NavbarCategory;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  keyFeatures: string[];
  images: {
    url: string;
    publicId: string;
  }[];
  subcategoryId: SubCategory;
  categoryId: Category;
  navbarCategoryId: NavbarCategory;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;

  // SEO (optional from backend)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export const dynamicParams = true;

/* -----------------------------------------
   Fetch Product + SEO
------------------------------------------ */
async function getProduct(slug: string, subSlug: string, productSlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/api/product`, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) return null;

    const data = await res.json();

    const product = data.data.find(
      (prod: Product) =>
        prod.slug === productSlug &&
        typeof prod.subcategoryId === "object" &&
        prod.subcategoryId.slug === subSlug &&
        typeof prod.categoryId === "object" &&
        prod.categoryId.slug === slug
    );

    if (!product) return null;

    // Fetch SEO metadata
    const seoRes = await fetch(`${apiUrl}/api/seo?slug=${productSlug}`, {
      headers: { "Content-Type": "application/json" }
    });

    if (seoRes.ok) {
      const seoData = await seoRes.json();
      if (seoData.success) {
        product.metaTitle = seoData.data.metaTitle;
        product.metaDescription = seoData.data.metaDescription;
        product.metaKeywords = seoData.data.metaKeywords;
      }
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/* -----------------------------------------
   SEO Metadata (Dynamic)
------------------------------------------ */
interface Props {
  params: Promise<{ slug: string; subSlug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subSlug, productSlug } = await params;

  const product = await getProduct(slug, subSlug, productSlug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist."
    };
  }

  const categoryName = product.categoryId?.name || "";
  const subCategoryName = product.subcategoryId?.name || "";
  const productName = product.name;

  const title =
    product.metaTitle ||
    `${productName} of ${subCategoryName} | Dahua Authorized Dealer in UAE`;

  const description =
    product.metaDescription ||
    `Discover detailed specifications, features, and images of ${productName}, available under ${subCategoryName} in the ${categoryName}  High-quality security and surveillance solutions in the UAE.`;

  const keywords =
    product.metaKeywords ||
    `${productName}, ${subCategoryName}, ${categoryName}, Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East.`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dahua-dubai.com/products/${slug}/${subSlug}/${productSlug}`,
      images:
        product.images.length > 0
          ? [{ url: getImageUrl(product.images[0].url, product.images[0].publicId) }]
          : []
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

/* -----------------------------------------
   Page Rendering
------------------------------------------ */
export async function generateStaticParams() {
  return [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string; productSlug: string }>;
}) {
  const { slug, subSlug, productSlug } = await params;

  const product = await getProduct(slug, subSlug, productSlug);

  if (!product) notFound();

  return <ProductDetailPageClient product={product} />;
}
