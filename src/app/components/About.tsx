'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import Image from 'next/image'

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleCards, setVisibleCards] = useState({
    coreValue: false,
    vision: false,
    mission: false,
  })
  const [heroVisible, setHeroVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const [displayedText1, setDisplayedText1] = useState('')
  const [displayedText2, setDisplayedText2] = useState('')
  const [displayedText3, setDisplayedText3] = useState('')
  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  // Define the paragraphs content
  const paragraph1 = "Established in 2015, Dahua serves as a leading provider of smart home solutions, focusing on the global smart IoT market for consumers worldwide."
  const paragraph2 = "Employing over 1,000 professionals across the globe — with more than 60% dedicated to R&D — Dahua has filed over 100 technology patents. These innovations have earned the company global recognition, and by 2022, Dahua's products have reached over 25 million users across more than 100 countries."
  const paragraph3 = "Leveraging Dahua's AI capabilities and cloud-based platform, we've developed four visually focused product lines: Dahua Security, Dahua Robots, Dahua Lights, and Dahua Link. Dahua is committed to delivering diverse solutions tailored to various application scenarios, offering smart users a more seamless, intelligent experience."

  const desktopHeroData = {
    image: "/images/About1.png",
    title: "About Us",
    description: "Your trusted Dahua distributor and security solutions partner in Dubai.",
  }

  const mobileBannerData = {
    image: "/mobile/about.jpg",
    title: "About Us",
    subtitle: "Leading Provider",
    description: "Trusted Dahua partner in Dubai.",
  }

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '6rem',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0,
      },
    },
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

  const sectionRef = useRef(null)
  const heroRef = useRef(null)
  const mobileHeroRef = useRef(null) // Add separate ref for mobile hero
  const coreValueRef = useRef(null)
  const visionRef = useRef(null)
  const missionRef = useRef(null)

  // Hero banner animation observer - for desktop
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Mobile hero banner animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (mobileHeroRef.current) {
      observer.observe(mobileHeroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Company section animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animation observer for core values section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardName = entry.target.getAttribute('data-card') as 'coreValue' | 'vision' | 'mission'
            if (cardName) {
              const delays = {
                coreValue: 0,
                vision: 150,
                mission: 300,
              }

              setTimeout(() => {
                setVisibleCards((prev) => ({
                  ...prev,
                  [cardName]: true,
                }))
              }, delays[cardName])
            }
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '-50px',
      },
    )

    const cards = [coreValueRef.current, visionRef.current, missionRef.current]
    cards.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  // Typing effect for first paragraph
  useEffect(() => {
    if (isVisible && currentParagraph === 0) {
      setIsTyping(true)
      let i = 0
      const timer = setInterval(() => {
        if (i <= paragraph1.length) {
          setDisplayedText1(paragraph1.slice(0, i))
          i++
        } else {
          clearInterval(timer)
          setIsTyping(false)
          setTimeout(() => setCurrentParagraph(1), 200)
        }
      }, 1) // Changed from 20 to 1 for faster typing
      return () => clearInterval(timer)
    }
  }, [isVisible, currentParagraph])

  // Typing effect for second paragraph
  useEffect(() => {
    if (isVisible && currentParagraph === 1) {
      setIsTyping(true)
      let i = 0
      const timer = setInterval(() => {
        if (i <= paragraph2.length) {
          setDisplayedText2(paragraph2.slice(0, i))
          i++
        } else {
          clearInterval(timer)
          setIsTyping(false)
          setTimeout(() => setCurrentParagraph(2), 10)
        }
      }, 1) // Changed from 20 to 1 for faster typing
      return () => clearInterval(timer)
    }
  }, [isVisible, currentParagraph])

  // Typing effect for third paragraph
  useEffect(() => {
    if (isVisible && currentParagraph === 2) {
      setIsTyping(true)
      let i = 0
      const timer = setInterval(() => {
        if (i <= paragraph3.length) {
          setDisplayedText3(paragraph3.slice(0, i))
          i++
        } else {
          clearInterval(timer)
          setIsTyping(false)
        }
      }, 1) // Changed from 20 to 1 for faster typing
      return () => clearInterval(timer)
    }
  }, [isVisible, currentParagraph])

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Desktop Hero Section */}
      <section
        ref={heroRef}
        className={`hidden md:block relative w-full h-screen flex items-center justify-start transition-all duration-700 ease-out ${heroVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}
      >
        <img
          src={desktopHeroData.image}
          alt="About Dahua Dubai"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Enhanced overlay with smooth transition */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center transition-all duration-1000 ease-out ${heroVisible
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-12'
            }`}
        >
          <div className="max-w-4xl px-10 space-y-6">
            <motion.h1
              custom={0}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            >
              <span className="block">{desktopHeroData.title.split(' ')[0]} <span className="text-red-600">{desktopHeroData.title.split(' ')[1]}</span></span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={textVariants}
              className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
              style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}
            >
              {desktopHeroData.description}
            </motion.p>
          </div>
        </div>
      </section>

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
            alt="About Dahua Dubai Mobile"
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
            <span className="block text-white">{mobileBannerData.title.split(' ')[0]} <span className='text-red-600'>{mobileBannerData.title.split(' ')[1]}</span></span>
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

      {/* Company Information Section */}
      <section
        ref={sectionRef}
        className="text-black py-12 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          {/* Company Logo */}
          <div
            className={`flex justify-center mb-6 transition-all duration-600 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}
          >
            <img src="/Logo.png" className="h-10 w-auto" />
          </div>

          {/* Company Description */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <p className="text-sm leading-relaxed">
              {displayedText1}
              {isTyping && currentParagraph === 0 && (
                <span className="ml-1 inline-block w-2 h-5 bg-red-400 animate-pulse"></span>
              )}
            </p>

            <p className="text-sm leading-relaxed">
              {displayedText2}
              {isTyping && currentParagraph === 1 && (
                <span className="ml-1 inline-block w-2 h-5 bg-red-400 animate-pulse"></span>
              )}
            </p>

            <p className="text-sm leading-relaxed">
              {displayedText3}
              {isTyping && currentParagraph === 2 && (
                <span className="ml-1 inline-block w-2 h-5 bg-red-400 animate-pulse"></span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Medium gap between company info and core values */}
      <div className="h-12"></div>

      {/* Animated Core Values Section */}
      <section className="bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Core Value */}
          <div
            ref={coreValueRef}
            data-card="coreValue"
            className={`flex flex-col lg:flex-row items-center mb-8 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ease-out ${visibleCards.coreValue
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-95'
              }`}
          >
            <div
              className={`lg:w-1/2 p-6 flex flex-col justify-center transform transition-all duration-800 delay-100 ease-out ${visibleCards.coreValue ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <h2 className="text-xl text-center font-semibold text-gray-900 mb-3">
                Core Value
              </h2>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Dahua protects your home and loved ones.
              </p>
            </div>
            <div
              className={`lg:w-1/2 relative h-[280px] w-full transform transition-all duration-800 delay-200 ease-out ${visibleCards.coreValue
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-8 scale-105'
                }`}
            >
              <img
                src="/images/Product.png"
                alt="Smart home security"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Vision */}
          <div
            ref={visionRef}
            data-card="vision"
            className={`flex flex-col lg:flex-row-reverse items-center mb-8 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ease-out ${visibleCards.vision
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-95'
              }`}
          >
            <div
              className={`lg:w-1/2 p-6 flex flex-col justify-center text-center transform transition-all duration-800 delay-100 ease-out ${visibleCards.vision ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
            >
              <h2 className="text-xl text-center font-semibold text-gray-900 mb-3">
                Vision
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Let people enjoy smart life with convenience and safety.
              </p>
            </div>
            <div
              className={`lg:w-1/2 relative h-[280px] w-full transform transition-all duration-800 delay-200 ease-out ${visibleCards.vision
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 -translate-x-8 scale-105'
                }`}
            >
              <img
                src="/about/vision.jpg"
                alt="Smart technology"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Mission */}
          <div
            ref={missionRef}
            data-card="mission"
            className={`flex flex-col lg:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ease-out ${visibleCards.mission
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-12 scale-95'
              }`}
          >
            <div
              className={`lg:w-1/2 p-6 flex flex-col justify-center transform transition-all duration-800 delay-100 ease-out ${visibleCards.mission ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
            >
              <h2 className="text-xl text-center font-semibold text-gray-900 mb-3">
                Mission
              </h2>
              <p className="text-gray-700 text-base leading-relaxed text-center">
                Provide consumers with first-class products and services.
              </p>
            </div>
            <div
              className={`lg:w-1/2 relative h-[280px] w-full transform transition-all duration-800 delay-200 ease-out ${visibleCards.mission
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-8 scale-105'
                }`}
            >
              <img
                src="/about/mission.jpg"
                alt="Innovation and partnership"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}