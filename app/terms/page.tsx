import type { Metadata } from "next";

import { LegalDocument } from "@/components/site/LegalDocument";
import { termsOfUse } from "@/config/legal";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("/terms");

/** Terms of Use page. Content from `config/legal`. */
export default function TermsPage() {
  return <LegalDocument doc={termsOfUse} eyebrow="Legal" />;
}
