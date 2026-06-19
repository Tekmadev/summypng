import type { Metadata } from "next";
import Link from "next/link";

import { CategoryPreview } from "@/components/home/CategoryPreview";
import { PinnedGallery } from "@/components/home/PinnedGallery";
import { brand, getPageMeta, identity, location, services } from "@/config/business";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/");

/**
 * Home. Interim cinematic hero wired to the single source of truth. The
 * signature GSAP horizontal-scroll section replaces the placeholder block below
 * in the next pass; the heading and copy here are server-rendered for crawlers.
 */
export default function HomePage() {
  const { h1 } = getPageMeta("/");

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative flex min-h-screen flex-col justify-center px-5 pt-24 pb-20 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {brand.tagline}
        </p>

        <h1 className="mt-8 max-w-[14ch] font-display text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.92] tracking-tight">
          {h1}
        </h1>

        <p className="mt-10 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
          {brand.hero.subhead}
        </p>

        <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3" aria-label="Galleries">
          {services.map((service) => (
            <Link
              key={service.key}
              href={service.route}
              className="text-sm uppercase tracking-widest text-muted transition-colors duration-300 ease-cinematic hover:text-foreground"
            >
              {service.label}
            </Link>
          ))}
        </nav>

        <p className="mt-auto pt-16 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted">
          {identity.name} · {location.city}, {location.regionName}
        </p>
      </section>

      <PinnedGallery />

      <CategoryPreview />
    </main>
  );
}
