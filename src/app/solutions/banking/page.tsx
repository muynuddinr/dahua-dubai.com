import { Metadata } from "next";
import  IndustryPage  from "./Main"

export const metadata: Metadata = {
  title: 'Banking Security Solutions Dubai - Financial Institution Protection',
  description: 'Advanced banking security solutions in Dubai including bank branch surveillance, ATM security, vault protection, and financial transaction monitoring for banks and financial institutions.',
  keywords: 'banking security Dubai,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. financial institution protection, bank branch surveillance, ATM security, vault protection, transaction monitoring, financial security, banking CCTV, cash handling security',
  openGraph: {
    title: 'Banking Security Solutions Dubai - Financial Institution Protection',
    description: 'Advanced banking security solutions in Dubai including bank branch surveillance, ATM security, vault protection, and financial transaction monitoring for banks and financial institutions.',
    type: 'website',
    url: 'https://dahua-dubai.com/banking',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Banking Security Solutions - Financial Institution Protection',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banking Security Solutions Dubai - Financial Institution Protection',
    description: 'Advanced banking security solutions in Dubai including bank branch surveillance, ATM security, vault protection, and financial transaction monitoring.',
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
    canonical: 'https://dahua-dubai.com/banking',
  },
};

export default function Page() {
  return (
    <main>
         <IndustryPage />
    </main>
  );
}