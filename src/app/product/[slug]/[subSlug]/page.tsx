import { notFound } from 'next/navigation';
import SubCategoryPageClient from './SubCategoryPageClient';
import type { Metadata } from 'next';

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
  description?: string;
  image?: string;
  navbarCategoryId: NavbarCategory;
  isActive: boolean;
  order: number;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imagePublicId?: string;
  categoryId: Category;
  navbarCategoryId: NavbarCategory;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;

  // SEO fields (from backend)
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
  subcategoryId: string;
  categoryId: string;
  navbarCategoryId: string;
  isActive: boolean;
  order: number;
}

export const dynamicParams = true;

/* -----------------------------------------
   FETCH SUB CATEGORY
------------------------------------------ */
async function getSubCategory(slug: string, subSlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/api/sub-category`, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) return null;

    const data = await res.json();

    const subCategory = data.data.find(
      (subCat: SubCategory) =>
        subCat.slug === subSlug &&
        typeof subCat.categoryId === "object" &&
        subCat.categoryId.slug === slug
    );

    if (!subCategory) return null;

    // Fetch SEO
    const seoRes = await fetch(`${apiUrl}/api/seo?slug=${subSlug}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (seoRes.ok) {
      const seoData = await seoRes.json();
      if (seoData.success) {
        subCategory.metaTitle = seoData.data.metaTitle;
        subCategory.metaDescription = seoData.data.metaDescription;
        subCategory.metaKeywords = seoData.data.metaKeywords;
      }
    }

    return subCategory;
  } catch (error) {
    console.error("Error fetching sub-category:", error);
    return null;
  }
}

/* -----------------------------------------
   FETCH PRODUCTS
------------------------------------------ */
async function getProducts(subcategoryId: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(
      `${apiUrl}/api/product?subcategoryId=${subcategoryId}`,
      {
        next: { revalidate: 60 },
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.success
      ? data.data
          .filter((prod: Product) => prod.isActive)
          .sort((a: Product, b: Product) => a.order - b.order)
      : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/* -----------------------------------------
   SEO METADATA (dynamic)
------------------------------------------ */
interface Props {
  params: Promise<{ slug: string; subSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subSlug } = await params;

  const subCategory = await getSubCategory(slug, subSlug);

  if (!subCategory) {
    return {
      title: "Subcategory Not Found",
      description: "This subcategory does not exist."
    };
  }

  const title =
    subCategory.metaTitle ||
    `${subCategory.name} subCategory | Dahua Authorized Dealer in UAE`;

  const description =
    subCategory.metaDescription ||
    `Discover high-quality ${subCategory.name} products under the ${subCategory.categoryId.name} High-quality security and surveillance solutions in the UAE.`;

  const keywords =
    subCategory.metaKeywords ||
    `${subCategory.name}, ${subCategory.categoryId.name}, Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East.`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://dahua-dubai.com/product/${slug}/${subSlug}`,
      images: subCategory.image ? [{ url: subCategory.image }] : []
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

/* -----------------------------------------
   PAGE
------------------------------------------ */
export async function generateStaticParams() {
  return [];
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;

  const subCategory = await getSubCategory(slug, subSlug);

  if (!subCategory) notFound();

  const products = await getProducts(subCategory._id);

  return (
    <SubCategoryPageClient
      subCategory={subCategory}
      products={products}
    />
  );
}
