"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Focus, Zap, Camera, Crosshair, Target, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white rounded-xl p-8 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
    >
      <div
        className={`${iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-6`}
      >
        <Icon size={32} className={iconColor} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function PredictiveFocusPage() {
  const [isLoaded, setIsLoaded] = useState(false)


  const shouldReduceMotion = useReducedMotion();
  useEffect(() => {
    setIsLoaded(true);
  }, []);
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
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const mobileBannerData = {
    image: "/mobile/tech/predictive-focus.jpg",
    title: "Predictive Focus",
    subtitle: "Algorithm",
    description:
      "Next-generation AI-powered focusing technology that predicts focus requirements before they are needed, ensuring crystal-clear capture with unprecedented accuracy.",
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };
  const Counter = ({
    value,
    suffix = "",
    duration = 2,
  }: {
    value: string;
    suffix?: string;
    duration?: number;
  }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5,
    });
    useEffect(() => {
      setIsLoaded(true);
    }, []);

    useEffect(() => {
      if (inView) {
        let start = 0;
        const numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
        const incrementTime = (duration * 1000) / numericValue;

        const timer = setInterval(() => {
          start += 1;
          setCount(start);
          if (start >= numericValue) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
      }
    }, [inView, value, duration]);

    return (
      <div ref={ref}>
        <div className="text-3xl font-bold text-red-600 mb-2">
          {count}
          {suffix}
        </div>
      </div>
    );
  };
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
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="/images/Predictive.jpg"
            alt="Predictive Focus Algorithm"
            className="object-cover w-full h-full absolute inset-0"
            style={{ zIndex: 0 }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-opacity-30"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl px-10 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-5xl font-bold text-white leading-tight"
            >
              <span className="block">Predictive Focus</span>
              <span className="block text-red-500">Algorithm</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
            >
              Next-generation AI-powered focusing technology that predicts focus
              requirements before they are needed, ensuring crystal-clear
              capture with unprecedented accuracy.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Mobile Hero Section */}
      <motion.section
        className="md:hidden relative w-full h-96 flex items-center justify-center"
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
        <div className="absolute inset-0 bg-black/60"></div>
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
            <p className="text-sm text-gray-100 leading-snug max-w-md mx-auto">
              {mobileBannerData.description}
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Video Section */}
      <motion.section
        className="mt-16 bg-white p-8 shadow-lg"
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
                PFA <span className="text-red-500">Technology Demo</span>
              </h2>
              <p className="text-xl text-gray-600 mx-auto mb-12">
                Experience the power of predictive focus with intelligent AI
                algorithms
              </p>

              {/* Video Container */}
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <video
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  controls
                  src="https://www.dahuasecurity.com/asset/upload/video/Predictive_Focus_Algorithm_(PFA).mp4"
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
                    title: "AI-Powered Prediction",
                    description:
                      "Advanced algorithms that predict focus requirements before they are needed for seamless operation",
                  },
                  {
                    title: "Real-time Processing",
                    description:
                      "Lightning-fast focus adjustment with 0.1s response time for moving subjects and dynamic scenes",
                  },
                  {
                    title: "Precision Accuracy",
                    description:
                      "Crystal-clear focus with 99.9% accuracy rate across all lighting conditions and scenarios",
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

      {/* Key Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Key <span className="text-red-500">Features</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 px-4">
              Advanced capabilities that deliver precision focusing and
              intelligent automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Predictive Focus",
                description:
                  "Advanced AI algorithms predict focus requirements before they are needed, ensuring sharp images with minimal lag and maximum precision.",
                icon: (
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 2v2m0 16v2M2 12h2m16 0h2"
                    />
                  </svg>
                ),
              },
              {
                title: "Smart Learning",
                description:
                  "Deep learning technology enables intelligent scene analysis and focus pattern recognition for enhanced performance across scenarios.",
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Ultra-Fast Response",
                description:
                  "Lightning-fast processing enables immediate focus adjustment with smooth transitions and minimal delay for moving subjects.",
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
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 text-center shadow-lg hover:shadow-[0_4px_12px_rgba(255,0,0,0.5)] transition-all duration-300 border border-gray-200"
              >
                {feature.icon}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
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

      {/* Focus Modes */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Focus <span className="text-red-500">Modes</span>
              </h2>
              <p className="text-xl text-gray-600 mx-auto">
                Flexible focusing options for different operational requirements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Predictive Mode */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/predictive/Predictive mode.jpg"
                    alt="Predictive Focus Mode"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-emerald-50 p-3 rounded-full mr-4">
                    <Crosshair className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Predictive Mode
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered predictive focusing that anticipates focus
                  requirements before they occur, ensuring sharp images with
                  zero lag and maximum accuracy.
                </p>
              </motion.div>

              {/* Adaptive Mode */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="rounded-xl overflow-hidden mb-6">
                  <Image
                    src="/predictive/Adaptive Mode.jpg"
                    alt="Adaptive Focus Mode"
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-50 p-3 rounded-full mr-4">
                    <Eye className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Adaptive Mode
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Intelligent adaptive focusing that learns from scene
                  conditions and automatically adjusts focus parameters for
                  optimal performance in changing environments.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Advanced Capabilities */}
      <motion.section
        className="py-20 text-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto mb-12 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Advanced <span className="text-gray-700">Capabilities</span>
              </h2>
              <p className="text-xl text-gray-600">
                Cutting-edge features for professional imaging and surveillance
                applications
              </p>
            </motion.div>

            {/* First Section: Application Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Forensic Analysis",
                  description:
                    "Crystal-clear evidence capture with zero focus drift during critical investigations",
                  image: "/predictive/23.jpg",
                },
                {
                  title: "Security Monitoring",
                  description:
                    "Continuous sharp surveillance with automatic focus adjustment for moving subjects",
                  image: "/predictive/24.jpg",
                },
                {
                  title: "Traffic Surveillance",
                  description:
                    "Perfect license plate capture and vehicle identification at all distances",
                  image: "/predictive/25.jpg",
                },
              ].map((app, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white  shadow-lg hover:shadow-[0_4px_12px_rgba(255,0,0,0.5)] transition-all duration-300 overflow-hidden  transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={app.image}
                      alt={app.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {app.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{app.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
