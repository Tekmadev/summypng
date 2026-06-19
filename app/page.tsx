import type { Metadata } from "next";

import { brand, contact, getPageMeta, identity, location, services } from "@/config/business";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/");

/**
 * Home — Phase 1 placeholder. Server-rendered, on-brand, and wired to the
 * single source of truth. The signature GSAP horizontal-scroll hero replaces
 * this in Phase 3; the markup here is intentionally crawler-friendly.
 */
export default function HomePage() {
  const { h1 } = getPageMeta("/");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-foreground/50">
        {identity.name} · {location.city}
      </p>

      <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
        {h1}
      </h1>

      <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-foreground/70 sm:text-lg">
        {brand.hero.subhead}
      </p>

      <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-widest text-foreground/50">
        {services.map((service) => (
          <li key={service.key}>{service.label}</li>
        ))}
      </ul>

      <a
        href={`mailto:${contact.email}`}
        className="mt-12 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium tracking-wide transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        Reach out
      </a>
    </main>
  );
}
