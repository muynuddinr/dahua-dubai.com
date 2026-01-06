'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumb({ title }: { title: string }) {
  const pathname = usePathname()

  const pathParts = pathname.split('/').filter((part) => part)

  // Only show breadcrumb if path starts with 'products' and is deeper than just /products
  const isProductDetailPage = pathParts[0] === 'products' && pathParts.length > 1

  if (!isProductDetailPage) return null

  const breadcrumbs = pathParts.slice(0, -1).map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/')
    const formatted = decodeURIComponent(part)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return (
      <li key={href} className="flex items-center">
        <span className="mx-2 text-black text-sm">›</span>
        <Link href={href} className="text-black hover:text-blue-600 transition-colors capitalize">
          {formatted}
        </Link>
      </li>
    )
  })

  return (
    <nav className="breadcrumb-nav flex mb-6 text-black pt-32" aria-label="Breadcrumb">
      <ol className="inline-flex items-center text-sm flex-wrap">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <i className="fas fa-home mr-1.5 text-xs" />
            Home
          </Link>
        </li>

        {breadcrumbs}

        <li className="flex items-center" aria-current="page">
          <span className="mx-2 text-gray-400 text-sm">›</span>
          <span className="text-blue-500 capitalize">{title}</span>
        </li>
      </ol>
    </nav>
  )
}
