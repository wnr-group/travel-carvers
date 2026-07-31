'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Package as PackageIcon, Search, X } from 'lucide-react';
import type { DestinationWithCount } from '@/lib/api/public/destinations';

const MAX_COUNTRY_CHIPS = 8;

function locationLabel(destination: DestinationWithCount): string {
  return destination.city ? `${destination.city}, ${destination.country}` : destination.country;
}

function DestinationCard({ destination }: { destination: DestinationWithCount }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block h-56 overflow-hidden rounded-2xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
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
          className="absolute inset-0 flex items-center justify-center bg-gradient-brand-primary"
        >
          <MapPin className="h-8 w-8 text-white/40" />
        </span>
      )}

      {/* Bottom scrim only, so any photo stays visible above the text. */}
      <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {destination.package_count > 0 && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-darkest shadow-sm backdrop-blur-sm">
          <PackageIcon aria-hidden="true" className="h-3 w-3" />
          {destination.package_count} {destination.package_count === 1 ? 'package' : 'packages'}
        </span>
      )}

      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
          <MapPin aria-hidden="true" className="h-3 w-3" />
          {locationLabel(destination)}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-white drop-shadow">{destination.name}</span>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-1 group-hover:text-white"
          />
        </span>
      </span>
    </Link>
  );
}


export default function DestinationsExplorer({
  destinations,
}: {
  destinations: DestinationWithCount[];
}) {
  const [country, setCountry] = useState('all');
  const [query, setQuery] = useState('');

  const countries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of destinations) {
      counts.set(item.country, (counts.get(item.country) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [destinations]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return destinations
      .filter((item) => {
        if (country !== 'all' && item.country !== country) return false;
        if (!term) return true;
        return (
          item.name.toLowerCase().includes(term) ||
          item.country.toLowerCase().includes(term) ||
          (item.city ?? '').toLowerCase().includes(term)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [destinations, country, query]);

  const hasFilters = country !== 'all' || query.trim() !== '';
  const clearFilters = () => {
    setCountry('all');
    setQuery('');
  };

  return (
    <div>
      {/* ------------------------------ Controls ------------------------------ */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search destinations..."
              aria-label="Search destinations"
              className="w-full rounded-full border border-brand-light bg-white py-2.5 pl-9 pr-4 text-sm text-brand-darkest placeholder:text-brand-medium/60 focus:border-brand-medium focus:outline-none focus:ring-2 focus:ring-brand-medium/30"
            />
          </div>

          {/* A long country list belongs in a select, not a wrapping chip row. */}
          {countries.length > MAX_COUNTRY_CHIPS && (
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              aria-label="Filter by country"
              className="w-full rounded-full border border-brand-light bg-white px-4 py-2.5 text-sm font-medium text-brand-darkest focus:border-brand-medium focus:outline-none focus:ring-2 focus:ring-brand-medium/30 sm:w-auto"
            >
              <option value="all">All countries ({destinations.length})</option>
              {countries.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.count})
                </option>
              ))}
            </select>
          )}
        </div>

        {countries.length <= MAX_COUNTRY_CHIPS && (
          <div className="flex flex-wrap gap-2">
            {[{ name: 'all', count: destinations.length }, ...countries].map((item) => {
              const isActive = country === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCountry(item.name)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-brand-forest bg-brand-forest text-white'
                      : 'border-brand-light bg-white text-brand-darkest hover:border-brand-medium'
                  }`}
                >
                  {item.name === 'all' ? 'All' : item.name}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-lightest/70 text-brand-dark'
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-5 flex items-center justify-between gap-4 border-b border-brand-light/60 pb-3">
        <p className="text-sm font-medium text-brand-medium">
          {visible.length} {visible.length === 1 ? 'destination' : 'destinations'}
          {country !== 'all' && ` in ${country}`}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark underline-offset-2 hover:underline"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-light bg-white/60 px-6 py-16 text-center">
          <MapPin aria-hidden="true" className="mx-auto mb-3 h-10 w-10 text-brand-light" />
          <p className="font-semibold text-brand-darkest">No destinations match that</p>
          <p className="mt-1 text-sm text-brand-medium">
            Try a different search term or country.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-brand-dark underline hover:text-brand-darkest"
          >
            Clear filters
          </button>
        </div>
      ) : (
        // Four up on wide screens: at the smaller height a 3-column card stretches too
        // wide for its content.
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((destination) => (
            <li key={destination.id}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
