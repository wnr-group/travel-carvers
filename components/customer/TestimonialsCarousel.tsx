'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionValueEvent, animate, useInView, Variants } from 'framer-motion';
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react';
import { usePublicTestimonials } from '@/lib/hooks/useTestimonials';

const FALLBACK_TESTIMONIALS = [
  { id: 'fb1', customer_name: 'Sarah Johnson', customer_role: 'Verified Adventurer', review_text: 'The Taj Mahal tour was absolutely breathtaking! Travel Carvers made everything seamless, and the local guides were incredibly knowledgeable.', rating: 5, photo_url: null },
  { id: 'fb2', customer_name: 'Rajesh Kumar', customer_role: 'Verified Explorer', review_text: 'Best travel experience ever! The Kerala backwaters trip was magical. Highly professional organization and great attention to detail!', rating: 5, photo_url: null },
  { id: 'fb3', customer_name: 'Emily Chen', customer_role: 'Verified Wanderer', review_text: 'Tokyo and Bali in one trip - a dream come true! Travel Carvers managed everything with such excellence and care. Will definitely book again.', rating: 5, photo_url: null },
  { id: 'fb4', customer_name: 'Michael Brown', customer_role: 'Verified Traveler', review_text: 'Our Dubai luxury package exceeded all expectations! High-end bookings and seamless transfers. A truly premium travel brand.', rating: 5, photo_url: null },
  { id: 'fb5', customer_name: 'Priya Sharma', customer_role: 'Verified Traveler', review_text: 'Our Maldives honeymoon was perfect! Romantic setup, wonderful beach villas, and amazing service throughout.', rating: 5, photo_url: null },
  { id: 'fb6', customer_name: 'Alex Martinez', customer_role: 'Verified Explorer', review_text: 'Switzerland Alps tour was stunning! Beautiful scenery, crisp mountain air, and excellent accommodation.', rating: 5, photo_url: null },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

export default function TestimonialsCarousel() {
  const testimonialsQuery = usePublicTestimonials();

  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const x = useMotionValue(0);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const dbTestimonials = testimonialsQuery.data || [];
  const featuredTestimonials = dbTestimonials.filter((t) => t.is_featured);
  const testimonialsToUse = featuredTestimonials.length > 0 ? featuredTestimonials : dbTestimonials;
  const activeTestimonials = testimonialsToUse.length > 0 ? testimonialsToUse : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    const updateWidth = () => {
      if (cardRef.current && activeTestimonials.length > 0) {
        const cardWidth = cardRef.current.offsetWidth;
        const gap = 20; // gap-5 in tailwind
        const setWidth = (cardWidth + gap) * activeTestimonials.length;
        setSingleSetWidth(setWidth);
        x.jump(-setWidth);
      }
    };
    updateWidth();
    // Add small delay to ensure cards are fully rendered
    const timer = setTimeout(updateWidth, 100);

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [x, activeTestimonials.length]);

  // Auto-play loop
  useEffect(() => {
    if (singleSetWidth === 0 || isHovering) return;

    let animationFrameId: number;
    const speed = 0.8; // speed of auto-play

    const play = () => {
      const currentX = x.get();
      x.set(currentX - speed);
      animationFrameId = requestAnimationFrame(play);
    };

    animationFrameId = requestAnimationFrame(play);
    return () => cancelAnimationFrame(animationFrameId);
  }, [singleSetWidth, isHovering, x]);

  useMotionValueEvent(x, "change", (latestX) => {
    if (singleSetWidth === 0 || activeTestimonials.length === 0) return;
    if (latestX > -singleSetWidth) {
      x.jump(latestX - singleSetWidth);
      return;
    } else if (latestX <= -singleSetWidth * 2) {
      x.jump(latestX + singleSetWidth);
      return;
    }
    const positionWithinSet = Math.abs(latestX + singleSetWidth);
    const scrollPercentage = positionWithinSet / singleSetWidth;
    let index = Math.round(scrollPercentage * activeTestimonials.length);
    if (index >= activeTestimonials.length) index = 0;
    setActiveIndex(index);
  });

  const handleDotClick = (index: number) => {
    if (singleSetWidth === 0 || activeTestimonials.length === 0) return;
    const itemWidth = singleSetWidth / activeTestimonials.length;
    const targetX = -singleSetWidth - (index * itemWidth);
    animate(x, targetX, { type: "spring", stiffness: 220, damping: 28 });
  };

  const handlePrev = () => {
    if (singleSetWidth === 0 || activeTestimonials.length === 0) return;
    const cardWidth = singleSetWidth / activeTestimonials.length;
    const currentX = x.get();
    const nearestIndex = Math.round(Math.abs(currentX + singleSetWidth) / cardWidth);
    const targetIndex = (nearestIndex - 1 + activeTestimonials.length) % activeTestimonials.length;
    const targetX = -singleSetWidth - (targetIndex * cardWidth);
    animate(x, targetX, { type: "spring", stiffness: 220, damping: 28 });
  };

  const handleNext = () => {
    if (singleSetWidth === 0 || activeTestimonials.length === 0) return;
    const cardWidth = singleSetWidth / activeTestimonials.length;
    const currentX = x.get();
    const nearestIndex = Math.round(Math.abs(currentX + singleSetWidth) / cardWidth);
    const targetIndex = (nearestIndex + 1) % activeTestimonials.length;
    const targetX = -singleSetWidth - (targetIndex * cardWidth);
    animate(x, targetX, { type: "spring", stiffness: 220, damping: 28 });
  };



  // Triple the items to make the infinite loop layout complete
  const extendedTestimonials = [...activeTestimonials, ...activeTestimonials, ...activeTestimonials];

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 overflow-hidden relative"
    >


      <div className="max-w-7xl mx-auto px-6">
        {/* Header section with Framer entrance */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="flex flex-col gap-3">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#1A3C34]/15 bg-[#1A3C34]/5 text-[10px] font-bold text-[#1A3C34] tracking-[0.2em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A3C34] animate-pulse" />
                Customer Testimonials
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A3C34] leading-tight"
            >
              What Our Travelers Say
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#1A3C34] text-[#1A3C34]" />
            ))}
            <span className="ml-1.5 text-[#1A3C34]/70 text-xs md:text-sm font-semibold">Loved by travelers worldwide</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel Wrapper - Full Screen Width */}
      <div className="relative group/carousel w-full overflow-hidden px-4 md:px-12">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-[#1A3C34] hover:bg-[#A9B388] text-white hover:text-[#1A3C34] rounded-full shadow-2xl border border-white/10 transition-all cursor-pointer flex items-center justify-center focus:outline-none scale-100 hover:scale-110"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden select-none py-3"
          onPointerEnter={() => setIsHovering(true)}
          onPointerLeave={() => setIsHovering(false)}
        >
          <motion.div
            drag="x"
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            style={{ x }}
            className="flex gap-5 w-max"
          >
            {extendedTestimonials.map((t, idx) => {
              const isLightCard = idx % 2 === 0;
              const isDarkerGreen = idx % 4 === 3;

              if (isLightCard) {
                return (
                  <div
                    ref={idx === 0 ? cardRef : null}
                    key={`${t.id}-${idx}`}
                    className="w-[85vw] sm:w-[340px] md:w-[350px] flex-shrink-0 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group border-2 border-[#A9B388]/20 shadow-xl hover:shadow-2xl transition-all"
                    style={{
                      background: "linear-gradient(135deg, #FFFFFF 0%, #FEFAE0 100%)",
                    }}
                  >
                    {/* Stars */}
                    <div className="text-yellow-500 text-base mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => '⭐').join('')}
                    </div>

                    {/* Review text */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">&quot;{t.review_text}&quot;</p>

                    {/* Divider and profile */}
                    <div className="mt-auto pt-4 border-t border-[#A9B388]/20 flex items-center">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.customer_name} className="w-12 h-12 object-cover rounded-full shadow-md" draggable="false" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1A3C34] to-[#A9B388] rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                          {(t.customer_name && t.customer_name[0]) || 'T'}
                        </div>
                      )}
                      <div className="ml-3">
                        <h4 className="font-bold text-[#5F6F52] text-base leading-none mb-1">{t.customer_name}</h4>
                        <span className="text-xs text-[#A9B388] font-semibold">{t.customer_role || 'VERIFIED TRAVELER'}</span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const bgClass = isDarkerGreen
                  ? "bg-gradient-to-br from-[#A9B388] to-[#5F6F52]"
                  : "bg-gradient-to-br from-[#A9B388] to-[#A9B388]";
                const initialsBg = isDarkerGreen
                  ? "bg-white/90 backdrop-blur-sm text-[#5F6F52]"
                  : "bg-white/90 backdrop-blur-sm text-[#A9B388]";

                return (
                  <div
                    ref={idx === 0 ? cardRef : null}
                    key={`${t.id}-${idx}`}
                    className={`w-[85vw] sm:w-[340px] md:w-[350px] flex-shrink-0 ${bgClass} rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all`}
                  >
                    {/* Stars */}
                    <div className="text-yellow-300 text-base mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => '⭐').join('')}
                    </div>

                    {/* Review text */}
                    <p className="text-white/95 text-sm leading-relaxed mb-6 italic">&quot;{t.review_text}&quot;</p>

                    {/* Divider and profile */}
                    <div className="mt-auto pt-4 border-t border-white/30 flex items-center">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.customer_name} className="w-12 h-12 object-cover rounded-full shadow-md" draggable="false" />
                      ) : (
                        <div className={`w-12 h-12 ${initialsBg} rounded-full flex items-center justify-center text-lg font-bold shadow-md`}>
                          {(t.customer_name && t.customer_name[0]) || 'T'}
                        </div>
                      )}
                      <div className="ml-3">
                        <h4 className="font-bold text-white text-base leading-none mb-1">{t.customer_name}</h4>
                        <span className="text-xs text-white/80 font-semibold">{t.customer_role || 'VERIFIED TRAVELER'}</span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </motion.div>
        </motion.div>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-[#1A3C34] hover:bg-[#A9B388] text-white hover:text-[#1A3C34] rounded-full shadow-2xl border border-white/10 transition-all cursor-pointer flex items-center justify-center focus:outline-none scale-100 hover:scale-110"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Highlight Dot Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 flex items-center justify-center gap-2"
      >
        {activeTestimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden cursor-pointer"
            style={{
              width: activeIndex === idx ? 28 : 8,
              background: activeIndex === idx ? "#1A3C34" : "rgba(26, 60, 52, 0.2)",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </motion.div>
    </section>
  );
}

