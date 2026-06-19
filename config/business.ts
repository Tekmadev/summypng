/**
 * SummyPNG — single source of truth.
 *
 * Every business-facing fact on the site (identity, contact, social links,
 * services, SEO copy, brand voice, hidden routes) lives here and ONLY here.
 * Pages, components, metadata, JSON-LD, robots.ts and sitemap.ts all import
 * from this module — nothing business-related is hardcoded anywhere else.
 *
 * Rules of the road:
 *   • Pure data + pure helper functions. No React, no side effects.
 *   • Named exports only. Strongly typed. JSDoc on every export.
 *   • If a value can change for business reasons, it belongs in this file.
 *
 * @module config/business
 */

import type { CategoryLabel, PhotoCategory } from "@/types";

/* -------------------------------------------------------------------------- */
/* Origin                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Canonical public origin, e.g. `https://summysingh.com`.
 * Read from the environment so previews/staging resolve correctly, with the
 * production domain as the fallback. No trailing slash.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://summysingh.com";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** Every public route that carries its own SEO metadata. */
export type SiteRoute =
  | "/"
  | "/gallery/people"
  | "/gallery/businesses"
  | "/gallery/hospitality"
  | "/gallery/real-estate"
  | "/about"
  | "/contact";

/** A gallery route, narrowed from {@link SiteRoute}. */
export type GalleryRoute = Extract<SiteRoute, `/gallery/${string}`>;

/**
 * Per-page SEO metadata. `title` is intentionally full and self-contained —
 * it is applied via Next.js `title.absolute` so the site-wide title template
 * never double-brands an already-complete title.
 */
export interface PageMeta {
  readonly route: SiteRoute;
  /** Complete `<title>`, kept ≤ 60 chars. Applied as `title.absolute`. */
  readonly title: string;
  /** Meta description, kept ≤ 160 chars. */
  readonly description: string;
  /** The page's single, visible `<h1>`. */
  readonly h1: string;
  /** Page-scoped keyword targets. */
  readonly keywords: readonly string[];
}

/** One of Summy's four service categories — each maps 1:1 to a gallery. */
export interface ServiceCategory {
  /** Stable identifier, matches the DB `categories.slug` and the URL segment. */
  readonly key: PhotoCategory;
  /** Public-facing label, matches the DB `categories.label`. */
  readonly label: CategoryLabel;
  /** Fully-qualified gallery route. */
  readonly route: GalleryRoute;
  /** schema.org `Service.serviceType`. */
  readonly serviceType: string;
  /** One evocative line for category cards and gallery intros. */
  readonly tagline: string;
  /** Longer prose for schema.org `Service.description` and meta. */
  readonly description: string;
  /** Category-scoped keyword targets. */
  readonly keywords: readonly string[];
}

/** An external profile shown in the UI and emitted as schema.org `sameAs`. */
export interface SocialProfile {
  readonly platform: string;
  readonly handle: string;
  readonly url: string;
}

/** Geographic coordinates for schema.org `GeoCoordinates`. */
export interface GeoPoint {
  readonly latitude: number;
  readonly longitude: number;
}

/** Pricing posture. The business is quote-based — no public price points. */
export interface PricingConfig {
  readonly model: "quote";
  /** ISO 4217 currency used in `Offer` nodes. */
  readonly currency: "CAD";
  /** schema.org `priceRange` — symbol only (no prose) per Google guidance. */
  readonly priceRange: "$$";
  /** Plain-language pricing statement shown to humans and answer engines. */
  readonly message: string;
}

/* -------------------------------------------------------------------------- */
/* Identity                                                                   */
/* -------------------------------------------------------------------------- */

/** Who the business is. */
export const identity = {
  /** Public display name used in headers, footers, and titles. */
  name: "Summy Singh",
  /** Business/brand name used as schema.org `name` and in copyright. */
  businessName: "Summy Singh Photography",
  /**
   * Registered legal entity. NOTE: confirm incorporation before relying on the
   * "Inc" form in schema `legalName` or a "© … Inc" notice — until then the
   * safe, non-Inc {@link identity.businessName} is used for copyright.
   */
  legalName: "Summy Singh Photography Inc",
  /** Informal brand alias / working title. */
  alias: "SummyPNG",
  /** Primary craft, for schema.org `Person.jobTitle`. */
  role: "Photographer",
} as const;

