import { Metadata } from "next";
import PredictiveFocusPage from './Main';

export const metadata: Metadata = {
  title: 'Predictive Focus Technology Dubai - Advanced Surveillance Focus',
  description: 'Discover Dahua Predictive Focus technology in Dubai - advanced AI-powered focus system that predicts subject movement for crystal clear surveillance footage in UAE.',
  keywords: 'Predictive Focus Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. AI focus technology, smart surveillance focus, Dahua Predictive Focus UAE, advanced auto focus, motion prediction technology, clear surveillance footage',
  openGraph: {
    title: 'Predictive Focus Technology Dubai - Advanced Surveillance Focus',
    description: 'Discover Dahua Predictive Focus technology in Dubai - advanced AI-powered focus system that predicts subject movement for crystal clear surveillance footage in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/predictive-focus',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Predictive Focus Technology - Advanced AI Focus',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Predictive Focus Technology Dubai - Advanced Surveillance Focus',
    description: 'Discover Dahua Predictive Focus technology in Dubai - advanced AI-powered focus system that predicts subject movement for crystal clear surveillance footage.',
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
    canonical: 'https://dahua-dubai.com/predictive-focus',
  },
};

export default function Page() {
  return (
    <main>
      <PredictiveFocusPage />
    </main>
  );
}