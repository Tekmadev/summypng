import Link from "next/link";

import {
  brand,
  contact,
  identity,
  location,
  pricing,
  services,
  socials,
} from "@/config/business";

/**
 * Site footer, sourced from config. Quiet and editorial: a closing line, the
 * full navigation, and contact. Uses the business display name for copyright
 * (not the unconfirmed legal "Inc").
 *
 * @module components/site/SiteFooter
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-site-footer
      className="border-t border-border bg-background"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="font-display text-3xl tracking-tight sm:text-4xl">
              {brand.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {pricing.message} {location.city}, {location.regionName}.
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-6 inline-block text-sm text-foreground underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            {services.map((service) => (
              <Link
                key={service.key}
                href={service.route}
                className="text-muted transition-colors hover:text-foreground"
              >
                {service.label}
              </Link>
            ))}
            <Link href="/about" className="text-muted transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-muted transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {identity.businessName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {socials.map((profile) => (
              <a
                key={profile.platform}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                {profile.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
