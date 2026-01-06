"use client";

import {
  motion,
  useInView,
} from "framer-motion";
import { useRef } from "react";
import Authorize from "../../../public/images/authorized.png";

export default function DahuaDubaiPage() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" });
  const isImageInView = useInView(imageRef, { once: true, margin: "-100px" });

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-red-50/30 overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Title with animated underline */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              Authorized<span className="text-red-600"> Dahua</span>{" "}
              <span className="text-gray-900">Distributor in Dubai</span>
            </h1>
            <motion.div
              className="w-24 h-1 bg-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            />
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-10 items-center overflow-hidden">
            {/* Left Side - Full Image Section */}
            <motion.div
              ref={imageRef}
              className="relative rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px] lg:min-h-[500px]"
              initial={{ opacity: 0, x: -60 }}
              animate={isImageInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={Authorize.src}
                alt="Dahua Authorized Distributor"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Right Side - Professional Content */}
            <motion.div
              ref={contentRef}
              className="space-y-6 overflow-hidden"
              initial={{ opacity: 0, x: 60 }}
              animate={
                isContentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <p className="text-gray-700 leading-relaxed text-base">
                  <span className="font-semibold text-gray-900">What's Up with Dahua-Dubai?</span>{" "}
                  As the Diamond Distribution Partner for Dahua Technology in Dubai, we provide comprehensive surveillance solutions ranging from individual cameras to integrated security systems.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <p className="text-gray-700 leading-relaxed text-base">
                  Located in the heart of Dubai, UAE, our showroom features the complete range of Dahua products. We specialize in delivering enterprise-grade surveillance technology to corporations, educational institutions, and government entities.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="relative"
              >
                <p className="text-gray-700 leading-relaxed text-base">
                  <span className="font-semibold text-gray-900">Dahua Product Portfolio</span>{" "}
                  Our extensive inventory is meticulously curated to address diverse security requirements. We have established our reputation as Dubai's premier security solutions provider for organizations of all scales.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <p className="text-gray-700 leading-relaxed text-base">
                  <span className="font-semibold text-gray-900">Seeking Dahua Solutions in Dubai?</span>{" "}
                  For consultation with our certified security experts, contact us at +971552929644. We are committed to delivering excellent service and technical support.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}