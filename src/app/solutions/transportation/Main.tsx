'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Shield, TrendingUp, CheckCircle, Cpu, Factory, Settings } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, Variants } from 'framer-motion'
import Image from 'next/image'

const solutionCategories = [
    {
        title: 'Transportation Security',
        subtitle: 'Intelligent, Scalable Transit Protection',
        description:
            'End‑to‑end security for airports, railways, highways, and public transport with AI analytics and centralized management.',
        solutions: [
            '24/7 surveillance of stations, terminals, platforms, and vehicles',
            'License Plate Recognition (ANPR) for access and parking',
            'AI‑based incident detection and real‑time alerts',
            'Centralized, multi‑site management with mobile/web access',
        ],
        image: '/transportation/System Structure (2).jpg',
    },
    {
        title: 'Key Technology',
        subtitle: 'Advanced AI & Traffic Analytics',
        description:
            'State‑of‑the‑art technologies optimizing security and traffic flow across all transport modes.',
        solutions: [
            'AI-powered Incident Detection & Video Analytics',
            'ANPR (License Plate Recognition)',
            'Smart Traffic Monitoring (flow, violations, ADAS)',
            'Centralized Management Platform',
        ],
        image: '/transportation/Key Technology.jpg',
    },
    {
        title: 'System Structure',
        subtitle: 'Modular Transport Security Architecture',
        description:
            'A multi-layered security framework covering every transport environment—from platforms to highways.',
        solutions: [
            'Stations & Platforms: 4K AI cameras for people & incident detection',
            'Roadways & Parking: ANPR, traffic violation enforcement, flow monitoring',
            'Vehicles: Mobile surveillance with ADAS/DSM on buses/trains',
            'Control Center: NVR/DSS for centralized playback, alerts, and management',
        ],
        image: '/transportation/System Structure.jpg',
    },
]

