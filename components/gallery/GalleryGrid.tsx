"use client";

import Image from "next/image";
import { useState } from "react";

import type { MockPhoto } from "@/lib/mock-photos";

import { Lightbox } from "./Lightbox";

/** A single masonry tile that fades in once its image loads. */
function GalleryItem({
  photo,
  eager,
  onOpen,
}: {
  readonly photo: MockPhoto;
  readonly eager: boolean;
  readonly onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open: ${photo.alt}`}
      className="group mb-3 block w-full break-inside-avoid overflow-hidden bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`h-auto w-full object-cover transition-all duration-700 ease-cinematic group-hover:scale-[1.03] ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

/** Props for {@link GalleryGrid}. */
export interface GalleryGridProps {
  /** Photos to display, in order. */
  readonly photos: readonly MockPhoto[];
}

/**
 * Masonry gallery grid. Clicking a photo opens the accessible {@link Lightbox}
 * with keyboard and swipe navigation. Photos lazy-load with a fade-in.
 *
 * @module components/gallery/GalleryGrid
 */
export function GalleryGrid({ photos }: GalleryGridProps) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {photos.map((photo, position) => (
          <GalleryItem
            key={photo.id}
            photo={photo}
            eager={position < 3}
            onOpen={() => setIndex(position)}
          />
        ))}
      </div>

      <Lightbox
        photos={photos}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </>
  );
}
