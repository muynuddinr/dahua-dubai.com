import { Metadata } from "next";
import GovernmentSolutionPage from "./Main"

export const metadata: Metadata = {
  title: 'Government Security Solutions Dubai - Public Safety & Surveillance',
  description: 'Secure government security solutions in Dubai including critical infrastructure protection, public safety systems, border control, and advanced surveillance for government facilities and public spaces.',
  keywords: 'government security Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. critical infrastructure protection, public safety systems, border control, government facilities, public space surveillance, secure government solutions, defense security',
  openGraph: {
    title: 'Government Security Solutions Dubai - Public Safety & Surveillance',
    description: 'Secure government security solutions in Dubai including critical infrastructure protection, public safety systems, border control, and advanced surveillance for government facilities and public spaces.',
    type: 'website',
    url: 'https://dahua-dubai.com/government',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Government Security Solutions - Public Safety & Surveillance',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Security Solutions Dubai - Public Safety & Surveillance',
    description: 'Secure government security solutions in Dubai including critical infrastructure protection, public safety systems, border control, and advanced surveillance.',
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
    canonical: 'https://dahua-dubai.com/government',
  },
};

export default function Page() {
  return (
    <main>
      <GovernmentSolutionPage />
    </main>
  );
}