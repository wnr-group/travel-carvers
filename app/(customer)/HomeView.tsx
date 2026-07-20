'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/customer/HeroSection';
import TrustBadges from '@/components/customer/TrustBadges';
import {
  HomePackageCard,
  HomePackageCardSkeleton,
  type HomePackage,
} from '@/components/customer/HomePackageCard';
import {
  HomeCategoryCard,
  HomeCategoryCardSkeleton,
  type HomeCategory,
} from '@/components/customer/HomeCategoryCard';
import { useFeaturedPackages, useTrendingPackages, usePublicSettings } from '@/lib/hooks/usePackages';
import { useCategories } from '@/lib/hooks/useCategories';
import TestimonialsCarousel from '@/components/customer/TestimonialsCarousel';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import { Globe, Package, HeartHandshake, Smile, Compass, MapPin } from 'lucide-react';


function ShowcaseError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorMessage
      message="Something went wrong while loading. Please try again."
      retry={onRetry}
    />
  );
}

function PackageShowcaseGrid({
  isLoading,
  isError,
  data,
  onRetry,
  badge,
  emptyText,
  showPricesGlobally = true,
}: {
  isLoading: boolean;
  isError: boolean;
  data?: HomePackage[];
  onRetry: () => void;
  badge?: string;
  emptyText: string;
  showPricesGlobally?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <HomePackageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <ShowcaseError onRetry={onRetry} />;

  const items = data ?? [];
  if (items.length === 0) return <EmptyState variant="packages" description={emptyText} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((pkg) => (
        <HomePackageCard key={pkg.id} pkg={pkg} badge={badge} showPricesGlobally={showPricesGlobally} />
      ))}
    </div>
  );
}