/** How to reach the business. */
export const contact = {
  /** Public email — also the recipient for inquiry-form notifications. */
  email: "summy.png@gmail.com",
  /** No public phone number by choice. */
  phone: null,
} as const;

/** Where the business operates. */
export const location = {
  city: "Montreal",
  /** Province code for `addressRegion`. */
  region: "QC",
  regionName: "Quebec",
  /** Country code for `addressCountry`. */
  country: "CA",
  countryName: "Canada",
  /** Free-text service area for schema.org `areaServed`. */
  areaServed: ["Montreal", "Greater Montreal", "Quebec", "Canada"],
  /** Centre-of-Montreal coordinates. */
  geo: { latitude: 45.5019, longitude: -73.5674 } satisfies GeoPoint,
} as const;

/** Language/locale posture. The site is English-first, French-aware. */
export const locale = {
  /** BCP-47 primary locale for `inLanguage` / `<html lang>`. */
  primary: "en-CA",
  /** Open Graph locale form (`en_CA`). */
  openGraph: "en_CA",
  /** Languages the business works in, for `knowsLanguage` / `availableLanguage`. */
  languages: ["en", "fr"],
} as const;

/** External profiles. Emitted as schema.org `sameAs`. */
export const socials: readonly SocialProfile[] = [
  {
    platform: "Instagram",
    handle: "@summy.png",
    url: "https://www.instagram.com/summy.png",
  },
];

/** Quote-based pricing. */
export const pricing: PricingConfig = {
  model: "quote",
  currency: "CAD",
  priceRange: "$$",
  message: "Reach out and the price will be discussed.",
};

/* -------------------------------------------------------------------------- */
/* Services / galleries                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The four service categories, in display order. Each maps to one gallery and
 * one schema.org `Service` node. Labels are fixed and must match the DB.
 */
