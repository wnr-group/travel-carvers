'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';


export type RevealAnimation = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in';

const DURATION = 1.05;
const EASE = [0.25, 0.1, 0.25, 1] as const;
const SHIFT_X = 60;
const ZOOM_FROM = 0.9;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  animation?: RevealAnimation;
  className?: string;
}

/** `fade-left` travels leftward, so it starts to the right — AOS's convention. */
function hiddenState(animation: RevealAnimation, y: number) {
  switch (animation) {
    case 'fade-down':
      return { opacity: 0, y: -y };
    case 'fade-left':
      return { opacity: 0, x: SHIFT_X };
    case 'fade-right':
      return { opacity: 0, x: -SHIFT_X };
    case 'zoom-in':
      return { opacity: 0, scale: ZOOM_FROM };
    default:
      return { opacity: 0, y };
  }
}


export default function Reveal({
  children,
  delay = 0,
  y = 28,
  animation = 'fade-up',
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={hiddenState(animation, y)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
