/**
 * Standard editorial page header: a small mono eyebrow, a large display title,
 * and an optional intro line. Server component.
 *
 * @module components/site/PageHeader
 */

/** Props for {@link PageHeader}. */
export interface PageHeaderProps {
  /** Small uppercase label above the title. */
  readonly eyebrow?: string;
  /** The page's visible H1. */
  readonly title: string;
  /** Optional supporting line beneath the title. */
  readonly intro?: string;
}

/** Editorial page header. */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/70">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
