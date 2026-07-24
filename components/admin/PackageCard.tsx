'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Edit, Eye, ImageOff } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatPrice, packagePath } from '@/lib/utils'
import type { AdminPackage } from '@/lib/types/package'

export default function PackageCard({ pkg }: { pkg: AdminPackage }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg">
      <div className="relative h-40 bg-gray-100">
        {pkg.cover_image_url ? (
          <Image
            src={pkg.cover_image_url}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        <StatusBadge status={pkg.status} className="absolute right-3 top-3 shadow-sm" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-medium">
          {pkg.categories.length > 0
            ? pkg.categories.map((category) => category.name).join(', ')
            : 'Uncategorised'}
        </p>

        <h3 className="mt-1 font-bold text-brand-darkest">{pkg.title}</h3>

        {pkg.short_description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{pkg.short_description}</p>
        )}
        
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-brand-darkest">
              {formatPrice(pkg.price_adult)}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              {pkg.view_count.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href={packagePath(pkg.slug)}
              target="_blank"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              View
            </Link>
            <Link
              href={`/admin/packages/${pkg.id}/edit`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-dark px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
