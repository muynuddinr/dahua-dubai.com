'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, Variants } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    title: 'Dahuas security solution transformed our entire campus safety approach.',
    text: 'The team at Dahua delivered a highly advanced and reliable security system for our campus. With high-resolution cameras, intuitive software, and intelligent monitoring features, managing campus safety has never been easier or more efficient.',
    additionalText:
      'Their professionalism and attention to detail truly exceeded our expectations.',
    name: 'Michael Johnson',
    role: 'Security Director',
    company: 'West Valley College',
    avatar: '/images/avatar/1.jpg',
  },
  {
    id: 2,
    title:
      'I’m thrilled with the results, continuous innovation, and unwavering commitment from Dahua.',
    text: 'Dahuas AI-powered system drastically reduced false alarms by 87%. Their support throughout our rollout and continued maintenance has been top-notch. The platform is robust, easy to use, and makes daily operations seamless.',
    additionalText: 'Its rare to find a partner so committed to long-term success.',
    name: 'Sarah Williams',
    role: 'Operations Manager',
    company: 'Metro Shopping Centers',
    avatar: '/images/avatar/2.jpg',
  },
  {
    id: 3,
    title: 'They created a smart, connected system tailored perfectly for our facility.',
    text: 'The Dahua team developed a secure, modern surveillance network that gives us full visibility into our daily operations. The intelligent system is integrated with our main control hub, ensuring constant communication and streamlined service management.',
    additionalText: 'We ve seen a noticeable improvement in our security workflow.',
    name: 'David Chen',
    role: 'CTO',
    company: 'Nexus Technologies',
    avatar: '/images/avatar/3.jpg',
  },
]

export default function TestimonialSlider() {
  const [visibleTestimonials, setVisibleTestimonials] = useState(new Set())
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      testimonials.forEach((_, index) => {
        setTimeout(() => {
          setVisibleTestimonials((prev) => new Set([...prev, index]))
        }, index * 600) // Stagger each testimonial by 600ms
      })
    }
  }, [isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants:Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }
  const lineVariants:Variants = {
    hidden: { width: 0 },
    visible: {
      width: '6rem',
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.3,
      },
    },
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients <span className='text-red-600'>Say</span>
            </h2>
            <motion.div
              variants={lineVariants}
              className="w-24 h-1 bg-red-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            />
            <p className="text-lg text-gray-600">Trusted by leading organizations worldwide</p>
          </div>

          {/* Testimonials Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Quote Icon */}
                <div className="text-4xl text-red-600 opacity-30 mb-4" aria-hidden="true"></div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-tight">
                  {testimonial.title}
                </h3>

                {/* Main Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.text}</p>

                {/* Additional Text if exists */}
                {testimonial.additionalText && (
                  <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.additionalText}</p>
                )}

                {/* Author Info */}
                <div className="flex items-center space-x-4 mt-6">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://source.unsplash.com/random/48x48?sig=${index}`}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                    <p className="text-xs font-medium text-red-600">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
