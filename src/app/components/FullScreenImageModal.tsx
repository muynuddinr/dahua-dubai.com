'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback, useRef } from 'react'

type FullScreenImageModalProps = {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
}

export default function FullScreenImageModal({
  isOpen,
  onClose,
  src,
  alt,
}: FullScreenImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset zoom and position when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }, [isOpen])

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.3 : 0.3 // Increased zoom increment
      const newScale = Math.min(Math.max(scale + delta, 0.25), 10) // Increased max zoom to 10x
      setScale(newScale)

      // Reset position when zooming out to minimum
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 })
      }
    },
    [scale],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        e.preventDefault()
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [scale, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Increased drag distance based on zoom level and container size
        const maxDrag = (scale - 1) * 600 // Increased from 400 to 600 for even more panning range
        setPosition({
          x: Math.min(Math.max(newX, -maxDrag), maxDrag),
          y: Math.min(Math.max(newY, -maxDrag), maxDrag),
        })
      }
    },
    [isDragging, scale, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (scale > 1) {
        // Reset zoom and position
        setScale(1)
        setPosition({ x: 0, y: 0 })
      } else {
        // Zoom in to 3x for better detail viewing
        setScale(3)
      }
    },
    [scale],
  )

  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.5, 10) // Increased max zoom to 10x
    setScale(newScale)
  }, [scale])

  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.5, 0.25) // Increased decrement and lower min zoom
    setScale(newScale)
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 })
    }
  }, [scale])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={zoomIn}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              disabled={scale >= 10} // Updated to match new max zoom
              aria-label="Zoom in"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              onClick={zoomOut}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              disabled={scale <= 0.25} // Updated to match new min zoom
              aria-label="Zoom out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            <button
              onClick={resetZoom}
              className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
              aria-label="Reset zoom"
            >
              1:1
            </button>
          </div>

          {/* Zoom level indicator */}
          <div className="absolute bottom-4 right-4 z-20 px-3 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
            {Math.round(scale * 100)}%
          </div>

          {/* Image container */}
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative max-w-[90vw] max-h-[90vh] w-auto h-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <motion.div
              animate={{
                scale: scale,
                x: position.x,
                y: position.y,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full h-full flex items-center justify-center"
            >
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                className="w-full h-full object-contain select-none"
                priority
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* Instructions text */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
            <div>Mouse wheel to zoom • Double-click to toggle zoom • Drag to pan when zoomed</div>
            <div>Press ESC or click outside to close</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
