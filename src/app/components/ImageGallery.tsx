'use client'
import { useState } from 'react'
import Image from 'next/image'
export default function ImageGallery({
  image,
  images,
  title,
}: {
  image: string
  images?: { url: string; caption?: string }[]
  title: string
}) {
  const [main, setMain] = useState(image)
  const [loading, setLoading] = useState(false)

  const handleClick = (url: string) => {
    setLoading(true)
    const img = new window.Image()
    img.onload = () => {
      setMain(url)
      setLoading(false)
    }
    img.src = url
  }

  return (
    <div className="image-gallery p-6 bg-white" data-scroll="fade-right" data-scroll-delay="300">
      <div
        className="main-image-container bg-gray-50 rounded-lg overflow-hidden relative group mb-4 flex items-center justify-center"
        style={{ minHeight: '320px' }}
      >
        {loading && <div className="image-loader absolute inset-0 bg-gray-200 animate-pulse" />}
        <img
          src={main}
          alt={title}
          className="main-image w-full max-w-[480px] h-80 object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      {images?.length && (
        <div className="thumbnail-gallery grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              className={`thumbnail-btn bg-gray-50 rounded-md border border-gray-200 overflow-hidden transition-all duration-200 ${main === img.url ? 'active' : ''}`}
              onClick={() => handleClick(img.url)}
              data-scroll="fade-up"
              data-scroll-delay={100 + i * 50}
            >
              <Image
                src={img.url}
                alt={img.caption || `${title} – Image ${i + 1}`}
                width={200}
                height={64}
                className="w-full h-16 object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