export const services: readonly ServiceCategory[] = [
  {
    key: "people",
    label: "People",
    route: "/gallery/people",
    serviceType: "Cinematic portrait photography",
    tagline: "Portraits in low light — faces given room to hold their own.",
    description: "Moody, cinematic editorial portrait photography in Montreal.",
    keywords: [
      "Montreal portrait photographer",
      "cinematic portrait photography",
      "editorial portraits Montreal",
      "moody portrait photographer",
      "headshot photographer Montreal",
    ],
  },
  {
    key: "businesses",
    label: "Businesses",
    route: "/gallery/businesses",
    serviceType: "Commercial and brand photography",
    tagline:
      "Commercial work with an editorial spine, shot for brands that prefer shadow to shine.",
    description: "Cinematic commercial and brand photography for Montreal businesses.",
    keywords: [
      "commercial photographer Montreal",
      "brand photography Montreal",
      "Montreal business photographer",
      "editorial commercial photography",
    ],
  },
  {
    key: "hospitality",
    label: "Hospitality",
    route: "/gallery/hospitality",
    serviceType: "Hospitality and venue photography",
    tagline: "Rooms, plates and rituals rendered at the hour the light goes quiet.",
    description:
      "Cinematic photography for Montreal restaurants, hotels, bars and cafés.",
    keywords: [
      "hospitality photographer Montreal",
      "restaurant photographer Montreal",
      "hotel photography Montreal",
      "bar and cafe photographer Montreal",
    ],
  },
  {
    key: "real-estate",
    label: "Real Estate",
    route: "/gallery/real-estate",
    serviceType: "Architectural and interior photography",
    tagline: "Spaces framed with intent — architecture read as composition, not listing.",
    description:
      "Cinematic real estate and architectural photography for Montreal properties.",
    keywords: [
      "real estate photographer Montreal",
      "architectural photographer Montreal",
      "interior photography Montreal",
      "property photographer Montreal",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Brand voice & copy                                                         */
/* -------------------------------------------------------------------------- */

/** Brand-grade copy. Drives hero, about seed, and form states. */
export const brand = {
  /** Primary tagline. */
  tagline: "Composed in the dark.",
  /** Alternate taglines, kept for future A/B use. */
  taglineOptions: [
    "Composed in the dark.",
    "Light, withheld.",
    "Montreal, after dark.",
    "The frame holds.",
    "Less light. More image.",
  ],
  /** Home-page hero. */
  hero: {
    headline: "Composed in the dark.",
    subhead:
      "Cinematic, low-light photography out of Montreal — people, businesses, hospitality, real estate.",
  },
  /**
   * One-paragraph voice guide. Every future piece of copy should pass through
   * this lens: spare, declarative, magazine-grade; the imagery is the loudest
   * thing on the page.
   */
  voice:
    "Spare, declarative, and quietly confident — the voice of a high-end photography magazine, not a service vendor. Sentences run short and load-bearing; nouns do the work, adjectives are rationed. State facts about light, place, and subject and let the photographs supply the feeling. Avoid sentiment and the entire dictionary of photography cliché.",
  /** Default About bio (Summy can edit later in admin / `about_content`). */
  aboutSeed:
    "Summy Singh is a Montreal photographer working in low light and dark tone across portraits, commercial, hospitality and real estate. The approach is editorial and deliberate: fewer frames, more weight, every image built to sit on a magazine spread. Work is taken on by inquiry — reach out and the price is discussed.",
  /** Intro line for the multi-step booking form. */
  contactIntro:
    "Tell us what you're shooting. Three short steps — the subject, the project, your details — and the rest is a conversation. Pricing is set per project; reach out and we'll discuss it.",
  /** Success state shown after an inquiry is submitted. */
  confirmationMessage:
    "Received. Your inquiry is in the studio — Summy reads every one personally and will reply by email, usually within a couple of days, with next steps and pricing.",
} as const;

/* -------------------------------------------------------------------------- */
/* SEO / AEO / GEO                                                            */
/* -------------------------------------------------------------------------- */

/** Site-wide SEO configuration. Per-page metadata lives in {@link pages}. */
export const seo = {
  /** Used ONLY for future pages that pass a short label (galleries use absolute titles). */
  titleTemplate: "%s · Summy Singh — Montreal Photographer",
  /** Fallback `<title>` when a route provides none. */
  defaultTitle: "Summy Singh — Montreal Cinematic Photographer",
  /** Default meta description (≤ 160 chars). */
  siteDescription:
    "Summy Singh is a Montreal photographer making moody, cinematic, dark-toned editorial work for people, business, hospitality and real estate.",
  /** Site-wide keyword targets. */
  keywordsGlobal: [
    "Summy Singh",
    "Montreal photographer",
    "photographe Montréal",
    "cinematic photographer Montreal",
    "moody editorial photography",
    "dark-toned photography",
    "portrait photographer Montreal",
    "commercial photographer Montreal",
    "hospitality photographer Montreal",
    "real estate photographer Montreal",
  ],
  /** Open Graph defaults. Per-route OG images are generated at `opengraph-image`. */
  openGraph: {
    type: "website",
    siteName: identity.name,
    imageWidth: 1200,
    imageHeight: 630,
    /** Static fallback used if the dynamic OG route fails. */
    fallbackImage: "/og/default.png",
  },
  /** Twitter/X card defaults. No account exists, so `site`/`creator` are omitted. */
  twitter: {
    card: "summary_large_image",
  },
  /**
   * AI crawlers explicitly welcomed on public routes (GEO). The hidden admin
   * and client-portal paths stay disallowed for all agents — see {@link routes}.
   */
  aiCrawlers: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
} as const;

/**
 * Per-page SEO metadata for every public route. Titles are full and applied
 * via `title.absolute`; descriptions are ≤ 160 chars. Verified against current
 * SEO/AEO/GEO guidance.
 */
export const pages: readonly PageMeta[] = [
  {
    route: "/",
    title: "Summy Singh — Montreal Cinematic Photographer",
    description:
      "Montreal cinematic photographer Summy Singh — moody, dark-toned editorial work across portraits, commercial, hospitality and real estate.",
    h1: "Cinematic photography from Montreal",
    keywords: [
      "Montreal photographer",
      "cinematic photographer Montreal",
      "moody editorial photographer",
      "dark-toned photography Montreal",
      "Summy Singh",
    ],
  },
  {
    route: "/gallery/people",
    title: "People — Cinematic Portrait Photography in Montreal",
    description:
      "Moody, cinematic portrait photography in Montreal by Summy Singh. Editorial people sessions with a dark, filmic tone. Quote-based.",
    h1: "People",
    keywords: services[0]!.keywords,
  },
  {
    route: "/gallery/businesses",
    title: "Businesses — Commercial & Brand Photography in Montreal",
    description:
      "Cinematic commercial and brand photography in Montreal by Summy Singh. Dark-toned, editorial imagery for businesses. Quote-based.",
    h1: "Businesses",
    keywords: services[1]!.keywords,
  },
  {
    route: "/gallery/hospitality",
    title: "Hospitality — Restaurant & Hotel Photography, Montreal",
    description:
      "Cinematic hospitality photography in Montreal by Summy Singh — restaurants, bars, hotels and cafés in a moody, atmospheric tone.",
    h1: "Hospitality",
    keywords: services[2]!.keywords,
  },
  {
    route: "/gallery/real-estate",
    title: "Real Estate — Architectural Photography in Montreal",
    description:
      "Cinematic real estate and architectural photography in Montreal by Summy Singh. Moody, editorial interiors that sell a space.",
    h1: "Real Estate",
    keywords: services[3]!.keywords,
  },
  {
    route: "/about",
    title: "About Summy Singh — Montreal Cinematic Photographer",
    description:
      "Meet Summy Singh, the Montreal photographer behind moody, cinematic, dark-toned editorial work across portraits, business and venues.",
    h1: "About Summy Singh",
    keywords: [
      "Summy Singh",
      "about Summy Singh photographer",
      "Montreal cinematic photographer bio",
      "who is Summy Singh",
    ],
  },
  {
    route: "/contact",
    title: "Contact & Booking — Summy Singh, Montreal Photographer",
    description:
      "Start a project with Montreal photographer Summy Singh — people, business, hospitality or real estate. Pricing is quote-based.",
    h1: "Let's work together",
    keywords: [
      "book Montreal photographer",
      "contact Summy Singh",
      "hire cinematic photographer Montreal",
      "photography quote Montreal",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Routes (public + hidden)                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Route configuration. The admin lives at a deliberately non-obvious path and
 * must never appear in the sitemap, must be disallowed in robots.txt, and must
 * be gated by auth. Centralised here so no secret route is hardcoded elsewhere.
 */
export const routes = {
  /** Hidden, Summy-only admin root. */
  adminRoot: "/darkroom",
  /** Reserved root for the future client portal (Phase 6). */
  clientPortalRoot: "/clients",
  /**
   * Path prefixes excluded from indexing (sitemap + robots Disallow). Keep in
   * sync with any new private surface area.
   */
  hiddenPrefixes: ["/darkroom", "/clients"],
} as const;

/** Ordered list of public routes that belong in the sitemap. */
export const PUBLIC_ROUTES: readonly SiteRoute[] = pages.map((page) => page.route);

/* -------------------------------------------------------------------------- */
/* Helpers (pure)                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Resolve a path to an absolute URL against {@link SITE_URL}.
 * @param path A root-relative path (e.g. `/about`) or `/`.
 * @returns The absolute URL (e.g. `https://summysingh.com/about`).
 */
export function absoluteUrl(path: string): string {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Look up the SEO metadata for a public route.
 * @param route One of the known public routes.
 * @returns The page's {@link PageMeta}.
 * @throws If the route has no configured metadata (programmer error).
 */
export function getPageMeta(route: SiteRoute): PageMeta {
  const meta = pages.find((page) => page.route === route);
  if (!meta) {
    throw new Error(`No page metadata configured for route "${route}".`);
  }
  return meta;
}

/**
 * Look up a service category by its slug / URL segment.
 * @param slug A category slug (e.g. `hospitality`).
 * @returns The matching {@link ServiceCategory}, or `undefined` if unknown.
 */
export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return services.find((service) => service.key === slug);
}

/** External profile URLs, for schema.org `sameAs`. */
export function sameAs(): readonly string[] {
  return socials.map((profile) => profile.url);
}

/* -------------------------------------------------------------------------- */
/* Aggregate                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Convenience aggregate of the entire business configuration. Prefer importing
 * the specific named export you need; this exists for ergonomic access in
 * templates and tests.
 */
export const business = {
  siteUrl: SITE_URL,
  identity,
  contact,
  location,
  locale,
  socials,
  pricing,
  services,
  brand,
  seo,
  pages,
  routes,
} as const;
