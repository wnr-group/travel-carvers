'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A clickable 1–5 star rating.
 *
 * Built on real `<input type="radio">` elements (visually hidden, with the star as the label)
 * rather than `<button>`s or `<div onClick>`. That is the whole accessibility story for free:
 * a radio group is arrow-key navigable, announces "3 of 5 stars" to a screen reader, and
 * participates in the form natively. Faking it with buttons would mean re-implementing roving
 * tabindex and ARIA by hand, badly.
 *
 * Lives in `components/ui` because it isn't package-specific — the `reviews` table has a rating
 * column too.
 */
export default function StarRating({
  value,
  onChange,
  onBlur,
  name,
  label,
  max = 5,
  disabled,
}: {
  value: number | undefined;
  onChange: (rating: number) => void;
  onBlur?: () => void;
  /** Must be unique per rating group on the page, or the radios bleed into each other. */
  name: string;
  label: string;
  max?: number;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Hovering previews what you'd get if you clicked, which is what makes a star control feel
  // like one. It's presentation only — nothing is written until you actually pick.
  const shown = hovered ?? value ?? 0;

  return (
    <fieldset
      className="flex items-center gap-1"
      disabled={disabled}
      onMouseLeave={() => setHovered(null)}
    >
      <legend className="sr-only">{label}</legend>

      {Array.from({ length: max }, (_, index) => index + 1).map((star) => {
        const isFilled = star <= shown;

        return (
          <label
            key={star}
            className={cn('cursor-pointer p-0.5', disabled && 'cursor-not-allowed')}
            onMouseEnter={() => setHovered(star)}
          >
            <input
              type="radio"
              name={name}
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              onBlur={onBlur}
              className="peer sr-only"
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            />
            <Star
              aria-hidden="true"
              className={cn(
                'h-5 w-5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-medium peer-focus-visible:rounded-sm',
                isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
              )}
            />
          </label>
        );
      })}

      <span className="ml-2 text-xs tabular-nums text-gray-500">
        {value ? `${value}/${max}` : 'Not rated'}
      </span>
    </fieldset>
  );
}
