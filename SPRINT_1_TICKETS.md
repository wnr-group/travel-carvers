# Sprint 1 (MVP 2.0) - Detailed Jira Tickets

**Sprint Goal**: Complete essential user-facing features for production launch  
**Duration**: 2 weeks  
**Team**: 2 junior developers  
**Total Estimated Time**: 45 hours

---

## TVLCVR-46: Create Terms & Conditions Page

**Type**: Story  
**Priority**: Critical  
**Estimated Time**: 2 hours  
**Assignee**: Developer A

### Description
Create a Terms & Conditions page that is legally required before launching the website. This page will outline the terms of use for the Travel Carvers website.

### Business Value
Legal compliance requirement. Footer already has a link to `/terms` that currently leads to a 404. Without this page, the website cannot be legally launched.

### Acceptance Criteria
- [ ] `/terms` route exists and is accessible
- [ ] Page has proper layout with header and footer
- [ ] Content is formatted with proper headings and sections
- [ ] Page is responsive on mobile, tablet, and desktop
- [ ] Page uses centralized brand colors
- [ ] Page is added to sitemap.xml
- [ ] Meta description and title are set for SEO
- [ ] Breadcrumb navigation shows: Home > Terms & Conditions

### Technical Details

**Files to Create**:
```
app/(customer)/terms/page.tsx
```

**Implementation Steps**:
1. Create new page component at `app/(customer)/terms/page.tsx`
2. Add metadata export for SEO (title, description)
3. Structure content with sections:
   - Introduction
   - Use of Website
   - Intellectual Property
   - Booking Terms
   - User Conduct
   - Limitation of Liability
   - Privacy Policy (link to /privacy)
   - Changes to Terms
   - Contact Information

**Example Structure**:
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Travel Carvers',
  description: 'Terms and conditions for using Travel Carvers website and services.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-brand-darkest mb-8">
        Terms & Conditions
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-brand-medium mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">
            1. Introduction
          </h2>
          <p>
            Welcome to Travel Carvers. By accessing and using this website...
          </p>
        </section>
        
        {/* More sections... */}
      </div>
    </div>
  );
}
```

**Sitemap Update**:
The page will automatically be included in the sitemap since it's a static route.

### Definition of Done
- [ ] Page renders without errors
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop
- [ ] Legal team has approved content (if applicable)

### Dependencies
None

---

## TVLCVR-47: Create Privacy Policy Page

**Type**: Story  
**Priority**: Critical  
**Estimated Time**: 2 hours  
**Assignee**: Developer A

### Description
Create a Privacy Policy page that explains how Travel Carvers collects, uses, and protects user data. This is legally required before launch, especially since we collect email addresses and phone numbers.

### Business Value
Legal compliance requirement (GDPR, data protection laws). Footer already has a link to `/privacy` that currently leads to a 404.

### Acceptance Criteria
- [ ] `/privacy` route exists and is accessible
- [ ] Page has proper layout with header and footer
- [ ] Content is formatted with proper headings and sections
- [ ] Page is responsive on mobile, tablet, and desktop
- [ ] Page uses centralized brand colors
- [ ] Page is added to sitemap.xml
- [ ] Meta description and title are set for SEO
- [ ] Breadcrumb navigation shows: Home > Privacy Policy

### Technical Details

**Files to Create**:
```
app/(customer)/privacy/page.tsx
```

**Implementation Steps**:
1. Create new page component at `app/(customer)/privacy/page.tsx`
2. Add metadata export for SEO
3. Structure content with sections:
   - Introduction
   - Information We Collect
   - How We Use Your Information
   - Cookies and Tracking
   - Data Security
   - Third-Party Services (Supabase, Mailgun)
   - Your Rights
   - Children's Privacy
   - Changes to Privacy Policy
   - Contact Us

**Example Structure**:
```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Travel Carvers',
  description: 'Learn how Travel Carvers collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold text-brand-darkest mb-8">
        Privacy Policy
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-brand-medium mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">
            1. Introduction
          </h2>
          <p>
            Travel Carvers ("we", "our", "us") is committed to protecting your privacy...
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-dark mb-4">
            2. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Name and contact information (email, phone)</li>
            <li>Travel preferences and inquiry details</li>
            <li>Review and rating submissions</li>
            <li>Newsletter subscription preferences</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>
        
        {/* More sections... */}
        
        <section className="mt-12 p-6 bg-brand-lightest rounded-lg">
          <h3 className="text-lg font-semibold text-brand-darkest mb-2">
            Questions About Privacy?
          </h3>
          <p className="text-brand-medium">
            Contact us at{' '}
            <a href="mailto:privacy@travelcarvers.com" className="text-brand-dark underline">
              privacy@travelcarvers.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
