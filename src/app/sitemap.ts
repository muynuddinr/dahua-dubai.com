import { MetadataRoute } from "next";

const baseUrl = "https://dahua-dubai.com";

async function getNavbarCategories() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/navbar-category`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching navbar categories:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/category`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data.filter((cat: any) => cat.isActive) : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getSubCategories() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/sub-category`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data.filter((sub: any) => sub.isActive) : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/product`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.success ? data.data.filter((prod: any) => prod.isActive) : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [navbarCategories, categories, subCategories, products] =
      await Promise.all([
        getNavbarCategories(),
        getCategories(),
        getSubCategories(),
        getProducts(),
      ]);

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/sira`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/technologies/wizsense`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/technologies/wizmind`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      }, {
        url: `${baseUrl}/technologies/full-color`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      }, {
        url: `${baseUrl}/technologies/auto-tracking`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
       {
        url: `${baseUrl}/technologies/hdcvi-ten`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
       {
        url: `${baseUrl}/technologies/predictive-focus`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/technologies`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/solutions`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }, {
        url: `${baseUrl}/solutions/building`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },{
        url: `${baseUrl}/solutions/banking`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },{
        url: `${baseUrl}/solutions/retail`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/solutions/transportation`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }, {
        url: `${baseUrl}/solutions/government`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      
      {
        url: `${baseUrl}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      
    ];

    // NavbarCategory routes: /products/:navbarSlug
    const navbarRoutes: MetadataRoute.Sitemap = navbarCategories.map((nav: any) => ({
      url: `${baseUrl}/products/${nav.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    // Category routes: /products/:slug
    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((cat: any) => cat.slug)
      .map((cat: any) => ({
        url: `${baseUrl}/products/${cat.slug}`,
        lastModified: new Date(cat.updatedAt || cat.createdAt).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    // SubCategory routes: /products/:slug/:subSlug
    const subCategoryRoutes: MetadataRoute.Sitemap = subCategories
      .filter((sub: any) => sub.slug && sub.categoryId?.slug)
      .map((sub: any) => ({
        url: `${baseUrl}/products/${sub.categoryId.slug}/${sub.slug}`,
        lastModified: new Date(sub.updatedAt || sub.createdAt).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));

    // Product routes: /products/:slug/:subSlug/:productSlug
    const productRoutes: MetadataRoute.Sitemap = products
      .filter(
        (prod: any) =>
          prod.slug && prod.categoryId?.slug && prod.subcategoryId?.slug
      )
      .map((prod: any) => ({
        url: `${baseUrl}/products/${prod.categoryId.slug}/${prod.subcategoryId.slug}/${prod.slug}`,
        lastModified: new Date(prod.updatedAt || prod.createdAt).toISOString(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    return [
      ...staticRoutes,
      ...navbarRoutes,
      ...categoryRoutes,
      ...subCategoryRoutes,
      ...productRoutes,
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Fallback sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
    ];
  }
}
