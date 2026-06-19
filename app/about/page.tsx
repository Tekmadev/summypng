import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { brand, getPageMeta, location, pricing, services } from "@/config/business";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/about");

/** About page: bio, portrait, and approach. Editable later via `about_content`. */
export default function AboutPage() {
  const { h1 } = getPageMeta("/about");

  return (
    <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <PageHeader eyebrow="About" title={h1} intro={brand.tagline} />

      <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-surface">
          <Image
            src="https://picsum.photos/seed/summy-portrait/1200/1500?grayscale"
            alt="Portrait of Summy Singh, Montreal photographer."
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col justify-center">
          <p className="max-w-xl text-lg leading-relaxed text-foreground/85 sm:text-xl">
            {brand.aboutSeed}
          </p>

          <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Based in
              </dt>
              <dd className="mt-2 text-foreground">
                {location.city}, {location.regionName}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Working in
              </dt>
              <dd className="mt-2 text-foreground">English &amp; French</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Shoots
              </dt>
              <dd className="mt-2 text-foreground">
                {services.map((service) => service.label).join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                Pricing
              </dt>
              <dd className="mt-2 text-foreground">{pricing.message}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </main>
  );
}
