'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import CategoryForm from '@/components/admin/CategoryForm';
import { Category } from '@/lib/types/category';

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/categories');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data as Category[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button onClick={() => { setEditingCategory(null); setShowForm(true); }} className="px-4 py-2 bg-green-900 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {isLoading ? <div>Loading...</div> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
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
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-b">
                  <td className="p-4"><GripVertical className="text-gray-400" /></td>
                  <td className="p-4"><img src={cat.cover_image_url || ''} className="w-10 h-10 rounded" /></td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-gray-600">{cat.slug}</td>
                  <td className="p-4 text-gray-600 font-mono text-sm">{cat.icon_name}</td>
                  <td className="p-4">{cat.is_active ? 'Yes' : 'No'}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setEditingCategory(cat); setShowForm(true); }}><Edit className="w-4 h-4 text-blue-600" /></button>
                    <button onClick={() => confirm('Delete?') && deleteMutation.mutate(cat.id)}><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && <CategoryForm category={editingCategory} onClose={() => setShowForm(false)} />}
    </div>
  );
}