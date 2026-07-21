'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  Search,
  X,
  Package,
  FolderOpen,
  MapPin,
  History,
  TrendingUp,
  Trash2,
  CornerDownLeft,
} from 'lucide-react';
import { searchSite } from '@/lib/api/public/search';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation';
import { formatPrice } from '@/lib/packageList';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorMessage from '@/components/ui/ErrorMessage';

const MIN_QUERY_LENGTH = 3;
const RECENT_STORAGE_KEY = 'tc:recent-searches';
const RECENT_LIMIT = 5;
const LISTBOX_ID = 'search-autocomplete-listbox';

/** Curated fallback destinations shown before the user types (link to a filtered search). */
const POPULAR_DESTINATIONS = ['Bali', 'Thailand', 'Dubai', 'Singapore', 'Kashmir', 'Europe'] as const;

/* ----------------------------- Recent searches ----------------------------- */

function readRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string').slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

function writeRecent(entries: string[]): void {
  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(entries));
  } catch {
  }
}

/** LocalStorage-backed recent searches: latest-first, unique, capped at RECENT_LIMIT. */
function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(readRecent);

  const add = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        RECENT_LIMIT,
      );
      writeRecent(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    writeRecent([]);
  }, []);

  return { recent, add, clear };
}

/* -------------------------------- Item model ------------------------------- */

type ItemKind = 'package' | 'category' | 'destination' | 'recent' | 'popular';

interface FlatItem {
  key: string;
  kind: ItemKind;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  /** Performed on click or Enter. */
  activate: () => void;
}

const GROUP_LABEL: Record<ItemKind, string> = {
  package: 'Packages',
  category: 'Categories',
  destination: 'Destinations',
  recent: 'Recent searches',
  popular: 'Popular destinations',
};

