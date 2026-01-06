import { Metadata } from "next";
import AutoTrackingPage from './Main';

export const metadata: Metadata = {
  title: 'Auto-Tracking Technology Dubai - Intelligent Object Tracking',
  description: 'Discover Dahua Auto-Tracking technology in Dubai - advanced AI-powered surveillance that automatically detects and tracks moving objects for comprehensive security coverage in UAE.',
  keywords: 'Auto-Tracking Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. intelligent object tracking, AI surveillance tracking, Dahua Auto-Tracking UAE, automatic tracking, moving object detection, smart camera tracking, perimeter security',
  openGraph: {
    title: 'Auto-Tracking Technology Dubai - Intelligent Object Tracking',
    description: 'Discover Dahua Auto-Tracking technology in Dubai - advanced AI-powered surveillance that automatically detects and tracks moving objects for comprehensive security coverage in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/auto-tracking',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Auto-Tracking Technology - Intelligent Object Tracking',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto-Tracking Technology Dubai - Intelligent Object Tracking',
    description: 'Discover Dahua Auto-Tracking technology in Dubai - advanced AI-powered surveillance that automatically detects and tracks moving objects for comprehensive security coverage.',
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
    canonical: 'https://dahua-dubai.com/auto-tracking',
  },
};

export default function Page() {
  return (
    <main>
      <AutoTrackingPage />
    </main>
  );
}