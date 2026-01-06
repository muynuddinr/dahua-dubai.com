import { Metadata } from "next";
import RetailSolutionPage from "./Main"

export const metadata: Metadata = {
  title: 'Retail Security Solutions Dubai - Store Surveillance & Analytics',
  description: 'Comprehensive retail security solutions in Dubai including POS monitoring, customer analytics, loss prevention, inventory tracking, and smart surveillance for retail stores and shopping malls.',
  keywords: 'retail security Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. store surveillance, POS monitoring, customer analytics, loss prevention, inventory tracking, retail analytics, shopping mall security, retail CCTV solutions',
  openGraph: {
    title: 'Retail Security Solutions Dubai - Store Surveillance & Analytics',
    description: 'Comprehensive retail security solutions in Dubai including POS monitoring, customer analytics, loss prevention, inventory tracking, and smart surveillance for retail stores and shopping malls.',
    type: 'website',
    url: 'https://dahua-dubai.com/retail',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Retail Security Solutions - Store Surveillance & Analytics',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retail Security Solutions Dubai - Store Surveillance & Analytics',
    description: 'Comprehensive retail security solutions in Dubai including POS monitoring, customer analytics, loss prevention, inventory tracking, and smart surveillance.',
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
    canonical: 'https://dahua-dubai.com/retail',
  },
};

export default function Page() {
  return (
    <main>
      <RetailSolutionPage />
    </main>
  );
}