```

### Definition of Done
- [ ] Page renders without errors
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop
- [ ] Legal team has approved content (if applicable)
- [ ] GDPR compliance verified

### Dependencies
None

---

## TVLCVR-48: Implement Global Search Functionality

**Type**: Story  
**Priority**: Critical  
**Estimated Time**: 8 hours  
**Assignee**: Developer B

### Description
Implement a global search system that allows users to search across packages, categories, and destinations. The search should be accessible from the navbar and provide real-time results as users type.

### Business Value
Users cannot easily find specific packages without search functionality. This is a critical UX feature that improves discoverability and conversions. 60%+ of users expect search functionality on travel websites.

### Acceptance Criteria
- [ ] Search icon in navbar opens search modal/dropdown
- [ ] Search input is visible and functional
- [ ] Search is debounced (300ms delay) to avoid excessive API calls
- [ ] Search queries the database for matches in:
  - Package titles
  - Package descriptions
  - Category names
  - Destination names
- [ ] Results appear in real-time as user types
- [ ] Minimum 3 characters required before searching
- [ ] Empty state shown when no results found
- [ ] Loading state shown while searching
- [ ] Search works on mobile and desktop
- [ ] Pressing ESC closes the search modal
- [ ] Clicking outside modal closes it

### Technical Details

**Files to Create**:
```
components/customer/SearchModal.tsx
lib/api/public/search.ts
app/api/search/route.ts (optional, if using API route)
```

**Files to Modify**:
```
components/customer/Navbar.tsx
```

**Database Implementation**:

Option 1: Use PostgreSQL Full-Text Search with `tsvector`:
```sql
-- Add to migration
ALTER TABLE packages ADD COLUMN search_vector tsvector;

CREATE INDEX idx_packages_search ON packages USING GIN(search_vector);

-- Update trigger to maintain search_vector
CREATE FUNCTION packages_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.destination_name, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON packages FOR EACH ROW EXECUTE FUNCTION packages_search_trigger();
```

Option 2: Simple ILIKE search (easier for MVP):
```typescript
// lib/api/public/search.ts
export async function searchPackages(query: string) {
  const { data, error } = await supabase
    .from('packages')
    .select(`
      id,
      title,
      slug,
      short_description,
      destination_name,
      price_adult,
      package_gallery!inner (
        image_url,
        is_cover
      )
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,short_description.ilike.%${query}%,destination_name.ilike.%${query}%`)
    .limit(10);

  if (error) throw error;
  return data;
}

