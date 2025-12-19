'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheck,
  FaImage,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLayerGroup,
  FaLink,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';

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
  imagePublicId?: string;
  navbarCategoryId: NavbarCategory | string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get proper image URL
const getImageUrl = (image?: string, publicId?: string): string => {
  if (!image) return '';
  
  // If it's already a full Cloudinary URL, return as-is
  if (image.startsWith('https://res.cloudinary.com')) {
    return image;
  }
  
  // If it's a local path but we have publicId, reconstruct Cloudinary URL
  if (publicId) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'websitedata123';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
  
  // Fallback to original image
  return image;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    imagePublicId: '',
    navbarCategoryId: '',
    order: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNavbarCategories();
    // Trigger migration on component mount
    migrateImages();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchNavbarCategories = async () => {
    try {
      const response = await axios.get('/api/navbar-category');
      if (response.data.success) {
        setNavbarCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching navbar categories:', err);
    }
  };

  const migrateImages = async () => {
    try {
      // Silently trigger migration endpoint to fix local image paths
      await axios.patch('/api/upload');
    } catch (err) {
      console.log('Image migration check completed');
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/category');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let imageUrl = formData.image;
      let imagePublicId = formData.imagePublicId;

      // Upload new image if selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await axios.post('/api/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.secure_url;
          imagePublicId = uploadResponse.data.data.public_id;

          // Delete old image if updating
          if (editingCategory && editingCategory.imagePublicId) {
            try {
              await axios.delete(`/api/upload?publicId=${editingCategory.imagePublicId}`);
            } catch (err) {
              console.error('Failed to delete old image:', err);
            }
          }
        }
        setUploading(false);
      }

      const categoryData = {
        ...formData,
        image: imageUrl,
        imagePublicId: imagePublicId,
      };

      if (editingCategory) {
        const response = await axios.put('/api/category', {
          _id: editingCategory._id,
          ...categoryData,
        });
        if (response.data.success) {
          setSuccess('Category updated successfully!');
          fetchCategories();
          handleCloseModal();
        }
      } else {
        const response = await axios.post('/api/category', categoryData);
        if (response.data.success) {
          setSuccess('Category created successfully!');
          fetchCategories();
          handleCloseModal();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      // Find category to delete its image
      const categoryToDelete = categories.find(cat => cat._id === id);
      
      const response = await axios.delete(`/api/category?id=${id}`);
      if (response.data.success) {
        // Delete image from Cloudinary if exists
        if (categoryToDelete?.imagePublicId) {
          try {
            await axios.delete(`/api/upload?publicId=${categoryToDelete.imagePublicId}`);
          } catch (err) {
            console.error('Failed to delete image:', err);
          }
        }
        
        setSuccess('Category deleted successfully!');
        fetchCategories();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      imagePublicId: category.imagePublicId || '',
      navbarCategoryId: typeof category.navbarCategoryId === 'string' 
        ? category.navbarCategoryId 
        : category.navbarCategoryId._id,
      order: category.order,
      isActive: category.isActive,
    });
    setImagePreview(category.image || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      imagePublicId: '',
      navbarCategoryId: '',
      order: 0,
      isActive: true,
    });
    setSelectedFile(null);
    setImagePreview('');
    setError('');
  };

  const handleToggleActive = async (category: Category) => {
    try {
      await axios.put('/api/category', {
        _id: category._id,
        isActive: !category.isActive,
      });
      fetchCategories();
      setSuccess(`Category ${!category.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      setError('Failed to toggle category status');
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setFormData({ ...formData, image: '', imagePublicId: '' });
  };

  const getNavbarCategoryName = (navbarCategoryId: NavbarCategory | string) => {
    if (typeof navbarCategoryId === 'string') {
      const found = navbarCategories.find(nc => nc._id === navbarCategoryId);
      return found ? found.name : 'Unknown';
    }
    return navbarCategoryId.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Categories
            </h1>
            <p className="text-slate-400">Manage categories under navbar sections</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            <FaPlus /> Add Category
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-xl text-green-400 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FaCheck />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess('')}>
              <FaTimes />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-xl text-red-400 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FaTimes />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')}>
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <FaLayerGroup className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg">No categories found</p>
            <p className="text-slate-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-purple-500/50 transition-all group"
              >
                <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <img
                      src={getImageUrl(category.image, category.imagePublicId)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <FaLayerGroup className="w-16 h-16 text-slate-700" />
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(category)}
                      className="backdrop-blur-sm"
                    >
                      {category.isActive ? (
                        <span className="px-3 py-1 bg-green-500/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                          <FaEye className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                          <FaEyeSlash className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-slate-900/90 text-slate-300 rounded-lg text-xs font-semibold">
                      Order: {category.order}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {category.name}
                    </h3>
                    <code className="px-2 py-1 bg-slate-800 text-purple-400 rounded text-xs font-mono">
                      {category.slug}
                    </code>
                  </div>

                  {category.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 pb-4 border-b border-slate-800">
                    <FaLink className="w-3 h-3" />
                    <span className="text-xs">
                      {getNavbarCategoryName(category.navbarCategoryId)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(category)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaEdit /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaTrash /> Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FaLayerGroup className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {categories.filter((c) => c.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FaEye className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-red-400">
                {categories.filter((c) => !c.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <FaEyeSlash className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-5 h-5 text-white" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Parent Navbar Category *
                    </label>
                    <select
                      value={formData.navbarCategoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, navbarCategoryId: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                      <option value="">Select Navbar Category</option>
                      {navbarCategories.map((nc) => (
                        <option key={nc._id} value={nc._id}>
                          {nc.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-slate-400">
                      This category will appear under the selected navbar section
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      placeholder="e.g., Banking Solutions"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                      placeholder="e.g., banking-solutions"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Auto-generated from name. Use lowercase with hyphens.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Brief description of this category..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Category Image
                    </label>
                    
                    {/* Image Preview */}
                    {(imagePreview || formData.image) && (
                      <div className="relative mb-4 rounded-xl overflow-hidden border-2 border-slate-700">
                        <img
                          src={imagePreview || getImageUrl(formData.image, formData.imagePublicId)}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl text-slate-400 hover:text-purple-400 cursor-pointer transition-all"
                      >
                        <FaImage className="w-5 h-5" />
                        <span>
                          {selectedFile
                            ? selectedFile.name
                            : imagePreview || formData.image
                            ? 'Change Image'
                            : 'Choose Image (Max 5MB)'}
                        </span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Upload an image for this category (JPG, PNG, GIF, WebP)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: parseInt(e.target.value) })
                      }
                      min="0"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Lower numbers appear first in the list.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-white">Active Status</p>
                      <p className="text-sm text-slate-400">
                        Display this category on the website
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, isActive: !formData.isActive })
                      }
                      className="relative"
                    >
                      {formData.isActive ? (
                        <FaToggleOn className="w-12 h-12 text-green-400" />
                      ) : (
                        <FaToggleOff className="w-12 h-12 text-slate-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCloseModal}
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
