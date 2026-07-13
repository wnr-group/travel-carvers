'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { categorySchema,CategoryFormData } from '@/lib/validations/category.schema';
import { slugify } from '@/lib/utils';
import ImageUploader from './ImageUploader';

export default function CategoryForm({ category, onClose }: { category?: any, onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEditing = !!category;
  const form = useForm<CategoryFormData>({
  resolver: zodResolver(categorySchema),
  defaultValues: {
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    cover_image_url: category?.cover_image_url ?? "",
    icon_name: category?.icon_name ?? "",
    display_order: category?.display_order ?? 0,
    is_active: category?.is_active ?? true,
  },
});

  const saveMutation = useMutation({
  mutationFn: async (data: CategoryFormData) => {
    // 1. Ensure the URL is absolute from the root
    const url = isEditing 
      ? `/api/admin/categories/${category.id}` 
      : '/api/admin/categories';
      
    const res = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to save');
    return result;
  },
  onSuccess: () => {
    toast.success(isEditing ? 'Category updated' : 'Category created');
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    onClose();
  }
});

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!isEditing) {
      form.setValue('slug', slugify(name));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              {...form.register('name')} 
              onChange={handleNameChange} 
              className="w-full border p-2 rounded" 
            />
            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Cover Image</label>
            <ImageUploader onUpload={(url) => form.setValue('cover_image_url', url)} />
            <input {...form.register('cover_image_url')} readOnly className="w-full border p-2 mt-2 bg-gray-50 text-xs" />
            </div>

            <div>
            <label className="block text-sm font-medium">Icon Name (Lucide Icon)</label>
            <input {...form.register('icon_name')} className="w-full border p-2 rounded" placeholder="e.g., Camera" />
        </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input 
              {...form.register('slug')} 
              readOnly={isEditing} 
              className="w-full border p-2 rounded bg-gray-50" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              {...form.register('description')} 
              className="w-full border p-2 rounded" 
              rows={3} 
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register('is_active')} /> 
            <span className="text-sm">Active</span>
          </label>

          <button 
            type="submit" 
            disabled={saveMutation.isPending}
            className="w-full bg-[#1A3C34] text-white p-2 rounded hover:bg-green-900 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </div>
  );
}