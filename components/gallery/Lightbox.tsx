"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { MockPhoto } from "@/lib/mock-photos";

/** Props for {@link Lightbox}. */
export interface LightboxProps {
  /** The full set of photos being viewed. */
  readonly photos: readonly MockPhoto[];
  /** Index of the open photo, or `null` when closed. */
  readonly index: number | null;
  /** Close the lightbox. */
  readonly onClose: () => void;
  /** Navigate to another photo by index. */
  readonly onNavigate: (nextIndex: number) => void;
}

const SWIPE_THRESHOLD_PX = 48;

/**
 * Accessible full-screen image lightbox.
 *
 * Keyboard: Left/Right navigate, Escape closes. Focus is trapped while open and
 * restored on close, body scroll is locked, and it is announced as a modal
 * dialog. Opens with a soft zoom. Serves the compressed image only, never
 * full resolution.
 *
 * @module components/gallery/Lightbox
 */
export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  // Keyboard, focus management, and scroll lock while open.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goPrev();
      else if (event.key === "Tab") {
        // Minimal focus trap: keep focus inside the dialog.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose, goNext, goPrev]);

  if (index === null) return null;
  const photo = photos[index]!;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${photos.length}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (delta > SWIPE_THRESHOLD_PX) goPrev();
        else if (delta < -SWIPE_THRESHOLD_PX) goNext();
        touchStartX.current = null;
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground sm:right-8 sm:top-8"
      >
        Close
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          goPrev();
        }}
        aria-label="Previous image"
        className="absolute left-3 z-10 px-3 py-6 text-foreground/60 transition-colors hover:text-foreground sm:left-6"
      >
        <span className="text-2xl">‹</span>
      </button>

      {/* The image itself; stop propagation so clicking it does not close. */}
      <figure
        onClick={(event) => event.stopPropagation()}
        className="animate-lightbox-in flex max-h-[88vh] max-w-[92vw] flex-col items-center"
      >
        <Image
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          sizes="92vw"
          priority
          className="h-auto max-h-[82vh] w-auto max-w-[92vw] object-contain"
        />
        <figcaption className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          {index + 1} / {photos.length}
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          goNext();
        }}
        aria-label="Next image"
        className="absolute right-3 z-10 px-3 py-6 text-foreground/60 transition-colors hover:text-foreground sm:right-6"
      >
        <span className="text-2xl">›</span>
      </button>
    </div>
  );
}
