'use client';

import { useEffect, useRef } from 'react';
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
import { useFeaturedPackages, useTrendingPackages } from '@/lib/hooks/usePackages';
import { useCategories } from '@/lib/hooks/useCategories';
import TestimonialsCarousel from '@/components/customer/TestimonialsCarousel';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Shared section heading — eyebrow + title + subtitle, with an optional CTA  */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: { href: string; label: string };
}) {
  const centered = align === 'center';
  return (
    <div
      className={`scroll-animate opacity-0 translate-y-8 mb-12 flex flex-col gap-6 sm:flex-row sm:items-end ${
        centered ? 'sm:flex-col sm:items-center text-center' : 'sm:justify-between'
      }`}
    >
      <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium ${
            centered ? 'justify-center' : ''
          }`}
        >
          <span className="h-px w-8 bg-brand-medium/50" />
          {eyebrow}
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-brand-darkest">
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-3 text-base md:text-lg text-brand-darkest/60 ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="hidden sm:inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:gap-3 hover:bg-brand-darkest hover:shadow-md"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function MobileViewAll({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 sm:hidden">
      <Link
        href={href}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-light/60 bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-lightest/40"
      >
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grids                                                                       */
/* -------------------------------------------------------------------------- */

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
}: {
  isLoading: boolean;
  isError: boolean;
  data?: HomePackage[];
  onRetry: () => void;
  badge?: string;
  emptyText: string;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <div className="scroll-animate opacity-0 translate-y-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((pkg) => (
        <HomePackageCard key={pkg.id} pkg={pkg} badge={badge} />
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
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
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
    <div className="scroll-animate opacity-0 translate-y-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
      {items.map((category) => (
        <HomeCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const featured = useFeaturedPackages();
  const trending = useTrendingPackages();
  const categories = useCategories();

  // Reveal-on-scroll for elements tagged `.scroll-animate`.
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [featured.data, trending.data, categories.data]);

  return (
    <div className="w-full">
      {/* Hero */}
      <HeroSection />
       {/* Categories Section */}
      <section className="py-20 bg-[#FFFEFA]">
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

      {/* Featured Packages Section */}
      <section id="featured" className="py-20 bg-[#FFFEFA]">
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
          />
          <MobileViewAll href="/packages" label="View all packages" />
        </div>
      </section>

      {/* Trending packages */}
      <section id="packages" className="py-20 bg-[#FFFEFA]">
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
          />
        </div>
      </section>

      {/* Stats/Badges Section */}
      <section className="py-24 bg-[#FFFEFA] overflow-hidden">
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
      
      {/* Why choose us — trust badges from the DB (numeric → stat cards, text → pills) */}
<!--       <section className="bg-brand-tint-subtle py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why Travel Carvers"
            title="Trusted by Thousands"
            subtitle="A decade of crafting journeys travellers remember for a lifetime."
            align="center"
          />
          <TrustBadges />
        </div>
      </section> -->

      {/* Testimonials */}
      <section className="overflow-hidden bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Loved by travellers"
            title="What Our Travellers Say"
            subtitle="Real stories from the people who journeyed with us."
            align="center"
          />
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Closing CTA — uses the header/navbar brand gradient (the app's main color) */}
      <section className="bg-gradient-brand-navbar">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Ready to carve your next journey?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-white/80">
            Browse our handcrafted packages or tell us your dream trip — our travel experts will design it around you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-darkest shadow-md transition-all hover:gap-3 hover:shadow-lg"
            >
              Explore all packages
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Plan a custom trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
