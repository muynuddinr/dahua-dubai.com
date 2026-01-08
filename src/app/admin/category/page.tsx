'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Category, NavbarCategory } from '@/lib/supabase';
import Image from 'next/image';

export default function CategoryPage() {
  const [categories, setCategories] = useState<(Category & { navbar_categories?: NavbarCategory })[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNavbar, setFilterNavbar] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    navbar_category_id: '',
    is_active: true,
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, navbarRes] = await Promise.all([
        supabase
          .from('categories')
          .select('*, navbar_categories(*)')
          .order('order', { ascending: true }),
        supabase
          .from('navbar_categories')
          .select('*')
          .eq('is_active', true)
          .order('order', { ascending: true }),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (navbarRes.error) throw navbarRes.error;

      setCategories(categoriesRes.data || []);
      setNavbarCategories(navbarRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name, slug: generateSlug(name) });
  };

  // Refresh dropdown data to get latest navbar categories
  const refreshDropdowns = async () => {
    try {
      const navbarRes = await supabase
        .from('navbar_categories')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      if (!navbarRes.error) setNavbarCategories(navbarRes.data || []);
    } catch (error) {
      console.error('Error refreshing dropdowns:', error);
    }
  };

  const openModal = async (category?: Category) => {
    await refreshDropdowns();
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        navbar_category_id: category.navbar_category_id,
        is_active: category.is_active,
        image: category.image || '',
      });
      setImagePreview(category.image || '');
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        navbar_category_id: navbarCategories[0]?.id || '',
        is_active: true,
        image: '',
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setImagePreview('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'dahua-dubai/categories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.data.url }));
        setImagePreview(result.data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        navbar_category_id: formData.navbar_category_id,
        is_active: formData.is_active,
        image: formData.image || null,
      };

      if (editingCategory) {
        const response = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id: editingCategory.id, ...dataToSave }),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Update failed');
      } else {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataToSave),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Create failed');
      }

      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Delete failed');
      await fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNavbar = !filterNavbar || category.navbar_category_id === filterNavbar;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && category.is_active) ||
                         (filterStatus === 'inactive' && !category.is_active);
    return matchesSearch && matchesNavbar && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
          <p className="text-gray-400">Manage product categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
          <select
            value={filterNavbar}
            onChange={(e) => setFilterNavbar(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">All Navbar Categories</option>
            {navbarCategories.map((nc) => (
              <option key={nc.id} value={nc.id}>{nc.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-gray-400">{searchTerm || filterNavbar || filterStatus ? 'No categories match your filters' : 'No categories found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Navbar Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                        {category.image ? (
                          <Image src={category.image} alt={category.name} width={48} height={48} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{category.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{category.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded text-xs">
                        {(category as any).navbar_categories?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">#{category.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(category)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Table Footer */}
        <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {filteredCategories.length} of {categories.length} categories
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  placeholder="category-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Navbar Category</label>
                <select
                  value={formData.navbar_category_id}
                  onChange={(e) => setFormData({ ...formData, navbar_category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  required
                >
                  <option value="">Select navbar category</option>
                  {navbarCategories.map((nc) => (
                    <option key={nc.id} value={nc.id}>{nc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500 resize-none"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                {!imagePreview ? (
                  <label className="flex items-center justify-center gap-2 px-4 py-6 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-400 transition-colors cursor-pointer">
                    {uploading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Click to upload image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                ) : (
                  <div className="relative h-32 rounded-xl overflow-hidden group">
                    <Image src={imagePreview} alt="Preview" fill sizes="128px" className="object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-pink-500 focus:ring-pink-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-400">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
