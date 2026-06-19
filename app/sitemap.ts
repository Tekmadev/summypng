import type { MetadataRoute } from "next";

import { PUBLIC_ROUTES, absoluteUrl, type SiteRoute } from "@/config/business";

/** How often each kind of route is expected to change. */
function changeFrequencyFor(
  route: SiteRoute,
): NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]> {
  if (route === "/") return "monthly";
  if (route.startsWith("/gallery/")) return "weekly"; // new photos land here
  return "yearly"; // about / contact
}

/** Relative importance, 0–1. Home leads, galleries next, info pages last. */
function priorityFor(route: SiteRoute): number {
  if (route === "/") return 1.0;
  if (route.startsWith("/gallery/")) return 0.8;
  return 0.6;
}

/**
 * sitemap.xml — public routes only, sourced from config. The hidden admin and
 * client-portal paths are deliberately excluded (they are not in PUBLIC_ROUTES).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: changeFrequencyFor(route),
    priority: priorityFor(route),
  }));
}
