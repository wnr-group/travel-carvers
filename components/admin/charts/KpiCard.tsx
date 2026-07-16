'use client';

import type { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  isPending?: boolean;
}

/**
 * A stat tile
 */
export default function KpiCard({ label, value, sub, icon: Icon, isPending = false }: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lightest/60 text-brand-dark">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {isPending ? (
          <Skeleton width={64} height={28} rounded="md" className="mt-1" />
        ) : (
          <p className="mt-0.5 text-2xl font-bold leading-tight text-brand-darkest">{value}</p>
        )}
        {sub && !isPending && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
