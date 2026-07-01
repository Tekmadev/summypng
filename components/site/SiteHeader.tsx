"use client";

import {
  AnimatePresence,
  type Variants,
  motion,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type RefObject, useEffect, useId, useMemo, useRef, useState } from "react";

import { contact, identity, services, socials } from "@/config/business";
import { SocialIcon, hasSocialIcon } from "@/components/site/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** Primary navigation, sourced from config. */
const NAV_LINKS = [
  ...services.map((service) => ({ label: service.label, href: service.route })),
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const SCROLL_THRESHOLD_PX = 24;

/** Expo-out easing, mirrors the CSS `--ease-cinematic` token. */
const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Tab-cyclable elements, in document order, within a root. */
function focusablesWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
    // getClientRects() is a reliable visibility test even inside a
    // position:fixed overlay (where offsetParent is unreliable).
  ).filter((el) => el.getClientRects().length > 0);
}

/**
 * Fixed site header with a full-screen editorial menu.
 *
 * Minimal chrome over the photography: a wordmark and a single menu toggle. The
 * overlay slides down and fades in (links stagger in behind it) via Framer
 * Motion's `AnimatePresence`; clicking a link closes it concurrently, so the
 * exit plays while the next page fades in from `app/template.tsx` rather than
 * snapping shut.
 *
 * Accessibility: Escape closes; focus moves into the menu on open and is
 * restored to the toggle on close; Tab is trapped across the header (the toggle
 * and the menu links) so focus never lands on the content hidden behind the
 * scrim. Body scroll is locked while open, paired with `scrollbar-gutter:
 * stable` (globals.css) so toggling the lock causes no layout shift.
 *
 * @module components/site/SiteHeader
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Solidify the header background once the hero scrolls away.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While open: lock scroll, move focus in, trap Tab + close on Escape, restore
  // focus out. The trap spans the whole header so the Close toggle (which lives
  // in the bar, above the scrim) stays in the cycle.
  useEffect(() => {
    if (!open) return;

    const toggle = toggleRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;

      const focusable = focusablesWithin(headerRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
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
      ref={headerRef}
      data-site-header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-cinematic ${
        open
          ? "border-transparent bg-transparent"
          : scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-md"
            : "border-b border-transparent"
      }`}
    >
      {/* Bar sits above the overlay (z-10 in-header) so the Close toggle stays
          clickable while the menu is open. */}
      <div className="relative z-10 mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-foreground sm:text-xl"
        >
          {identity.name}
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle className="-mr-1" />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
            className="cursor-pointer px-1 py-1 text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Full-screen menu overlay. AnimatePresence keeps it mounted through the
          exit so the slide-up can play while the next page fades in behind it. */}
      <AnimatePresence>
        {open && (
          <MenuOverlay
            key="site-menu"
            menuId={menuId}
            pathname={pathname}
            firstLinkRef={firstLinkRef}
            onNavigate={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * The full-screen menu panel. Split into its own component so it can read
 * Framer Motion's presence: while it animates OUT (`!isPresent`) it is marked
 * `inert`, removing the still-mounted `role="dialog"` from the a11y tree and
 * blocking pointer/focus on the fading scrim. (Binding `inert` to the parent
 * `open` state would not work: `AnimatePresence` keeps the captured element,
 * whose props are frozen at the moment it was removed.)
 */
function MenuOverlay({
  menuId,
  pathname,
  firstLinkRef,
  onNavigate,
}: {
  menuId: string;
  pathname: string;
  firstLinkRef: RefObject<HTMLAnchorElement | null>;
  onNavigate: () => void;
}) {
  const isPresent = useIsPresent();
  const reduce = useReducedMotion();

  // Slide-down + fade for the panel; the nav staggers its links in, and reverses
  // the stagger on exit. Reduced motion collapses every offset/delay to zero so
  // the overlay just cross-fades. (Transforms here are safe: the overlay is a
  // sibling of the page, never an ancestor of the home page's GSAP fixed pin.)
  const overlayVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : -24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.5, ease: EASE_CINEMATIC },
      },
      exit: {
        opacity: 0,
        y: reduce ? 0 : -24,
        transition: { duration: reduce ? 0 : 0.4, ease: EASE_CINEMATIC },
      },
    }),
    [reduce],
  );

  const listVariants: Variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: reduce ? {} : { staggerChildren: 0.05, delayChildren: 0.12 },
      },
      exit: {
        transition: reduce ? {} : { staggerChildren: 0.03, staggerDirection: -1 },
      },
    }),
    [reduce],
  );

  const itemVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: reduce ? 0 : 0.5, ease: EASE_CINEMATIC },
      },
      exit: {
        opacity: 0,
        y: reduce ? 0 : 10,
        transition: { duration: reduce ? 0 : 0.25, ease: EASE_CINEMATIC },
      },
    }),
    [reduce],
  );

  return (
    <motion.div
      key="site-menu"
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!isPresent}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="site-menu-scrim fixed inset-0 z-0 flex flex-col"
    >
      {/* Spacer matching the header bar; the real bar (wordmark + Close)
          renders above the scrim, so the menu doesn't duplicate it. */}
      <div aria-hidden className="h-16 shrink-0 sm:h-20" />

      <motion.nav
        variants={listVariants}
        className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center gap-2 px-5 sm:px-8"
      >
        {NAV_LINKS.map((link, index) => {
          const active = pathname === link.href;
          return (
            <motion.div key={link.href} variants={itemVariants}>
              <Link
                href={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`inline-block w-fit py-1.5 font-display text-4xl tracking-tight transition-colors duration-300 ease-cinematic hover:text-foreground sm:text-6xl ${
                  active ? "text-foreground" : "text-foreground/55"
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <motion.div
        variants={itemVariants}
        className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 px-5 pb-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8"
      >
        <a href={`mailto:${contact.email}`} className="py-1 hover:text-foreground">
          {contact.email}
        </a>
        <div className="flex items-center gap-5">
          {socials.map((profile) => (
            <a
              key={profile.platform}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              aria-label={profile.platform}
              className="inline-flex items-center gap-2 py-1 transition-colors hover:text-foreground"
            >
              <SocialIcon platform={profile.platform} size={20} />
              <span className={hasSocialIcon(profile.platform) ? "sr-only" : undefined}>
                {profile.platform}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
