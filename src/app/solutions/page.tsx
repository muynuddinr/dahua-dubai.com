import { Metadata } from "next";
import Main from './Main';

export const metadata: Metadata = {
  title: 'Security Solutions Dubai - Comprehensive Surveillance Systems',
  description: 'Professional security solutions in Dubai including CCTV installation, access control, video analytics, and integrated surveillance systems for commercial and residential properties.',
  keywords: 'security solutions Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. CCTV installation Dubai, access control systems, video surveillance, security systems UAE, commercial security, residential security, integrated surveillance',
  openGraph: {
    title: 'Security Solutions Dubai - Comprehensive Surveillance Systems',
    description: 'Professional security solutions in Dubai including CCTV installation, access control, video analytics, and integrated surveillance systems for commercial and residential properties.',
    type: 'website',
    url: 'https://dahua-dubai.com/solutions',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Security Solutions - Comprehensive Surveillance Systems',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security Solutions Dubai - Comprehensive Surveillance Systems',
    description: 'Professional security solutions in Dubai including CCTV installation, access control, video analytics, and integrated surveillance systems.',
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
    canonical: 'https://dahua-dubai.com/solutions',
  },
};

export default function Page() {
  return (
    <main>
      <Main />
    </main>
  );
}