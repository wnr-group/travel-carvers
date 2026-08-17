'use client';

import {
  Waves,
  Compass,
  Mountain,
  Landmark,
  PawPrint,
  Building2,
  Clock3,
  Sparkles,
  TrendingUp,
  BadgePlus,
  Sun,
  Crown,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Filters,
  Difficulty,
  CategoryOption,
  DIFFICULTIES,
  PRICE_FLOOR,
  PRICE_CEIL,
  DURATION_RANGES,
  formatPrice,
} from '@/lib/hooks/usePackageFilters';
import { PACKAGE_FLAGS, type PackageFlagKey } from '@/lib/packageFlags';

// Map categories to Lucide icons
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Beach: Waves,
  Adventure: Compass,
  Mountain: Mountain,
  Cultural: Landmark,
  Wildlife: PawPrint,
  City: Building2,
};

export const FLAG_ICONS: Record<PackageFlagKey, LucideIcon> = {
  featured: Sparkles,
  trending: TrendingUp,
  new: BadgePlus,
  seasonal: Sun,
  'best-seller': Crown,
  group: Users,
};

export interface ChipProps {
  label: string;
  onRemove: () => void;
}

export function Chip({ label, onRemove }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="flex items-center gap-1.5 rounded-full border border-brand-light bg-brand-lightest px-3 py-1 text-xs font-medium text-brand-darkest transition hover:border-brand-medium"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

export interface PackageFiltersProps {
  filters: Filters;
  categories: CategoryOption[];
  activeFilterCount: number;
  toggleCategory: (value: string) => void;
  toggleFlag: (value: PackageFlagKey) => void;
  toggleDifficulty: (value: Difficulty) => void;
  setPriceMin: (value: number) => void;
  setPriceMax: (value: number) => void;
  setDuration: (value: string) => void;
  clearFilters: () => void;
}

export function PackageFilters({
  filters,
  categories,
  activeFilterCount,
  toggleCategory,
  toggleFlag,
  toggleDifficulty,
  setPriceMin,
  setPriceMax,
  setDuration,
  clearFilters,
}: PackageFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-base font-semibold text-brand-darkest lg:block">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto text-sm font-medium text-brand-dark transition hover:opacity-70"
          >
            Clear filters
          </button>
        )}
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Package Flags</h3>
        <div className="space-y-2">
          {PACKAGE_FLAGS.map(({ key, label }) => {
            const checked = filters.flags.includes(key);
            const Icon = FLAG_ICONS[key];
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
                  checked
                    ? 'border-brand-medium bg-brand-lightest text-brand-darkest'
                    : 'border-transparent text-brand-darkest/80 hover:bg-brand-lightest/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFlag(key)}
                  className="h-4 w-4 rounded border-brand-light text-brand-dark accent-[var(--logo-forest)]"
                />
                <Icon aria-hidden="true" className="h-4 w-4 text-brand-medium" />
                {label}
              </label>
            );
          })}
        </div>
      </section>

      {/* Category */}
      {categories.length > 0 && (
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Category</h3>
        <div className="space-y-2">
          {categories.map(({ value, label }) => {
            const checked = filters.categories.includes(value);
            const Icon = CATEGORY_ICONS[value] || Compass;
            return (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
                  checked
                    ? 'border-brand-medium bg-brand-lightest text-brand-darkest'
                    : 'border-transparent text-brand-darkest/80 hover:bg-brand-lightest/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(value)}
                  className="h-4 w-4 rounded border-brand-light text-brand-dark accent-[var(--logo-forest)]"
                />
                <Icon className="h-4 w-4 text-brand-medium" />
                {label}
              </label>
            );
          })}
        </div>
      </section>
      )}

      {/* Price range */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Price range</h3>
        <div className="mb-2 flex items-center justify-between text-sm text-brand-medium">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
        <div className="relative h-6">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-brand-lightest" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-medium"
            style={{
              left: `${((filters.priceMin - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100}%`,
              right: `${100 - ((filters.priceMax - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
          />
          <input
            type="range"
            min={PRICE_FLOOR}
            max={PRICE_CEIL}
            step={50}
            value={filters.priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 appearance-none bg-transparent"
          />
        </div>
        <style>{`
          .range-thumb::-webkit-slider-thumb {
            pointer-events: auto;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: var(--logo-forest);
            border: 2px solid var(--background);
            box-shadow: 0 0 0 1px var(--logo-sage-medium);
            cursor: pointer;
          }
          .range-thumb::-moz-range-thumb {
            pointer-events: auto;
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: var(--logo-forest);
            border: 2px solid var(--background);
            box-shadow: 0 0 0 1px var(--logo-sage-medium);
            cursor: pointer;
          }
        `}</style>
      </section>

      {/* Duration */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Duration</h3>
        <div className="relative">
          <select
            value={filters.duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full appearance-none rounded-lg border border-brand-light bg-[var(--background)] py-2.5 pl-3 pr-9 text-sm text-brand-darkest outline-none transition focus:border-brand-medium focus:ring-2 focus:ring-brand-light/60"
          >
            {Object.entries(DURATION_RANGES).map(([key, range]) => (
              <option key={key} value={key}>
                {range.label}
              </option>
            ))}
          </select>
          <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium" />
        </div>
      </section>

      {/* Difficulty */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-darkest">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((level) => {
            const checked = filters.difficulty.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => toggleDifficulty(level)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  checked
                    ? 'border-brand-dark bg-brand-dark text-white'
                    : 'border-brand-light text-brand-darkest hover:bg-brand-lightest'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
