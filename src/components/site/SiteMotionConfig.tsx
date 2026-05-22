"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honors the user's "prefers-reduced-motion" OS setting for all framer-motion
 * components inside the site layout. With `reducedMotion="user"`, framer-motion
 * keeps non-transform animations (opacity, color) and disables movement.
 * The /chat route is outside this layout and therefore unaffected.
 */
export function SiteMotionConfig({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