/** Compose the "Kerala · 6 days · from ₹…" line for a package, honouring hidden prices. */
function packageSubtitle(pkg: {
  destination_name: string | null;
  duration_days: number | null;
  price_adult: number | string | null;
  show_price: boolean | null;
}): string {
  const price = pkg.show_price === false || pkg.price_adult == null ? NaN : Number(pkg.price_adult);
  return [
    pkg.destination_name,
    pkg.duration_days ? `${pkg.duration_days} days` : null,
    Number.isFinite(price) && price > 0 ? `from ${formatPrice(price)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

/* --------------------------------- Rows ------------------------------------ */

function GroupHeading({ label, onClear }: { label: string; onClear?: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 pb-1 pt-4 first:pt-1">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-medium">{label}</h3>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-brand-medium transition-colors hover:bg-brand-lightest/60 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        >
          <Trash2 aria-hidden="true" className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}

function OptionRow({
  item,
  index,
  active,
  onHover,
  onSelect,
}: {
  item: FlatItem;
  index: number;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        id={`search-option-${index}`}
        role="option"
        aria-selected={active}
        onMouseMove={onHover}
        onClick={onSelect}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
          active ? 'bg-brand-lightest/80' : 'hover:bg-brand-lightest/60'
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand-dark">
          {item.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-brand-darkest">{item.label}</span>
          {item.sublabel && <span className="block truncate text-xs text-brand-medium">{item.sublabel}</span>}
        </span>
        {active && <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-brand-medium" />}
      </button>
    </li>
  );
}

/* ------------------------------- Component --------------------------------- */

interface SearchAutocompleteProps {
  onClose: () => void;
  autoFocus?: boolean;
}

export default function SearchAutocomplete({ onClose, autoFocus = true }: SearchAutocompleteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const { recent, add: addRecent, clear: clearRecent } = useRecentSearches();

  const debouncedQuery = useDebouncedValue(query, 300);
  const activeQuery = debouncedQuery.trim();
  const inputLength = query.trim().length;

  const mode: 'suggestions' | 'too-short' | 'results' =
    inputLength === 0 ? 'suggestions' : inputLength < MIN_QUERY_LENGTH ? 'too-short' : 'results';

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => searchSite(activeQuery),
    enabled: activeQuery.length >= MIN_QUERY_LENGTH,
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const go = useCallback(
    (href: string, term?: string) => {
      if (term) addRecent(term);
      router.push(href);
      onClose();
    },
    [addRecent, router, onClose],
  );

  const runSearch = useCallback(
    (term: string) => {
      setQuery(term);
      addRecent(term);
      inputRef.current?.focus();
    },
    [addRecent],
  );

  const items = useMemo<FlatItem[]>(() => {
    if (mode === 'suggestions') {
      const recentItems: FlatItem[] = recent.map((term) => ({
        key: `recent:${term}`,
        kind: 'recent',
        label: term,
        icon: <History aria-hidden="true" className="h-4 w-4" />,
        activate: () => runSearch(term),
      }));
      const popularItems: FlatItem[] = POPULAR_DESTINATIONS.map((name) => ({
        key: `popular:${name}`,
        kind: 'popular',
        label: name,
        sublabel: 'Popular destination',
        icon: <TrendingUp aria-hidden="true" className="h-4 w-4" />,
        activate: () => go(`/packages?q=${encodeURIComponent(name)}`, name),
      }));
      return [...recentItems, ...popularItems];
    }

    if (mode === 'results' && data) {
      const packageItems: FlatItem[] = (data.packages ?? []).map((pkg) => ({
        key: `package:${pkg.id}`,
        kind: 'package',
        label: pkg.title,
        sublabel: packageSubtitle(pkg) || undefined,
        icon: <Package aria-hidden="true" className="h-4 w-4" />,
        activate: () => go(`/packages/${pkg.slug}`, activeQuery),
      }));
      const categoryItems: FlatItem[] = (data.categories ?? []).map((category) => ({
        key: `category:${category.id}`,
        kind: 'category',
        label: category.name,
        sublabel: 'Category',
        icon: <FolderOpen aria-hidden="true" className="h-4 w-4" />,
        activate: () => go(`/categories/${category.slug}`, activeQuery),
      }));
      const destinationItems: FlatItem[] = (data.destinations ?? []).map((destination) => ({
        key: `destination:${destination.name}`,
        kind: 'destination',
        label: destination.name,
        sublabel: 'Destination',
        icon: <MapPin aria-hidden="true" className="h-4 w-4" />,
        activate: () => go(`/packages?q=${encodeURIComponent(destination.name)}`, destination.name),
      }));
      return [...packageItems, ...categoryItems, ...destinationItems];
    }

    return [];
  }, [mode, recent, data, activeQuery, go, runSearch]);

  const onSelect = useCallback(
    (index: number) => {
      if (index >= 0 && index < items.length) {
        items[index].activate();
        return;
      }
      if (mode === 'results' && activeQuery.length >= MIN_QUERY_LENGTH) {
        go(`/packages?q=${encodeURIComponent(activeQuery)}`, activeQuery);
      }
    },
    [items, mode, activeQuery, go],
  );

  const { activeIndex, setActiveIndex, handleKeyDown, reset } = useKeyboardNavigation({
    itemCount: items.length,
    onSelect,
    onEscape: onClose,
  });

  useEffect(() => {
    reset();
  }, [mode, reset]);

  useEffect(() => {
    if (activeIndex < 0) return;
    document.getElementById(`search-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const hasResults = mode === 'results' && items.length > 0;

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Input */}
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
          onKeyDown={handleKeyDown}
          placeholder="Search packages, categories, destinations..."
          autoComplete="off"
          role="combobox"
          aria-expanded
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
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

      {/* Dropdown */}
      <div
        id={LISTBOX_ID}
        role="listbox"
        aria-label="Search suggestions"
        className={`max-h-[55vh] overflow-y-auto p-3 transition-opacity ${
          isFetching && !isPending ? 'opacity-60' : 'opacity-100'
        }`}
        aria-busy={isFetching}
      >
        {mode === 'too-short' ? (
          <p className="px-3 py-8 text-center text-sm text-brand-medium">
            Type at least {MIN_QUERY_LENGTH} characters to search.
          </p>
        ) : mode === 'results' && isPending ? (
          <LoadingSkeleton variant="list" count={4} label="Searching…" />
        ) : mode === 'results' && isError ? (
          <ErrorMessage
            title="Search failed"
            message="We could not run that search. Please try again."
            retry={() => refetch()}
          />
        ) : mode === 'results' && !hasResults ? (
          <EmptyState
            variant="search"
            description={`Nothing matches “${activeQuery}”. Try a destination, package or category name.`}
          />
        ) : items.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-brand-medium">
            Search for packages, categories and destinations.
          </p>
        ) : (
          <ul>
            {items.map((item, index) => {
              const startsGroup = index === 0 || items[index - 1].kind !== item.kind;
              return (
                <Fragment key={item.key}>
                  {startsGroup && (
                    <GroupHeading
                      label={GROUP_LABEL[item.kind]}
                      onClear={item.kind === 'recent' ? clearRecent : undefined}
                    />
                  )}
                  <OptionRow
                    item={item}
                    index={index}
                    active={activeIndex === index}
                    onHover={() => setActiveIndex(index)}
                    onSelect={item.activate}
                  />
                </Fragment>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
