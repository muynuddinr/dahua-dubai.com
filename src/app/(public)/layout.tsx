import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar
        logo={{
          url: "/Logo.png",
          alt: "Dahuva Logo",
        }}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
