import { cn } from '@/lib/utils'
import { PACKAGE_STATUS_LABELS, type PackageStatus } from '@/lib/types/package'

const STATUS_STYLES: Record<PackageStatus, string> = {
  published: 'bg-brand-lightest text-brand-darkest',
  draft: 'bg-gray-100 text-gray-700',
  archived: 'bg-amber-100 text-amber-800',
  sold_out: 'bg-rose-100 text-rose-800',
}

export default function StatusBadge({
  status,
  className,
}: {
  status: PackageStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        STATUS_STYLES[status],
        className
      )}
    >
      {PACKAGE_STATUS_LABELS[status]}
    </span>
  )
}
