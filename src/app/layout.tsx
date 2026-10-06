import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://checkdamp.co.uk"),
  title: {
    default: "UK Damp & Mould Risk Index | CheckDamp UK",
    template: "%s | CheckDamp UK",
  },
  description: "Explore UK property damp and mould risk scores. Check solid wall vulnerability, pre-1930 housing stock, and condensation risk profiles across UK postcodes.",
  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
  authors: [{ name: "UK Damp Risk Index Research Team", url: "https://checkdamp.co.uk/about" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://checkdamp.co.uk",
    title: "UK Damp & Mould Risk Index | Postcode Condensation & Property Data",
    description: "Instant damp risk scores, Victorian solid-wall housing analysis, and surveyor recommendations across UK postcodes.",
    siteName: "UK Damp Risk Index",
    images: [
      {
        url: "/icon.webp",
        width: 512,
        height: 512,
        alt: "UK Damp Risk Index Shield Logo",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UK Damp Risk Index Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Damp & Mould Risk Index | Postcode Condensation Data",
    description: "Instant damp risk scores, Victorian solid-wall housing analysis, and surveyor recommendations across UK postcodes.",
    images: ["/icon.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://checkdamp.co.uk/#website",
                  "url": "https://checkdamp.co.uk",
                  "name": "UK Damp Risk Index",
                  "publisher": {
                    "@id": "https://checkdamp.co.uk/#organization",
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://checkdamp.co.uk/damp-risk/{search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://checkdamp.co.uk/#organization",
                  "name": "UK Damp Risk Index",
                  "alternateName": "CheckDamp UK",
                  "url": "https://checkdamp.co.uk",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://checkdamp.co.uk/icon.webp",
                  },
                  "description": "CheckDamp UK provides localized UK property damp analytics, Victorian solid wall vulnerability assessments, and surveyor quotes across UK postcodes.",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#FDFDFD] text-slate-900 antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}