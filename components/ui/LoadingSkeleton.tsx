import type { CSSProperties } from 'react';

/**
 * Reusable loading skeletons. Pure/presentational (no client JS), so this works in both Server
 * Components (e.g. `loading.tsx`) and Client Components. Uses the brand tint + Tailwind's
 * `animate-pulse` for a no-layout-shift placeholder.
 */

type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const ROUNDED: Record<Rounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: Rounded;
  animation?: 'pulse' | 'none';
  className?: string;
}

/** A single shimmer block — the primitive every variant is built from. */
export function Skeleton({
  width,
  height,
  rounded = 'md',
  animation = 'pulse',
  className = '',
}: SkeletonProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`bg-brand-lightest ${animation === 'pulse' ? 'animate-pulse' : ''} ${ROUNDED[rounded]} ${className}`}
    />
  );
}

export type SkeletonVariant = 'card' | 'list' | 'grid' | 'hero' | 'table' | 'gallery' | 'form';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  /** Number of repeated items (cards, rows, cells…). Defaults sensibly per variant. */
  count?: number;
  rounded?: Rounded;
  animation?: 'pulse' | 'none';
  className?: string;
  /** Announced to screen readers while loading. */
  label?: string;
}

function CardSkeleton({ animation }: { animation: 'pulse' | 'none' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-light bg-[var(--background)]">
      <Skeleton height="11rem" rounded="none" animation={animation} className="w-full" />
      <div className="space-y-2 p-4">
        <Skeleton height="1rem" animation={animation} className="w-3/4" />
        <Skeleton height="0.75rem" animation={animation} className="w-full" />
        <Skeleton height="0.75rem" animation={animation} className="w-2/3" />
        <Skeleton height="2rem" rounded="full" animation={animation} className="w-full" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  variant = 'card',
  count,
  rounded,
  animation = 'pulse',
  className = '',
}: LoadingSkeletonProps) {
  const items = (n: number) => Array.from({ length: count ?? n });

  let content: React.ReactNode;

  switch (variant) {
    case 'card':
      content = <CardSkeleton animation={animation} />;
      break;

    case 'grid':
      content = (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items(6).map((_, i) => (
            <CardSkeleton key={i} animation={animation} />
          ))}
        </div>
      );
      break;

    case 'list':
      content = (
        <div className="space-y-4">
          {items(5).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-brand-light p-4">
              <Skeleton width="3rem" height="3rem" rounded="full" animation={animation} />
              <div className="flex-1 space-y-2">
                <Skeleton height="1rem" animation={animation} className="w-1/3" />
                <Skeleton height="0.75rem" animation={animation} className="w-2/3" />
              </div>
            </div>
          ))}
        </div>
      );
      break;

    case 'hero':
      content = (
        <div className="space-y-4">
          <Skeleton height="52vh" rounded="2xl" animation={animation} className="w-full min-h-[340px]" />
          <Skeleton height="2rem" animation={animation} className="w-1/2" />
          <Skeleton height="1rem" animation={animation} className="w-3/4" />
        </div>
      );
      break;

    case 'table':
      content = (
        <div className="overflow-hidden rounded-xl border border-brand-light">
          <Skeleton height="2.75rem" rounded="none" animation={animation} className="w-full" />
          <div className="divide-y divide-brand-light">
            {items(6).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton height="0.875rem" animation={animation} className="w-1/4" />
                <Skeleton height="0.875rem" animation={animation} className="w-1/3" />
                <Skeleton height="0.875rem" animation={animation} className="ml-auto w-16" />
              </div>
            ))}
          </div>
        </div>
      );
      break;

    case 'gallery':
      content = (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items(6).map((_, i) => (
            <Skeleton key={i} rounded="xl" animation={animation} className="aspect-square w-full" />
          ))}
        </div>
      );
      break;

    case 'form':
      content = (
        <div className="space-y-5">
          {items(4).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton height="0.75rem" animation={animation} className="w-24" />
              <Skeleton height="2.75rem" rounded="xl" animation={animation} className="w-full" />
            </div>
          ))}
          <Skeleton height="3rem" rounded="2xl" animation={animation} className="w-full" />
        </div>
      );
      break;
  }

  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">Loading…</span>
      {rounded ? <div className={ROUNDED[rounded]}>{content}</div> : content}
    </div>
  );
}
