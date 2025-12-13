"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import ProductEnquiryModal from "@/app/components/ProductEnquiryModal";
import {
  FaHome,
  FaChevronRight,
  FaBoxes,
  FaBox,
  FaFolder,
  FaArrowLeft,
  FaCheckCircle,
  FaCalendar,
  FaLink,
  FaChevronLeft,
  FaChevronRight as FaChevronRightIcon,
  FaTimes,
} from "react-icons/fa";
import styles from "./motion-button.module.css";

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
  navbarCategoryId: NavbarCategory;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category;
  navbarCategoryId: NavbarCategory;
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
  subcategoryId: SubCategory;
  categoryId: Category;
  navbarCategoryId: NavbarCategory;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailPageClientProps {
  product: Product;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const contentSlideIn: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const buttonStyles = {
  button: {
    all: "unset",
    cursor: "pointer",
    backgroundColor: "#fff",
    padding: "8px 16px", // Increased padding to make the button a little bigger
    color: "#000",
    borderRadius: "40px", // Increased borderRadius to make the border more rounded
    position: "relative" as const,
    overflow: "clip",
    border: "2px solid rgb(231, 46, 46)",
  },
  buttonTitle: {
    margin: 0,
    zIndex: 2,
    color: "#000",
    fontSize: "0.9rem",
  },
  buttonTitle2: {
    margin: 0,
    text: "white", // (this line is not needed for color)
    height: "100%",
    top: 0,
    transform: "translateY(-50%)",
    position: "absolute" as const,
    display: "flex",
    alignItems: "center",
    zIndex: 2,
    color: "#fff", // ✅ white text
    fontSize: "0.9rem",
  },

  buttonBackground: {
    position: "absolute" as const,
    zIndex: 1,
    bottom: 0,
    left: 0,
    height: "100%",
    width: "100%",
    borderRadius: "40px", // Match the increased borderRadius
    backgroundColor: "rgb(231, 46, 46)",
  },
};

function MotionButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const resetBoxShadow = () => {
      btn.style.boxShadow = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offsetX = x - centerX;
      const offsetY = y - centerY;

      const shadowX = offsetX / 5;
      const shadowY = offsetY / 1.5;
      const insetX = offsetX / 22;
      const insetY = offsetY / 8;

      btn.style.boxShadow = `inset ${-insetX}px ${-insetY}px 2px rgba(231,46,46,0.95),
                             inset ${insetX}px ${insetY}px 2px rgba(255,255,255,0.08),
                             ${shadowX}px ${shadowY}px 14px -14px rgba(231,46,46,0.18),
                             ${shadowX * 3}px ${
        shadowY * 3
      }px 48px rgba(231,46,46,0.55)`;
    };

    const handleMouseLeave = () => {
      resetBoxShadow();
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
        padding: "8px 16px",
        color: "#000",
        borderRadius: "40px",
        position: "relative" as const,
        overflow: "clip",
        border: "2px solid rgb(231, 46, 46)",
        background:
          "linear-gradient(180deg, rgba(207,207,208,0) 0%, rgba(159,159,160,0) 100%)",
      }}
      initial={false}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      onClick={onClick}
      aria-label="Request Quote"
    >
      <motion.p
        style={{
          ...buttonStyles.buttonTitle,
          color: "#000", // keep text black always
          zIndex: 3, // ensure it's above the animated background
        }}
        initial={false}
        transition={{ type: "tween", duration: 0.45, ease: "linear" }}
        animate={{
          y: isHovering ? -40 : 0,
        }}
      >
        {children}
      </motion.p>

      <motion.p
        style={{
          ...buttonStyles.buttonTitle2,
          color: "#fff", // ✅ text white
          zIndex: 3,
        }}
        initial={false}
        transition={{ type: "tween", duration: 0.45, ease: "linear" }}
        animate={{
          y: isHovering ? 0 : 40,
        }}
      >
        {children}
      </motion.p>

      <motion.div
        style={{
          ...buttonStyles.buttonBackground,
          backgroundColor: "rgb(231,46,46)",
        }}
        initial={false}
        transition={{ type: "tween", duration: 0.45, ease: "linear" }}
        animate={{
          y: isHovering ? "0%" : "100%",
          scaleX: isHovering ? 1 : 0.5,
        }}
      />
    </motion.button>
  );
}

