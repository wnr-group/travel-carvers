import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Breadcrumb from '@/components/customer/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';
import { createMetadata, SITE } from '@/lib/seo';
import { getActiveDestinations } from '@/lib/api/public/destinations';

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: 'Destinations | Travel Carvers',
  description: `Browse every destination we run trips to. ${SITE.defaultDescription}`,
  path: '/destinations',
});


export default async function DestinationsPage() {
  const destinations = await getActiveDestinations().catch(() => []);

  return (
    <div className="min-h-screen bg-brand-tint-light pb-16">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Destinations' }]} />

      <header className="mx-auto mt-6 max-w-7xl px-5 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
          Where we go
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-brand-darkest sm:text-5xl">Destinations</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-brand-medium sm:text-base">
          {destinations.length > 0
            ? `${destinations.length} ${destinations.length === 1 ? 'destination' : 'destinations'} across our tours.`
            : 'Our destination list is on its way.'}
        </p>
      </header>

      <main className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        {destinations.length === 0 ? (
          <EmptyState
            variant="destinations"
            description="We are still adding destinations. Please check back soon, or browse all our packages."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <li key={destination.id}>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="group relative block h-64 overflow-hidden rounded-2xl shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  {destination.hero_image_url ? (
                    <Image
                      src={destination.hero_image_url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--logo-forest-dark)] to-[var(--logo-sage)]"
                    >
                      <MapPin className="h-12 w-12 text-white/70" />
                    </span>
                  )}

                  <span className="absolute inset-0 bg-gradient-to-t from-brand-darkest via-brand-darkest/30 to-transparent" />

                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-xl font-semibold text-white drop-shadow">
                      {destination.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/85">
                      {destination.city
                        ? `${destination.city}, ${destination.country}`
                        : destination.country}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
