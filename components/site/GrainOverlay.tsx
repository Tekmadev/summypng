/**
 * Film-grain overlay.
 *
 * A fixed, non-interactive SVG noise texture laid over the whole site at low
 * opacity with a soft-light blend. It adds cinematic film texture without ever
 * competing with the photographs, and sits below the header (z-40) and any
 * lightbox (z-50) so chrome and full-screen images stay crisp.
 *
 * @module components/site/GrainOverlay
 */

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/** Subtle cinematic grain over the entire viewport. */
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 opacity-[0.045] mix-blend-soft-light"
      style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundRepeat: "repeat" }}
    />
  );
}
