import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHeader } from "@/components/site/PageHeader";
import { getServiceBySlug, services } from "@/config/business";
import { getMockPhotos } from "@/lib/mock-photos";
import { getRouteMetadata } from "@/lib/seo";

/** Only the four known categories are valid; anything else 404s. */
export const dynamicParams = false;

type GalleryParams = { params: Promise<{ category: string }> };

/** Pre-render exactly the four service galleries. */
export function generateStaticParams() {
  return services.map((service) => ({ category: service.key }));
}

export async function generateMetadata({ params }: GalleryParams): Promise<Metadata> {
  const { category } = await params;
  const service = getServiceBySlug(category);
  return service ? getRouteMetadata(service.route) : {};
}

/**
 * Category gallery. Renders the masonry grid (with lightbox) for one of the
 * four service categories. Photos are mock placeholders until Supabase is wired.
 */
export default async function GalleryPage({ params }: GalleryParams) {
  const { category } = await params;
  const service = getServiceBySlug(category);
  if (!service) notFound();

  const photos = getMockPhotos(service.key);

  return (
    <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <PageHeader eyebrow="Work" title={service.label} intro={service.description} />
      <div className="mt-12 sm:mt-16">
        <GalleryGrid photos={photos} />
      </div>
    </main>
  );
}
