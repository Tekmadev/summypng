"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { getFeaturedPhotos } from "@/lib/mock-photos";

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = getFeaturedPhotos();

/**
 * Vertical-scroll budget for the strip, as a multiple of its horizontal travel.
 * 1 = strictly 1px down per 1px across (the strip ends the instant the last
 * photo lands, so the next section arrives abruptly). Above 1 the strip holds
 * longer and moves more slowly, giving room to take in each photo before the
 * next section appears. Tune to taste.
 */
const SCROLL_DISTANCE_FACTOR = 1.6;

/**
 * Signature home section: a horizontal-scroll strip of selected work.
 *
 * On desktop with motion allowed, an explicitly-tall section provides the
 * vertical scroll distance while a `position: sticky` pane holds the strip in
 * view; GSAP's scrub only drives the horizontal translate. This deliberately
 * avoids ScrollTrigger's `pin: true` + pinSpacing, which fails to reserve
 * scroll height inside this layout's flex chain (`body`/`main` are flex
 * columns) and let the next section scroll up over the strip. On mobile OR with
 * prefers-reduced-motion, no JS runs and the same markup degrades to a native
 * horizontal swipe strip (CSS overflow + scroll-snap). All GSAP work is
 * auto-reverted by useGSAP's context.
 *
 * @module components/home/PinnedGallery
 */
export function PinnedGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const trackEl = track.current;
      const rootEl = root.current;
      if (!trackEl || !rootEl) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };
          // Mobile or reduced-motion: leave the CSS swipe strip alone.
          if (!isDesktop || reduceMotion) return;

          // Horizontal travel = how far the track overflows the viewport.
          // Measured against the viewport width (stable), not any ancestor box.
          const getAmount = () =>
            Math.max(0, trackEl.scrollWidth - document.documentElement.clientWidth);

          // The section's height is the scroll budget: one viewport (so the
          // sticky pane is fully shown) plus the horizontal travel * factor.
          // Set before every ScrollTrigger measurement so start/end stay correct
          // across resizes and after images settle.
          const setHeight = () => {
            rootEl.style.height = `${window.innerHeight + getAmount() * SCROLL_DISTANCE_FACTOR}px`;
          };
          setHeight();
          ScrollTrigger.addEventListener("refreshInit", setHeight);

          gsap.to(trackEl, {
            x: () => -getAmount(),
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          // scrollWidth can shift as images decode; refresh once they settle,
          // and remove listeners on revert (breakpoint change) or unmount.
          const imgs = Array.from(rootEl.querySelectorAll("img"));
          const cleanups: Array<() => void> = [];
          let pending = imgs.length;
          const refresh = () => ScrollTrigger.refresh();

          if (pending === 0) {
            refresh();
          } else {
            imgs.forEach((img) => {
              if (img.complete) {
                pending -= 1;
                if (pending === 0) refresh();
                return;
              }
              const done = () => {
                pending -= 1;
                if (pending === 0) refresh();
              };
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
              cleanups.push(() => {
                img.removeEventListener("load", done);
                img.removeEventListener("error", done);
              });
            });
          }

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", setHeight);
            rootEl.style.height = "";
            cleanups.forEach((off) => off());
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Selected work" className="relative">
      {/* Sticky pane holds the strip in view while the tall section scrolls.
          The section must NOT clip overflow (that would break position:sticky),
          so the horizontal clip lives here. */}
      <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center md:overflow-hidden">
        <div
          ref={track}
          className="flex gap-3 px-5 max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-6 sm:gap-4 sm:px-8 md:h-[72vh] md:flex-nowrap md:will-change-transform"
        >
          {PHOTOS.map((photo) => (
            <article
              key={photo.id}
              className="relative aspect-[16/10] w-[82vw] shrink-0 snap-start overflow-hidden bg-surface sm:w-[60vw] md:aspect-auto md:h-full md:w-[44vw] lg:w-[38vw]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 38vw, (min-width: 768px) 44vw, 82vw"
                className="object-cover"
              />
              {/* Fixed white source for the difference blend (not the theme
                  token): in light mode a near-black foreground would barely
                  invert and the label could vanish over dark photo areas. */}
              <p className="absolute bottom-4 left-4 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-white mix-blend-difference">
                {photo.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
