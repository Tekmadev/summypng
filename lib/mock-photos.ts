/**
 * Mock photo data for building and previewing the galleries before Supabase is
 * wired. Uses seeded grayscale placeholders so the dark, editorial layout reads
 * correctly. Replace `getMockPhotos` with a Supabase query in Phase 2/3 wiring;
 * the returned shape intentionally mirrors the public-facing fields of `Photo`.
 *
 * DEV ONLY. The placeholder host (picsum.photos) is allowed in next.config.ts
 * and should be removed once real images land.
 *
 * @module lib/mock-photos
 */

import { services } from "@/config/business";
import type { CategoryLabel, PhotoCategory } from "@/types";

/** A display-ready photo for the gallery grid and lightbox. */
export interface MockPhoto {
  readonly id: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/** A wide, captioned photo for the home horizontal-scroll strip. */
export interface FeaturedPhoto extends MockPhoto {
  readonly label: CategoryLabel;
}

/** A spread of portrait/landscape/square ratios for a varied masonry rhythm. */
const ASPECTS: ReadonlyArray<readonly [number, number]> = [
  [1600, 2000],
  [1600, 1067],
  [1600, 2400],
  [1600, 1200],
  [1600, 1066],
  [1600, 1800],
  [1600, 1067],
  [1600, 2133],
  [1600, 1400],
];

/** Human-readable subject hints per category, used to build alt text. */
const SUBJECTS: Record<PhotoCategory, string> = {
  people: "portrait",
  businesses: "commercial brand frame",
  hospitality: "venue interior",
  "real-estate": "architectural interior",
};

/**
 * Build a deterministic set of mock photos for a category.
 * @param category One of the four service categories.
 * @param count How many photos to return (defaults to the full aspect set).
 * @returns Display-ready mock photos with stable ids and seeded sources.
 */
export function getMockPhotos(
  category: PhotoCategory,
  count: number = ASPECTS.length,
): MockPhoto[] {
  return Array.from({ length: count }, (_, index) => {
    const [width, height] = ASPECTS[index % ASPECTS.length]!;
    const seed = `${category}-${index + 1}`;
    return {
      id: seed,
      src: `https://picsum.photos/seed/${seed}/${width}/${height}?grayscale`,
      width,
      height,
      alt: `Moody, cinematic ${SUBJECTS[category]} in Montreal by Summy Singh.`,
    };
  });
}

/** Wide panels for the home page horizontal-scroll strip (one per category, plus repeats). */
const FEATURED_ORDER: readonly PhotoCategory[] = [
  "people",
  "hospitality",
  "businesses",
  "real-estate",
  "people",
  "hospitality",
];

/**
 * A curated row of wide, captioned photos for the signature horizontal-scroll
 * section on the home page.
 * @returns Six landscape mock photos labelled by category.
 */
export function getFeaturedPhotos(): FeaturedPhoto[] {
  return FEATURED_ORDER.map((category, index) => {
    const label =
      services.find((service) => service.key === category)?.label ?? "People";
    return {
      id: `featured-${index + 1}`,
      src: `https://picsum.photos/seed/featured-${category}-${index}/1600/1000?grayscale`,
      width: 1600,
      height: 1000,
      alt: `Selected work: moody, cinematic ${SUBJECTS[category]} in Montreal by Summy Singh.`,
      label,
    };
  });
}
