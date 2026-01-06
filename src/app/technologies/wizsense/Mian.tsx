'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { Shield, Cpu, Eye, Database, Settings } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion'

export function Main({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  xDisable = false,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  title: string
  description: string
  xDisable?: boolean
}) {
  return (
    <motion.div
      whileHover={xDisable ? {} : { y: -10, scale: 1.05 }}
      className="bg-white rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300"
    >
      <div className={`${iconBg} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={32} className={iconColor} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  )
}

const features = [
  {
    icon: Cpu,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    title: 'AI-Powered Detection',
    description:
      'Advanced deep learning algorithms that can distinguish between humans, vehicles, and other objects with 99.7% accuracy.',
  },
  {
    icon: Shield,
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    title: 'Real-Time Processing',
    description:
      'Instant threat detection and alert notifications with minimal latency for immediate response capabilities.',
  },
  {
    icon: Database,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    title: 'Smart Analytics',
    description:
      'Comprehensive behavioral analysis including crowd detection, loitering, and intrusion detection.',
  },
  {
    icon: Eye,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-600',
    title: 'False Alarm Reduction',
    description: 'Up to 95% reduction in false alarms through intelligent filtering',
  },
]

export default function WizSensePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const overviewRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(true)

  const { ref: benefitsRef, inView: benefitsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const imageVariants: Variants = {
    hidden: { scale: 1.1 },
    visible: {
      scale: 1,
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  }

  const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const mobileBannerData = {
    image: "/mobile/tech/wizsense.jpg",
    title: "WizSense",
    subtitle: "Technology",
    description: "Revolutionary AI-powered surveillance technology that transforms ordinary security cameras into intelligent monitoring systems with advanced detection capabilities.",
  }

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId)
    const targetRef = sectionId === 'overview' ? overviewRef : featuresRef
    if (targetRef.current) {
      const navHeight = 80
      const elementPosition = targetRef.current.offsetTop - navHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      })
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const tabData = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'features', label: 'Features', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Desktop Hero Section */}
      <motion.section
        className="hidden md:flex relative w-full h-screen items-center justify-start"
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
            src="/images/wizsens.webp"
            alt="WizSense Technology"
            className="object-cover w-full h-full absolute inset-0"
            style={{ zIndex: 0 }}
          />
        </motion.div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl px-10 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xl md:text-6xl font-bold text-white leading-tight"
            >
              <span className="block">WizSense</span>
              <span className="block text-red-500">Technology</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
            >
              Revolutionary AI-powered surveillance technology that transforms ordinary security
              cameras into intelligent monitoring systems with advanced detection capabilities.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Mobile Hero Section */}
      <motion.section
        className="md:hidden relative w-full h-96 flex items-center justify-center"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={shouldReduceMotion ? reducedMotionVariants : containerVariants}
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
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
          className="absolute inset-0 flex items-center justify-center text-center px-6"
        >
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              <span className="block">{mobileBannerData.title}</span>
              <span className="block text-red-500">{mobileBannerData.subtitle}</span>
            </h1>
            <p className="text-sm text-gray-100 leading-snug max-w-md mx-auto">
              {mobileBannerData.description}
            </p>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="py-20 bg-white bg-opacity-95"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                WizSense <span className="text-red-500">Technology Demo</span>
              </h2>
              <p className="text-xl text-gray-600 mx-auto">
                Experience the advanced capabilities of our AI-powered surveillance system
              </p>
            </motion.div>

            {/* Video Container */}
            <motion.div
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Video Wrapper */}
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/kQOFsrFDvC0"
                  title="WizSense Technology Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>

            {/* Video Description */}
            <div className="mt-12 text-center">
              <motion.div
                className="grid md:grid-cols-3 gap-8 text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  {
                    title: 'Real-Time Detection',
                    description:
                      'Watch AI identify and classify objects in real-time with precision',
                  },
                  {
                    title: 'Smart Analytics',
                    description:
                      'Advanced behavioral analysis and pattern recognition capabilities',
                  },
                  {
                    title: 'Zero False Alarms',
                    description: 'Intelligent filtering reduces false alerts by up to 95%',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Related Products Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              WizSense Camera <span className="text-red-600">Products</span>
            </h2>
            <p className="text-xl text-gray-600  mb-4">
              Advanced security solutions powered by AI technology for comprehensive surveillance
            </p>
          </motion.div>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Dome Camera */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-48 flex items-center justify-center">
                      <Image
                        src="/images/domecamera.webp"
                        alt="Dome Camera"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mt-2">Dome Camera</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      4MP AI-powered with smart detection
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                        4MP
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">
                        AI
                      </span>
                    </div>
                  </motion.div>

                  {/* Bullet Camera */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-48 flex items-center justify-center">
                      <Image
                        src="/images/wBulletCamera.webp"
                        alt="Bullet Camera"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mt-2">Bullet Camera</h3>
                    <p className="text-sm text-gray-600 mt-1">8MP outdoor with night vision</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                        8MP
                      </span>
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded text-xs">
                        Night
                      </span>
                    </div>
                  </motion.div>

                  {/* PTZ Camera */}
                  <motion.div whileHover={{ y: -5 }} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="h-48 flex items-center justify-center">
                      <Image
                        src="/images/WizPTZCamera.webp"
                        alt="PTZ Camera"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mt-2">PTZ Camera</h3>
                    <p className="text-sm text-gray-600 mt-1">30x zoom with auto-tracking</p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs">30x</span>
                      <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs">
                        PTZ
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      {/* Compact Products Section */}
    </div>
  )
}