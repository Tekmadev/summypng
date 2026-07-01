/**
 * SEO logic - turns the {@link config/business} single source of truth into
 * Next.js `Metadata` and schema.org JSON-LD. Pure functions only; no React.
 *
 * Two consumers:
 *   • `app/layout.tsx` + each page's `generateMetadata` → {@link getRouteMetadata}.
 *   • `app/layout.tsx` `<JsonLd>` → {@link buildSiteGraph} (sitewide entity graph).
 *
 * @module lib/seo
 */

import type { Metadata } from "next";

import {
  LEGAL_ROUTES,
  SITE_URL,
  absoluteUrl,
  contact,
  getPageMeta,
  identity,
  location,
  locale,
  pages,
  pricing,
  sameAs,
  seo,
  services,
  socials,
  type PageMeta,
  type ServiceCategory,
  type SiteRoute,
} from "@/config/business";

/** Legal/utility routes do not belong in the LLM "core pages" summary. */
const LEGAL_ROUTE_SET: ReadonlySet<string> = new Set(LEGAL_ROUTES);

/** A loosely-typed JSON-LD node. */
type JsonLdNode = Record<string, unknown>;

/** Stable schema.org `@id` anchors, all resolved against the canonical origin. */
const ID = {
  business: `${SITE_URL}/#business`,
  person: `${SITE_URL}/#summy`,
  website: `${SITE_URL}/#website`,
  offerCatalog: `${SITE_URL}/#offercatalog`,
  /** e.g. `…/#service-realestate` (hyphen stripped to match the slug). */
  service: (key: ServiceCategory["key"]): string =>
    `${SITE_URL}/#service-${key.replace(/-/g, "")}`,
} as const;

/* -------------------------------------------------------------------------- */
/* Per-route Metadata                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Build the Next.js `Metadata` for a public route from config.
 *
 * The page title is applied via `title.absolute` so the sitewide title
 * template never double-brands an already-complete, keyword-tuned title.
 * Open Graph images are intentionally omitted here - Next injects them
 * automatically once per-route `opengraph-image` files exist.
 *
 * @param route A public route.
 * @returns Metadata ready to return from `generateMetadata`/`export const metadata`.
 */
export function getRouteMetadata(route: SiteRoute): Metadata {
  const page = getPageMeta(route);
  const canonical = route === "/" ? "/" : route;

  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: [...page.keywords],
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: seo.openGraph.siteName,
      locale: locale.openGraph,
      url: absoluteUrl(route),
      title: page.title,
      description: page.description,
    },
    twitter: {
      card: seo.twitter.card,
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}

/* -------------------------------------------------------------------------- */
/* Sitewide JSON-LD graph                                                      */
/* -------------------------------------------------------------------------- */

/** A schema.org `PostalAddress` for Montreal (service-area business, no street). */
function postalAddress(): JsonLdNode {
  return {
    "@type": "PostalAddress",
    addressLocality: location.city,
    addressRegion: location.region,
    addressCountry: location.country,
  };
}

/** The four `Service` nodes, derived from config. */
function serviceNodes(): JsonLdNode[] {
  return services.map((service) => ({
    "@type": "Service",
    "@id": ID.service(service.key),
    serviceType: service.serviceType,
    name: service.label,
    provider: { "@id": ID.business },
    areaServed: { "@type": "City", name: location.city },
    description: service.description,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: pricing.currency,
      description: pricing.message,
    },
  }));
}

/**
 * Build the sitewide schema.org `@graph`: the business (LocalBusiness), the
 * photographer (Person), the WebSite, the OfferCatalog, and the four Services.
 * Per-page nodes (WebPage, BreadcrumbList, ImageGallery) are added by the
 * individual routes in later phases.
 *
 * @returns A JSON-LD document ready to serialize into a `<script>` tag.
 */
