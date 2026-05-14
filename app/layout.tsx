import type { Metadata } from "next";
// Temporarily using system fonts due to Google Fonts connectivity issues
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import JsonLd from "@/components/seo/JsonLd";

// Using CSS variables with system font fallbacks
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kofibenteh.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kofi Benteh Afful | MP Sefwi Wiawso",
    template: "%s | Kofi Benteh Afful",
  },
  description:
    "Official website of Hon. Kofi Benteh Afful, Member of Parliament for Sefwi Wiawso Constituency. Committed to development, transparency, and community service.",
  keywords: [
    "Kofi Benteh Afful",
    "MP",
    "Sefwi Wiawso",
    "Parliament",
    "Ghana",
    "Development",
    "Constituency",
    "Sefwi",
    "Wiawso",
  ],
  authors: [{ name: "Kofi Benteh Afful" }],
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: baseUrl,
    title: "Kofi Benteh Afful | MP Sefwi Wiawso",
    description:
      "Official website of Hon. Kofi Benteh Afful. Serving the people of Sefwi Wiawso with dedication and integrity.",
    siteName: "Kofi Benteh Afful Official",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kofi Benteh Afful",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kofi Benteh Afful | MP Sefwi Wiawso",
    description:
      "Serving the people of Sefwi Wiawso with dedication and integrity.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Kofi Benteh Afful",
            url: baseUrl,
            image: `${baseUrl}/og-image.jpg`,
            jobTitle: "Member of Parliament",
            worksFor: {
              "@type": "Organization",
              name: "Parliament of Ghana",
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sefwi Wiawso",
              addressRegion: "Western North Region",
              addressCountry: "GH",
            },
            sameAs: [
              "https://twitter.com/kofibenteh",
              "https://facebook.com/kofibenteh",
            ],
          }}
        />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
