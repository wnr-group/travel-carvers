'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import Reveal from '@/components/customer/Reveal';
import { useMapOverlay } from './MapOverlayContext';

const RealWorldMap = dynamic(() => import('@/components/RealWorldMap'), {
  ssr: false,
});


export default function WorldMapSection() {
  const { isMapExpanded, setMapExpanded: setIsMapExpanded } = useMapOverlay();
  const reduceMotion = useReducedMotion();
  const rise = reduceMotion ? 0 : 28;

  // Keyboard support for closing map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapExpanded) {
        setIsMapExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapExpanded, setIsMapExpanded]);

  // The expanded view covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!isMapExpanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMapExpanded]);

  const [navHeight, setNavHeight] = useState(80);
  useEffect(() => {
    if (!isMapExpanded) return;

    const measure = () => {
      const nav = document.querySelector('nav');
      if (nav) setNavHeight(Math.ceil(nav.getBoundingClientRect().height));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isMapExpanded]);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
            <span className="h-px w-8 bg-brand-medium/50" />
            Interactive Globe
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-darkest">
            Explore World Map
          </h2>
          <p className="mt-3 text-base md:text-lg text-brand-darkest/60">
            Click regions to uncover tailored packages from every corner of the world.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative isolate w-full h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_-12px_rgba(26,60,52,0.25)] ring-1 ring-brand-forest/10">
            {/* Unmounted while expanded so only one Leaflet instance ever exists. */}
            {!isMapExpanded && (
              <RealWorldMap isPreview onExpand={() => setIsMapExpanded(true)} />
            )}
          </div>
        </Reveal>
      </div>

      {/* Expanded Fullscreen Map Modal View */}
      <AnimatePresence>
        {isMapExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          // overflow-hidden so nothing inside can spill past the viewport edge and
          // push right-anchored furniture out of reach.
          className="fixed inset-0 z-[90] flex flex-col overflow-hidden bg-brand-paper"
          style={{ paddingTop: navHeight }}
        >
          {/* A real header row rather than a floating button. Absolute positioning
              kept losing the close control behind the navbar or under the map's own
              full-width search field; in normal flow it cannot be covered at all. */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-forest/10 bg-white px-3 py-2 shadow-sm sm:px-6 sm:py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-brand-forest sm:text-base lg:text-lg">
                Explore World Map
              </p>
              <p className="hidden text-xs text-gray-500 sm:block">
                Click a marker to see its packages
              </p>
            </div>

            {/* Never below 44px — that is the minimum reliable touch target, and this
                is the only way out of the full-screen map on a phone. */}
            <button
              onClick={() => setIsMapExpanded(false)}
              aria-label="Close expanded map"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-brand-forest text-white shadow-lg transition-all hover:scale-110 hover:bg-black cursor-pointer sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" strokeWidth={3} />
            </button>
          </div>

          {/* min-h-0 lets this flex child actually shrink, so the map fills the rest. */}
          <div className="relative min-h-0 flex-1">
            <RealWorldMap isPreview={false} />
          </div>

          {/* Instruction Banner - Bottom Center. The wrapper keeps the -50% centring:
              motion writes its own inline transform, which would overwrite it. */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2000]">
            <motion.div
              initial={{ opacity: 0, y: rise }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-full shadow-2xl border border-brand-forest/20 text-center"
            >
              <p className="text-xs sm:text-sm font-bold text-brand-forest">
                🖱️ Click markers to explore destinations &nbsp;•&nbsp; Press{' '}
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">ESC</kbd> to exit
              </p>
            </motion.div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