export async function searchCategories(query: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, icon_name')
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .limit(5);

  if (error) throw error;
  return data;
}
```

**Search Modal Component**:
```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { searchPackages, searchCategories } from '@/lib/api/public/search';
import Link from 'next/link';
import Image from 'next/image';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({ packages: [], categories: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      performSearch(debouncedQuery);
    } else {
      setResults({ packages: [], categories: [] });
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const [packages, categories] = await Promise.all([
        searchPackages(searchQuery),
        searchCategories(searchQuery),
      ]);
      setResults({ packages, categories });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div className="mx-auto max-w-2xl mt-20 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="w-5 h-5 text-brand-medium" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages, categories, destinations..."
              className="flex-1 outline-none text-brand-darkest placeholder:text-brand-medium/50"
            />
            {isLoading && <Loader2 className="w-5 h-5 text-brand-medium animate-spin" />}
            <button onClick={onClose} className="text-brand-medium hover:text-brand-dark">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[500px] overflow-y-auto p-4">
            {query.length < 3 ? (
              <p className="text-center text-brand-medium py-8">
                Type at least 3 characters to search
              </p>
            ) : isLoading ? (
              <p className="text-center text-brand-medium py-8">Searching...</p>
            ) : results.packages.length === 0 && results.categories.length === 0 ? (
              <p className="text-center text-brand-medium py-8">
                No results found for "{query}"
              </p>
            ) : (
              <>
                {/* Package Results */}
                {results.packages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-brand-dark mb-3">Packages</h3>
                    <div className="space-y-2">
                      {results.packages.map((pkg: any) => (
                        <Link
                          key={pkg.id}
                          href={`/packages/${pkg.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-lightest transition"
                        >
                          {pkg.package_gallery?.[0]?.image_url && (
                            <Image
                              src={pkg.package_gallery[0].image_url}
                              alt={pkg.title}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-brand-darkest">{pkg.title}</p>
                            <p className="text-sm text-brand-medium line-clamp-1">
                              {pkg.short_description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Results */}
                {results.categories.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-brand-dark mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.categories.map((category: any) => (
                        <Link
                          key={category.id}
                          href={`/packages?category=${category.slug}`}
                          onClick={onClose}
                          className="px-4 py-2 bg-brand-lightest text-brand-dark rounded-full hover:bg-brand-light transition"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**useDebounce Hook**:
```typescript
// lib/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Navbar Integration**:
```tsx
// components/customer/Navbar.tsx
import { SearchModal } from './SearchModal';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav>
        {/* ... existing nav items ... */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
```

### Definition of Done
- [ ] Search modal opens from navbar
- [ ] All acceptance criteria met
- [ ] Debouncing works (300ms delay)
- [ ] Results appear in real-time
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop
- [ ] Performance tested with 100+ packages

### Dependencies
None

---

## TVLCVR-49: Search Autocomplete with Results Display

**Type**: Sub-task  
**Parent**: TVLCVR-48  
**Priority**: High  
**Estimated Time**: 6 hours  
**Assignee**: Developer B

### Description
Enhance the search functionality with autocomplete suggestions and improved results display including images, tags, and highlighting of matched terms.

### Business Value
Improved user experience with visual feedback and faster navigation to desired packages. Autocomplete reduces typing effort and helps users discover packages they might not have found otherwise.

### Acceptance Criteria
- [ ] Search results show package thumbnail images
- [ ] Results display price (if visible)
- [ ] Results show category tags
- [ ] Matched search terms are highlighted in results
- [ ] Keyboard navigation works (up/down arrows, enter to select)
- [ ] "View All Results" button appears when there are many matches
- [ ] Recent searches are remembered (optional)
- [ ] Click on result navigates to package/category page
- [ ] Search query is preserved in URL when viewing all results

### Technical Details

**Files to Modify**:
```
components/customer/SearchModal.tsx
lib/api/public/search.ts
```

**Enhanced Search Results**:
```typescript
interface SearchResult {
  id: string;
  type: 'package' | 'category';
  title: string;
  slug: string;
  description?: string;
  image?: string;
  price?: number;
  tags?: string[];
  destination?: string;
}

// Highlight matching text
function highlightMatch(text: string, query: string) {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
```

**Keyboard Navigation**:
```typescript
const [selectedIndex, setSelectedIndex] = useState(-1);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        Math.min(prev + 1, totalResults - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [isOpen, selectedIndex, results]);
```

**View All Results**:
```tsx
{results.packages.length >= 10 && (
  <Link
    href={`/packages?search=${encodeURIComponent(query)}`}
    onClick={onClose}
    className="block text-center p-4 text-brand-dark font-semibold hover:bg-brand-lightest transition"
  >
    View all results for "{query}" →
  </Link>
)}
```

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Keyboard navigation works smoothly
- [ ] Highlighting is accurate
- [ ] Code reviewed and merged
- [ ] Accessibility tested (screen reader compatible)

### Dependencies
- TVLCVR-48 must be completed first

---

## TVLCVR-50: Implement Package Filters (Price, Duration, Category)

**Type**: Story  
**Priority**: Critical  
**Estimated Time**: 10 hours  
**Assignee**: Developer A

### Description
Wire up the existing PackageFilters component to actually filter packages based on user selections. Users should be able to filter by price range, duration, categories, and destinations. Filters should update the URL query parameters and results should update in real-time.

### Business Value
Users cannot browse packages effectively without filters. This is critical for UX - users with budget constraints need price filters, and users looking for specific trip lengths need duration filters. 80% of users use filters when browsing travel packages.

### Acceptance Criteria
- [ ] Filter panel is visible on packages page (sidebar on desktop, collapsible on mobile)
- [ ] Price range slider works and filters packages by price
- [ ] Duration checkboxes work (1-3 days, 4-6 days, 7-10 days, 10+ days)
- [ ] Category multi-select checkboxes work
- [ ] Destination dropdown/autocomplete works
- [ ] Filters update URL query parameters (e.g., `/packages?price_min=10000&price_max=50000&duration=4-6`)
- [ ] Results update in real-time without page reload
- [ ] "Clear All Filters" button resets all selections
- [ ] Active filter count badge shows in UI
- [ ] Filters persist when navigating back from package detail
- [ ] Loading state shown while filtering
- [ ] Mobile filter panel can be opened/closed
- [ ] If no results, show empty state with suggestion to adjust filters

### Technical Details

**Files to Modify**:
```
components/customer/PackageFilters.tsx
lib/hooks/usePackageFilters.ts
app/(customer)/packages/page.tsx
app/(customer)/packages/PackagesView.tsx
```

**URL Query Parameters Structure**:
```
/packages?price_min=10000&price_max=50000&duration=4-6&category=adventure,beach&destination=bali
```

**usePackageFilters Hook Enhancement**:
```typescript
// lib/hooks/usePackageFilters.ts
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export interface PackageFilters {
  priceMin?: number;
  priceMax?: number;
  duration?: string[];
  categories?: string[];
  destination?: string;
}

export function usePackageFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PackageFilters>({
    priceMin: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    priceMax: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    duration: searchParams.get('duration')?.split(',') || [],
    categories: searchParams.get('category')?.split(',') || [],
    destination: searchParams.get('destination') || undefined,
  });

  const updateFilters = useCallback((newFilters: Partial<PackageFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Build query string
    const params = new URLSearchParams();
    if (updated.priceMin) params.set('price_min', String(updated.priceMin));
    if (updated.priceMax) params.set('price_max', String(updated.priceMax));
    if (updated.duration?.length) params.set('duration', updated.duration.join(','));
    if (updated.categories?.length) params.set('category', updated.categories.join(','));
    if (updated.destination) params.set('destination', updated.destination);

    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, router, pathname]);

  const clearFilters = useCallback(() => {
    setFilters({});
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeFilterCount = 
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.duration?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.destination ? 1 : 0);

  return {
    filters,
    updateFilters,
    clearFilters,
    activeFilterCount,
  };
}
```

**Filtering Packages Query**:
```typescript
// lib/api/public/packages.ts
export async function getFilteredPackages(filters: PackageFilters) {
  let query = supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      package_categories (
        categories (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published');

  // Price filter
  if (filters.priceMin) {
    query = query.gte('price_adult', filters.priceMin);
  }
  if (filters.priceMax) {
    query = query.lte('price_adult', filters.priceMax);
  }

  // Duration filter
  if (filters.duration?.length) {
    const durationConditions = filters.duration.map(d => {
      if (d === '1-3') return 'duration_days.lte.3';
      if (d === '4-6') return 'duration_days.gte.4,duration_days.lte.6';
      if (d === '7-10') return 'duration_days.gte.7,duration_days.lte.10';
      if (d === '10+') return 'duration_days.gte.10';
      return null;
    }).filter(Boolean);
    
    // This is simplified - you may need to adjust based on Supabase query capabilities
    // Or fetch all and filter in-memory for complex duration logic
  }

  // Category filter
  if (filters.categories?.length) {
    // Use inner join to filter by categories
    query = query.in('package_categories.categories.slug', filters.categories);
  }

  // Destination filter
  if (filters.destination) {
    query = query.ilike('destination_name', `%${filters.destination}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

**PackageFilters Component**:
```tsx
'use client';

import { usePackageFilters } from '@/lib/hooks/usePackageFilters';
import { useCategories } from '@/lib/hooks/useCategories';
import { Slider } from '@/components/ui/slider'; // Install if needed
import { X } from 'lucide-react';

export function PackageFilters() {
  const { filters, updateFilters, clearFilters, activeFilterCount } = usePackageFilters();
  const { data: categories } = useCategories();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-brand-darkest">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-brand-dark text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-brand-medium hover:text-brand-dark flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-brand-dark mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={200000}
            step={5000}
            value={[filters.priceMin || 0, filters.priceMax || 200000]}
            onValueChange={([min, max]) => 
              updateFilters({ priceMin: min, priceMax: max })
            }
          />
          <div className="flex justify-between mt-2 text-sm text-brand-medium">
            <span>₹{filters.priceMin || 0}</span>
            <span>₹{filters.priceMax || 200000}</span>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <h4 className="font-semibold text-brand-dark mb-3">Duration</h4>
        <div className="space-y-2">
          {['1-3', '4-6', '7-10', '10+'].map((duration) => (
            <label key={duration} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.duration?.includes(duration)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...(filters.duration || []), duration]
                    : filters.duration?.filter(d => d !== duration) || [];
                  updateFilters({ duration: updated });
                }}
                className="w-4 h-4 text-brand-dark rounded"
              />
              <span className="text-brand-darkest">{duration} days</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-brand-dark mb-3">Categories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories?.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.slug)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...(filters.categories || []), category.slug]
                    : filters.categories?.filter(c => c !== category.slug) || [];
                  updateFilters({ categories: updated });
                }}
                className="w-4 h-4 text-brand-dark rounded"
              />
              <span className="text-brand-darkest">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Destination */}
      <div className="mb-6">
        <h4 className="font-semibold text-brand-dark mb-3">Destination</h4>
        <input
          type="text"
          value={filters.destination || ''}
          onChange={(e) => updateFilters({ destination: e.target.value })}
          placeholder="Search destination..."
          className="w-full px-4 py-2 border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium"
        />
      </div>
    </div>
  );
}
```

**Mobile Filter Button**:
```tsx
// Show filter button on mobile
<button
  onClick={() => setShowFilters(true)}
  className="md:hidden fixed bottom-4 right-4 bg-brand-dark text-white px-6 py-3 rounded-full shadow-lg z-10"
>
  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
</button>
```

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Filters work correctly on desktop and mobile
- [ ] URL query parameters update properly
- [ ] Results filter in real-time
- [ ] Code reviewed and merged
- [ ] Performance tested with filters applied
- [ ] Edge cases handled (no results, all filters selected, etc.)

### Dependencies
None

---

## TVLCVR-51: Implement Package Sorting

**Type**: Story  
**Priority**: High  
**Estimated Time**: 4 hours  
**Assignee**: Developer A

### Description
Add sorting functionality to the packages listing page. Users should be able to sort packages by rating, price, newest, oldest, and popularity (view count). Sorting should work alongside filters.

### Business Value
Users have different priorities when browsing - some want cheapest options, others want highest rated. Sorting helps users find packages that match their decision criteria faster, improving conversion rates.

### Acceptance Criteria
- [ ] Sort dropdown is visible above package results
- [ ] Sorting options include:
  - Rating (Highest first)
  - Price (Low to High)
  - Price (High to Low)
  - Newest First
  - Oldest First
  - Popularity (Most viewed)
- [ ] Sorting updates URL query parameter (e.g., `/packages?sort=price_asc`)
- [ ] Results re-order immediately when sort changes
- [ ] Sort selection persists when navigating back
- [ ] Sort works alongside active filters
- [ ] Default sort is "Newest First"
- [ ] Loading state shown while re-sorting

### Technical Details

**Files to Modify**:
```
app/(customer)/packages/PackagesView.tsx
lib/hooks/usePackageFilters.ts
lib/api/public/packages.ts
```

**Sort Options**:
```typescript
type SortOption = 
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'popularity';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Most Popular' },
];
```

**Add Sort to usePackageFilters**:
```typescript
// lib/hooks/usePackageFilters.ts
export interface PackageFilters {
  // ... existing filters
  sort?: SortOption;
}

export function usePackageFilters() {
  // ... existing code
  const [filters, setFilters] = useState<PackageFilters>({
    // ... existing filters
    sort: (searchParams.get('sort') as SortOption) || 'newest',
  });

  const updateFilters = useCallback((newFilters: Partial<PackageFilters>) => {
    // ... existing code
    if (updated.sort) params.set('sort', updated.sort);
    // ...
  }, [filters, router, pathname]);
}
```

**Sorting in Query**:
```typescript
// lib/api/public/packages.ts
export async function getFilteredPackages(filters: PackageFilters) {
  let query = supabase
    .from('packages')
    .select('...')
    .eq('status', 'published');

  // Apply filters...

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'price_asc':
      query = query.order('price_adult', { ascending: true, nullsFirst: false });
      break;
    case 'price_desc':
      query = query.order('price_adult', { ascending: false, nullsFirst: false });
      break;
    case 'rating':
      // Assuming you have an average_rating column or compute it
      query = query.order('rating', { ascending: false });
      break;
    case 'popularity':
      query = query.order('view_count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

**Sort Dropdown Component**:
```tsx
'use client';

import { usePackageFilters } from '@/lib/hooks/usePackageFilters';

export function PackageSort() {
  const { filters, updateFilters } = usePackageFilters();

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-semibold text-brand-dark">
        Sort by:
      </label>
      <select
        id="sort"
        value={filters.sort || 'newest'}
        onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
        className="px-4 py-2 border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-medium bg-white text-brand-darkest"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**Integration in PackagesView**:
```tsx
// app/(customer)/packages/PackagesView.tsx
import { PackageSort } from '@/components/customer/PackageSort';

export default function PackagesView() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Packages</h1>
        <PackageSort />
      </div>
      {/* Package grid */}
    </div>
  );
}
```

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Sort dropdown works correctly
- [ ] Results re-order as expected
- [ ] Sort persists in URL
- [ ] Code reviewed and merged
- [ ] Tested with all sort options
- [ ] Works alongside filters

### Dependencies
- TVLCVR-50 (shares same filtering infrastructure)

---

## TVLCVR-52: Create Category Detail Pages

**Type**: Story  
**Priority**: High  
**Estimated Time**: 6 hours  
**Assignee**: Developer B

### Description
Create dynamic category detail pages that show all packages within a specific category. These pages are important for SEO and user navigation. Each category should have its own landing page with packages filtered by that category.

### Business Value
Category pages are critical for SEO - users searching for "adventure packages" or "beach holidays" should land on category-specific pages. These pages also improve navigation and help users browse packages by interest area. Category pages typically rank well in search engines.

### Acceptance Criteria
- [ ] `/category/[slug]` route exists and is accessible
- [ ] Page displays category name, description, and cover image
- [ ] All packages in the category are displayed
- [ ] Packages use the same card design as main packages page
- [ ] Filters and sorting work on category pages
- [ ] Breadcrumb shows: Home > Categories > [Category Name]
- [ ] Related categories are shown at the bottom
- [ ] Page has proper SEO metadata (title, description, OG tags)
- [ ] Page is responsive on all devices
- [ ] Loading states for packages
- [ ] Empty state if category has no packages
- [ ] 404 page if category slug doesn't exist

### Technical Details

**Files to Create**:
```
app/(customer)/category/[slug]/page.tsx
app/(customer)/category/[slug]/loading.tsx
```

**Files to Modify**:
```
lib/api/public/categories.ts
app/sitemap.ts
```

**Category Page Component**:
```tsx
// app/(customer)/category/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/api/public/categories';
import { getPackagesByCategory } from '@/lib/api/public/packages';
import Image from 'next/image';
import Link from 'next/link';
import { PackageCard } from '@/components/customer/PackageCard';
import { ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Travel Carvers',
    };
  }

  return {
    title: `${category.name} Packages | Travel Carvers`,
    description: category.description || `Explore our ${category.name} travel packages and tours.`,
    openGraph: {
      title: `${category.name} Packages`,
      description: category.description,
      images: category.cover_image_url ? [category.cover_image_url] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const packages = await getPackagesByCategory(category.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-6 py-4">
        <ol className="flex items-center gap-2 text-sm text-brand-medium">
          <li>
            <Link href="/" className="hover:text-brand-dark transition">
              Home
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li>
            <Link href="/packages" className="hover:text-brand-dark transition">
              Packages
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" />
          <li className="text-brand-darkest font-semibold">{category.name}</li>
        </ol>
      </nav>

      {/* Category Hero */}
      <section className="relative overflow-hidden bg-brand-darkest text-white">
        {category.cover_image_url && (
          <>
            <div className="absolute inset-0">
              <Image
                src={category.cover_image_url}
                alt={category.name}
                fill
                className="object-cover opacity-40"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-darkest/80 to-transparent" />
          </>
        )}
        
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-white/90 max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-brand-lightest">
            {packages.length} {packages.length === 1 ? 'package' : 'packages'} available
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        {packages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-brand-medium mb-4">
              No packages available in this category yet
            </p>
            <Link
              href="/packages"
              className="inline-block px-6 py-3 bg-brand-dark text-white rounded-full hover:bg-brand-darkest transition"
            >
              Browse All Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        )}
      </section>

      {/* Related Categories */}
      {category.related_categories?.length > 0 && (
        <section className="bg-brand-lightest py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-bold text-brand-darkest mb-8">
              Related Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {category.related_categories.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/category/${related.slug}`}
                  className="p-6 bg-white rounded-xl hover:shadow-lg transition text-center"
                >
                  <h3 className="font-semibold text-brand-darkest">
                    {related.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
```

**Loading State**:
```tsx
// app/(customer)/category/[slug]/loading.tsx
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="h-64 bg-brand-light/20 animate-pulse" />
      
      {/* Packages grid skeleton */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="package-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Enhanced getCategoryBySlug**:
```typescript
// lib/api/public/categories.ts
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      related_categories:categories!category_related(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}
```

**Update Sitemap**:
```typescript
// app/sitemap.ts
// Category entries already included, just verify they work correctly
const categories = await getActiveCategories();
categoryEntries = categories.map((category) => ({
  url: absoluteUrl(`/category/${category.slug}`),
  lastModified: category.updated_at ? new Date(category.updated_at) : now,
  changeFrequency: 'weekly',
  priority: 0.7,
}));
```

### Definition of Done
- [ ] Category pages render correctly
- [ ] All acceptance criteria met
- [ ] SEO metadata is correct
- [ ] Breadcrumbs work
- [ ] Loading states work
- [ ] 404 handling for invalid slugs
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop
- [ ] Sitemap includes all category pages

### Dependencies
None

---

## TVLCVR-53: Create Subcategory Pages

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 4 hours  
**Assignee**: Developer B

### Description
Create dynamic subcategory detail pages that show packages within specific subcategories. These pages provide more granular filtering than category pages (e.g., "Adventure > Mountain Trekking").

### Business Value
Subcategory pages improve SEO by targeting long-tail keywords and help users find highly specific package types. They provide better navigation hierarchy.

### Acceptance Criteria
- [ ] `/category/[category]/[subcategory]` route exists
- [ ] Page displays subcategory name and description
- [ ] Parent category is shown prominently
- [ ] All packages in subcategory are displayed
- [ ] Breadcrumb shows: Home > Categories > [Category] > [Subcategory]
- [ ] Filters and sorting work
- [ ] Page has proper SEO metadata
- [ ] Responsive design
- [ ] Empty state if no packages
- [ ] 404 if subcategory doesn't exist

### Technical Details

**Files to Create**:
```
app/(customer)/category/[category]/[subcategory]/page.tsx
```

**Files to Modify**:
```
lib/api/public/categories.ts
```

**Implementation**:
Similar to TVLCVR-52 but with subcategory focus. Key differences:
- Breadcrumb includes parent category
- Query filters by subcategory_id
- Show parent category context

**Example Breadcrumb**:
```tsx
Home > Packages > Adventure > Mountain Trekking
```

**API Function**:
```typescript
export async function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      package_subcategories(packages(*))
    `)
    .eq('slug', subcategorySlug)
    .eq('category.slug', categorySlug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}
```

### Definition of Done
- [ ] Subcategory pages work correctly
- [ ] All acceptance criteria met
- [ ] SEO metadata correct
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop

### Dependencies
- TVLCVR-52 should be completed first (shares similar structure)

---

## TVLCVR-54: Create Destination Filter Pages

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 3 hours  
**Assignee**: Developer A

### Description
Create destination-specific pages accessible via `/packages?destination=[name]` that show all packages for a specific destination. These pages are important for SEO as users often search by destination name.

### Business Value
Destination pages capture high-intent search traffic (users searching for "Bali packages" or "Thailand tours"). These pages convert well because users have already decided on a destination.

### Acceptance Criteria
- [ ] `/packages?destination=bali` shows packages for Bali
- [ ] Destination name is displayed prominently
- [ ] Packages are filtered by destination_name field
- [ ] Filters and sorting still work
- [ ] Breadcrumb shows: Home > Packages > [Destination]
- [ ] Page has destination-specific metadata
- [ ] Popular destinations have hero images
- [ ] Responsive design
- [ ] Empty state if no packages for destination

### Technical Details

**Files to Modify**:
```
app/(customer)/packages/PackagesView.tsx
app/(customer)/packages/page.tsx
```

**Implementation**:
This can reuse the existing packages page with destination filter applied. The key is enhancing the UI when a destination filter is active.

**Destination-Specific Header**:
```tsx
// app/(customer)/packages/PackagesView.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function PackagesView() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination');

  return (
    <div>
      {destination && (
        <section className="mb-12 p-8 bg-gradient-to-r from-brand-dark to-brand-medium text-white rounded-2xl">
          <h1 className="text-4xl font-bold mb-2">
            {destination.charAt(0).toUpperCase() + destination.slice(1)} Packages
          </h1>
          <p className="text-white/90">
            Discover our curated travel packages to {destination}
          </p>
        </section>
      )}
      
      {/* Rest of packages view */}
    </div>
  );
}
```

**Popular Destinations**:
```typescript
const POPULAR_DESTINATIONS = [
  { name: 'Bali', slug: 'bali', image: '/images/destinations/bali.jpg' },
  { name: 'Thailand', slug: 'thailand', image: '/images/destinations/thailand.jpg' },
  { name: 'Vietnam', slug: 'vietnam', image: '/images/destinations/vietnam.jpg' },
  { name: 'Singapore', slug: 'singapore', image: '/images/destinations/singapore.jpg' },
  { name: 'Dubai', slug: 'dubai', image: '/images/destinations/dubai.jpg' },
  { name: 'Kashmir', slug: 'kashmir', image: '/images/destinations/kashmir.jpg' },
];
```

**SEO Metadata**:
```typescript
// app/(customer)/packages/page.tsx
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const destination = params.destination;

  if (destination) {
    return {
      title: `${destination} Packages | Travel Carvers`,
      description: `Explore our best travel packages and tours to ${destination}. Book your dream vacation with Travel Carvers.`,
    };
  }

  return {
    title: 'Travel Packages | Travel Carvers',
    description: 'Browse our collection of travel packages to amazing destinations worldwide.',
  };
}
```

### Definition of Done
- [ ] Destination filter works correctly
- [ ] All acceptance criteria met
- [ ] SEO metadata is destination-specific
- [ ] Code reviewed and merged
- [ ] Tested with multiple destinations

### Dependencies
- TVLCVR-50 (uses same filtering infrastructure)

---

## Sprint 1 Summary

**Total Tickets**: 9  
**Total Estimated Time**: 45 hours  
**Duration**: 2 weeks (10 working days)  
**Team**: 2 developers

### Developer Allocation

**Developer A** (23 hours):
- TVLCVR-46: Terms page (2h)
- TVLCVR-47: Privacy page (2h)
- TVLCVR-50: Package filters (10h)
- TVLCVR-51: Package sorting (4h)
- TVLCVR-54: Destination pages (3h)
- Buffer time: 2h

**Developer B** (22 hours):
- TVLCVR-48: Global search (8h)
- TVLCVR-49: Search autocomplete (6h)
- TVLCVR-52: Category pages (6h)
- TVLCVR-53: Subcategory pages (4h)
- Buffer time: 2h

### Success Metrics
- [ ] All 9 tickets completed and merged
- [ ] Zero critical bugs
- [ ] Build passes
- [ ] All pages responsive
- [ ] Search performs under 300ms
- [ ] Filters update within 100ms

### Definition of Sprint Done
- [ ] All tickets meet acceptance criteria
- [ ] Code reviewed and merged to main
- [ ] Tested on mobile, tablet, desktop
- [ ] No TypeScript errors
- [ ] Build passes
- [ ] Ready for user acceptance testing

---

**Ready to assign to your team! 🚀**
