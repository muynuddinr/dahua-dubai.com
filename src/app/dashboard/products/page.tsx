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
  FaBox,
  FaToggleOn,
  FaToggleOff,
  FaLayerGroup,
  FaBoxes,
  FaLink,
} from 'react-icons/fa';

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
  navbarCategoryId: NavbarCategory | string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category | string;
  navbarCategoryId: NavbarCategory | string;
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
  subcategoryId: SubCategory | string;
  categoryId: Category | string;
  navbarCategoryId: NavbarCategory | string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    keyFeatures: [''],
    navbarCategoryId: '',
    categoryId: '',
    subcategoryId: '',
    isActive: true,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNavbarCategories();
    fetchCategories();
    fetchSubCategories();
    fetchProducts();
    migrateImages();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    if (formData.navbarCategoryId) {
      const filtered = categories.filter((cat) => {
        const navbarId = typeof cat.navbarCategoryId === 'string' ? cat.navbarCategoryId : cat.navbarCategoryId._id;
        return navbarId === formData.navbarCategoryId;
      });
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [formData.navbarCategoryId, categories]);

  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subCategories.filter((sub) => {
        const catId = typeof sub.categoryId === 'string' ? sub.categoryId : sub.categoryId._id;
        return catId === formData.categoryId;
      });
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData.categoryId, subCategories]);

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
      const response = await axios.get('/api/category');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get('/api/sub-category');
      if (response.data.success) {
        setSubCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching sub-categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/product');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let uploadedImages = [...existingImages];

      if (selectedFiles.length > 0) {
        setUploading(true);
        for (const file of selectedFiles) {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          const uploadResponse = await axios.post('/api/upload', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          if (uploadResponse.data.success) {
            uploadedImages.push({
              url: uploadResponse.data.data.secure_url,
              publicId: uploadResponse.data.data.public_id,
            });
          }
        }
        setUploading(false);
      }

      const productData = {
        ...formData,
        images: uploadedImages,
      };

      if (editingProduct) {
        // Delete removed images
        const removedImages = editingProduct.images.filter(
          (img) => !existingImages.find((ex) => ex.publicId === img.publicId)
        );
        for (const img of removedImages) {
          try {
            await axios.delete(`/api/upload?publicId=${img.publicId}`);
          } catch (err) {
            console.error('Failed to delete image:', err);
          }
        }

        const response = await axios.put('/api/product', {
          _id: editingProduct._id,
          ...productData,
        });
        if (response.data.success) {
          setSuccess('Product updated successfully!');
          fetchProducts();
          handleCloseModal();
        }
      } else {
        const response = await axios.post('/api/product', productData);
        if (response.data.success) {
          setSuccess('Product created successfully!');
          fetchProducts();
          handleCloseModal();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const productToDelete = products.find((p) => p._id === id);
      const response = await axios.delete(`/api/product?id=${id}`);
      
      if (response.data.success) {
        if (productToDelete?.images) {
          for (const img of productToDelete.images) {
            try {
              await axios.delete(`/api/upload?publicId=${img.publicId}`);
            } catch (err) {
              console.error('Failed to delete image:', err);
            }
          }
        }
        setSuccess('Product deleted successfully!');
        fetchProducts();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      keyFeatures: product.keyFeatures.length > 0 ? product.keyFeatures : [''],
      navbarCategoryId: typeof product.navbarCategoryId === 'string' ? product.navbarCategoryId : product.navbarCategoryId._id,
      categoryId: typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id,
      subcategoryId: typeof product.subcategoryId === 'string' ? product.subcategoryId : product.subcategoryId._id,
      isActive: product.isActive,
    });
    setExistingImages(product.images || []);
    setImagePreviews([]);
    setSelectedFiles([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      keyFeatures: [''],
      navbarCategoryId: '',
      categoryId: '',
      subcategoryId: '',
      isActive: true,
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setError('');
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await axios.put('/api/product', {
        _id: product._id,
        isActive: !product.isActive,
      });
      fetchProducts();
      setSuccess(`Product ${!product.isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      setError('Failed to toggle product status');
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image should be less than 5MB');
        return;
      }
    }

    setSelectedFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setError('');
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getSubCategoryName = (subcategoryId: SubCategory | string) => {
    if (typeof subcategoryId === 'string') {
      const found = subCategories.find((sub) => sub._id === subcategoryId);
      return found ? found.name : 'Unknown';
    }
    return subcategoryId.name;
  };

  const getCategoryName = (categoryId: Category | string) => {
    if (typeof categoryId === 'string') {
      const found = categories.find((cat) => cat._id === categoryId);
      return found ? found.name : 'Unknown';
    }
    return categoryId.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Products
            </h1>
            <p className="text-slate-400">Manage all products</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
          >
            <FaPlus /> Add Product
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, slug, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <div className="inline-block w-12 h-12 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-800 rounded-full flex items-center justify-center">
              <FaBox className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg">No products found</p>
            <p className="text-slate-500 text-sm mt-2">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding a new product'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all group"
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0].url, product.images[0].publicId)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <FaBox className="w-16 h-16 text-slate-700" />
                  )}
                  <div className="absolute top-3 right-3">
                    <button onClick={() => handleToggleActive(product)} className="backdrop-blur-sm">
                      {product.isActive ? (
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
                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 bg-slate-900/90 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <FaImage className="w-3 h-3" /> {product.images.length}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {product.name}
                    </h3>
                    <code className="px-2 py-1 bg-slate-800 text-emerald-400 rounded text-xs font-mono">
                      {product.slug}
                    </code>
                  </div>

                  {product.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  {product.keyFeatures && product.keyFeatures.length > 0 && (
                    <div className="mb-4">
                      <p className="text-slate-500 text-xs mb-2">Key Features:</p>
                      <ul className="space-y-1">
                        {product.keyFeatures.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="text-slate-400 text-xs flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {product.keyFeatures.length > 2 && (
                          <li className="text-slate-500 text-xs">+{product.keyFeatures.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-2 mb-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <FaBoxes className="w-3 h-3" />
                      <span>{getSubCategoryName(product.subcategoryId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <FaLayerGroup className="w-3 h-3" />
                      <span>{getCategoryName(product.categoryId)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaEdit /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product._id)}
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
              <p className="text-slate-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <FaBox className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{products.filter((p) => p.isActive).length}</p>
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
              <p className="text-2xl font-bold text-red-400">{products.filter((p) => !p.isActive).length}</p>
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
              <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <FaTimes className="w-5 h-5 text-white" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Parent Navbar Category *
                      </label>
                      <select
                        value={formData.navbarCategoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            navbarCategoryId: e.target.value,
                            categoryId: '',
                            subcategoryId: '',
                          })
                        }
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="">Select Navbar Category</option>
                        {navbarCategories.map((nc) => (
                          <option key={nc._id} value={nc._id}>
                            {nc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Parent Category *</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
                        required
                        disabled={!formData.navbarCategoryId}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                      >
                        <option value="">Select Category</option>
                        {filteredCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Sub-Category *</label>
                    <select
                      value={formData.subcategoryId}
                      onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                      required
                      disabled={!formData.categoryId}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      <option value="">Select Sub-Category</option>
                      {filteredSubCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                        placeholder="e.g., HD Security Camera"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        placeholder="e.g., hd-security-camera"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Product description..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Key Features
                    </label>
                    <textarea
                      value={formData.keyFeatures.join('\n')}
                      onChange={(e) => {
                        const text = e.target.value;
                        const features = text.split('\n');
                        setFormData({ ...formData, keyFeatures: features.length > 0 ? features : [''] });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                        }
                      }}
                      rows={6}
                      placeholder="Enter each feature on a new line&#10;Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Press Enter to add a new line. Each line will be a separate feature.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Product Images</label>

                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {existingImages.map((img, index) => (
                          <div key={`existing-${index}`} className="relative rounded-xl overflow-hidden border-2 border-slate-700">
                            <img src={getImageUrl(img.url, img.publicId)} alt="Existing" className="w-full h-32 object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.map((preview, index) => (
                          <div key={`new-${index}`} className="relative rounded-xl overflow-hidden border-2 border-emerald-500">
                            <img src={preview} alt="Preview" className="w-full h-32 object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-slate-400 hover:text-emerald-400 cursor-pointer transition-all"
                      >
                        <FaImage className="w-5 h-5" />
                        <span>Choose Images (Max 5MB each)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-white">Active Status</p>
                      <p className="text-sm text-slate-400">Display this product on the website</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
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
                      className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          {editingProduct ? 'Update Product' : 'Create Product'}
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
