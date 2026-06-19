import Image from "next/image";
import Link from "next/link";

import { services } from "@/config/business";
import { getMockPhotos } from "@/lib/mock-photos";

/**
 * Home section linking to the four galleries, each behind a representative
 * cover image with a hover reveal. Server component; data from config.
 *
 * @module components/home/CategoryPreview
 */
export function CategoryPreview() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-32" aria-labelledby="galleries-heading">
      <p
        id="galleries-heading"
        className="font-mono text-xs uppercase tracking-[0.3em] text-muted"
      >
        Galleries
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const cover = getMockPhotos(service.key, 1)[0]!;
          return (
            <Link
              key={service.key}
              href={service.route}
              className="group relative block aspect-[3/2] overflow-hidden bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-75 transition-all duration-700 ease-cinematic group-hover:scale-[1.04] group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/85 via-background/20 to-transparent p-6 sm:p-8">
                <div>
                  <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                    {service.label}
                  </h3>
                  <p className="mt-1 max-w-xs text-sm text-foreground/70">
                    {service.tagline}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
