'use client'

import { usePathname } from 'next/navigation'
import Breadcrumb from './Breadcrumb'

export default function BreadcrumbWrapper() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] ?? ''

  const title = decodeURIComponent(lastSegment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  // Hide breadcrumb on home page (optional)
  if (pathname === '/') return null

  return <Breadcrumb title={title} />
}