const TransportationSolutionPage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const shouldReduceMotion = useReducedMotion()

    const [activeTab, setActiveTab] = useState('overview')

    const overviewRef = useRef<HTMLDivElement>(null)
    const solutionsRef = useRef<HTMLDivElement>(null)

    const { ref: benefitsRef, inView: benefitsInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const { ref: solutionsInViewRef, inView: solutionsInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const scrollToSection = (sectionId: string) => {
        setActiveTab(sectionId)
        const targetRef = sectionId === 'overview' ? overviewRef : solutionsRef

        if (targetRef.current) {
            const navHeight = 80
            const elementPosition = targetRef.current.offsetTop - navHeight
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth',
            })
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100
            const sections = [
                { id: 'overview', ref: overviewRef },
                { id: 'solutions', ref: solutionsRef },
            ]

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
                    setActiveTab(section.id)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

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
    }

    // Image variants (for mobile banner)
    const imageVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8
            }
        }
    }

    // Simplified variants for reduced motion
    const reducedMotionVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    }

    // Banner data for hero section
    const mobileBannerData = {
        image: "/mobile/transportation.jpg",
        title: "Transportation Security",
        subtitle: "Intelligent Transit Protection",
        description:
            "Secure every journey with intelligent surveillance, real-time alerts, and centralized management for stations, vehicles, and roadways.",
    }

    const tabData = [
        { id: 'overview', label: 'Overview', icon: Factory },
        { id: 'solutions', label: 'Solutions', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-white overflow-x-hidden overflow-y-auto">
            <style jsx global>{`
                html,
                body {
                    max-width: 100%;
                }
                * {
                    box-sizing: border-box;
                }
            `}</style>
            
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
                    <Image
                        src="/images/wzmind.webp"
                        alt="Transportation Security Solution"
                        fill
                        className="object-cover w-full h-full"
                        priority
                        quality={100}
                    />
                </motion.div>
                <div className="absolute inset-0 bg-black/40 flex items-center">
                    <div className="max-w-4xl px-10 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                        >
                            <span className="block text-5xl text-white">Transportation</span>
                            <span className="block text-5xl text-red-500">Security Solutions</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
                        >
                            Secure every journey with intelligent surveillance, real-time alerts, and centralized
                            management for stations, vehicles, and roadways. Dahua's advanced solutions ensure
                            safe, efficient, and seamless transportation for all.
                        </motion.p>
                    </div>
                </div>
            </motion.section>

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
                            alt="Transportation Security Solution"
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

            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-4">
                        {tabData.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                    className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-red-600 text-red-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Overview Section */}
            <section ref={overviewRef} className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Key Benefits */}
                    <motion.div
                        ref={benefitsRef}
                        className="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 overflow-hidden"
                        initial="hidden"
                        animate={benefitsInView ? 'visible' : 'hidden'}
                        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                    >
                        <motion.div className="text-center mb-6 md:mb-8" variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                                Why Choose Dahua Transportation Solutions?
                            </h2>
                        </motion.div>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-hidden"
                            variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                        >
                            {[
                                {
                                    icon: TrendingUp,
                                    title: 'Seamless Transit Security',
                                    description:
                                        '24/7 monitoring for stations, vehicles, and roadways with real-time incident alerts and response.',
                                    color: 'bg-red-600',
                                },
                                {
                                    icon: Shield,
                                    title: 'Centralized Management',
                                    description:
                                        'Unified platform for multi-site surveillance, access control, and traffic analytics across all transport modes.',
                                    color: 'bg-gray-600',
                                },
                                {
                                    icon: Cpu,
                                    title: 'AI-Driven Traffic & Safety',
                                    description:
                                        'Advanced AI analytics for incident detection, license plate recognition, and optimized traffic flow.',
                                    color: 'bg-red-600',
                                },
                            ].map((benefit, index) => {
                                const Icon = benefit.icon
                                return (
                                    <motion.div
                                        key={index}
                                        className="text-center overflow-hidden"
                                        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                                    >
                                        <motion.div
                                            className={`w-12 h-12 md:w-16 md:h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}
                                        >
                                            <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </motion.div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1.5 md:mb-2">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-gray-600">{benefit.description}</p>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Solutions Section */}
            <section ref={solutionsRef} className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <motion.div
                        ref={solutionsInViewRef}
                        initial="hidden"
                        animate={solutionsInView ? 'visible' : 'hidden'}
                        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                        className="overflow-hidden"
                    >
                        <motion.div className="text-center mb-8 md:mb-12 overflow-hidden" variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                                Industrial Solutions
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600">
                                Comprehensive security and monitoring solutions for industrial applications
                            </p>
                        </motion.div>

                        <div className="space-y-8 md:space-y-12 lg:space-y-16 overflow-hidden">
                            {solutionCategories.map((category, index) => (
                                <motion.div
                                    key={index}
                                    className={`grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center overflow-hidden ${
                                        index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                                    }`}
                                    variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <motion.div
                                        className={`space-y-4 md:space-y-6 overflow-hidden ${
                                            index % 2 === 1 ? 'lg:col-start-2' : ''
                                        }`}
                                        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                                    >
                                        <div className="overflow-hidden">
                                            <motion.p
                                                className="text-xs md:text-sm font-medium text-red-600 uppercase tracking-wide mb-1.5 md:mb-2"
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {category.subtitle}
                                            </motion.p>
                                            <motion.h3
                                                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {category.title}
                                            </motion.h3>
                                            <motion.p
                                                className="text-sm md:text-base lg:text-lg text-gray-600"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {category.description}
                                            </motion.p>
                                        </div>

                                        <motion.div
                                            className="space-y-2 md:space-y-3 overflow-hidden"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            {category.solutions.map((solution, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    className="flex items-center overflow-hidden"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + idx * 0.1 }}
                                                >
                                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 mr-2 md:mr-3 flex-shrink-0" />
                                                    <span className="text-sm md:text-base text-gray-700">{solution}</span>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        className={`overflow-hidden ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                                        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
                                    >
                                        <motion.img
                                            src={category.image}
                                            alt={category.title}
                                            className="w-full h-48 md:h-64 lg:h-80 object-cover rounded-xl md:rounded-2xl shadow-2xl"
                                            transition={{ duration: 0.5 }}
                                        />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default TransportationSolutionPage