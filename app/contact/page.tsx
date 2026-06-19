import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/site/PageHeader";
import { brand, getPageMeta } from "@/config/business";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/contact");

/** Contact / booking page: the multi-step inquiry form. */
export default function ContactPage() {
  const { h1 } = getPageMeta("/contact");

  return (
    <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <PageHeader eyebrow="Contact" title={h1} intro={brand.contactIntro} />
      <div className="mt-12 sm:mt-16">
        <ContactForm />
      </div>
    </main>
  );
}
