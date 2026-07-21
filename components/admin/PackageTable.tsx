'use client'

import Link from 'next/link'
import { Edit, Eye, ImageOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { formatDate, formatPrice, packagePath } from '@/lib/utils'
import type { AdminPackage } from '@/lib/types/package'
import { useDeletePackage } from '@/lib/hooks/useAdminPackages'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

export default function PackageTable({ packages }: { packages: AdminPackage[] }) {
  const deleteMutation = useDeletePackage()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState<string>('')

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteId(id)
    setDeleteTitle(title)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Package deleted successfully')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete package')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-3xl">
          <thead className="bg-brand-lightest/40 border-b text-brand-darkest text-sm font-semibold tracking-wide">
            <tr>
              <th className="py-3.5 px-4 text-left">IMAGE</th>
              <th className="py-3.5 px-4 text-left">TITLE</th>
              <th className="py-3.5 px-4 text-left">CATEGORY</th>
              <th className="py-3.5 px-4 text-left">STATUS</th>
              <th className="py-3.5 px-4 text-left">PRICE</th>
              <th className="py-3.5 px-4 text-left">VIEWS</th>
              <th className="py-3.5 px-4 text-left">CREATED</th>
              <th className="py-3.5 px-4 text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light/30">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="transition-colors hover:bg-brand-lightest/15">
                <td className="p-4">
                  {pkg.cover_image_url ? (
                    <img
                      src={pkg.cover_image_url}
                      alt={pkg.title}
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
                    <button
                      onClick={() => handleDeleteClick(pkg.id, pkg.title)}
                      disabled={deleteMutation.isPending}
                      aria-label={`Delete ${pkg.title}`}
                      className="text-red-500 transition-colors hover:text-red-700 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Package"
        message={`Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
