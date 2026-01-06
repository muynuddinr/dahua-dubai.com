'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

type ZoomImageProps = {
  src: string
  alt: string
  width: number
  height: number
  onClick?: () => void
}

export default function ZoomImage({ src, alt, width, height, onClick }: ZoomImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <motion.div
      ref={containerRef}
      className="w-full h-full object-contain p-4 sm:p-4 cursor-pointer overflow-hidden relative"
    >
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full h-full flex items-center justify-center"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  )
}
