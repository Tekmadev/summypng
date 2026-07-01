import { PageHeader } from "@/components/site/PageHeader";
import { LEGAL_EFFECTIVE_DATE, type LegalDoc } from "@/config/legal";

/**
 * Renders a {@link LegalDoc} (Privacy Policy, Terms of Use) as a long-form
 * editorial document: the standard page header, a "last updated" line, then
 * each section as a display heading with prose and optional bullets. Server
 * component; content comes from `config/legal`.
 *
 * @module components/site/LegalDocument
 */
export function LegalDocument({
  doc,
  eyebrow,
}: {
  readonly doc: LegalDoc;
  readonly eyebrow: string;
}) {
  return (
    <main className="flex-1 px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <PageHeader eyebrow={eyebrow} title={doc.title} intro={doc.summary} />

      <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-muted">
        Last updated {LEGAL_EFFECTIVE_DATE}
      </p>

      <div className="mt-12 max-w-3xl space-y-12 sm:mt-16">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              {section.heading}
            </h2>

            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/70">
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {section.bullets ? (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-base leading-relaxed text-foreground/70"
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
