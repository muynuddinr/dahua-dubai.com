'use client'
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, Shield, Users, Building, Star, Navigation, Camera } from 'lucide-react';
import Image from 'next/image';
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.phone,
                    companyName: formData.company,
                    subject: formData.subject,
                    message: formData.message,
                    enquiryType: 'general',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccessModal(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    subject: '',
                    message: ''
                });
                // Auto close modal after 5 seconds
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 5000);
            } else {
                setErrorMessage(data.message || 'Failed to submit enquiry. Please try again.');
            }
        } catch (error) {
            setErrorMessage('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants with proper TypeScript types
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
            }
        }
    };

    const fadeInLeft: Variants = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
            }
        }
    };

    const fadeInRight: Variants = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
            }
        }
    };// Banner animations
    const bannerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1.5,
                ease: 'easeInOut',
            },
        },
    }

    const lineVariants: Variants = {
        hidden: { width: 0 },
        visible: {
            width: '6rem',
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.4,
            },
        },
    }

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

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
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

    const mobileBannerData = {
        image: "/mobile/contact.jpg",
        title: "Contact Us",
        subtitle: "Get In Touch",
        description: "Ready to discuss your enquiry? Fill out the form and we will respond within 24 hours.",
    };

    // Update your input styles
    const getInputStyles = (hasError: boolean) => `
  w-full px-4 py-3 border
  ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#ea2227]'}
  rounded-xl 
  focus:outline-none
  focus:ring-1
  focus:border-[#ea2227] 
  transition-all
  bg-white 
  text-slate-900 
  hover:border-[#ea2227]/50
`


    return (
        <div className="relative min-h-screen">
            {/* Hero Section */}
            {/* Desktop Hero Section */}
            <section className="hidden md:block relative w-full h-screen flex items-center justify-start overflow-hidden">
                <style jsx global>{`
          html,
          body {
            max-width: 100%;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={bannerVariants}
                    className="absolute inset-0 w-full h-full"
                >
                    <Image
                        src="/images/Contact Us.png"
                        alt="Contact Hero"
                        fill
                        className="object-cover w-full h-full"
                        priority
                        quality={100}
                    />
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent flex items-center"
                >
                    <div className="max-w-4xl px-10 space-y-6">
                        <motion.h1
                            custom={0}
                            variants={textVariants}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
                        >
                            <span className="block">Contact <span className="text-red-600">Us</span></span>

                        </motion.h1>

                        <motion.p
                            custom={1}
                            variants={textVariants}
                            className="text-base md:text-lg text-gray-100 max-w-3xl leading-snug"
                            style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.8)' }}
                        >
                            Ready to discuss your enquiry? Fill out the form below and we will respond within 24
                            hours with a personalized consultation.
                        </motion.p>
                    </div>
                </motion.div>
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
                        alt="Contact Hero Mobile"
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

            {/* Split Layout Section */}
            <section className="py-20 bg-white" id="contact-form-section">
                <div className="flex flex-col lg:flex-row min-h-[80vh] rounded-3xl overflow-hidden shadow-2xl mx-4 lg:mx-8">
                    {/* Left Side - Contact Info */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-[#8B0000] via-[#A52A2A] to-[#DC143C] text-white p-8 lg:p-12 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:10px_10px]" />
                        </div>

                        <div className="h-full flex flex-col justify-between relative z-10">
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-4xl lg:text-5xl font-bold mb-6"
                                >
                                    Let's Secure Your Space
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-white/90 text-lg mb-12"
                                >
                                    Professional security solutions with Dahua Technology. Get in touch with our experts today.
                                </motion.p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: MapPin,
                                            title: "Dubai Office",
                                            subtitle: "Al Barsha, Dubai, UAE",
                                            description: "United Arab Emirates"
                                        },
                                        {
                                            icon: Phone,
                                            title: "+971 552929644",
                                        
                                            description: "Available 24/7 for emergencies"
                                        },
                                        {
                                            icon: Mail,
                                            title: "sales@dahua-dubai.com",
                                            subtitle: "sales@dahua-dubai.com",
                                            description: "We reply within 2 hours"
                                        },
                                        {
                                            icon: Clock,
                                            title: "Business Hours",
                                            subtitle: "Sun - Thu: 8:00 AM - 6:00 PM",
                                            description: "Friday: 9:00 AM - 1:00 PM"
                                        }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-sm">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <p className="text-white/90">{item.subtitle}</p>
                                                <p className="text-white/70 text-sm">{item.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="mt-12"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <Shield className="w-8 h-8 text-white" />
                                    <h3 className="font-bold text-xl">Why Choose Us?</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-white" />
                                        <p className="text-sm">Expert Team</p>
                                    </div>
                                    <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                                        <Camera className="w-6 h-6 mx-auto mb-2 text-white" />
                                        <p className="text-sm">Dahua Certified</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="lg:w-3/5 bg-white p-8 lg:p-12 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="w-full max-w-2xl"
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Start Your Enquiry
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Fill out the form below and our security experts will contact you
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {errorMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xl font-bold">✕</span>
                                            </div>
                                            <p className="text-red-700 font-medium">{errorMessage}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={getInputStyles(false)}
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={getInputStyles(false)}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className={getInputStyles(false)}
                                            placeholder="+971 XXX XXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className={getInputStyles(false)}
                                            placeholder="Your company name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={getInputStyles(false)}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="cctv-installation">CCTV Installation</option>
                                        <option value="security-consultation">Security Consultation</option>
                                        <option value="product-inquiry">Product Inquiry</option>
                                        <option value="technical-support">Technical Support</option>
                                        <option value="maintenance">Maintenance Services</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className={getInputStyles(false)}
                                        placeholder="Tell us about your security requirements and enquiry details..."
                                    />
                                </div>

                                <div className="flex justify-center"> {/* Add this wrapper div */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`inline-flex rounded-full items-center gap-3 px-7 py-3 border-2 ${isSubmitting
                                            ? 'bg-gray-400 border-gray-400 cursor-not-allowed text-white'
                                            : 'border-black text-black bg-transparent hover:bg-red-600 hover:border-red-600 hover:text-white'
                                            } transition-all duration-300 font-semibold group text-base`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Map & Location Section */}
            <section className="relative py-20 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
                            Visit Our <span className="text-[#ea2227]">Showroom</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Come see our latest Dahua security products and solutions in person at our Dubai showroom.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50"
                    >
                        {/* Enhanced Interactive Map Section */}
                        <div className="h-96 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0f0f] relative overflow-hidden">
                            {/* Dubai Skyline Background */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/60">
                                {/* Building Silhouettes */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent">
                                    {/* Burj Khalifa */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-24 bg-gradient-to-t from-yellow-500/20 to-yellow-300/40 rounded-t-lg">
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400/60 rounded-full" />
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-yellow-400/40 rounded-full" />
                                    </div>

                                    {/* Surrounding Buildings */}
                                    <div className="absolute bottom-0 left-1/4 w-6 h-16 bg-gradient-to-t from-blue-500/20 to-blue-300/30 rounded-t-lg" />
                                    <div className="absolute bottom-0 left-1/3 w-5 h-20 bg-gradient-to-t from-green-500/20 to-green-300/30 rounded-t-lg" />
                                    <div className="absolute bottom-0 right-1/4 w-6 h-14 bg-gradient-to-t from-purple-500/20 to-purple-300/30 rounded-t-lg" />
                                    <div className="absolute bottom-0 right-1/3 w-5 h-18 bg-gradient-to-t from-red-500/20 to-red-300/30 rounded-t-lg" />
                                </div>

                                {/* Animated City Lights */}
                                <div className="absolute bottom-8 left-0 right-0 flex justify-around">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1 h-1 bg-yellow-300 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Location Marker */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                className="h-[450px] w-full relative"
                            >
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7215.497384021633!2d55.324346!3d25.279038!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cb74997acd3%3A0x497aa605b636b17e!2s25th%20St%20-%20Deira%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1763631637806!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Company Location Map"
                                />
                            </motion.div>

                            {/* Interactive Info Card */}


                            {/* Floating Security Icons */}

                        </div>
                    </motion.div>

                    {/* Enhanced Location Features */}

                </div>
            </section>

            {/* CTA Section */}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowSuccessModal(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-3">
                                Thank You!
                            </h3>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We have received your enquiry. Soon we will reach out to you. Thank you!
                            </p>

                            {/* Decorative Elements */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="w-2 h-2 bg-red-500 rounded-full"
                                    />
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Contact;