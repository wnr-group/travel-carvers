import type { Metadata } from 'next';
import Image from 'next/image';
import { Compass, Globe2, MapPin, Package as PackageIcon } from 'lucide-react';
import Breadcrumb from '@/components/customer/Breadcrumb';
import DestinationsExplorer from '@/components/customer/DestinationsExplorer';
import EmptyState from '@/components/ui/EmptyState';
import { createMetadata, SITE } from '@/lib/seo';
import { getActiveDestinationsWithCounts } from '@/lib/api/public/destinations';

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: 'Destinations | Travel Carvers',
  description: `Browse every destination we run trips to. ${SITE.defaultDescription}`,
  path: '/destinations',
});


const BANNER_IMAGE ='/destination-image.jpg';

function Stat({ icon: Icon, value, label }: { icon: typeof Globe2; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-xl font-black leading-none text-white">{value}</span>
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {label}
        </span>
      </span>
    </div>
  );
}

export default async function DestinationsPage() {
  const destinations = await getActiveDestinationsWithCounts().catch(() => []);

  // Banner stats only — the listing itself groups and filters client-side.
  const countryCount = new Set(destinations.map((item) => item.country)).size;
  const totalPackages = destinations.reduce((sum, item) => sum + item.package_count, 0);

  return (
    <div className="min-h-screen bg-brand-tint-light pb-20">
      {/* ------------------------------- Banner ------------------------------- */}
      <header className="relative isolate overflow-hidden">
        <Image
          src={BANNER_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />

        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-12">
          <Breadcrumb
            tone="light"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Destinations' },
            ]}
          />

          <div className="mt-6 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <Compass aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
              Where we go
            </span>

            <h1 className="mt-4 text-4xl font-black leading-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
              Every corner of our map
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              {destinations.length > 0
                ? 'From backwaters and beaches to skylines and snow — browse the places we plan trips to, and the packages that go there.'
                : 'Our destination list is on its way. In the meantime, browse all of our packages.'}
            </p>

            {destinations.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Stat icon={MapPin} value={destinations.length} label="Destinations" />
                <Stat icon={Globe2} value={countryCount} label="Countries" />
                {totalPackages > 0 && (
                  <Stat icon={PackageIcon} value={totalPackages} label="Packages" />
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------ Listing ------------------------------- */}
      <main className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        {destinations.length === 0 ? (
          <EmptyState
            variant="destinations"
            description="We are still adding destinations. Please check back soon, or browse all our packages."
          />
        ) : (
          <DestinationsExplorer destinations={destinations} />
        )}
      </main>
    </div>
  );
}
