"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import Image from "next/image";

const solutionsData = [
    {
        id: "building",
        title: "Building Security",
        subtitle: "Smart Building Protection",
        description:
            "Comprehensive security solutions for residential and commercial buildings with smart access control systems.",
        image: "/images/building.webp",
        buttonText: "Learn more",
        buttonLink: "/solutions/building",
        alignLeft: true,
    },
    {
        id: "banking",
        title: "Banking & Finance",
        subtitle: "Secure Financial Operations",
        description:
            "Advanced security solutions for banks and financial institutions with AI-powered threat detection.",
        image: "/images/banking.webp",
        buttonText: "Explore Solutions",
        buttonLink: "/solutions/banking",
        alignLeft: false,
    },
    {
        id: "retail",
        title: "Retail Security",
        subtitle: "Intelligent Retail Protection",
        description:
            "Smart retail solutions for loss prevention, customer analytics, and inventory management systems.",
        image: "/images/retail.jpg",
        buttonText: "View Details",
        buttonLink: "/solutions/retail",
        alignLeft: true,
    },
    {
        id: "transportation",
        title: "Transportation",
        subtitle: "Smart Transit Security",
        description:
            "Intelligent transportation systems for airports, railways, and highways with traffic monitoring.",
        image: "/images/transport.webp",
        buttonText: "Learn More",
        buttonLink: "/solutions/transportation",
        alignLeft: false,
    },
    {
        id: "government",
        title: "Government & Public Safety",
        subtitle: "Critical Infrastructure Protection",
        description:
            "Comprehensive public safety solutions for cities and government facilities with smart integration.",
        image: "/images/safety.webp",
        buttonText: "Discover More",
        buttonLink: "/solutions/government",
        alignLeft: true,
    },
];

