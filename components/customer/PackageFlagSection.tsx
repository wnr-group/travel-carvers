'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  HomePackageCard,
  HomePackageCardSkeleton,
  type HomePackage,
} from '@/components/customer/HomePackageCard';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import { getPackageFlag, packagesHrefForFlag, type PackageFlagKey } from '@/lib/packageFlags';

export const SHOWCASE_GRID = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
export const SHOWCASE_LIMIT = 4;

export function PackageShowcaseGrid({
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

  if (isError) {
    return (
      <ErrorMessage
        message="Something went wrong while loading. Please try again."
        retry={onRetry}
      />
    );
  }

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

/** The slice of a react-query result a showcase row needs. */
export interface ShowcaseQuery {
  isLoading: boolean;
  isError: boolean;
  data?: unknown;
  refetch: () => void;
}

export interface PackageFlagSectionProps {
  flag: PackageFlagKey;
  title: string;
  description: string;
  className?: string;
  query: ShowcaseQuery;
  emptyText: string;
  hideWhenEmpty?: boolean;
  href?: string;
}

export default function PackageFlagSection({
  flag,
  title,
  description,
  className = 'bg-white',
  query,
  emptyText,
  hideWhenEmpty = false,
  href,
}: PackageFlagSectionProps) {
  const { plural, badge } = getPackageFlag(flag);
  const packages = (query.data ?? []) as HomePackage[];

  if (hideWhenEmpty && !query.isLoading && !query.isError && packages.length === 0) return null;

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-forest">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>

          <Link
            href={href ?? packagesHrefForFlag(flag)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md self-start sm:self-auto"
          >
            <span>View More {plural}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <PackageShowcaseGrid
          isLoading={query.isLoading}
          isError={query.isError}
          data={packages}
          onRetry={query.refetch}
          badge={badge}
          emptyText={emptyText}
        />
      </div>
    </section>
  );
}
