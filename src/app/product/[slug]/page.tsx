import { notFound } from 'next/navigation';
import ProductPageClient from './ProductPageClient';
import type { Metadata } from 'next';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  navbarCategoryId: {
    _id: string;
    name: string;
    slug: string;
    href: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Optional SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export const dynamicParams = true;

/* -----------------------------------------
   FETCH CATEGORY
------------------------------------------ */
async function getCategory(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/api/category`, { 
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) return null;

    const data = await res.json();
    const category = data.data.find((cat: Category) => cat.slug === slug);

    if (!category) return null;

    // Fetch SEO meta
    const seoRes = await fetch(`${apiUrl}/api/seo?slug=${slug}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (seoRes.ok) {
      const seoData = await seoRes.json();
      if (seoData.success) {
        category.metaTitle = seoData.data.metaTitle;
        category.metaDescription = seoData.data.metaDescription;
        category.metaKeywords = seoData.data.metaKeywords;
      }
    }

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/* -----------------------------------------
   FETCH SUBCATEGORIES
------------------------------------------ */
async function getSubCategories(categoryId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) return [];

  try {
    const res = await fetch(
      `${apiUrl}/api/sub-category?categoryId=${categoryId}`,
      { 
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!res.ok) return [];

    const data = await res.json();

    return data.success
      ? data.data
          .filter((sub: SubCategory) => sub.isActive)
          .sort((a: SubCategory, b: SubCategory) => a.order - b.order)
      : [];
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    return [];
  }
}

/* -----------------------------------------
   SEO METADATA
------------------------------------------ */
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "Category does not exist."
    };
  }

  const title =
    category.metaTitle || `${category.name} | Dahua Authorized Dealer in UAE`;

  const description =
    category.metaDescription ||
    `Explore our selection of ${category.name} products. High-quality security and surveillance solutions in the UAE.`;

  const keywords =
    category.metaKeywords ||
    `${category.name}, Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East.`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dahua-dubai.com/product/${slug}`,
      images: category.image ? [{ url: category.image }] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* -----------------------------------------
   MAIN PAGE
------------------------------------------ */
export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) notFound();

  const subCategories = await getSubCategories(category._id);

  return (
    <ProductPageClient
      category={category}
      subCategories={subCategories}
    />
  );
}
