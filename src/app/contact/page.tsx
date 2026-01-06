import { Metadata } from "next";
import Contact from "../components/Contact";

export const metadata: Metadata = {
  title: 'Contact Us | Dahua Dubai - Security Solutions Experts',
  description: 'Get in touch with Dahua Dubai for premium security solutions, CCTV systems, and professional surveillance consulting. Contact our security experts today.',
  keywords: 'contact Dahua Dubai, security consultation UAE, CCTV support Dubai, surveillance experts contact, Dahua contact information',
  openGraph: {
    title: 'Contact Us | Dahua Dubai - Security Solutions Experts',
    description: 'Get in touch with Dahua Dubai for premium security solutions, CCTV systems, and professional surveillance consulting. Contact our security experts today.',
    type: 'website',
    url: 'https://dahua-dubai.com/contact',
     images: [{
      url: '/images/dahualogo-removebg-preview0.png',
      width: 1200,
      height: 630,
      alt: 'About Dahua Security Dubai - Leading Security Solutions Provider',
    }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return (
    <>
      <Contact />
    </>
  );
}