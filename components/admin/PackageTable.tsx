'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Edit, Eye, ImageOff, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatDate, formatPrice, packagePath } from '@/lib/utils'
import type { AdminPackage } from '@/lib/types/package'

export default function PackageTable({
  packages,
  onDelete,
}: {
  packages: AdminPackage[]
  onDelete?: (pkg: AdminPackage) => void
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl">
          <thead className="border-b bg-brand-lightest/40 text-brand-darkest">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Views</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b last:border-b-0 hover:bg-brand-lightest/20">
                <td className="p-4">
                  {pkg.cover_image_url ? (
                    <Image
                      src={pkg.cover_image_url}
                      alt={pkg.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-400">
                      <ImageOff className="h-4 w-4" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium text-brand-darkest">{pkg.title}</td>
                <td className="p-4 text-gray-600">
                  {pkg.categories.length > 0
                    ? pkg.categories.map((category) => category.name).join(', ')
                    : '—'}
                </td>
                <td className="p-4">
                  <StatusBadge status={pkg.status} />
                </td>
                <td className="p-4 text-gray-600">{formatPrice(pkg.price_adult)}</td>
                <td className="p-4 text-gray-600">{pkg.view_count.toLocaleString('en-IN')}</td>
                <td className="p-4 text-gray-600">{formatDate(pkg.created_at)}</td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={packagePath(pkg.slug)}
                      target="_blank"
                      aria-label={`View ${pkg.title}`}
                      className="text-gray-500 transition-colors hover:text-brand-dark"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/packages/${pkg.id}/edit`}
                      aria-label={`Edit ${pkg.title}`}
                      className="text-brand-dark transition-colors hover:text-brand-darkest"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(pkg)}
                        aria-label={`Delete ${pkg.title}`}
                        className="text-gray-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
