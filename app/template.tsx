"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";

/**
 * Page-entry animation. A `template.tsx` re-mounts on every navigation, so this
 * gives each page a bold fade-in on first load and on route change.
 *
 * Deliberately OPACITY-ONLY: a transform on this wrapper would become the
 * containing block for the home page's `position: fixed` GSAP pin and break the
 * horizontal-scroll section. `MotionConfig reducedMotion="user"` neutralizes
 * transform/layout animations app-wide when the OS requests reduced motion.
 *
 * @module app/template
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="flex flex-1 flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
