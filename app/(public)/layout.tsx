"use client";
import SiteHeader from "@/components/hero/SiteHeader";
import SiteFooter from "@/components/hero/SiteFooter";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SiteHeader />
      <main>{children}</main>
      <FloatingWhatsApp phoneNumber="233247730625" />
      <SiteFooter />
    </div>
  );
}
