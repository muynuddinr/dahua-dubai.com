'use client'
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { Shield, Wrench, TrendingUp, Award, ArrowRight, CheckCircle, Users, Building, FileCheck, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Sira from "../../../public/images/Sira.png"
import Siraa from "../../../public/images/Sira.jpg"

const SiraPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displayedText1, setDisplayedText1] = useState('');
  const [displayedText2, setDisplayedText2] = useState('');
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const paragraph1 = "The Security Industry Regulatory Agency (SIRA) is a Dubai-based government authority established in 2016 by a decree issued by His Highness Sheikh Mohammed Bin Rashid Al Maktoum, Vice President and Prime Minister of the UAE and Ruler of Dubai. SIRA plays a crucial role in maintaining and enhancing Dubai's security infrastructure by regulating and supervising all security-related activities across the emirate. Its primary objective is to ensure the highest standards of safety and protection through the licensing, monitoring, and development of security companies, professionals, and systems.";
  
  const paragraph2 = "Only companies that are officially approved and licensed by SIRA are authorized to operate within the fields of security system design, installation, maintenance, consultancy, and guarding services. This ensures that all security operations within Dubai adhere to international standards and local regulations. Through continuous monitoring, strict compliance checks, and specialized training programs, SIRA promotes best practices in security management—strengthening both public and private sector safety. Its commitment to innovation and excellence has made SIRA a key pillar in safeguarding Dubai's infrastructure, residents, and visitors alike.";

  useEffect(() => {
    if (currentParagraph === 0) {
      setIsTyping(true);
      let i = 0;
      const timer = setInterval(() => {
        if (i <= paragraph1.length) {
          setDisplayedText1(paragraph1.slice(0, i));
          i++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          setTimeout(() => setCurrentParagraph(1), 200);
        }
      }, 1); // Very fast typing speed
      
      return () => clearInterval(timer);
    }
  }, [currentParagraph]);

  useEffect(() => {
    if (currentParagraph === 1) {
      setIsTyping(true);
      let i = 0;
      const timer = setInterval(() => {
        if (i <= paragraph2.length) {
          setDisplayedText2(paragraph2.slice(0, i));
          i++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 1); // Very fast typing speed
      
      return () => clearInterval(timer);
    }
  }, [currentParagraph]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants with proper TypeScript types
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

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
      transition: {
        duration: 0.6,
        ease: "easeOut",
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

  const mobileBannerData = {
    image: "/mobile/Seira.jpg",
    title: "SIRA Certified",
    subtitle: "Dubai Trusted Standard",
    description: "Dubai trusted standard for professional security systems installation and maintenance. Ensure compliance and maximum protection with SIRA-approved solutions.",
  };

  return (
    <div>
      {/* Desktop Hero Section */}
      <section className="hidden md:block relative w-full h-screen flex items-center justify-start overflow-hidden">
        <Image
          src={Sira.src}
          alt="SIRA Hero"
          fill
          className="object-cover w-full h-full"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-opacity-40 flex items-center px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              <span className="block text-white">SIRA <span className='text-red-600'>Certified</span></span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
            >
              Dubai trusted standard for professional security systems installation and maintenance.
              Ensure compliance and maximum protection with SIRA-approved solutions.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >

            </motion.div>
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
            alt="SIRA Hero Mobile"
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

      {/* Simple Section with Left Content and Right Image */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-white to-slate-50/30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="max-w-2xl space-y-3 sm:space-y-4 relative z-10 order-2 lg:order-1"
            >
              <motion.div
                variants={scaleIn}
                className="inline-block"
              >

              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-xl sm:text-3xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 bg-clip-text text-transparent"
              >
                SIRA APPROVED DAHUA DISTRIBUTOR IN DUBAI
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base text-slate-600 leading-relaxed"
              >
                Discover Dahua-Dubai, a leading Dahua Distributor approved by SIRA, dedicated to delivering exceptional security solutions in Dubai. With a remarkable track record, we have been actively involved in SIRA Projects (formerly DPS) since 2018, specializing in the professional installation of state-of-the-art CCTV systems.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base text-slate-600 leading-relaxed"
              >
                Our expertise spans across diverse environments, encompassing hotels, shopping malls, restaurants, offices, shops, schools, warehouses, factories, as well as residential and commercial buildings.
              </motion.p>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
              className="relative order-1 lg:order-2  lg:mb-0"
            >
              <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={Siraa.src}
                  alt="SIRA Certified Building"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is SIRA Section - Enhanced without image */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-48 h-48 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-16 right-16 w-56 h-56 bg-slate-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-red-700 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="text-center mb-12 sm:mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6"
              >
                What is SIRA and SIRA Certification?
              </motion.h2>
              <motion.div
                variants={scaleIn}
                className="h-1 w-24 sm:w-32 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto"
              ></motion.div>
            </motion.div>

            <div className="gap-8 sm:gap-12 items-stretch">
              {/* Left Content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="space-y-6 flex flex-col"
              >
                <motion.div
                  variants={fadeInLeft}
                  className="rounded-2xl p-6 sm:p-8 w-full"
                >
                  <div className="w-full">
                    <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6 ">
                      {displayedText1}
                      {isTyping && currentParagraph === 0 && (
                        <span className="ml-1 inline-block w-2 h-5 bg-red-400 animate-pulse"></span>
                      )}
                    </p>

                    <p className="text-base sm:text-lg text-slate-200 leading-relaxed ">
                      {displayedText2}
                      {isTyping && currentParagraph === 1 && (
                        <span className="ml-1 inline-block w-2 h-5 bg-red-400 animate-pulse"></span>
                      )}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-red-50/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="text-center mb-16 sm:mb-20"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-slate-900"
            >
              Benefits of Choosing Our SIRA-Approved <span className='text-red-600'>Services</span>
            </motion.h2>
            <motion.p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Experience unparalleled security solutions backed by SIRA certification and industry expertise
            </motion.p>
            <motion.div
              variants={scaleIn}
              className="h-1.5 w-32 sm:w-40 bg-gradient-to-r from-red-600 to-red-400 rounded-full mx-auto mt-8"
            ></motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Enhanced Security',
                text: 'State-of-the-art SIRA-certified safety systems providing comprehensive protection for your premises.'
              },
              {
                icon: Wrench,
                title: 'Regular Maintenance',
                text: 'Proactive SIRA-approved maintenance ensuring optimal performance of your security infrastructure.'
              },
              {
                icon: TrendingUp,
                title: 'Latest Solutions',
                text: 'Advanced security systems utilizing cutting-edge SIRA-compliant technology and equipment.'
              },
              {
                icon: Award,
                title: 'Proven Credibility',
                text: 'Distinguished SIRA certification validating our commitment to excellence in security services.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="bg-white p-8 shadow-lg flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(255,0,0,0.4)]"
              >
                <div className="mb-6 p-4 rounded-full bg-red-50">
                  <benefit.icon className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SiraPage;