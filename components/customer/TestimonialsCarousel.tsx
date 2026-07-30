'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, animate, useInView, Variants } from 'framer-motion';
import { Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { usePublicTestimonials } from '@/lib/hooks/useTestimonials';

const AUTOPLAY_INTERVAL = 4500;
const CARD_GAP = 20;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export default function TestimonialsCarousel() {
  const testimonialsQuery = usePublicTestimonials();

  const [step, setStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  const x = useMotionValue(0);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const dbTestimonials = testimonialsQuery.data || [];
  const featuredTestimonials = dbTestimonials.filter((t) => t.is_featured);
  const activeTestimonials = featuredTestimonials.length > 0 ? featuredTestimonials : dbTestimonials;
  const count = activeTestimonials.length;

  if (count !== prevCount) {
    setPrevCount(count);
    setActiveIndex((prev) => Math.min(prev, Math.max(0, count - 1)));
  }

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        setStep(cardRef.current.offsetWidth + CARD_GAP);
      }
    };
    measure();
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [count]);

  useEffect(() => {
    const controls = animate(x, -activeIndex * step, { type: 'spring', stiffness: 220, damping: 28 });
    return () => controls.stop();
  }, [activeIndex, step, x]);

  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, count]);

  const handleDotClick = (index: number) => setActiveIndex(index);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + count) % count);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % count);

  return (
    <section
      ref={sectionRef}
      className={`w-full py-6 md:py-10 overflow-hidden relative bg-brand-paper ${count === 0 ? 'hidden' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-forest/15 bg-brand-forest/5 text-[10px] font-bold text-brand-forest tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-forest animate-pulse" />
                Customer Testimonials
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-black tracking-tight text-brand-forest"
            >
              What Our Travelers Say
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-forest text-brand-forest" />
            ))}
            <span className="ml-1.5 text-brand-forest/70 text-xs md:text-sm font-semibold">Loved by travelers worldwide</span>
          </motion.div>
        </motion.div>
      </div>

      <div
        className="relative group/carousel w-full overflow-hidden px-4 md:px-12"
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-brand-forest hover:bg-brand-sage text-white hover:text-brand-forest rounded-full shadow-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden select-none py-2"
        >
          <motion.div
            style={{ x }}
            className="flex gap-5 w-max items-stretch"
          >
            {activeTestimonials.map((t, idx) => {
              const isDarkCard = idx % 2 === 1;

              return (
                <div
                  ref={idx === 0 ? cardRef : null}
                  key={`${t.id || idx}`}
                  className={`w-[85vw] sm:w-[360px] md:w-[380px] flex-shrink-0 rounded-3xl p-8 flex flex-col justify-between relative shadow-lg transition-all duration-300 ${
                    isDarkCard
                      ? 'bg-brand-forest text-white border border-brand-forest'
                      : 'bg-brand-mist text-brand-forest border border-brand-sage/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className={`text-sm sm:text-base leading-relaxed mb-8 font-medium ${isDarkCard ? 'text-white/90' : 'text-gray-800'}`}>
                      &ldquo;{t.review_text}&rdquo;
                    </p>
                  </div>

                  <div className={`mt-auto pt-4 border-t flex items-center gap-3.5 ${isDarkCard ? 'border-white/20' : 'border-brand-forest/15'}`}>
                    {t.photo_url ? (
                      <Image
                        src={t.photo_url}
                        alt={t.customer_name}
                        width={44}
                        height={44}
                        className="w-11 h-11 object-cover rounded-full shadow-md"
                        draggable={false}
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${isDarkCard ? 'bg-brand-sage text-brand-forest' : 'bg-brand-forest text-white'}`}>
                        {t.customer_name[0]}
                      </div>
                    )}
                    <div>
                      <h4 className={`font-bold text-base leading-tight ${isDarkCard ? 'text-white' : 'text-brand-forest'}`}>
                        {t.customer_name}
                      </h4>
                      <p className={`text-xs font-semibold mt-0.5 ${isDarkCard ? 'text-brand-sage' : 'text-gray-500'}`}>
                        {t.customer_role || 'Verified Traveler'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 bg-brand-forest hover:bg-brand-sage text-white hover:text-brand-forest rounded-full shadow-xl transition-all cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-2"
      >
        {activeTestimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className="relative h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none"
            style={{
              width: activeIndex === idx ? 28 : 8,
              background: activeIndex === idx ? "var(--brand-forest)" : "var(--brand-forest-20)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={activeIndex === idx}
          />
        ))}
      </motion.div>
    </section>
  );
}
