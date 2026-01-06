import { Metadata } from "next";
import HDCVITenPage from "./Mian";

export const metadata: Metadata = {
  title: 'HDCVI Ten Technology Dubai - Ultra HD Long-Distance Transmission',
  description: 'Discover Dahua HDCVI Ten technology in Dubai - revolutionary video transmission supporting ultra HD resolution up to 4K over long distances with stable performance in UAE.',
  keywords: 'HDCVI Ten Dubai, ultra HD transmission,Dahua authorized dealer UAE, Dahua, Dahua Dubai, Dahua Technology, CCTV, Security Systems, Surveillance Solutions, IP Cameras, Video Surveillance, Access Control, NVR, Security Equipment, Home Security, Commercial Security, Dahua Dealer, Dahua Distributor, Dahua Partner, Dahua Authorized Reseller, Dahua CCTV, Dahua Security Cameras, Dahua Surveillance, Dahua Solutions, Dahua UAE, Dahua Middle East. 4K surveillance, long-distance video, Dahua HDCVI Ten UAE, coaxial cable technology, high-definition transmission, stable video signal',
  openGraph: {
    title: 'HDCVI Ten Technology Dubai - Ultra HD Long-Distance Transmission',
    description: 'Discover Dahua HDCVI Ten technology in Dubai - revolutionary video transmission supporting ultra HD resolution up to 4K over long distances with stable performance in UAE.',
    type: 'website',
    url: 'https://dahua-dubai.com/hdcvi-ten',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'HDCVI Ten Technology - Ultra HD Transmission',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HDCVI Ten Technology Dubai - Ultra HD Long-Distance Transmission',
    description: 'Discover Dahua HDCVI Ten technology in Dubai - revolutionary video transmission supporting ultra HD resolution up to 4K over long distances with stable performance.',
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
    canonical: 'https://dahua-dubai.com/hdcvi-ten',
  },
};

export default function Page() {
  return (
    <main>
      <HDCVITenPage />
    </main>
  );
}