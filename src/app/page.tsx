import { Metadata } from 'next';  
import Home from "./components/Home";

export const metadata: Metadata = {
  title: 'Dahua Dubai: Authorized Dahua Distributor In Dubai UAE',
  description: 'Dahua Dubai offers premium security solutions, CCTV systems, and innovative digital surveillance products. Explore our cutting-edge security technology and professional services.',
  keywords: 'Dahua Dubai, Dahua security systems, CCTV Dubai, surveillance cameras UAE, security solutions Dubai, Dahua technology, security equipment UAE',
  openGraph: {
    title: 'Dahua Dubai - Premium Security Solutions & CCTV Systems in UAE',
    description: 'Dahua Dubai offers premium security solutions, CCTV systems, and innovative digital surveillance products. Explore our cutting-edge security technology and professional services.',
    type: 'website',
    url: 'https://dahua-dubai.com',
    images: [{
      url: '/images/dahualogo-removebg-preview.png',
      width: 1200,
      height: 630,
      alt: 'Dahua Technologies - Advanced Security Solutions',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dahua Dubai - Premium Security Solutions & CCTV Systems in UAE',
    description: 'Dahua Dubai offers premium security solutions, CCTV systems, and innovative digital surveillance products. Explore our cutting-edge security technology and professional services.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
<Home/>
  )
}