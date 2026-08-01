'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in seconds, e.g. index * 0.08 for a cascading grid. */
  delay?: number;
  /** Distance (px) the element travels up as it fades in. */
  y?: number;
  className?: string;
}

/**
 * Fades + slides its child in the first time it scrolls into view. Self-contained
 * (each instance observes itself), so it works for content that mounts after an
 * async fetch. Honors `prefers-reduced-motion` by rendering statically.
 */
export default function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
