import { Metadata } from "next";
import WizMindPage from "./Main";

export const metadata: Metadata = {
  title: 'WizMind AI Security Solutions Dubai - Advanced Video Analytics',
  description: 'Discover WizMind AI-powered security solutions in Dubai featuring advanced video analytics, people counting, facial recognition, and intelligent monitoring for smart cities and businesses in UAE.',
  keywords: 'WizMind Dubai, AI video analytics,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. people counting, facial recognition, smart city solutions, business intelligence, Dahua WizMind UAE, advanced surveillance Dubai, AI CCTV analytics',
  openGraph: {
    title: 'WizMind AI Security Solutions Dubai - Advanced Video Analytics',
    description: 'Discover WizMind AI-powered security solutions in Dubai featuring advanced video analytics, people counting, facial recognition, and intelligent monitoring for smart cities and businesses in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/wizmind',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'WizMind AI Solutions - Advanced Video Analytics',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WizMind AI Security Solutions Dubai - Advanced Video Analytics',
    description: 'Discover WizMind AI-powered security solutions in Dubai featuring advanced video analytics, people counting, facial recognition, and intelligent monitoring.',
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
    canonical: 'https://dahua-dubai.com/wizmind',
  },
};

export default function Page() {
  return (
    <main>
      <WizMindPage />
    </main>
  );
}