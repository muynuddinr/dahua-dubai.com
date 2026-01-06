import { Metadata } from "next";
import BuildingSolutionPage from "./Main"

export const metadata: Metadata = {
  title: 'Building Security Solutions Dubai - Smart Building Management',
  description: 'Integrated building security solutions in Dubai including access control, perimeter protection, elevator monitoring, and smart building management systems for commercial and residential complexes.',
  keywords: 'building security Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. smart building management, access control systems, perimeter protection, elevator monitoring, commercial complexes, residential security, building automation, facility management',
  openGraph: {
    title: 'Building Security Solutions Dubai - Smart Building Management',
    description: 'Integrated building security solutions in Dubai including access control, perimeter protection, elevator monitoring, and smart building management systems for commercial and residential complexes.',
    type: 'website',
    url: 'https://dahua-dubai.com/building',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Building Security Solutions - Smart Building Management',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Security Solutions Dubai - Smart Building Management',
    description: 'Integrated building security solutions in Dubai including access control, perimeter protection, elevator monitoring, and smart building management systems.',
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
    canonical: 'https://dahua-dubai.com/building',
  },
};

export default function Page() {
  return (
    <main>
      <BuildingSolutionPage />
    </main>
  );
}