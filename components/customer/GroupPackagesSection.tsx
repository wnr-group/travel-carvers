'use client';

import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import {
  HomePackageCard,
  HomePackageCardSkeleton,
  type HomePackage,
} from '@/components/customer/HomePackageCard';
import { useGroupPackages } from '@/lib/hooks/usePackages';
import Reveal from '@/components/customer/Reveal';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const GROUP_TOURS_SLUG = 'group-tours';

const SHOWCASE_LIMIT = 4;

export default function GroupPackagesSection() {

  const { data, isLoading, isError, refetch } = useGroupPackages(
    GROUP_TOURS_SLUG,
    SHOWCASE_LIMIT
  );

  const packages = (data ?? []) as unknown as HomePackage[];
  
  if (!isLoading && !isError && packages.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-forest/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-forest">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              Group Tours
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black text-brand-forest">
              Travel Together, Save Together
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fixed-departure group journeys with shared costs, expert guides and ready-made company.
            </p>
          </div>

          <Link
            href={`/categories/${GROUP_TOURS_SLUG}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-forest/25 bg-white px-6 py-3 text-sm font-bold text-brand-forest shadow-sm transition-all hover:gap-3 hover:border-brand-forest hover:shadow-md self-start sm:self-auto"
          >
            <span>View More Packages</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {isError ? (
          <ErrorMessage
            message="Something went wrong while loading group tours. Please try again."
            retry={refetch}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: SHOWCASE_LIMIT }).map((_, index) => (
                  <HomePackageCardSkeleton key={index} />
                ))
              : packages.map((pkg, i) => (
                  <Reveal key={pkg.id} delay={Math.min(i, 6) * 0.08} className="h-full">
                    <HomePackageCard pkg={pkg} badge="GROUP TOUR" />
                  </Reveal>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}