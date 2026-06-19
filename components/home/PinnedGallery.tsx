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
 * Signature home section: a pinned horizontal-scroll strip of selected work.
 *
 * On desktop with motion allowed, the section pins and vertical scroll is
 * converted to horizontal movement across the photos (GSAP ScrollTrigger via
 * the useGSAP hook). On mobile OR when prefers-reduced-motion is set, no JS
 * animation runs and the same markup degrades to a native horizontal swipe
 * strip (CSS overflow + scroll-snap). All GSAP work is auto-reverted by
 * useGSAP's context; image listeners are cleaned up on revert/unmount.
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

          const getAmount = () =>
            Math.max(0, trackEl.scrollWidth - rootEl.offsetWidth);
          if (getAmount() === 0) return;

          gsap.to(trackEl, {
            x: () => -getAmount(),
            ease: "none",
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: () => `+=${getAmount()}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // scrollWidth is only correct after images decode; refresh then, and
          // remove the listeners on revert (breakpoint change) or unmount.
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

          return () => cleanups.forEach((off) => off());
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Selected work"
      className="relative overflow-hidden md:flex md:h-screen md:items-center"
    >
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
            <p className="absolute bottom-4 left-4 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-foreground mix-blend-difference">
              {photo.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
