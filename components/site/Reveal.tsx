"use client";

import { motion, useReducedMotion } from "motion/react";

/** Props for {@link Reveal}. */
export interface RevealProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  /** Seconds to delay the reveal, for staggering sibling blocks. */
  readonly delay?: number;
}

/**
 * Scroll-reveal wrapper: fades and lifts its children into view once, when they
 * enter the viewport. Collapses to a plain container under reduced-motion.
 *
 * @module components/site/Reveal
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