const Page = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    // Refs for each category section
    const categoryRef1 = useRef<HTMLDivElement>(null);
    const categoryRef2 = useRef<HTMLDivElement>(null);
    const categoryRef3 = useRef<HTMLDivElement>(null);
    const categoryRef4 = useRef<HTMLDivElement>(null);
    const categoryRef5 = useRef<HTMLDivElement>(null);

    // Video refs for each category
    const videoRefs = [
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
    ];

    // Image refs for each category
    const imageRefs = [
        useRef<HTMLImageElement>(null),
        useRef<HTMLImageElement>(null),
        useRef<HTMLImageElement>(null),
        useRef<HTMLImageElement>(null),
        useRef<HTMLImageElement>(null),
    ];

    // Header ref and in-view detection
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

    // Check if each category is in view
    const isInView1 = useInView(categoryRef1, { once: true, margin: "-50px" });
    const isInView2 = useInView(categoryRef2, { once: true, margin: "-50px" });
    const isInView3 = useInView(categoryRef3, { once: true, margin: "-50px" });
    const isInView4 = useInView(categoryRef4, { once: true, margin: "-50px" });
    const isInView5 = useInView(categoryRef5, { once: true, margin: "-50px" });

    const categoryRefs = [
        categoryRef1,
        categoryRef2,
        categoryRef3,
        categoryRef4,
        categoryRef5,
    ];
    const inViewStates = [isInView1, isInView2, isInView3, isInView4, isInView5];

    // Play/pause videos based on viewport
    useEffect(() => {
        videoRefs.forEach((videoRef, index) => {
            if (videoRef.current) {
                if (inViewStates[index]) {
                    videoRef.current.play().catch((error) => {
                        console.log("Video play failed:", error);
                    });
                } else {
                    videoRef.current.pause();
                }
            }
        });
    }, [inViewStates]);

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const slideVariants: Variants = {
        hidden: (alignLeft: boolean) => ({
            opacity: 0,
            x: alignLeft ? -100 : 100,
            scale: 0.95,
        }),
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const overlayVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.1,
            },
        },
    };

    const contentVariants: Variants = {
        hidden: (alignLeft: boolean) => ({
            opacity: 0,
            x: alignLeft ? -30 : 30,
        }),
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
            },
        },
    };

    const textVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: delay,
            },
        }),
    };

    // Header variants
    const headerVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Image variants (for mobile banner)
    const imageVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8
            }
        }
    };

    // Simplified variants for reduced motion
    const reducedMotionVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    // Banner data for hero section
    const mobileBannerData = {
        image: "/mobile/security.jpg",
        title: "Security Solutions",
        subtitle: "Expert Installations",
        description:
            "Trusted by businesses across Dubai, we specialize in expert security system installations that are fully compliant with SIRA regulations.",
    };

    return (
        <div className="bg-gradient-to-r from-red-900/80 to-transparent overflow-hidden">
            {/* Desktop Hero Section */}
            <section className="hidden md:block relative w-full h-screen flex items-center justify-start overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <Image
                        src="/images/Security.png"
                        alt="Security Solutions"
                        fill
                        className="object-cover w-full h-full"
                        priority
                        quality={100}
                    />
                </motion.div>
                <div className="absolute inset-0 bg-opacity-40 flex items-center">
                    <div className="max-w-4xl px-10 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                        >
                            <span className="block text-5xl text-white">Security</span>
                            <span className="block text-5xl text-red-500">Solutions</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
                        >
                            Trusted by businesses across Dubai, we specialize in expert
                            security system installations that are fully compliant with SIRA
                            regulations—ensuring your property is protected, secure, and
                            future-ready.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        ></motion.div>
                    </div>
                </div>
            </section>

            {/* Mobile Hero Section - Restructured like Banner component */}
            <section className="md:hidden relative w-full h-96 overflow-hidden">
                <div className="absolute inset-0">
                    {/* Mobile Banner Image */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={imageVariants}
                        className="w-full h-full"
                    >
                        <img
                            src={mobileBannerData.image}
                            alt="Security Solutions"
                            className="w-full h-96 object-cover"
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setIsLoaded(true)}
                        />
                    </motion.div>

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* Banner Content - Mobile */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center z-10"
                    >
                        {/* Subtitle/Highlight Text */}
                        <motion.p
                            variants={textVariants}
                            custom={0}
                            className="text-xs font-semibold text-red-500 mb-2 uppercase tracking-wide"
                        >
                          
                        </motion.p>

                        {/* Title */}
                        <motion.h1
                            variants={textVariants}
                            custom={0.1}
                            className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2"
                        >
                            {mobileBannerData.title}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            variants={textVariants}
                            custom={0.2}
                            className="text-sm sm:text-base text-red-400 font-semibold mb-3"
                        >
                            {mobileBannerData.subtitle}
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            variants={textVariants}
                            custom={0.3}
                            className="text-xs sm:text-sm leading-relaxed mb-4 max-w-sm text-gray-100"
                        >
                            {mobileBannerData.description}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-gray-100">
                <motion.div
                    ref={headerRef}
                    variants={shouldReduceMotion ? reducedMotionVariants : headerVariants}
                    initial="hidden"
                    animate={isHeaderInView ? "visible" : "hidden"}
                    className="text-center max-w-6xl mx-auto px-6 mb-16"
                >
                    <motion.h2
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    >
                        Enterprise Networking Solutions
                    </motion.h2>

                    <motion.p
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.2}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="text-lg md:text-xl text-red-700 font-medium mb-6"
                    >
                        Professional-Grade Infrastructure for Modern Businesses
                    </motion.p>

                    <motion.div
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.4}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="max-w-4xl mx-auto"
                    >
                        <p className="text-base text-gray-700 leading-relaxed mb-4">
                            Discover our comprehensive suite of enterprise networking
                            solutions designed to power modern businesses. From cloud
                            connectivity to physical security, we provide the robust
                            infrastructure needed to drive your digital transformation
                            forward.
                        </p>

                       
                    </motion.div>
                </motion.div>

                <div className="w-full flex flex-col gap-8">
                    {solutionsData.map((category, index) => {
                        const isInView = inViewStates[index];

                        return (
                            <motion.div
                                key={category.id}
                                ref={categoryRefs[index]}
                                custom={category.alignLeft}
                                variants={
                                    shouldReduceMotion ? reducedMotionVariants : slideVariants
                                }
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                className="relative bg-cover bg-center h-96 md:h-[70vh] w-full overflow-hidden"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        ref={imageRefs[index]}
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        priority
                                        className="object-cover w-full h-full brightness-75 contrast-110"
                                        quality={100}
                                    />
                                </div>

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/30"></div>

                                {/* Gradient Overlay */}
                                <motion.div
                                    variants={
                                        shouldReduceMotion ? reducedMotionVariants : overlayVariants
                                    }
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className={`absolute inset-0 ${
                                        index % 2 === 1
                                            ? "bg-gradient-to-l from-black/70 to-transparent"
                                            : "bg-gradient-to-r from-black/70 to-transparent"
                                    }`}
                                />

                                {/* Content */}
                                <motion.div
                                    custom={category.alignLeft}
                                    variants={
                                        shouldReduceMotion ? reducedMotionVariants : contentVariants
                                    }
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className={`absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white ${
                                        category.alignLeft ? "items-start" : "items-end text-right"
                                    }`}
                                >
                                    <motion.h2
                                        custom={shouldReduceMotion ? 0 : 0.3}
                                        variants={
                                            shouldReduceMotion ? reducedMotionVariants : textVariants
                                        }
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-2xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg"
                                    >
                                        {category.title}
                                    </motion.h2>

                                    <motion.p
                                        custom={shouldReduceMotion ? 0 : 0.4}
                                        variants={
                                            shouldReduceMotion ? reducedMotionVariants : textVariants
                                        }
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-base md:text-lg mb-3 text-gray-200"
                                    >
                                        {category.subtitle}
                                    </motion.p>

                                    <motion.p
                                        custom={shouldReduceMotion ? 0 : 0.5}
                                        variants={
                                            shouldReduceMotion ? reducedMotionVariants : textVariants
                                        }
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-sm md:text-base mb-6 opacity-90 max-w-lg leading-relaxed text-gray-300"
                                    >
                                        {category.description}
                                    </motion.p>

                                    <motion.a
                                        custom={shouldReduceMotion ? 0 : 0.6}
                                        variants={
                                            shouldReduceMotion ? reducedMotionVariants : textVariants
                                        }
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        href={category.buttonLink}
                                        className="text-red-400 hover:text-red-300 text-lg font-medium transition-all duration-300 inline-block group drop-shadow-md"
                                    >
                                        {category.buttonText}
                                        <span className="transition-transform duration-300 group-hover:translate-x-2 inline-block text-lg ml-2">
                                            →
                                        </span>
                                    </motion.a>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Page;