function CategoryShowcaseGrid({
  isLoading,
  isError,
  data,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  data?: HomeCategory[];
  onRetry: () => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <HomeCategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <ShowcaseError onRetry={onRetry} />;

  const items = data ?? [];
  if (items.length === 0) return <EmptyState variant="categories" />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {items.map((category) => (
        <HomeCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Dynamic homepage content — see lib/hooks/usePackages.ts and useCategories.ts.
  const featured = useFeaturedPackages();
  const trending = useTrendingPackages();
  const categories = useCategories();
  const { data: settingsData } = usePublicSettings();
  const showPricesGlobally = settingsData?.show_prices_globally !== false;

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Cycle through cards to highlight them
  useEffect(() => {
    let currentIndex = 0;

    const cycleCards = () => {
      setActiveCard(currentIndex);
      currentIndex = (currentIndex + 1) % 6; // Cycle through 0-5
    };

    // Start immediately
    cycleCards();

    // Continue cycling every 2 seconds
    const interval = setInterval(cycleCards, 2000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="w-full overflow-y-auto">
      {/* Hero Section with Carousel and Map */}
      <HeroSection />

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Featured Packages Section */}
      <section id="featured" className="py-20 bg-[#FEFAE0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12 scroll-animate opacity-0 translate-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-2">
                Featured Packages
              </h2>
              <p className="text-gray-600 text-lg">
                Hand-picked journeys our travellers love
              </p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1A3C34] to-[#A9B388] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <PackageShowcaseGrid
            isLoading={featured.isLoading}
            isError={featured.isError}
            data={featured.data}
            onRetry={featured.refetch}
            badge="FEATURED"
            emptyText="No featured packages yet. Check back soon!"
            showPricesGlobally={showPricesGlobally}
          />
        </div>
      </section>

      {/* Trending Packages Section */}
      <section id="packages" className="py-20 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12 scroll-animate opacity-0 translate-y-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-2">
                Trending Packages
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our most popular destinations
              </p>
            </div>
            <Link href="/packages" className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1A3C34] to-[#A9B388] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
              View More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <PackageShowcaseGrid
            isLoading={trending.isLoading}
            isError={trending.isError}
            data={trending.data}
            onRetry={trending.refetch}
            badge="TRENDING"
            emptyText="No trending packages right now. Explore all our packages instead."
            showPricesGlobally={showPricesGlobally}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#FEFAE0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A3C34] mb-4">
              Travel Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose your perfect adventure from our curated travel experiences
            </p>
          </div>

          <CategoryShowcaseGrid
            isLoading={categories.isLoading}
            isError={categories.isError}
            data={categories.data}
            onRetry={categories.refetch}
          />
        </div>
      </section>

      {/* Stats/Badges Section */}
      <section className="py-24 bg-[#FEFAE0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A3C34] mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg">Trusted by thousands of travelers worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { val: "50+", label: "Countries", icon: Globe, bgColor: "bg-blue-50", borderColor: "border-blue-200", iconGradient: "from-blue-400 to-blue-600", textColor: "text-blue-900" },
              { val: "200+", label: "Packages", icon: Package, bgColor: "bg-purple-50", borderColor: "border-purple-200", iconGradient: "from-purple-400 to-purple-600", textColor: "text-purple-900" },
              { val: "24/7", label: "Support", icon: HeartHandshake, bgColor: "bg-rose-50", borderColor: "border-rose-200", iconGradient: "from-rose-400 to-rose-600", textColor: "text-rose-900" },
              { val: "10K+", label: "Travelers", icon: Smile, bgColor: "bg-amber-50", borderColor: "border-amber-200", iconGradient: "from-amber-400 to-amber-600", textColor: "text-amber-900" },
              { val: "500+", label: "Guides", icon: Compass, bgColor: "bg-emerald-50", borderColor: "border-emerald-200", iconGradient: "from-emerald-400 to-emerald-600", textColor: "text-emerald-900" },
              { val: "1K+", label: "Spots", icon: MapPin, bgColor: "bg-teal-50", borderColor: "border-teal-200", iconGradient: "from-teal-400 to-teal-600", textColor: "text-teal-900" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer border-2 ${stat.borderColor} ${activeCard === i
                    ? 'scale-110 -translate-y-2 shadow-2xl ring-4 ring-offset-2'
                    : ''
                  }`}
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  ...(activeCard === i && {
                    ringColor: stat.borderColor.replace('border-', ''),
                  })
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${stat.iconGradient} flex items-center justify-center mb-4 transition-transform duration-500 hover:rotate-12 hover:scale-125 ${activeCard === i ? 'rotate-12 scale-125' : ''
                    }`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-3xl font-bold ${stat.textColor} mb-2`}>{stat.val}</h3>
                  <p className="text-gray-600 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Badges */}
          <div className="mt-20 flex flex-wrap justify-center gap-6">
            {["World Class", "Award Winning", "Best Price", "Secure Booking", "Expert Guides"].map((text, i) => (
              <div key={i} className="relative  bg-gradient-to-br from-[#1A3C34] to-[#A9B388] group-hover:bg-[#1A3C34] text-white px-6 py-3 rounded-sm shadow-md font-bold text-sm uppercase tracking-widest overflow-hidden hover:bg-[#1A3C34] transition-colors duration-500 before:absolute before:left-[-10px] before:top-2 before:w-5 before:h-5 before:bg-[#FEFAE0] before:rounded-full after:absolute after:right-[-10px] after:top-2 after:w-5 after:h-5 after:bg-[#FEFAE0] after:rounded-full">
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FEFAE0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <TestimonialsCarousel />
        </div>
      </section>

      <style jsx global>{`
        /* Testimonials scroll animation */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }

        .hover\:pause-animation:hover {
          animation-play-state: paused;
        }

        /* Page load animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        /* Scroll-triggered animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scroll-animate {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          scale: 1 !important;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Hover lift effect */
        .hover\:-translate-y-2:hover {
          transform: translateY(-0.5rem);
        }

        /* Pulse animation for CTA buttons */
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(140, 163, 132, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(140, 163, 132, 0);
          }
        }

        button:hover {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>
    </div>
  );
}
