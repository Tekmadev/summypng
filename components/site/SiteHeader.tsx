"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { contact, identity, services, socials } from "@/config/business";

/** Primary navigation, sourced from config. */
const NAV_LINKS = [
  ...services.map((service) => ({ label: service.label, href: service.route })),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const SCROLL_THRESHOLD_PX = 24;

/**
 * Fixed site header with a full-screen editorial menu.
 *
 * Minimal chrome over the photography: a wordmark and a single menu toggle. The
 * overlay is keyboard accessible (Escape closes, focus moves in and is restored
 * on close) and locks body scroll while open.
 *
 * @module components/site/SiteHeader
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Solidify the header background once the hero scrolls away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While open: lock scroll, move focus in, close on Escape, restore focus out.
  useEffect(() => {
    if (!open) return;

    const toggle = toggleRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? toggle)?.focus();
    };
  }, [open]);

  return (
    <header
      data-site-header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-cinematic ${
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground sm:text-xl"
        >
          {identity.name}
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
          className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Full-screen menu overlay. */}
      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 top-0 z-40 flex flex-col bg-background/98 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-8">
          <span className="font-display text-lg tracking-tight sm:text-xl">
            {identity.name}
          </span>
        </div>

        <nav className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center gap-1 px-5 sm:px-8">
          {NAV_LINKS.map((link, index) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={() => setOpen(false)}
                className={`font-display text-4xl tracking-tight transition-colors duration-300 ease-cinematic hover:text-foreground sm:text-6xl ${
                  active ? "text-foreground" : "text-foreground/45"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-5 pb-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href={`mailto:${contact.email}`} className="hover:text-foreground">
            {contact.email}
          </a>
          <div className="flex gap-5">
            {socials.map((profile) => (
              <a
                key={profile.platform}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {profile.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
