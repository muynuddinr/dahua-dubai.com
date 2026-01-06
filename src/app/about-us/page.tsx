import { Metadata } from "next";
import About from "../components/About";

export const metadata: Metadata = {
  title: 'About Us - Dahua Security Dubai | Leading Security Solutions Provider',
  description: 'Learn about Dahua Security Dubai - leading provider of advanced security solutions in UAE. Our expertise in CCTV, surveillance systems, and innovative security technology since 2001.',
  keywords: 'about Dahua Dubai, security company UAE, CCTV experts Dubai, surveillance specialists, security solutions provider, Dahua history, security company about us, professional security team',
  openGraph: {
    title: 'About Us - Dahua Security Dubai | Leading Security Solutions Provider',
    description: 'Learn about Dahua Security Dubai - leading provider of advanced security solutions in UAE. Our expertise in CCTV, surveillance systems, and innovative security technology since 2001.',
    type: 'website',
    url: 'https://dahua-dubai.com/about',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'About Dahua Security Dubai - Leading Security Solutions Provider',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - Dahua Security Dubai | Leading Security Solutions Provider',
    description: 'Learn about Dahua Security Dubai - leading provider of advanced security solutions in UAE. Our expertise in CCTV, surveillance systems, and innovative security technology.',
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
    canonical: 'https://dahua-dubai.com/about',
  },
};

export default function Page() {
  return (
    <main>
      <About />
    </main>
  );
}