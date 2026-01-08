'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SubCategory, Category, NavbarCategory } from '@/lib/supabase';
import Image from 'next/image';

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    navbar_category_id: '',
    is_active: true,
    image: '',
  });
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedNavbarCategory, setSelectedNavbarCategory] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subCatRes, catRes, navbarRes] = await Promise.all([
        supabase.from('sub_categories').select('*, categories(*), navbar_categories(*)').order('order', { ascending: true }),
        supabase.from('categories').select('*').eq('is_active', true).order('name', { ascending: true }),
        supabase.from('navbar_categories').select('*').eq('is_active', true).order('order', { ascending: true }),
      ]);

      if (subCatRes.error) throw subCatRes.error;
      if (catRes.error) throw catRes.error;
      if (navbarRes.error) throw navbarRes.error;

      setSubCategories(subCatRes.data || []);
      setCategories(catRes.data || []);
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

  const handleNavbarCategoryChange = (navbarCategoryId: string) => {
    setSelectedNavbarCategory(navbarCategoryId);
    setFormData({ ...formData, navbar_category_id: navbarCategoryId, category_id: '' });
  };

  const filteredCategoriesForModal = categories.filter(
    (cat) => cat.navbar_category_id === (selectedNavbarCategory || formData.navbar_category_id)
  );

  // Refresh dropdown data to get latest categories and navbar categories
  const refreshDropdowns = async () => {
    try {
      const [catRes, navbarRes] = await Promise.all([
        supabase.from('categories').select('*').eq('is_active', true).order('name', { ascending: true }),
        supabase.from('navbar_categories').select('*').eq('is_active', true).order('order', { ascending: true }),
      ]);
      if (!catRes.error) setCategories(catRes.data || []);
      if (!navbarRes.error) setNavbarCategories(navbarRes.data || []);
    } catch (error) {
      console.error('Error refreshing dropdowns:', error);
    }
  };

  const openModal = async (subCategory?: SubCategory) => {
    await refreshDropdowns();
    if (subCategory) {
      setEditingSubCategory(subCategory);
      setSelectedNavbarCategory(subCategory.navbar_category_id);
      setFormData({
        name: subCategory.name,
        slug: subCategory.slug,
        description: subCategory.description || '',
        category_id: subCategory.category_id,
        navbar_category_id: subCategory.navbar_category_id,
        is_active: subCategory.is_active,
        image: subCategory.image || '',
      });
      setImagePreview(subCategory.image || '');
    } else {
      setEditingSubCategory(null);
      setSelectedNavbarCategory('');
      setFormData({
        name: '',
        slug: '',
        description: '',
        category_id: '',
        navbar_category_id: '',
        is_active: true,
        image: '',
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubCategory(null);
    setImagePreview('');
    setSelectedNavbarCategory('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'dahua-dubai/sub-categories');

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
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        category_id: formData.category_id,
        navbar_category_id: formData.navbar_category_id,
        is_active: formData.is_active,
        image: formData.image || null,
      };

      if (editingSubCategory) {
        const { error } = await supabase.from('sub_categories').update(dataToSave).eq('id', editingSubCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('sub_categories').insert([dataToSave]);
        if (error) throw error;
      }

      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving sub-category:', error);
      alert('Error saving sub-category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub-category?')) return;

    try {
      const { error } = await supabase.from('sub_categories').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      alert('Error deleting sub-category');
    }
  };

  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subCategory.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || subCategory.category_id === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'active' && subCategory.is_active) ||
                         (filterStatus === 'inactive' && !subCategory.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sub Categories</h1>
          <p className="text-gray-400">Manage product sub-categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Sub Category
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
                placeholder="Search sub-categories..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
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
        ) : filteredSubCategories.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-400">{searchTerm || filterCategory || filterStatus ? 'No sub-categories match your filters' : 'No sub-categories found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                        {subCategory.image ? (
                          <Image src={subCategory.image} alt={subCategory.name} width={48} height={48} className="w-full h-full object-cover" />
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
                      <span className="text-white font-medium">{subCategory.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{subCategory.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs">
                        {subCategory.categories?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">#{subCategory.order}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subCategory.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {subCategory.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(subCategory)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(subCategory.id)}
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
            Showing {filteredSubCategories.length} of {subCategories.length} sub-categories
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-white">
                {editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
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
                  placeholder="Enter sub-category name"
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
                  placeholder="sub-category-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Navbar Category</label>
                <select
                  value={formData.navbar_category_id}
                  onChange={(e) => handleNavbarCategoryChange(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-pink-500"
                  required
                  disabled={!formData.navbar_category_id}
                >
                  <option value="">Select category</option>
                  {filteredCategoriesForModal.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
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
                  {saving ? 'Saving...' : editingSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
