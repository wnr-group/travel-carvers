'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Compact page list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 20]. */
function pageItems(page: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);

  if (start > 2) items.push('ellipsis');
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < total - 1) items.push('ellipsis');

  items.push(total);
  return items;
}

/** Page-number pagination. Renders nothing when there's a single page. */
export default function Pagination({ page, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  const arrowClasses =
    'flex h-9 w-9 items-center justify-center rounded-lg border border-brand-light text-brand-dark transition-colors hover:bg-brand-lightest disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button type="button" onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page" className={arrowClasses}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageItems(page, totalPages).map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-brand-dark/50" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
              item === page
                ? 'bg-brand-dark text-white'
                : 'border border-brand-light text-brand-dark hover:bg-brand-lightest'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button type="button" onClick={() => go(page + 1)} disabled={page >= totalPages} aria-label="Next page" className={arrowClasses}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
