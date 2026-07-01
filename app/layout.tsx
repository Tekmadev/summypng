import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { JsonLd } from "@/components/JsonLd";
import { GrainOverlay } from "@/components/site/GrainOverlay";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ThemeScript } from "@/components/theme/ThemeScript";
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

/** Characterful editorial display serif, optical-sized for large headlines. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
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

/**
 * The site ships both skins (light default, dark optional) via a `.dark` class,
 * independent of the OS preference. The theme-color meta is seeded to the light
 * default here and then kept in sync with the actual theme by ThemeScript (first
 * paint) and ThemeToggle (on flip), so it is NOT keyed on prefers-color-scheme.
 */
export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={locale.primary}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        <JsonLd data={buildSiteGraph()} />
        <GrainOverlay />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
