'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, Building2, MessageSquare } from 'lucide-react';

interface ProductEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    slug: string;
    images?: { url: string; publicId: string }[];
  };
}

export default function ProductEnquiryModal({ isOpen, onClose, product }: ProductEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productName: product.name,
          productSlug: product.slug,
          productId: product._id,
          enquiryType: 'product',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          companyName: '',
          message: '',
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 4000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-red-500/30"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-200 z-10 group"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-200" />
            </button>

            {/* Product Info */}
            <div className="p-4 sm:p-6 md:p-8 border-b border-red-500/20 bg-gradient-to-r from-red-500/5 to-red-500/5">
              <div className="flex items-center gap-4 sm:gap-6">
                {product.images && product.images.length > 0 ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg sm:rounded-xl shadow-lg border-2 border-red-500/30"
                    />
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg">
                      Product
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500/20 to-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-red-500/30 flex-shrink-0">
                    <span className="text-2xl sm:text-3xl">📦</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-400 text-transparent bg-clip-text mb-1 sm:mb-2">
                    Product Enquiry
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg font-medium truncate">{product.name}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Fill the form below to get in touch with us</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Success Message */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 sm:p-6 bg-gradient-to-r from-red-500/20 to-red-500/20 border-2 border-red-500/50 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-red-400 font-bold text-lg sm:text-xl mb-1">Thank You!</p>
                      <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        We have received your enquiry. Soon we will reach out to you. Thank you!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-red-500/10 to-rose-500/10 border-2 border-red-500/40 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-base sm:text-lg md:text-xl font-bold">✕</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-red-400 font-bold text-base sm:text-lg truncate">Error!</p>
                      <p className="text-gray-300 text-xs sm:text-sm truncate">{errorMessage}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form Fields - Stack on mobile */}
              <div className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2 sm:mb-3">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-red-400" />
                    Full Name <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all group-hover:border-red-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2 sm:mb-3">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-red-400" />
                    Email Address <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all group-hover:border-red-400"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2 sm:mb-3">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-red-400" />
                    Mobile Number <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="+971 XX XXX XXXX"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all group-hover:border-red-400"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2 sm:mb-3">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-red-400" />
                    Company Name <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all group-hover:border-red-400"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-200 mb-2 sm:mb-3">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-red-400" />
                    Message <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us more about your requirements, quantity, delivery timeline, or any specific questions..."
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-slate-300 rounded-lg sm:rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all resize-none group-hover:border-red-400"
                      maxLength={500}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-white px-1.5 py-0.5 rounded">
                      {formData.message.length}/500
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700/50 pt-4 sm:pt-6"></div>

              {/* Submit Buttons - Stack on mobile */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-800/80 hover:bg-slate-700 border-2 border-slate-700 hover:border-slate-600 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Note */}
              <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4">
                🔒 Your information is secure and will only be used to contact you regarding this enquiry.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}