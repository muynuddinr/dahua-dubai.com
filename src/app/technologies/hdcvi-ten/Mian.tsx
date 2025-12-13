'use client'

import { motion } from 'framer-motion'
import { Camera, Zap, Shield, Cpu, Video, Signal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { Variants, useReducedMotion } from 'framer-motion'

function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
}) {
  return (
    <motion.div

      className="bg-white rounded-xl p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
    >
      <div
        className={`${iconBg} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6`}
      >
        <Icon size={24} className={`${iconColor} sm:w-8 sm:h-8`} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}
const Counter = ({
  value,
  suffix = '',
  duration = 2
}: {
  value: string
  suffix?: string
  duration?: number
}) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5
  })

  useEffect(() => {
    if (inView) {
      let start = 0
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''))
      const incrementTime = (duration * 1000) / numericValue

      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start >= numericValue) clearInterval(timer)
      }, incrementTime)

      return () => clearInterval(timer)
    }
  }, [inView, value, duration])

  return (
    <div ref={ref}>
      <div className="text-3xl font-bold text-red-600 mb-2">
        {count}{suffix}
      </div>
    </div>
  )
}
export default function HDCVITenPage() {
  const [isLoaded, setIsLoaded] = useState(true)
  const handlePlayVideo = () => {
    setIsLoaded(true)
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 1.1 },
    visible: {
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  };

  const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const shouldReduceMotion = useReducedMotion();

  const mobileBannerData = {
    image: "/mobile/tech/hdcvi.jpg",
    title: "HDCVI 10.0",
    subtitle: "AI Over-Coax Era",
    description:
      "Next-generation HDCVI technology with integrated AI capabilities over coaxial cables.",
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Desktop Hero Section */}
      <motion.section
        className="hidden md:flex relative w-full h-screen items-center justify-start overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="/images/Hdcvii.png"
            alt="HDCVI 10.0 Technology"
            className="object-cover w-full h-full absolute inset-0"
            style={{ zIndex: 0 }}
          />
          <div className="absolute inset-0  bg-opacity-30"></div>
        </motion.div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl px-4 sm:px-6 lg:px-10 space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              <span className="block">HDCVI 10.0</span>
              <span className="block text-red-500">AI Over-Coax Era</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl leading-snug"
            >
              HDCVI 10.0 represents the pinnacle of high-definition composite video interface
              technology with integrated AI capabilities. This breakthrough innovation blazes a
              trail to the over-coax AI era, delivering exceptional 4K resolution with intelligent
              analytics over traditional coaxial cables.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Mobile Hero Section */}
      <motion.section
        className="md:hidden relative w-full h-96 flex items-center justify-center overflow-hidden"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={
          shouldReduceMotion ? reducedMotionVariants : containerVariants
        }
      >
        <motion.div
          variants={shouldReduceMotion ? reducedMotionVariants : imageVariants}
          className="w-full h-full"
        >
          <Image
            src={mobileBannerData.image}
            alt={mobileBannerData.title}
            fill
            className="object-cover"
            onLoad={() => setIsLoaded(true)}
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/40"></div>
        <motion.div
          variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
          className="absolute inset-0 flex items-center justify-center text-center px-6"
        >
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              <span className="block">{mobileBannerData.title}</span>
              <span className="block text-red-500">
                {mobileBannerData.subtitle}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-100 leading-snug max-w-md mx-auto">
              {mobileBannerData.description}
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Video Section */}
      <motion.section
        className="mt-16 bg-white p-6 sm:p-8 shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                See HDCVI 10.0 in <span className="text-red-500">Action</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mx-auto mb-8 sm:mb-12 px-4">
                Experience the revolutionary capabilities of HDCVI 10.0 AI technology
              </p>

              {/* Video Container - Enhanced for mobile */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=675&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-white">
                    <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                      HDCVI 10.0 AI Demo
                    </h3>
                    <p className="text-sm sm:text-lg opacity-90">Over-coax AI Era technology</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Video Description */}
            <div className="mt-8 sm:mt-12 text-center">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  {
                    title: '4K AI Resolution',
                    description:
                      'Ultra-high definition video with integrated AI analytics delivers crystal clear monitoring with intelligent detection',
                  },
                  {
                    title: 'Over-Coax Transmission',
                    description:
                      'Revolutionary AI data transmission over existing coaxial infrastructure reduces installation costs significantly',
                  },
                  {
                    title: 'Smart Integration',
                    description:
                      'Seamless upgrade path with AI capabilities while maintaining compatibility with existing security systems',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="p-4"
                  >
                    <h3 className="text-base sm:text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Overview Section */}
      <motion.section
        className="py-12 sm:py-16 lg:py-24 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Technology <span className="text-red-500">Overview</span>
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 mx-auto max-w-3xl px-4">
              Next-generation HDCVI technology that revolutionizes video surveillance
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center p-4 sm:p-8 lg:p-20">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Next-Generation HDCVI Technology
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                HDCVI 10.0 represents the pinnacle of high-definition composite video interface
                technology with integrated AI capabilities. This breakthrough innovation blazes a
                trail to the over-coax AI era, delivering exceptional 4K resolution with intelligent
                analytics over traditional coaxial cables.
              </p>

            </motion.div>

            {/* Right Image - Full Height */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative h-64 sm:h-96 lg:h-full"
            >
              <motion.div className="">
                <div className="rounded-xl overflow-hidden ">
                  <img
                    src="/images/NXT.jpg"
                    alt="HDCVI 10.0 Technology"
                    className="w-full h-64 object-cover"
                  />
                </div>


                {/* Floating Stats */}

              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50 "
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 ">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-red-500">HDCVI 10.0?</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 px-4">
              Revolutionary advantages that transform video surveillance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                title: "AI Over-Coax Era",
                description:
                  "Revolutionary technology that blazes a trail to the over-coax AI era, delivering intelligent analytics over existing infrastructure.",
                icon: (
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                title: "Smart Installation",
                description:
                  "Easy upgrade with AI capabilities while maintaining existing coaxial infrastructure and reducing installation complexity.",
                icon: (
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 3l8 4v6c0 5-4 8-8 8s-8-3-8-8V7l8-4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                ),
              },
              {
                title: "Enhanced Intelligence",
                description:
                  "Easy upgrade to AI features while keeping your existing coaxial setup and reducing installation work with better efficiency.",
                icon: (
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 6v6l4 2"
                    />
                    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 text-center shadow-lg hover:shadow-[0_4px_12px_rgba(255,0,0,0.5)] transition-all duration-300 border border-gray-200"
              >
                {feature.icon}
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>



    </div>
  )
}