'use client'
import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

export default function DahuaHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

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
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const imageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  }

  // Desktop and mobile data
  const desktopBannerData = {
    image: '/images/red.jpg',
    title: "At Dahua, we're",
    titleHighlight: 'security-driven.',
    description:
      "Let's build a more secure, intelligent, and connected world together.",
    cta: 'Contact Us',
    ctaLink: '/contact',
  }

  const mobileBannerData = {
    image: '/mobile/contact.jpg',
    title: "At Dahua, we're",
    highlight: 'security-driven.',
    description:
      "Let's build a more secure, intelligent, and connected world together.",
    cta: 'Contact Us',
    ctaLink: '/contact',
  }

  return (
    <section
      className="relative w-full font-[Open_Sans,sans-serif] overflow-hidden"
      style={{ fontFamily: "'Open Sans', sans-serif" }}
    >
      {/* Desktop Banner */}
      <div className="hidden md:block relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img
            src={desktopBannerData.image}
            alt="Professional security monitoring"
            className="w-full h-full object-cover object-center"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
        </motion.div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Content */}
        <div className="relative z-20 flex items-center justify-start w-full h-full px-4 sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-xl bg-black/70 p-6 sm:p-8 md:p-10 rounded-lg shadow-xl 
                     mx-auto sm:mx-0 sm:ml-4 md:ml-8 lg:ml-12 xl:ml-16
                     mt-8 mb-8 sm:mt-12 sm:mb-12 md:mt-16 md:mb-16"
            initial="hidden"
            animate={isLoaded ? 'visible' : 'visible'}
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                       font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight"
            >
              {desktopBannerData.title}
              <br />
              <span className="text-red-600">
                {desktopBannerData.titleHighlight}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base md:text-lg text-gray-300 
                       mb-6 sm:mb-7 md:mb-8 leading-relaxed"
            >
              {desktopBannerData.description}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href={desktopBannerData.ctaLink}
                className="inline-flex items-center rounded-full justify-center gap-2 sm:gap-3 
                         px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3 
                         border-2 border-white text-white bg-transparent 
                         hover:bg-red-600 hover:border-red-600 hover:text-white 
                         transition-all duration-300 font-semibold group 
                         text-sm sm:text-base w-full sm:w-auto
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                {desktopBannerData.cta}
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
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
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center z-10"
          >
            <motion.p
              variants={itemVariants}
              className="text-xs font-semibold text-red-500 mb-2 uppercase tracking-wide"
            >
              {mobileBannerData.highlight}
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-lg font-bold leading-tight mb-2"
            >
              {mobileBannerData.title}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xs leading-relaxed mb-4 max-w-sm"
            >
              {mobileBannerData.description}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                href={mobileBannerData.ctaLink}
                className="inline-flex items-center rounded-full justify-center gap-2 px-4 py-2 border-2 border-white text-white bg-transparent hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 font-semibold group text-xs w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
              >
                {mobileBannerData.cta}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