export function buildSiteGraph(): { "@context": string; "@graph": JsonLdNode[] } {
  const business: JsonLdNode = {
    "@type": ["LocalBusiness", "Organization"],
    "@id": ID.business,
    name: identity.businessName,
    legalName: identity.legalName,
    alternateName: identity.alias,
    url: SITE_URL,
    description: seo.siteDescription,
    founder: { "@id": ID.person },
    employee: { "@id": ID.person },
    slogan: "Montreal cinematic photography",
    areaServed: [
      { "@type": "City", name: "Montreal" },
      { "@type": "AdministrativeArea", name: location.regionName },
      { "@type": "Country", name: location.countryName },
    ],
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.geo.latitude,
      longitude: location.geo.longitude,
    },
    email: `mailto:${contact.email}`,
    sameAs: [...sameAs()],
    knowsLanguage: [...locale.languages],
    priceRange: pricing.priceRange,
    currenciesAccepted: pricing.currency,
    makesOffer: services.map((service) => ({ "@id": ID.service(service.key) })),
    hasOfferCatalog: { "@id": ID.offerCatalog },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Booking",
      email: contact.email,
      areaServed: location.country,
      availableLanguage: [...locale.languages],
    },
  };

  const person: JsonLdNode = {
    "@type": "Person",
    "@id": ID.person,
    name: identity.name,
    jobTitle: identity.role,
    description: "Montreal cinematic, moody editorial photographer.",
    url: absoluteUrl("/about"),
    worksFor: { "@id": ID.business },
    address: postalAddress(),
    email: contact.email,
    sameAs: [...sameAs()],
    knowsAbout: [
      "cinematic photography",
      "editorial portraiture",
      "commercial photography",
      "hospitality photography",
      "real estate photography",
      "architectural photography",
    ],
    knowsLanguage: [...locale.languages],
  };

  const website: JsonLdNode = {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: identity.name,
    inLanguage: [locale.primary, "fr-CA"],
    publisher: { "@id": ID.business },
    about: { "@id": ID.person },
  };

  const offerCatalog: JsonLdNode = {
    "@type": "OfferCatalog",
    "@id": ID.offerCatalog,
    name: "Photography Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@id": ID.service(service.key) },
      priceCurrency: pricing.currency,
      description: pricing.message,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [business, person, website, offerCatalog, ...serviceNodes()],
  };
}

/* -------------------------------------------------------------------------- */
/* llms.txt (AEO / GEO)                                                        */
/* -------------------------------------------------------------------------- */

/** One `- [Label](url): note` line for a page in the llms.txt index. */
function llmsEntry(page: PageMeta): string {
  const url = absoluteUrl(page.route);
  if (page.route === "/") {
    return `- [Home](${url}): Overview of ${identity.name}'s cinematic photography and featured work.`;
  }
  if (page.route === "/about") {
    return `- [About](${url}): ${identity.name}'s background, approach and photographic style.`;
  }
  if (page.route === "/contact") {
    return `- [Contact](${url}): Booking and project inquiries. ${pricing.message}`;
  }
  const service = services.find((entry) => entry.route === page.route);
  return `- [${service?.label ?? page.h1}](${url}): ${service?.description ?? page.description}`;
}

/**
 * Build the plain-text `/llms.txt` body from config - a compact, citable
 * summary of the business for LLMs and answer engines. This is context, not a
 * ranking signal; it simply gives AI agents a clean read of the core facts.
 *
 * @returns The full llms.txt document.
 */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${identity.name} - Montreal Cinematic Photographer`,
    "",
    `> ${identity.name} is a Montreal-based photographer creating moody, cinematic, ` +
      `dark-toned editorial imagery across People (portraits), Businesses (commercial/brand), ` +
      `Hospitality (restaurants, hotels, bars) and Real Estate (architectural/interior). ` +
      `Serves ${location.areaServed.join(", ")}. Bilingual (English/French). ` +
      `Pricing is quote-based - ${pricing.message} Business: ${identity.businessName}.`,
    "",
    "## Core pages",
    ...pages.filter((page) => !LEGAL_ROUTE_SET.has(page.route)).map(llmsEntry),
    "",
    "## Contact",
    `- Email: ${contact.email}`,
    ...socials.map((profile) => `- ${profile.platform}: ${profile.url}`),
    `- Location: ${location.city}, ${location.regionName}, ${location.countryName}`,
    `- Pricing: Quote-based. ${pricing.message}`,
    "",
    "## Notes for AI assistants",
    `- Display name: "${identity.name}". Brand/alias: "${identity.alias}". Business: "${identity.businessName}".`,
    "- Style keywords: cinematic, moody, dark-toned, editorial.",
    "- No public phone number; contact by email or the contact form.",
  ];

  return `${lines.join("\n")}\n`;
}
