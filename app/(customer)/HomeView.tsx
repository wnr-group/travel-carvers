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
      {/* Categories */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Find your vibe"
            title="Travel by Category"
            subtitle="Choose your perfect adventure from our curated experiences."
            align="center"
          />
          <CategoryShowcaseGrid
            isLoading={categories.isLoading}
            isError={categories.isError}
            data={categories.data}
            onRetry={categories.refetch}
          />
        </div>
      </section>

      {/* Featured packages */}
      <section id="featured" className="bg-brand-tint-subtle py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Hand picked"
            title="Featured Packages"
            subtitle="Journeys our travellers love, chosen by our team."
            action={{ href: '/packages', label: 'View all' }}
          />
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
      <section id="packages" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Most booked"
            title="Trending Now"
            subtitle="Explore the destinations everyone is talking about."
            action={{ href: '/packages', label: 'View more' }}
          />
          <PackageShowcaseGrid
            isLoading={trending.isLoading}
            isError={trending.isError}
            data={trending.data}
            onRetry={trending.refetch}
            badge="TRENDING"
            emptyText="No trending packages right now. Explore all our packages instead."
          />
          <MobileViewAll href="/packages" label="View all packages" />
        </div>
      </section>

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
