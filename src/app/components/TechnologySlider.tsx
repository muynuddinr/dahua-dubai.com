"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import desktop images
import FullColorImg from "./slider/Fullcolor.png";
import WizSenseImg from "./slider/Wizsense.png";
import AutoTrackingImg from "./slider/Autotracking.png";
import PredictiveFocusImg from "./slider/Predictivefocus.png";
import WizMindImg from "./slider/Wizmind.png";
import HDCVITenImg from "./slider/Hdcviten.png";

export default function TechnologySlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  const slides = [
    {
      title: "Full Color Technology",
      description:
        "Dahua's full-color technology brings vivid imagery, capturing details with vibrant color reproduction for enhanced surveillance solutions.",
      image: FullColorImg,
      mobileImage: FullColorImg,
      link: "/technologies/full-color",
    },
    {
      title: "WizSense Technology",
      description:
        "WizSense Technology revolutionizes AI by integrating advanced sensing capabilities for intelligent systems across various applications.",
      image: WizSenseImg,
      mobileImage: WizSenseImg,
      link: "/technologies/wizsense",
    },
    {
      title: "Auto Tracking Technology",
      description:
        "Auto Tracking provides seamless target following with intelligent algorithms to detect and track moving objects with precision accuracy.",
      image: AutoTrackingImg,
      mobileImage: AutoTrackingImg,
      link: "/technologies/auto-tracking",
    },
    {
      title: "Predictive Focus Algorithm",
      description:
        "Predictive Focus uses machine learning to maintain optimal focus on moving subjects, ensuring clear imagery in dynamic surveillance scenarios.",
      image: PredictiveFocusImg,
      mobileImage: PredictiveFocusImg,
      link: "/technologies/predictive-focus",
    },
    {
      title: "WizMind Technology",
      description:
        "WizMind combines deep learning with powerful processing to deliver intelligent video analytics and proactive security solutions.",
      image: WizMindImg,
      mobileImage: WizMindImg,
      link: "/technologies/wizmind",
    },
    {
      title: "HDCVI TEN Technology",
      description:
        "Dahua's HDCVI TEN brings AI-for-all, Scheduled AI, Smart Dual Illuminators and real 5MP 16:9 over coax for safer, smarter living.",
      image: HDCVITenImg,
      mobileImage: HDCVITenImg,
      link: "/technologies/hdcvi-ten",
    },
  ];

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload images and check for errors
  useEffect(() => {
    const preloadImages = async () => {
      const results = await Promise.all(
        slides.map(async (slide, index) => {
          try {
            const img = new Image();
            const imageToLoad = isMobile ? slide.mobileImage : slide.image;
            const imageSrc =
              typeof imageToLoad === "string" ? imageToLoad : imageToLoad.src;
            img.src = imageSrc;

            return new Promise<boolean>((resolve) => {
              img.onload = () => {
                console.log(`✓ Loaded: ${slide.title} - ${imageSrc}`);
                resolve(true);
              };
              img.onerror = () => {
                console.error(`✗ Failed to load: ${slide.title} - ${imageSrc}`);
                setImageErrors((prev) => [
                  ...prev,
                  `${slide.title}: ${imageSrc}`,
                ]);
                resolve(false);
              };
            });
          } catch (error) {
            console.error(`Error loading image ${slide.title}:`, error);
            return false;
          }
        })
      );

      setLoadedImages(results);

      // Log summary
      const loadedCount = results.filter(Boolean).length;
      console.log(
        `Image loading summary: ${loadedCount}/${slides.length} loaded successfully`
      );

      if (imageErrors.length > 0) {
        console.error("Failed images:", imageErrors);
      }
    };

    preloadImages();
  }, [isMobile]);

  // Auto-play slides every 3 seconds
  useEffect(() => {
    if (autoPlayPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlayPaused, slides.length]);

  const nextSlide = () => {
    setAutoPlayPaused(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setAutoPlayPaused(false), 5000);
  };

  const prevSlide = () => {
    setAutoPlayPaused(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setAutoPlayPaused(false), 5000);
  };

  const goToSlide = (index: number) => {
    setAutoPlayPaused(true);
    setCurrentSlide(index);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setAutoPlayPaused(false), 5000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden min-h-screen">
      {/* Debug info - remove in production */}
      {imageErrors.length > 0 && (
        <div className="fixed top-4 left-4 right-4 bg-red-900/90 text-white p-4 rounded-lg z-50 text-sm max-w-md">
          <div className="font-bold mb-2">Image Loading Errors:</div>
          {imageErrors.map((error, index) => (
            <div key={index} className="text-xs mb-1">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Indicator dots - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10">
        <div className="relative flex flex-col items-center gap-6 lg:gap-8 py-4 lg:py-6 h-[300px] lg:h-[400px] justify-center">
          {/* Static vertical line */}
          <span
            className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 bg-white/20 pointer-events-none"
            aria-hidden="true"
          />
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-300 ease-out w-7 h-7 ${
                currentSlide === index
                  ? "bg-white text-gray-900 font-bold shadow-md"
                  : "bg-white/25 text-white hover:bg-white/35"
              }`}
            >
              <span className="font-medium text-xs">{index + 1}</span>
              {/* Show loading status indicator */}
              {loadedImages[index] === false && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile indicator dots */}
      <div className="lg:hidden absolute bottom-20 left-4 z-10">
        <div className="flex flex-col gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-colors duration-300 ease-out w-2.5 h-2.5 ${
                currentSlide === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full max-w-7xl mx-auto">
          {/* Left content */}
          <div className="lg:ml-9 relative h-[200px] sm:h-[280px] lg:h-[300px] order-2 lg:order-1">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full transition-all duration-700 ease-in-out ${
                  currentSlide === index
                    ? "opacity-100 translate-y-0 lg:translate-y-0 scale-100"
                    : isMobile
                    ? "opacity-0 scale-95"
                    : index < currentSlide
                    ? "opacity-0 -translate-y-full"
                    : "opacity-0 translate-y-full"
                }`}
              >
                <div className="text-white space-y-2 lg:space-y-4 text-center lg:text-left">
                  <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent px-2 lg:px-0">
                    {slide.title}
                    {/* Show error indicator */}
                    {loadedImages[index] === false && (
                      <span className="ml-2 text-xs text-red-400 align-middle">
                        (Image missing)
                      </span>
                    )}
                  </h1>
                  <p className="text-sm sm:text-lg text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0 px-2 lg:px-0">
                    {slide.description}
                  </p>
                  <div className="pt-1">
                    <a
                      href={slide.link}
                      className="group rounded-full
relative px-5 py-2 overflow-hidden border-2 border-white transition-all duration-300 mx-auto lg:mx-0 block w-fit"
                    >
                      <span className="relative z-10 text-white group-hover:text-gray-900 transition-colors duration-300 text-sm sm:text-base">
                        Learn More
                      </span>
                      <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right content - Single Image Display with different sizes for mobile */}
          <div className="relative flex justify-center items-center h-[350px] sm:h-[400px] lg:h-[500px] w-full order-1 lg:order-2 mb-4 lg:mb-0">
            <div className="relative w-[280px] h-[350px] sm:w-[300px] sm:h-[380px] lg:w-[320px] lg:h-[400px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 rounded-xl overflow-hidden pointer-events-none select-none transition-all duration-700 ${
                    currentSlide === index
                      ? "opacity-100 z-10 scale-100"
                      : "opacity-0 z-0 lg:scale-100 scale-95"
                  }`}
                >
                  {loadedImages[index] === false ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-xl">
                      <div className="text-center p-4">
                        <div className="text-white text-lg font-semibold mb-2">
                          Image not found
                        </div>
                        <div className="text-gray-300 text-sm">
                          {slide.title}
                        </div>
                        <div className="text-gray-400 text-xs mt-2">
                          Check:{" "}
                          {typeof slide.image === "string"
                            ? slide.image
                            : slide.image.src}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={
                        isMobile
                          ? typeof slide.mobileImage === "string"
                            ? slide.mobileImage
                            : slide.mobileImage.src
                          : typeof slide.image === "string"
                          ? slide.image
                          : slide.image.src
                      }
                      alt={slide.title}
                      className="w-full h-full object-cover rounded-xl"
                      loading="eager"
                      draggable="false"
                      onError={(e) => {
                        console.error(
                          `Failed to load image for: ${slide.title}`
                        );
                        e.currentTarget.style.display = "none";
                        // Show error state
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-xl">
                              <div class="text-center p-4">
                                <div class="text-white text-lg font-semibold mb-2">
                                  Failed to load image
                                </div>
                                <div class="text-gray-300 text-sm">
                                  ${slide.title}
                                </div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 lg:bottom-8 right-1/2 translate-x-1/2 flex gap-16 z-20">
        <button
          onClick={prevSlide}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="lg:w-6 lg:h-6" />
        </button>
      </div>
    </div>
  );
}