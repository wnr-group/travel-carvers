'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Compass, Sparkles, MapPin, ShieldCheck, Star } from 'lucide-react';

const RealWorldMap = dynamic(() => import('@/components/RealWorldMap'), {
  ssr: false,
});

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

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (!isMapExpanded) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5500);
      return () => clearInterval(interval);
    }
  }, [isMapExpanded]);

  // Keyboard support for closing map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapExpanded) {
        setIsMapExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapExpanded]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full overflow-hidden bg-brand-paper z-0 flex items-center">
      {/* Absolute Background Image Carousel Layer covering the whole section */}
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
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Elegant Dark Gradient Overlay for absolute contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-forest/95 via-brand-forest/80 to-black/70 backdrop-blur-[1px]" />
      </div>

      {/* Main Split-Screen Container */}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-700 ${
          isMapExpanded ? 'opacity-0 pointer-events-none scale-98' : 'opacity-100 scale-100'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Essential Branding, Headline & CTA Buttons (6 Columns) */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left z-10 space-y-6">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm w-fit">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Crafting Unforgettable Journeys</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
                Explore Your Next <span className="text-amber-300 underline decoration-white/30 underline-offset-8">Adventure</span>
              </h1>
              <p className="text-base sm:text-lg text-white/90 font-medium max-w-xl leading-relaxed pt-2">
                Handcrafted itineraries, exclusive global destinations, and seamless planning tailored precisely to your soul.
              </p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-gray-100 px-8 py-4 text-sm font-bold text-brand-forest shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Compass className="h-4 w-4 text-brand-forest" />
                <span>Explore Packages</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 hover:border-white px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10"
              >
                <span>Request Custom Quote</span>
              </Link>
            </div>

            {/* Quick Stats Micro-bar */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/20 text-xs text-white/80 font-semibold">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-300 fill-current" />
                <span className="text-white font-bold">4.85 / 5.0</span> Rating
              </div>
              <div className="w-1 h-1 bg-white/40 rounded-full" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-sage" />
                <span className="text-white font-bold">100%</span> Secure Booking
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/40 rounded-full" />
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span className="text-white font-bold">200+</span> Destinations
              </div>
            </div>

          </div>

          {/* Right Column: Larger Map Card / Interactive Preview (6 Columns) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/25 bg-black/30 backdrop-blur-md group/map">
              
              {/* Actual Map Preview Component */}
              <div className="absolute inset-0 z-0">
                <RealWorldMap isPreview={true} />
              </div>

              {/* Top-Right Glowing Live Atlas Pill */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Atlas Active</span>
              </div>

              {/* Bottom Interactive Trigger Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 block mb-1">Interactive Globe</span>
                  <h3 className="text-white font-bold text-lg sm:text-xl tracking-tight">Explore World Map</h3>
                  <p className="text-white/70 text-xs mt-0.5 font-medium">Click regions to uncover tailored packages</p>
                </div>

                <button 
                  onClick={() => setIsMapExpanded(true)}
                  className="px-5 py-3 bg-white hover:bg-amber-300 text-brand-forest font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl transform hover:scale-105 shrink-0"
                >
                  Open Map
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Expanded Fullscreen Map Modal View */}
      <div
        className={`absolute inset-0 transition-all duration-700 bg-brand-paper ${
          isMapExpanded ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none z-0'
        }`}
      >
        {isMapExpanded && (
          <>
            <div className="w-full h-full relative">
              <RealWorldMap isPreview={false} />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsMapExpanded(false)}
              aria-label="Close expanded map"
              className="absolute top-6 right-6 z-[2000] w-14 h-14 bg-brand-forest hover:bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-2 border-white/40 cursor-pointer"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Instruction Banner - Bottom Center */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-full shadow-2xl border border-brand-forest/20 text-center">
              <p className="text-xs sm:text-sm font-bold text-brand-forest">
                🖱️ Click markers to explore destinations &nbsp;•&nbsp; Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">ESC</kbd> to exit
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
