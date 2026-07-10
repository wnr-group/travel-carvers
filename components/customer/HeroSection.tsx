'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const RealWorldMap = dynamic(() => import('@/components/RealWorldMap'), {
  ssr: false,
});

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    title: 'Mountain Adventures',
    subtitle: 'Explore breathtaking peaks',
  },
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    title: 'Tropical Paradise',
    subtitle: 'Discover exotic beaches',
  },
  {
    url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    title: 'City Escapes',
    subtitle: 'Experience urban wonders',
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    title: 'Desert Dreams',
    subtitle: 'Journey through golden sands',
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
      }, 5000); // Change slide every 5 seconds

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden z-0">
      {/* Split View - Default State */}
      <div
        className={`flex flex-col md:flex-row h-full transition-all duration-700 ${
          isMapExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left Half - Carousel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative group">
          {/* Carousel Images */}
          <div className="absolute inset-0">
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
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5F6F52]/60 via-[#5F6F52]/40 to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Carousel Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-8">
            <div className="transform transition-all duration-500 translate-y-0 opacity-100">
              {/* Logo/Brand */}
              <div className="mb-6 md:mb-8">
                <Image
                  src="/logo.png"
                  alt="Travel Carvers"
                  width={96}
                  height={96}
                  className="h-16 w-16 md:h-24 md:w-24 mx-auto rounded-full object-cover border-4 border-white/50 shadow-2xl mb-3 md:mb-4"
                  priority
                />
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 drop-shadow-2xl">
                  Travel Carvers
                </h1>
                <p className="text-base md:text-xl text-white/90 font-light tracking-wide">
                  Explore Your Next Adventure
                </p>
              </div>

              {/* Current Slide Info */}
              <div className="mt-6 md:mt-12 transform transition-all duration-500">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg">
                  {heroImages[currentSlide].title}
                </h2>
                <p className="text-base md:text-xl text-white/90 mb-4 md:mb-8">
                  {heroImages[currentSlide].subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#1A3C34] to-[#A9B388] text-white rounded-full font-bold text-base md:text-lg hover:shadow-2xl hover:scale-105 transition-all">
                    Explore Packages
                  </button>
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-bold text-base md:text-lg border-2 border-white/50 hover:bg-white/30 hover:scale-105 transition-all">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentSlide
                    ? 'w-12 h-3 bg-white rounded-full'
                    : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Half - Map Preview with Thin Frame */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative bg-[#F8F9FA] p-6 lg:p-8 flex items-center justify-center">
          
          {/* Map Container */}
          <div className="relative w-full h-full max-w-4xl cursor-pointer group/map overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
            
            {/* Map Filling the Frame */}
            <div className="absolute inset-0 z-0">
              <RealWorldMap isPreview={true} />
            </div>

            {/*Top-Right "Live Atlas" Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1A3C34]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Atlas</span>
            </div>

            {/* 2. Bottom Branded Console */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#1A3C34] via-[#1A3C34]/80 to-transparent p-6 pt-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-xl tracking-wide">Interactive World Map</h3>
                  <p className="text-[#A9B388] text-xs mt-1 uppercase tracking-widest font-semibold">50+ Countries • 200+ Destinations</p>
                </div>
                
                <button 
                  onClick={() => setIsMapExpanded(true)}
                  className="px-6 py-3 bg-white hover:bg-[#A9B388] text-[#1A3C34] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Open Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Map View */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isMapExpanded ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none z-0'
        }`}
      >
        {isMapExpanded && (
          <>
            <RealWorldMap isPreview={false} />

            {/* Close Button */}
            <button
              onClick={() => setIsMapExpanded(false)}
              className="absolute top-6 right-6 z-[2000] w-14 h-14 bg-gradient-to-br from-[#5F6F52] to-[#A9B388] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-3 border-white/50"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Instruction Overlay - Bottom Left */}
            <div className="absolute bottom-8 left-8 z-[2000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border-2 border-[#A9B388]/30">
              <p className="text-sm font-semibold text-[#5F6F52]">
                🖱️ Click markers to explore destinations • ESC to close
              </p>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Smooth fade-in for map preview */
        .map-preview-container {
          animation: slideIn 1s ease-out;
        }
      `}</style>
    </section>
  );
}
