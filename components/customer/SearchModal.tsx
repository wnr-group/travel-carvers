'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Search, X, Package, FolderOpen, MapPin, Clock3 } from 'lucide-react';
import { searchSite } from '@/lib/api/public/search';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { formatPrice } from '@/lib/packageList';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

const MIN_QUERY_LENGTH = 3;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Section heading inside the results list. */
function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-brand-medium first:pt-1">
      {children}
    </h3>
  );
}

/** One row in the results list — a link that closes the modal when followed. */
function ResultRow({
  href,
  icon,
  title,
  subtitle,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-lightest/60 focus-visible:bg-brand-lightest/60 focus-visible:outline-none"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand-dark">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-brand-darkest">{title}</span>
          {subtitle && <span className="block truncate text-xs text-brand-medium">{subtitle}</span>}
        </span>
      </Link>
    </li>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(query, 300);
  const activeQuery = debouncedQuery.trim();
  const enabled = isOpen && activeQuery.length >= MIN_QUERY_LENGTH;

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => searchSite(activeQuery),
    enabled,
    staleTime: 60 * 1000,
    // Keep the previous results on screen while the next keystroke's query loads.
    placeholderData: keepPreviousData,
  });

  // Lock background scroll, close on Escape, focus the input on open.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Start fresh next time the modal opens.
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const hasResults =
    !!data && (data.packages.length > 0 || data.categories.length > 0 || data.destinations.length > 0);

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[12vh] sm:p-6 sm:pt-[14vh]">
      {/* Blurred backdrop — clicking it closes the modal */}
      <div
        className="absolute inset-0 bg-[#1B4D1B]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-brand-light px-5 py-4">
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-medium" />
          <label htmlFor="global-search" className="sr-only">
            Search packages, categories and destinations
          </label>
          <input
            id="global-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packages, categories, destinations..."
            autoComplete="off"
            className="w-full bg-transparent text-base text-brand-darkest outline-none placeholder:text-brand-medium/70"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-lightest/50 text-brand-darkest transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-dark"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`max-h-[55vh] overflow-y-auto p-3 transition-opacity ${
            isFetching && !isPending ? 'opacity-50' : 'opacity-100'
          }`}
          aria-live="polite"
          aria-busy={isFetching}
        >
          {activeQuery.length < MIN_QUERY_LENGTH ? (
            <p className="px-3 py-8 text-center text-sm text-brand-medium">
              Type at least {MIN_QUERY_LENGTH} characters to search.
            </p>
          ) : isPending ? (
            <LoadingSkeleton variant="list" count={4} label="Searching…" />
          ) : isError ? (
            <ErrorMessage
              title="Search failed"
              message="We could not run that search. Please try again."
              retry={() => refetch()}
            />
          ) : !hasResults ? (
            <EmptyState
              variant="search"
              description={`Nothing matches “${activeQuery}”. Try a destination, package or category name.`}
            />
          ) : (
            <>
              {data.packages.length > 0 && (
                <section aria-label="Package results">
                  <GroupHeading>Packages</GroupHeading>
                  <ul>
                    {data.packages.map((pkg) => {
                      // Hidden prices stay hidden in search results too.
                      const price =
                        pkg.show_price === false || pkg.price_adult == null
                          ? NaN
                          : Number(pkg.price_adult);
                      const details = [
                        pkg.destination_name,
                        pkg.duration_days ? `${pkg.duration_days} days` : null,
                        Number.isFinite(price) && price > 0 ? `from ${formatPrice(price)}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ');

                      return (
                        <ResultRow
                          key={pkg.id}
                          href={`/packages/${pkg.slug}`}
                          icon={<Package aria-hidden="true" className="h-4 w-4" />}
                          title={pkg.title}
                          subtitle={details || undefined}
                          onNavigate={onClose}
                        />
                      );
                    })}
                  </ul>
                </section>
              )}

              {data.categories.length > 0 && (
                <section aria-label="Category results">
                  <GroupHeading>Categories</GroupHeading>
                  <ul>
                    {data.categories.map((category) => (
                      <ResultRow
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        icon={<FolderOpen aria-hidden="true" className="h-4 w-4" />}
                        title={category.name}
                        subtitle="Category"
                        onNavigate={onClose}
                      />
                    ))}
                  </ul>
                </section>
              )}

              {data.destinations.length > 0 && (
                <section aria-label="Destination results">
                  <GroupHeading>Destinations</GroupHeading>
                  <ul>
                    {data.destinations.map((destination) => (
                      <ResultRow
                        key={destination.name}
                        href={`/packages?q=${encodeURIComponent(destination.name)}`}
                        icon={<MapPin aria-hidden="true" className="h-4 w-4" />}
                        title={destination.name}
                        subtitle="Destination"
                        onNavigate={onClose}
                      />
                    ))}
                  </ul>
                </section>
              )}

              <p className="flex items-center gap-1.5 px-3 pb-1 pt-4 text-xs text-brand-medium/80">
                <Clock3 aria-hidden="true" className="h-3 w-3" />
                Results update as you type
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
