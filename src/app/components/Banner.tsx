"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

export default function Banner() {
    const [isLoaded, setIsLoaded] = useState(false);

    const desktopBannerData = {
        image: "/images/main-banner.png",
        title: "Leading Dahua Security in Dubai",
        titleHighlight: "Dahua",
        highlight: "SIRA Approved & Trusted Partner",
        description:
            "As part of Digital Link Tech, we provide enterprise-grade security and surveillance solutions. We specialize in Dahua's comprehensive range of cameras, DVRs, and NVRs, delivering cost-effective systems tailored for projects across the UAE.",
        cta: "View Our Dahua Solutions",
        ctaLink: "/products",
    };

    const mobileBannerData = {
        image: "/mobile/Main Banner.png",
        title: "Dahua Security in Dubai",
        titleHighlight: "Dahua",
        highlight: "SIRA Approved Partner",
        description:
            "Enterprise-grade security and surveillance solutions. Dahua cameras, DVRs, and NVRs for the UAE.",
        cta: "View Solutions",
        ctaLink: "/products",
    };

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            },
        },
    };

    const underlineVariants: Variants = {
        hidden: {
            width: 0,
            opacity: 0
        },
        visible: {
            width: "30%",
            opacity: 1,
            transition: {
                delay: 0.8,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8
            }
        }
    };

    return (
        <div className="w-full relative">
            {/* Desktop Banner */}
            <div className="hidden md:block relative w-full h-screen mt-4 min-h-[600px] overflow-hidden">
                <div className="absolute inset-0">
                    {/* Desktop Banner Image */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={imageVariants}
                        className="w-full h-full"
                    >
                        <img
                            src={desktopBannerData.image}
                            alt="Dahua Security Solutions in Dubai"
                            className="w-full h-full object-cover"
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setIsLoaded(true)}
                        />
                    </motion.div>

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Banner Content - Left aligned */}
                    <div className="absolute inset-0 flex items-center">
                        <motion.div
                            initial="hidden"
                            animate={isLoaded ? "visible" : "visible"}
                            variants={containerVariants}
                            className="text-white px-4 sm:px-6 md:px-12 lg:px-16 max-w-4xl lg:max-w-5xl"
                        >
                            {/* Highlight Text */}
                            <motion.p
                                variants={itemVariants}
                                className="text-lg md:text-xl font-semibold text-red-500 mb-2"
                            >
                                {desktopBannerData.highlight}
                            </motion.p>

                            {/* Title with Animated Underline */}
                            <div className="relative inline-block mb-4 sm:mb-6">
                                <motion.h1
                                    variants={itemVariants}
                                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-2 sm:mb-4"
                                >
                                    Reliable <span className="text-red-600">Dahua</span> Security Expertise in Dubai
                                </motion.h1>
                                <motion.div
                                    variants={underlineVariants}
                                    className="absolute bottom-0 left-0 h-1 bg-red-500 rounded-full"
                                />
                            </div>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-3xl"
                            >
                                {desktopBannerData.description}
                            </motion.p>

                            {/* Call to Action Button */}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Banner */}
            <div className="md:hidden relative w-full h-96 overflow-hidden">
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
                            className="w-full h-96 object-cover"
                            alt={mobileBannerData.title}
                            width="600"
                            height="900"
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
                        {/* Highlight Text */}
                        <motion.p
                            variants={itemVariants}
                            className="text-xs font-semibold text-red-500 mb-2 uppercase tracking-wide"
                        >
                            {mobileBannerData.highlight}
                        </motion.p>

                        {/* Title */}
                        <motion.h2
                            variants={itemVariants}
                            className="text-lg font-bold leading-tight mb-2"
                        >
                            {mobileBannerData.title}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="text-xs leading-relaxed mb-4 max-w-sm"
                        >
                            {mobileBannerData.description}
                        </motion.p>

                        {/* Call to Action Button */}
                        
                    </motion.div>
                </div>
            </div>

            {/* Custom Styles for complex parts */}
            <style jsx global>{`
                @keyframes subtleGlow {
                    0% { text-shadow: 0 0 1px rgba(255,255,255,0.2); }
                    50% { text-shadow: 0 0 8px rgba(255,255,255,0.4); }
                    100% { text-shadow: 0 0 1px rgba(255,255,255,0.2); }
                }

                .shop-now-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.1) 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0.1) 100%
                    );
                    transition: all 0.5s ease-in-out;
                    transform: skewX(-20deg);
                    z-index: 0;
                }

                .shop-now-btn:hover::before,
                .shop-now-btn:active::before {
                    left: 200%;
                }

                .carousel-item-container:hover .carousel-image,
                .carousel-item-container:active .carousel-image {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
}