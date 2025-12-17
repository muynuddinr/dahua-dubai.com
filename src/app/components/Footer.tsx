'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  categoryId: string;
  subCategoryId: string;
  sku: string;
  stock: number;
  isActive: boolean;
  features: string[];
  specifications: Record<string, string>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface NavbarCategory {
  _id: string;
  name: string;
  slug?: string;
  href?: string;
  order?: number;
  isActive?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  navbarCategoryId?: { _id: string; name: string } | string;
  isActive?: boolean;
  order?: number;
}

export default function Footer() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for categories data
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  // Fetch featured products
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
        const endpoint =
          apiBase ? `${apiBase}/api/products?featured=true&limit=4` : '/api/products?featured=true&limit=4'

        const res = await fetch(endpoint, {
          headers: { 'Content-Type': 'application/json' },
        })
        
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          const activeProducts = data.data
            .filter((product: Product) => product.isActive)
            .slice(0, 4);
          setFeaturedProducts(activeProducts);
        } else {
          throw new Error('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        setCategoriesError(null)

        const catRes = await axios.get('/api/category')

        if (catRes.data?.success) {
          const activeCats = catRes.data.data
            .filter((c: Category) => c.isActive)
            .sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0))
          setCategories(activeCats)
        } else {
          setCategories([])
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategoriesError('Failed to load categories')
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Company Info - Column 1 */}
          <div className="animate-slideUp">
            <div className="flex items-center mb-3">
              <div className="border-l border-gray-400 pl-2">
                <div className="text-sm font-semibold text-white">DAHUA</div>
                <div className="text-xs text-gray-300">TECHNOLOGY</div>
              </div>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed mb-3 max-w-xs">
              Dahua-Dubai Is The largest Distributor Of All kind Of Dahua Products In The
              Surveillance Market of Dubai UAE & Middle East. Follow Us On Social Medias To Get to
              Know About Our Latest Product Line.
            </p>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div className="animate-slideUp animation-delay-200">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">▲</span>
                <Link
                  href="/technologies"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Technologies
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">▲</span>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Contact Us
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">▲</span>
                <Link
                  href="/sira"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Sira
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">▲</span>
                <Link
                  href="/about-us"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  About Us
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">▲</span>
                <Link
                  href="/solutions"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Solutions
                </Link>
              </div>
            </div>
          </div>

          {/* Categories (Previously Featured Products) - Column 3 */}
          <div className="animate-slideUp animation-delay-400">
            <h3 className="text-sm font-semibold text-white mb-3">Products</h3>
            <div className="space-y-2">
              {categoriesLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="h-3 bg-gray-600 rounded w-32"></div>
                  </div>
                ))
              ) : categoriesError ? (
                <div className="text-gray-400 text-xs flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Categories unavailable</span>
                </div>
              ) : categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <div key={category._id} className="flex items-center space-x-2 group">
                    <span className="text-red-500 font-bold text-xs transition-transform duration-200 ">▲</span>
                    <Link
                      href={`/product/${category.slug}`}
                      className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1 line-clamp-1"
                      title={category.name}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-xs flex items-center space-x-2">
                  <span>📦</span>
                  <span>No categories found</span>
                </div>
              )}
            </div>
            
            {/* View All Categories Link */}
            
          </div>

          {/* Get In Touch - Column 4 */}
          <div className="animate-slideUp animation-delay-600">
            <h3 className="text-sm font-semibold text-white mb-3">Get In Touch</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 group">
                <span className="text-red-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">✉</span>
                <Link
                  href="mailto:sales@dahua-dubai.com"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  sales@dahua-dubai.com
                </Link>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="text-red-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">📞</span>
                <Link
                  href="tel:+971552929644"
                  className="text-gray-300 hover:text-white transition-all duration-200 text-xs hover:translate-x-1"
                >
                  +971 55 2929644
                </Link>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="text-red-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">🏢</span>
                <span className="text-gray-300 text-xs">
                  Office: 9AM - 6PM (GMT+4)
                </span>
              </div>
            </div>
            
            {/* Emergency Support */}
            <div className="mt-3 pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 font-bold text-xs">🚨</span>
                <span className="text-gray-300 text-xs font-medium">
                  24/7 Technical Support
                </span>
              </div>
            </div>
          </div>

          {/* Our Location - Column 5 */}
          <div className="animate-slideUp animation-delay-800">
            <h3 className="text-sm font-semibold text-white mb-3">Our Location</h3>
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">
              Visit us at our Dubai office for all your surveillance and security needs.
            </p>
            <div className="h-24 bg-gray-700 rounded-lg overflow-hidden shadow-lg mb-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7215.497384021633!2d55.324346!3d25.279038!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cb74997acd3%3A0x497aa605b636b17e!2s25th%20St%20-%20Deira%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1763631637806!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dubai Office Location"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-300 text-xs">
              <span>📍</span>
              <span>Al Barsha, Dubai, UAE</span>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-8 animate-slideUp animation-delay-1000">
          <Link
            href="https://www.facebook.com/DAHUAMENA"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-all transform hover:scale-110 hover:-translate-y-1 duration-200 shadow-lg"
            title="Follow us on Facebook"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
         
          <Link
            href="https://www.instagram.com/dahuamena/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-all transform hover:scale-110 hover:-translate-y-1 duration-200 shadow-lg"
            title="Follow us on Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </Link>
          
        </div>
      </div>

      {/* Bottom section - Copyright and Powered By centered vertically */}
      <div className="bg-gray-900 border-t border-gray-700 animate-fadeIn">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            {/* Copyright - First line */}
            <p className="text-gray-400 text-xs">© 2025 Dahua Technology. All rights reserved.</p>
            {/* Powered By - Second line */}
            <span className="text-gray-400 text-xs">
              Powered By:{' '}
              <a
                href="https://lovosis.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold transition-all duration-200 hover:translate-x-1 cursor-pointer hover:text-red-400"
              >
                Lovosis Technology
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Line clamp utility for category names */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </footer>
  )
}