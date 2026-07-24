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
import { useFeaturedPackages, useTrendingPackages } from '@/lib/hooks/usePackages';
import { useCategories } from '@/lib/hooks/useCategories';
import type { HomepageSectionsContent } from '@/lib/api/public/homepageSections';
import TestimonialsCarousel from '@/components/customer/TestimonialsCarousel';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import Image from 'next/image';
import AllCategoriesModal from '@/components/customer/AllCategoriesModal';
import GroupPackagesSection from '@/components/customer/GroupPackagesSection';

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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md"
        >
          {action.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grids                                                                     */
/* -------------------------------------------------------------------------- */

function ShowcaseError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorMessage
      message="Something went wrong while loading. Please try again."
      retry={onRetry}
    />
  );
}

/** Four across on desktop — matches the Trending and Featured rows. */
const SHOWCASE_GRID = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
const SHOWCASE_LIMIT = 4;

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
      <div className={SHOWCASE_GRID}>
        {Array.from({ length: SHOWCASE_LIMIT }).map((_, i) => (
          <HomePackageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <ShowcaseError onRetry={onRetry} />;

  const items = (data ?? []).slice(0, SHOWCASE_LIMIT);
  if (items.length === 0) return <EmptyState variant="packages" description={emptyText} />;

  return (
    <div className={SHOWCASE_GRID}>
      {items.map((pkg) => (
        <HomePackageCard key={pkg.id} pkg={pkg} badge={badge} />
      ))}
    </div>
  );
}

/** One full row on desktop. Anything beyond this lives behind "View more categories". */
const CATEGORY_ROW_SIZE = 6;

const CATEGORY_GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6';

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
      <div className={CATEGORY_GRID}>
        {Array.from({ length: CATEGORY_ROW_SIZE }).map((_, i) => (
          <HomeCategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <ShowcaseError onRetry={onRetry} />;

  const items = data ?? [];
  if (items.length === 0) return <EmptyState variant="categories" />;

  return (
    <div className={`scroll-animate opacity-0 translate-y-8 ${CATEGORY_GRID}`}>
      {items.slice(0, CATEGORY_ROW_SIZE).map((category) => (
        <HomeCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home({ sections }: { sections: HomepageSectionsContent | null }) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const featured = useFeaturedPackages();
  const trending = useTrendingPackages();
  const categories = useCategories();

  // Drives the header's "View more" button, which sits outside the grid component.
  const hiddenCategoryCount = Math.max(
    0,
    (categories.data?.length ?? 0) - CATEGORY_ROW_SIZE
  );

  // Section headings come from the admin's Homepage Manager; the wording below is the
  // fallback for a site that has never saved one.
  const trendingTitle = sections?.trending_title?.trim() || 'Most Loved Around The World';
  const trendingDescription =
    sections?.trending_description?.trim() || 'Explore destinations everyone is booking right now.';
  const featuredTitle = sections?.featured_title?.trim() || 'Handpicked Experiences For You';
  const featuredDescription =
    sections?.featured_description?.trim() || 'Curated journeys hand-selected by our travel experts.';

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
      <HeroSection sections={sections} />
      {/* Categories Section */}
      <section className="py-20 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 flex flex-col gap-5 scroll-animate opacity-0 translate-y-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-brand-forest mb-3">
                Travel Categories
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Choose your perfect adventure from our curated travel experiences
              </p>
            </div>

            {hiddenCategoryCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md"
              >
                View more categories
                <span className="rounded-full bg-brand-forest/10 px-2 py-0.5 text-xs font-bold">
                  +{hiddenCategoryCount}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <CategoryShowcaseGrid
            isLoading={categories.isLoading}
            isError={categories.isError}
            data={categories.data}
            onRetry={categories.refetch}
          />

          <AllCategoriesModal
            open={showAllCategories}
            categories={categories.data ?? []}
            onClose={() => setShowAllCategories(false)}
          />
        </div>
      </section>

      {/* Trending Packages (Most Loved Around The World) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-forest">{trendingTitle}</h2>
              <p className="text-sm text-gray-600 mt-1">{trendingDescription}</p>
            </div>
            <Link
              href="/packages"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md self-start sm:self-auto"
            >
              <span>View All Destinations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <PackageShowcaseGrid
            isLoading={trending.isLoading}
            isError={trending.isError}
            data={trending.data}
            onRetry={trending.refetch}
            badge="TRENDING"
            emptyText="No trending packages right now. Browse all our packages instead."
          />
        </div>
      </section>

      {/* Highlighted Visa Service Banner */}
      <section className="my-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Outer Banner Box with Light Editorial Background */}
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-shell via-brand-linen to-brand-sand border border-brand-sage/30 shadow-xl px-6 py-10 sm:p-12 overflow-visible flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left Side: Real Uploaded Image Container with Realistic Frame Style */}
          <div className="relative lg:w-1/3 flex justify-center lg:justify-start -mt-16 sm:-mt-20 lg:-mt-12 lg:-ml-16 mb-4 lg:mb-0 shrink-0">
            <div className="relative w-[280px] sm:w-[340px] h-[190px] sm:h-[220px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500 bg-black">
              <Image
                src="/passport-img.jpg"
                alt="Visa and Passport Travel Flatlay"
                fill
                sizes="(max-width: 640px) 280px, 340px"
                className="object-cover filter brightness-[0.95]"
              />
              {/* Subtle aesthetic gradient tint */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-forest/15 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Center/Right Side: Content, Checklist & CTA */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-brand-forest/10 text-brand-forest text-[11px] font-bold uppercase tracking-[0.2em] rounded-full mb-3">
              Visa Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-forest tracking-tight mb-3">
              Hassle-free Visa Processing
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed max-w-2xl">
              We make your travel smooth with expert visa assistance for all major countries with fast documentation support.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-left max-w-2xl">
              {['Tourist Visa', 'Business Visa', 'Student Visa', 'Fast Processing', 'Hajj / Umrah Visa', 'Expert Guidance'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-brand-forest">
                  <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/visa"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-7 py-3.5 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Packages (Handpicked Experiences For You) */}
      <section className="py-16 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-forest">{featuredTitle}</h2>
              <p className="text-sm text-gray-600 mt-1">{featuredDescription}</p>
            </div>
            <Link
              href="/packages"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md self-start sm:self-auto"
            >
              <span>View All Packages</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <PackageShowcaseGrid
            isLoading={featured.isLoading}
            isError={featured.isError}
            data={featured.data}
            onRetry={featured.refetch}
            badge="FEATURED"
            emptyText="No featured packages yet. Browse all our packages instead."
          />
        </div>
      </section>

      {/* Group packages */}
      <GroupPackagesSection />

      {/* Why choose us — trust badges from the DB (numeric → stat cards, text → pills) */}
      <section className="bg-brand-tint-subtle py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why Travel Carvers"
            title="Trusted by Thousands"
            subtitle="A decade of crafting journeys travellers remember for a lifetime."
            align="center"
          />
          <TrustBadges />
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Closing CTA — uses the header/navbar brand gradient (the app's main color) */}
      <section className="w-full py-16 bg-brand-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl py-16 md:py-20 px-6 sm:px-12 text-white shadow-2xl">
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
                alt="Travel background"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-forest/80 via-brand-dark/75 to-brand-forest/80 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md mb-6 shadow-sm">
                <Compass className="h-3.5 w-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '12s' }} />
                <span>Start Exploring Today</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Ready to carve your next journey?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-white/95 font-medium leading-relaxed">
                Browse our handcrafted packages or tell us your dream trip — our travel experts will design it around you.
              </p>

              {/* Buttons layout */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs md:text-sm font-bold text-brand-forest shadow-lg transition-all duration-300 hover:gap-3 hover:bg-gray-100 hover:scale-105"
                >
                  <span>Explore all packages</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-transparent px-7 py-3.5 text-xs md:text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-white hover:scale-105"
                >
                  <span>Plan a custom trip</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}