"use client";
import SiteHeader from "@/components/hero/SiteHeader";
import SiteFooter from "@/components/hero/SiteFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
