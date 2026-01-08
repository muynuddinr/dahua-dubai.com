'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Stats {
  categories: number;
  subCategories: number;
  products: number;
  productEnquiries: number;
  contactEnquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    subCategories: 0,
    products: 0,
    productEnquiries: 0,
    contactEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [categories, subCategories, products, contacts] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('sub_categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*'),
      ]);

      const productEnquiries = contacts.data?.filter((c) => c.enquiry_type === 'product').length || 0;
      const contactEnquiries = contacts.data?.filter((c) => c.enquiry_type === 'general' || !c.enquiry_type).length || 0;

      setStats({
        categories: categories.count || 0,
        subCategories: subCategories.count || 0,
        products: products.count || 0,
        productEnquiries,
        contactEnquiries,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Categories',
      value: stats.categories,
      href: '/admin/category',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      title: 'Sub Categories',
      value: stats.subCategories,
      href: '/admin/sub-category',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Products',
      value: stats.products,
      href: '/admin/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Product Enquiries',
      value: stats.productEnquiries,
      href: '/admin/product-enquiry',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Contact Enquiries',
      value: stats.contactEnquiries,
      href: '/admin/contact-enquiry',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-900 to-black min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent mb-2">
          Welcome back, Admin!
        </h1>
        <p className="text-gray-400">Here&apos;s an overview of your dashboard.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900/80 border border-pink-500/20 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-800 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="bg-gray-900/80 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/50 hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 font-medium group-hover:text-gray-300">{card.title}</p>
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                  <span className="text-pink-400">{card.icon}</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-white">{card.value}</p>
              <p className="text-pink-400 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to manage →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
