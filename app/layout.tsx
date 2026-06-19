import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  absoluteUrl,
  identity,
  locale,
  seo,
} from "@/config/business";
import { buildSiteGraph } from "@/lib/seo";

import "./globals.css";
import "@/styles/print.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Root metadata. `metadataBase` lets relative canonical/OG URLs resolve to
 * absolute. The title `template` brands child pages that pass a short label;
 * pages with complete titles bypass it via `title.absolute` (see lib/seo).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.siteDescription,
  applicationName: identity.businessName,
  keywords: [...seo.keywordsGlobal],
  authors: [{ name: identity.name, url: absoluteUrl("/about") }],
  creator: identity.name,
  publisher: identity.businessName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: seo.openGraph.siteName,
    locale: locale.openGraph,
    url: SITE_URL,
    title: seo.defaultTitle,
    description: seo.siteDescription,
  },
  twitter: {
    card: seo.twitter.card,
    title: seo.defaultTitle,
    description: seo.siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

/** Dark, cinematic brand — declare the colour scheme so the UA chrome matches. */
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={locale.primary}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildSiteGraph()} />
        {children}
      </body>
    </html>
  );
}
