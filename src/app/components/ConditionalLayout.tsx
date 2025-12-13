"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Whatsapp from "./Whatsapp";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar logo={{ url: "/images/dahualogo-removebg-preview0.png", alt: "Logo" }} />
      <Whatsapp />
      {children}
      <Footer />
    </>
  );
}