export default function ProductDetailPageClient({
  product,
}: ProductDetailPageClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const category = product.categoryId as Category;
  const subCategory = product.subcategoryId as SubCategory;
  const navbarCategory = product.navbarCategoryId as NavbarCategory;

  const nextImage = () => {
    if (product && product.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Hero images
  const desktopHeroImage = "/images/Product2.png";
  const mobileBannerData = {
    image: "/mobile/Product 2.png",
    title: product.name,
    subtitle: "Product Details",
    description:
      product.description || "Explore detailed specifications and features.",
  };

  return (
    <div className="min-h-screen">
      {/* Desktop Hero Section */}
      <div className="hidden md:block relative h-screen overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-300">
          <img
            src={desktopHeroImage}
            alt={subCategory.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10" />
        </div>

        <div className="relative h-full flex items-center px-6 lg:px-12 z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentSlideIn}
            className="max-w-2xl text-left"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {product.name}
            </motion.h1>

            {product.description && (
              <motion.p
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {product.description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <section className="md:hidden relative w-full h-96 flex items-center justify-center overflow-hidden">
        <motion.div
          variants={shouldReduceMotion ? reducedMotionVariants : imageVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="absolute inset-0"
        >
          <Image
            src={mobileBannerData.image}
            alt={`${product.name} Hero Mobile`}
            fill
            className="object-cover w-full h-full"
            priority
            quality={100}
            onLoad={() => setIsLoaded(true)}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          variants={
            shouldReduceMotion ? reducedMotionVariants : containerVariants
          }
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="relative z-10 text-center px-4 space-y-4"
        >
          <motion.h1
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            className="text-2xl sm:text-3xl font-bold text-white leading-tight"
          >
            {mobileBannerData.title}
          </motion.h1>
          <motion.p
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            className="text-sm sm:text-base text-gray-100 leading-snug"
          >
            {mobileBannerData.subtitle}
          </motion.p>
          <motion.p
            variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
            className="text-sm sm:text-base text-gray-100 leading-snug"
          >
            {mobileBannerData.description}
          </motion.p>
        </motion.div>
      </section>

      <div
        id="product-details"
        className="relative bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <motion.nav
            className="inline-flex items-center gap-x-0.5 sm:gap-x-1 
    text-[8px] sm:text-xs 
    bg-white/80 backdrop-blur-sm rounded-full 
    px-1 sm:px-2 py-0.5 sm:py-1 
    mb-4 sm:mb-6
    max-w-full overflow-x-auto
    flex-nowrap"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link
              href="/"
              className="text-slate-600 hover:text-red-400 transition-colors flex items-center group flex-shrink-0"
            >
              <FaHome className="w-2 h-2 sm:w-2.5 sm:h-2.5 group-hover:scale-110 transition-transform" />
            </Link>

            <FaChevronRight className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-slate-400 flex-shrink-0" />

            <Link
              href={navbarCategory.href}
              className="text-slate-600 hover:text-red-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {navbarCategory.name}
            </Link>

            <FaChevronRight className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-slate-400 flex-shrink-0" />

            <Link
              href={`/product/${category.slug}`}
              className="text-slate-600 hover:text-red-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {category.name}
            </Link>

            <FaChevronRight className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-slate-400 flex-shrink-0" />

            <Link
              href={`/product/${category.slug}/${subCategory.slug}`}
              className="text-slate-600 hover:text-red-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {subCategory.name}
            </Link>

            <FaChevronRight className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-slate-400 flex-shrink-0" />

            <span className="text-red-500 font-semibold whitespace-nowrap flex-shrink-0">
              {product.name}
            </span>
          </motion.nav>

          <style jsx>{`
            motion.nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <motion.div
                variants={itemVariants}
                className="lg:sticky lg:top-20"
              >
                <div
                  className="relative bg-white rounded-2xl shadow-sm p-8 mb-3 cursor-pointer group"
                  onClick={() => setShowImageModal(true)}
                >
                  <div className="aspect-[16/10] flex items-center justify-center">
                    {product.images?.length > 0 ? (
                      <>
                        <img
                          src={product.images[selectedImageIndex].url}
                          alt={product.name}
                          className="max-w-full max-h-full object-contain group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center rounded-2xl">
                          <div className="bg-white rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 shadow-lg">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-slate-600">
                                Click to enlarge
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="w-20 h-20 text-slate-200" />
                      </div>
                    )}
                  </div>

                  {product.images?.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {selectedImageIndex + 1} / {product.images.length}
                      </span>
                    </div>
                  )}
                </div>

                {product.images?.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden bg-white p-2 border transition-all duration-200 ${
                          selectedImageIndex === index
                            ? "border-slate-300 shadow-sm"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                    {product.name}
                  </h1>
                  <div className="inline-block">
                    <h2 className="text-xs sm:text-sm md:text-base font-semibold text-slate-700 pb-2 border-b-2 border-red-500">
                      Overview
                    </h2>
                  </div>
                </div>

                <div>
                  <p className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.keyFeatures?.length > 0 && (
                  <div className="space-y-3">
                    {product.keyFeatures.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                        <span className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <MotionButton onClick={() => setShowEnquiryModal(true)}>
                    Request Quote
                  </MotionButton>
                </div>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>

      {product && (
        <>
          {/* Product Enquiry Modal */}
          <ProductEnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => setShowEnquiryModal(false)}
            product={{
              _id: product._id,
              name: product.name,
              slug: product.slug,
              images: product.images,
            }}
          />

          {/* Image Modal */}
          {showImageModal && product.images?.length > 0 && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowImageModal(false)}
                className="fixed inset-0 bg-black/90 z-50"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
              >
                <div className="relative w-full max-w-4xl mx-auto">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="absolute -top-10 right-0 sm:-top-12 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close"
                  >
                    <FaTimes className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </button>

                  {/* Image Container */}
                  <div className="relative">
                    <img
                      src={product.images[selectedImageIndex].url}
                      alt={product.name}
                      className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg sm:rounded-2xl"
                      loading="lazy"
                    />

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                          aria-label="Next image"
                        >
                          <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 sm:px-6 sm:py-3 bg-black/70 text-white rounded-full text-xs sm:text-sm font-medium">
                        {selectedImageIndex + 1} / {product.images.length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
}
