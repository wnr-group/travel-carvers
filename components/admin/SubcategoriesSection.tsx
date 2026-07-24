'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, AlertTriangle, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import SubcategoryForm from '@/components/admin/SubcategoryForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { fetchJson } from '@/lib/api/fetchJson';
import { useAdminCategories } from '@/lib/hooks/useAdminCategories';
import { useAdminSubcategories } from '@/lib/hooks/useAdminSubcategories';
import { ADMIN_SUBCATEGORIES_KEY } from '@/lib/queryKeys';
import type { Subcategory } from '@/lib/types/category';

/**
 * Subcategory management: list, create, edit, delete — including the
 * category ↔ subcategory links the package form's subcategory picker relies on.
 */
export default function SubcategoriesSection() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: subcategories, isPending, isError, error } = useAdminSubcategories();
  const categoriesQuery = useAdminCategories();

  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    (categoriesQuery.data ?? []).forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categoriesQuery.data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/subcategories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Subcategory deleted');
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBCATEGORIES_KEY });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
    } catch {
      // Surfaced by the mutation's onError toast.
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-brand-dark text-white rounded-lg flex items-center gap-2 hover:bg-brand-darkest transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" /> Add Subcategory
        </button>
      </div>

      {isPending ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Loading...</div>
      ) : isError ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="font-semibold text-red-600">Could not load subcategories</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : subcategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="font-semibold">No subcategories yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create subcategories (e.g. Honeymoon, Family, Luxury) and link them to categories to
            refine how packages are organised.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[800px]">
              <thead className="bg-brand-lightest/40 border-b text-brand-darkest">
                <tr>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Slug</th>
                  <th className="p-4 text-left">Parent Categories</th>
                  <th className="p-4 text-left">Active</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.map((sub) => (
                  <tr key={sub.id} className="border-b">
                    <td className="p-4 text-gray-600">{sub.display_order}</td>
                    <td className="p-4">
                      {sub.cover_image_url ? (
                        <Image src={sub.cover_image_url} alt={sub.name} width={40} height={40} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageOff className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">{sub.name}</td>
                    <td className="p-4 text-gray-600">{sub.slug}</td>
                    <td className="p-4">
                      {sub.category_ids.length === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Not linked
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {sub.category_ids.map((id) => (
                            <span
                              key={id}
                              className="rounded-full bg-brand-lightest px-2.5 py-1 text-xs font-medium text-brand-darkest"
                            >
                              {categoryNames.get(id) ?? '…'}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4">{sub.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditing(sub); setShowForm(true); }}
                          aria-label={`Edit ${sub.name}`}
                        >
                          <Edit className="w-4 h-4 text-brand-dark" />
                        </button>
                        <button
                          onClick={() => setPendingDelete({ id: sub.id, name: sub.name })}
                          disabled={deleteMutation.isPending}
                          aria-label={`Delete ${sub.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <SubcategoryForm
          key={editing?.id ?? 'create'}
          subcategory={editing}
          onClose={() => setShowForm(false)}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete subcategory"
        message={
          pendingDelete
            ? `Delete “${pendingDelete.name}”? Packages tagged with it lose the tag. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
