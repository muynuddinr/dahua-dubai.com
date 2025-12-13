"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaArrowLeft,
  FaLayerGroup,
  FaCalendar,
  FaTag,
  FaHome,
  FaChevronRight,
  FaBoxes,
  FaFolder,
  FaBox,
} from "react-icons/fa";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  navbarCategoryId: {
    _id: string;
    name: string;
    slug: string;
    href: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductPageClientProps {
  category: Category;
  subCategories: SubCategory[];
}

// Animation variants
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

// Product Showcase Component
const ProductShowcase = ({
  item,
  index,
  isSubCategory = false,
  href,
}: {
  item: SubCategory | Category;
  index: number;
  isSubCategory?: boolean;
  href: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className="group p-4"
    >
      <Link href={href} className="block">
        <motion.div
          className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {item.image ? (
              <>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/10"
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    filter: isHovered ? "brightness(0.4)" : "brightness(1)",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="relative w-full h-full p-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>

                {/* Description Overlay */}
                {item.description && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 30,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <p className="text-red-400 text-sm md:text-base leading-relaxed mt-3 mb-6 font-light max-w-xs drop-shadow-lg">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8"
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 8 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {isSubCategory ? (
                    <FaFolder className="w-16 h-16 text-slate-300 group-hover:text-red-500 transition-colors duration-300" />
                  ) : (
                    <FaBox className="w-16 h-16 text-slate-300 group-hover:text-red-500 transition-colors duration-300" />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Title Section */}
          <div
            className="p-6 relative transition-colors duration-300"
            style={{
              backgroundColor: isHovered ? "rgba(0, 0, 0, 0.6)" : "transparent",
            }}
          >
            <motion.h3
              className="text-lg font-bold leading-tight line-clamp-2 mb-2 text-slate-900"
              animate={{
                x: isHovered ? 4 : 0,
                opacity: isHovered ? 0 : 1,
                height: isHovered ? 0 : "auto",
              }}
              transition={{ duration: 0.3 }}
            >
              {item.name}
            </motion.h3>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function ProductPageClient({
  category,
  subCategories,
}: ProductPageClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageOpacity = Math.max(0.2, 1 - scrollY / 600);

  // Hero images
  const desktopHeroImage = "/images/categoery.png";
  const mobileBannerData = {
    image: "/mobile/Category.png",
    title: category.name,
    subtitle: "Product Category",
    description: category.description || "Explore our detailed product offerings.",
  };

  return (
    <div className="min-h-screen">
      {/* Desktop Hero Section */}
      <div className="hidden md:block relative h-screen overflow-hidden">
        {/* Image Background */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: imageOpacity }}
        >
          <Image
            src={desktopHeroImage}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center px-6 lg:px-12 z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentSlideIn}
            className="max-w-2xl text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {category.name}
            </motion.h1>

            {category.description && (
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {category.description}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button
              onClick={() => {
                const el = document.getElementById("subcategories");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  });
                }
              }}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none group"
              aria-label="Scroll to subcategories"
            >
              <span className="text-xs font-medium mb-2 uppercase tracking-wider">
                Explore
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <FaChevronRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </button>
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
            alt={`${category.name} Hero Mobile`}
            fill
            className="object-cover w-full h-full"
            priority
            quality={100}
            onLoad={() => setIsLoaded(true)}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          variants={shouldReduceMotion ? reducedMotionVariants : containerVariants}
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

      {/* Content Section */}
      <div
        id="subcategories"
        className="relative bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {/* Breadcrumb Navigation */}
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
              href={category.navbarCategoryId.href}
              className="text-slate-600 hover:text-red-400 transition-colors whitespace-nowrap flex-shrink-0"
            >
              {category.navbarCategoryId.name}
            </Link>
            <FaChevronRight className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-slate-400 flex-shrink-0" />
            <span className="text-red-500 font-semibold">{category.name}</span>
          </motion.nav>
           <style jsx>{`
            motion.nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Sub-Categories Section */}
          {subCategories.length > 0 && (
            <motion.section
              className="mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
                variants={itemVariants}
              >
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                    Sub-Categories
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl">
                    Explore detailed topics within{" "}
                    <span className="text-red-500">{category.name}</span>
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
                variants={containerVariants}
              >
                {subCategories.map((subCat, index) => (
                  <ProductShowcase
                    key={subCat._id}
                    item={subCat}
                    index={index}
                    isSubCategory={true}
                    href={`/product/${category.slug}/${subCat.slug}`}
                  />
                ))}
              </motion.div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
