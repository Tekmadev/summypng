import type { MetadataRoute } from "next";

import { SITE_URL, absoluteUrl, routes, seo } from "@/config/business";

/**
 * robots.txt - generated from config.
 *
 * Public routes are open to all crawlers, including the major AI/answer-engine
 * agents (a deliberate GEO choice). The hidden admin and client-portal paths
 * are disallowed for everyone. NOTE: robots is a hint, not access control -
 * real protection comes from auth on those routes.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = routes.hiddenPrefixes.flatMap((prefix) => [prefix, `${prefix}/`]);

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Explicitly welcome answer/generative engines on public content.
      ...seo.aiCrawlers.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
