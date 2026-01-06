import { Metadata } from "next";
import SiraPage from "../components/Sira"

export const metadata: Metadata = {
  title: 'SIRA Certified Security Solutions Dubai - Approved CCTV Systems',
  description: 'Get SIRA certified security solutions in Dubai with approved CCTV systems, cameras, and surveillance equipment that meet SIRA regulations for commercial and residential properties.',
  keywords: 'SIRA certified Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. SIRA approved CCTV, SIRA regulations, security compliance Dubai, SIRA certified cameras, legal surveillance UAE, SIRA permit, approved security systems',
  openGraph: {
    title: 'SIRA Certified Security Solutions Dubai - Approved CCTV Systems',
    description: 'Get SIRA certified security solutions in Dubai with approved CCTV systems, cameras, and surveillance equipment that meet SIRA regulations for commercial and residential properties.',
    type: 'website',
    url: 'https://dahua-dubai.com/sira',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'SIRA Certified Security Solutions - Approved CCTV Systems',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SIRA Certified Security Solutions Dubai - Approved CCTV Systems',
    description: 'Get SIRA certified security solutions in Dubai with approved CCTV systems, cameras, and surveillance equipment that meet SIRA regulations.',
    images: ['/images/dahualogo-removebg-preview0.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dahua-dubai.com/sira',
  },
};

export default function Page() {
  return (
    <main>
      <SiraPage />
    </main>
  );
}