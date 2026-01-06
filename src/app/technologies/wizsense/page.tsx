import { Metadata } from "next";
import WizSensePage from "./Mian";

export const metadata: Metadata = {
  title: 'WizSense AI Security Solutions Dubai - Smart Intrusion Detection',
  description: 'Discover WizSense AI-powered security solutions in Dubai featuring Smart Intrusion Detection, Active Deterrence, and advanced analytics for comprehensive property protection in UAE.',
  keywords: 'WizSense Dubai, AI security solutions,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. Smart Intrusion Detection, Active Deterrence, perimeter protection, intelligent analytics, Dahua WizSense UAE, smart surveillance Dubai, AI CCTV systems',
  openGraph: {
    title: 'WizSense AI Security Solutions Dubai - Smart Intrusion Detection',
    description: 'Discover WizSense AI-powered security solutions in Dubai featuring Smart Intrusion Detection, Active Deterrence, and advanced analytics for comprehensive property protection in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/wizsense',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'WizSense AI Security Solutions - Smart Protection',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WizSense AI Security Solutions Dubai - Smart Intrusion Detection',
    description: 'Discover WizSense AI-powered security solutions in Dubai featuring Smart Intrusion Detection, Active Deterrence, and advanced analytics.',
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
    canonical: 'https://dahua-dubai.com/wizsense',
  },
};

export default function Page() {
  return (
    <main>
      <WizSensePage />
    </main>
  );
}