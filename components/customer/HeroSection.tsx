'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, MapPin, ShieldCheck, Star } from 'lucide-react';
import type { HomepageSectionsContent } from '@/lib/api/public/homepageSections';

/** Used until the admin saves copy in the Homepage Manager (and if that read fails). */
const HERO_FALLBACK = {
  title: 'Explore Your Next Adventure',
  subtitle:
    'Handcrafted itineraries, exclusive global destinations, and seamless planning tailored precisely to your soul.',
  ctaText: 'Explore Packages',
};

/**
 * The design accents the final word of the headline. The admin writes one plain string,
 * so split the last word back out rather than losing the treatment or hardcoding it.
 */
function splitHeadline(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: '', accent: title.trim() };
  return { lead: words.slice(0, -1).join(' '), accent: words[words.length - 1] };
}

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80',
    title: 'Majestic Mountain Peaks',
    subtitle: 'Conquer scenic trails and alpine hideaways',
  },
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    title: 'Untouched Coastal Havens',
    subtitle: 'Discover crystal waters and golden island sunsets',
  },
  {
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80',
    title: 'Vibrant Global Capitals',
    subtitle: 'Immerse yourself in architecture, art, and culture',
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
    title: 'Serene Desert Horizons',
    subtitle: 'Journey through breathtaking dunes and starlit nights',
  },
];

/** The hero is above the fold, so it plays on mount rather than on scroll. */
const heroStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
};

function heroItem(distance: number): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };
}

export default function HeroSection({
  sections,
}: {
  sections: HomepageSectionsContent | null;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Honour the OS "reduce motion" setting: fade only, no travel, no slow zoom.
  const reduceMotion = useReducedMotion();
  const item = heroItem(reduceMotion ? 0 : 24);

  // Copy from the admin's Homepage Manager, falling back to the built-in wording.
  const heroTitle = sections?.hero_title?.trim() || HERO_FALLBACK.title;
  const heroSubtitle = sections?.hero_subtitle?.trim() || HERO_FALLBACK.subtitle;
  const heroCtaText = sections?.hero_cta_text?.trim() || HERO_FALLBACK.ctaText;
  const { lead, accent } = splitHeadline(heroTitle);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full overflow-hidden bg-brand-paper z-0 flex items-center pt-24 sm:pt-28 pb-12">
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.title}
              fill
              sizes="100vw"
              // Slow Ken Burns push on the slide that's showing; the outgoing slide
              // snaps back instantly so it never drifts while it fades.
              className={`object-cover brightness-[0.95] transition-transform ease-linear ${
                index === currentSlide && !reduceMotion
                  ? 'scale-110 duration-[7000ms]'
                  : 'scale-100 duration-0'
              }`}
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-forest/50 via-brand-forest/25 to-black/15" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1">

          {/* Branding, Headline & CTA Buttons */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center z-10 space-y-6"
          >

            {/* Top Eyebrow Badge */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm w-fit"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Crafting Unforgettable Journeys</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={item} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
                {lead && `${lead} `}
                <span className="text-amber-300 underline decoration-white/40 underline-offset-8">
                  {accent}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-white/95 font-medium max-w-xl mx-auto leading-relaxed pt-2 drop-shadow">
                {heroSubtitle}
              </p>
            </motion.div>

            {/* CTA Action Buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-gray-100 px-8 py-4 text-sm font-bold text-brand-forest shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Compass className="h-4 w-4 text-brand-forest" />
                <span>{heroCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/45 hover:border-white px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-white/15"
              >
                <span>Request Custom Quote</span>
              </Link>
            </motion.div>

            {/* Quick Stats Micro-bar */}
            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-white/25 text-xs text-white/90 font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-300 fill-current" />
                <span className="text-white font-bold">4.85 / 5.0</span> Rating
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-sage" />
                <span className="text-white font-bold">100%</span> Secure Booking
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full" />
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span className="text-white font-bold">200+</span> Destinations
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}