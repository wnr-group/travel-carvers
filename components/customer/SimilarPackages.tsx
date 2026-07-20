'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSimilarPackages } from '@/lib/api/public/packages';
import { mapPackage, type RawListPackage, type TravelPackage } from '@/lib/packageList';
import { PackageCard } from '@/components/customer/PackageCard';

interface SimilarPackagesProps {
  packageId: string;
  categoryId: string | null;
}

const SIMILAR_LIMIT = 4;

/* --------------------------------- Header ---------------------------------- */

function SectionHeader() {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-medium">Keep Exploring</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-brand-darkest sm:text-3xl">
        Similar Packages
      </h2>
    </div>
  );
}

/** Shared shell so every state (loading/empty/error/list) renders under one heading. */
function Section({ children }: { children: React.ReactNode }) {
  return (
    <section aria-label="Similar packages">
      <SectionHeader />
      {children}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-light/70 bg-white/50 px-6 py-12 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

/* -------------------------------- Skeletons -------------------------------- */

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)]">
      <div className="h-44 w-full animate-pulse bg-brand-lightest" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-lightest" />
        <div className="h-3 w-full animate-pulse rounded bg-brand-lightest" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-brand-lightest" />
        <div className="mt-3 h-8 w-full animate-pulse rounded bg-brand-lightest" />
      </div>
    </div>
  );
}

/**
 * Responsive layout
 */
function CardRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}

function RailItem({ children }: { children: React.ReactNode }) {
  return <div className="w-[260px] shrink-0 snap-start sm:w-auto">{children}</div>;
}

/* -------------------------------- Component -------------------------------- */

export function SimilarPackages({ packageId, categoryId }: SimilarPackagesProps) {
  const enabled = Boolean(packageId && categoryId);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['packages', 'similar', packageId, categoryId],
    queryFn: () => getSimilarPackages(packageId, categoryId as string, SIMILAR_LIMIT),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  // Reuse the catalogue mapping so cards behave identically to the listing page.
  const packages = useMemo<TravelPackage[]>(
    () => ((data ?? []) as RawListPackage[]).map(mapPackage),
    [data],
  );

  // Uncategorised package (or missing id) — nothing meaningful to recommend.
  if (!enabled) {
    return (
      <Section>
        <Note>No related packages to show for this trip yet.</Note>
      </Section>
    );
  }

  if (isLoading) {
    return (
      <Section>
        <CardRail>
          {Array.from({ length: 3 }).map((_, i) => (
            <RailItem key={i}>
              <CardSkeleton />
            </RailItem>
          ))}
        </CardRail>
      </Section>
    );
  }

  if (isError) {
    return (
      <Section>
        <Note>
          We couldn’t load similar packages right now.{' '}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="font-medium text-brand-dark underline underline-offset-2 hover:text-brand-darkest disabled:opacity-60"
          >
            Try again
          </button>
        </Note>
      </Section>
    );
  }

  if (packages.length === 0) {
    return (
      <Section>
        <Note>More packages in this category are on the way — check back soon.</Note>
      </Section>
    );
  }

  return (
    <Section>
      <CardRail>
        {packages.map((pkg) => (
          <RailItem key={pkg.id}>
            <PackageCard pkg={pkg} />
          </RailItem>
        ))}
      </CardRail>
    </Section>
  );
}
