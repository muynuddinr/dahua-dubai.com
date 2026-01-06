import { Metadata } from "next";
import TransportationSolutionPage from './Main';

export const metadata: Metadata = {
  title: 'Transportation Security Solutions Dubai - Traffic & Vehicle Surveillance',
  description: 'Advanced transportation security solutions in Dubai including traffic monitoring, license plate recognition, vehicle tracking, and intelligent transportation systems for roads and public transport.',
  keywords: 'transportation security Dubai, traffic monitoring, license plate recognition, LPR systems, vehicle tracking, intelligent transportation, road security, public transport surveillance',
  openGraph: {
    title: 'Transportation Security Solutions Dubai - Traffic & Vehicle Surveillance',
    description: 'Advanced transportation security solutions in Dubai including traffic monitoring, license plate recognition, vehicle tracking, and intelligent transportation systems for roads and public transport.',
    type: 'website',
    url: 'https://dahua-dubai.com/transportation',
    images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'Transportation Security Solutions - Traffic & Vehicle Surveillance',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation Security Solutions Dubai - Traffic & Vehicle Surveillance',
    description: 'Advanced transportation security solutions in Dubai including traffic monitoring, license plate recognition, vehicle tracking, and intelligent transportation systems.',
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
    canonical: 'https://dahua-dubai.com/transportation',
  },
};

export default function Page() {
  return (
    <main>
      <TransportationSolutionPage />
    </main>
  );
}