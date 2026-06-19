/**
 * Renders a schema.org JSON-LD document as a `<script type="application/ld+json">`.
 *
 * Presentational only - the structured data itself is built by pure functions
 * in {@link lib/seo}. Server-rendered so crawlers and answer engines read it
 * without executing JavaScript.
 *
 * @module components/JsonLd
 */

/** Props for {@link JsonLd}. */
export interface JsonLdProps {
  /** A JSON-serializable schema.org document (e.g. a `@graph`). */
  readonly data: Record<string, unknown>;
}

/**
 * Inject a JSON-LD block.
 *
 * `JSON.stringify` output is safe inside a script tag, but we defensively
 * escape `<` to avoid any chance of breaking out of the element.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
