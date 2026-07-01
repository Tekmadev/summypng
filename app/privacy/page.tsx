import type { Metadata } from "next";

import { LegalDocument } from "@/components/site/LegalDocument";
import { privacyPolicy } from "@/config/legal";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/privacy");

/** Privacy Policy page. Content from `config/legal`. */
export default function PrivacyPage() {
  return <LegalDocument doc={privacyPolicy} eyebrow="Privacy" />;
}
