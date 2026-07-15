'use client';

import {
  PackageOpen,
  SearchX,
  FolderOpen,
  ImageOff,
  CalendarX,
  Inbox,
  Heart,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

export type EmptyStateVariant =
  | 'packages'
  | 'search'
  | 'categories'
  | 'gallery'
  | 'itinerary'
  | 'bookings'
  | 'favorites'
  | 'destinations'
  | 'generic';

const PRESETS: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string }> = {
  packages: {
    icon: PackageOpen,
    title: 'No packages yet',
    description: 'There are no travel packages to show right now. Please check back soon.',
  },
  search: {
    icon: SearchX,
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you’re looking for.',
  },
  categories: {
    icon: FolderOpen,
    title: 'No categories yet',
    description: 'Travel categories will appear here once they’re added.',
  },
  gallery: {
    icon: ImageOff,
    title: 'No photos yet',
    description: 'There are no images to display for this item.',
  },
  itinerary: {
    icon: CalendarX,
    title: 'No itinerary yet',
    description: 'A detailed day-by-day plan will be published soon.',
  },
  bookings: {
    icon: Inbox,
    title: 'No bookings yet',
    description: 'Your bookings and enquiries will show up here.',
  },
  favorites: {
    icon: Heart,
    title: 'No favourites yet',
    description: 'Save the trips you love to find them here later.',
  },
  destinations: {
    icon: MapPin,
    title: 'No destinations yet',
    description: 'Destinations will appear here soon.',
  },
  generic: {
    icon: Inbox,
    title: 'Nothing here yet',
    description: 'There’s nothing to show right now.',
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  /** Overrides the variant preset. */
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Reusable empty-state panel with sensible per-context presets. Any preset field can be
 * overridden via props. Announced politely to screen readers.
 */
export default function EmptyState({
  variant = 'generic',
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const preset = PRESETS[variant];
  const Icon = icon ?? preset.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-light bg-brand-lightest/40 px-6 py-16 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-lightest">
        <Icon className="h-7 w-7 text-brand-medium" aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-brand-darkest">{title ?? preset.title}</h3>
      <p className="max-w-sm text-sm text-brand-medium">{description ?? preset.description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-gradient-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
