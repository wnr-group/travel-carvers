'use client';

import { Skeleton } from '@/components/ui/LoadingSkeleton';

interface ChartCardProps {
  title: string;
  description?: string;
  isPending?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  height?: number;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  isPending = false,
  isError = false,
  isEmpty = false,
  emptyText = 'No data yet.',
  height = 280,
  children,
}: ChartCardProps) {
  return (
    <section className="bg-white rounded-lg shadow p-5" aria-label={title}>
      <h2 className="font-semibold text-brand-darkest">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}

      <div className="mt-4" style={{ height }}>
        {isPending ? (
          <div className="flex h-full flex-col justify-end gap-3">
            <Skeleton height="70%" rounded="lg" />
            <Skeleton height="12%" rounded="md" width="60%" />
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-red-50 px-6 text-center">
            <p className="text-sm text-red-700">Could not load this chart. Try refreshing.</p>
          </div>
        ) : isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-gray-50 px-6 text-center">
            <p className="text-sm text-gray-500">{emptyText}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
