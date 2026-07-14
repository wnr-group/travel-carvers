'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import CategoryForm from '@/components/admin/CategoryForm';
import { fetchJson } from '@/lib/api/fetchJson';
import { useAdminCategories } from '@/lib/hooks/useAdminCategories';
import { ADMIN_CATEGORIES_KEY } from '@/lib/queryKeys';
import { Category } from '@/lib/types/category';

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isPending, isError, error } = useAdminCategories();

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-brand-darkest">Categories</h1>
        <button onClick={() => { setEditingCategory(null); setShowForm(true); }} className="px-4 py-2 bg-brand-dark text-white rounded-lg flex items-center gap-2 hover:bg-brand-darkest transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {isPending ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">Loading...</div>
      ) : isError ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="font-semibold text-red-600">Could not load categories</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="font-semibold">No categories yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create your first category to start organising packages.
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
                <th className="p-4 text-left">Icon</th>
                <th className="p-4 text-left">Active</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="p-4 text-gray-600">{cat.display_order}</td>
                  <td className="p-4">
                    {cat.cover_image_url ? (
                      <img src={cat.cover_image_url} alt={cat.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageOff className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-600">{cat.slug}</td>
                  <td className="p-4 text-gray-600 font-mono text-sm">{cat.icon_name}</td>
                  <td className="p-4">{cat.is_active ? 'Yes' : 'No'}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => { setEditingCategory(cat); setShowForm(true); }}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Edit className="w-4 h-4 text-brand-dark" />
                    </button>
                    <button
                      onClick={() => confirm(`Delete "${cat.name}"? This cannot be undone.`) && deleteMutation.mutate(cat.id)}
                      disabled={deleteMutation.isPending}
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
      {showForm && (
        <CategoryForm
          key={editingCategory?.id ?? 'create'}
          category={editingCategory}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
