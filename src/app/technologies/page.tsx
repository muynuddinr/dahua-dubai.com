import { Metadata } from "next";
import Main from './Main';

export const metadata: Metadata = {
  title: 'Dahua Security Technologies Dubai - AI-Powered Surveillance Solutions',
  description: 'Discover Dahua Dubai cutting-edge security technologies: Auto-Tracking, Full-Color Vision, HDVCI-TEN, Predictive Focus, WizMind AI, and WizSense. Advanced surveillance solutions for UAE.',
  keywords: 'Dahua technologies Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. Auto-Tracking cameras, Full-Color Vision night, HDVCI-TEN transmission, Predictive Focus, WizMind AI analytics, WizSense security, Dahua AI solutions UAE, smart surveillance Dubai, CCTV technology',
  openGraph: {
    title: 'Dahua Security Technologies Dubai - AI-Powered Surveillance Solutions',
    description: 'Discover Dahua Dubai cutting-edge security technologies: Auto-Tracking, Full-Color Vision, HDVCI-TEN, Predictive Focus, WizMind AI, and WizSense. Advanced surveillance solutions for UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/technologies',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Dahua Technologies - Advanced Security Solutions',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dahua Security Technologies Dubai - AI-Powered Surveillance Solutions',
    description: 'Discover Dahua Dubai cutting-edge security technologies: Auto-Tracking, Full-Color Vision, HDVCI-TEN, Predictive Focus, WizMind AI, and WizSense.',
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
    canonical: 'https://dahua-dubai.com/technologies',
  },
};

export default function TechnologiesPage() {
  return (
    <main>
      <Main />
    </main>
  );
}