import { Metadata } from "next";
import SmartAnalyticsPage from './Main';

export const metadata: Metadata = {
  title: 'Smart Analytics Technology Dubai - Intelligent Video Analysis',
  description: 'Discover Dahua Smart Analytics technology in Dubai - advanced AI-powered video analysis for intelligent detection, recognition, and automated monitoring solutions in UAE.',
  keywords: 'Smart Analytics Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. intelligent video analysis, AI video analytics, Dahua Smart Analytics UAE, automated monitoring, video intelligence, smart detection, recognition technology',
  openGraph: {
    title: 'Smart Analytics Technology Dubai - Intelligent Video Analysis',
    description: 'Discover Dahua Smart Analytics technology in Dubai - advanced AI-powered video analysis for intelligent detection, recognition, and automated monitoring solutions in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/full-color',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Smart Analytics Technology - Intelligent Video Analysis',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Analytics Technology Dubai - Intelligent Video Analysis',
    description: 'Discover Dahua Smart Analytics technology in Dubai - advanced AI-powered video analysis for intelligent detection, recognition, and automated monitoring solutions.',
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
    canonical: 'https://dahua-dubai.com/full-color',
  },
};

export default function Page() {
  return (
    <main>
      <SmartAnalyticsPage />
    </main>
  );
}