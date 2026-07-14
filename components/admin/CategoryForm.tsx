'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import {
  categorySchema,
  CategoryFormInput,
  CategoryFormOutput,
} from '@/lib/validations/category.schema';
import { ADMIN_CATEGORIES_KEY } from '@/lib/queryKeys';
import type { Category } from '@/lib/types/category';
import { slugify } from '@/lib/utils';
import ImageUploader from './ImageUploader';

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  // <input, context, transformed-output>: the resolver applies Zod's defaults and
  // ''-to-null transforms, so handleSubmit hands us CategoryFormOutput.
  const form = useForm<CategoryFormInput, unknown, CategoryFormOutput>({
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

  const { errors } = form.formState;
  const coverImageUrl = useWatch({ control: form.control, name: 'cover_image_url' });

  const saveMutation = useMutation({
    mutationFn: async (data: CategoryFormOutput) => {
      const url = isEditing ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(result?.error || 'Failed to save');
      return result;
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Category updated' : 'Category created');
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save category');
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name, { shouldValidate: true });
    // Only mirror the name into the slug while creating, and only until the admin
    // edits the slug by hand.
    if (!isEditing && !form.formState.dirtyFields.slug) {
      form.setValue('slug', slugify(name));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-darkest">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4" noValidate>
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              {...form.register('name')}
              onChange={handleNameChange}
              className="w-full border p-2 rounded"
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <ImageUploader onUpload={(url) => form.setValue('cover_image_url', url, { shouldValidate: true })} />

            {/* Image Preview Box */}
            {coverImageUrl && (
              <div className="mt-3 w-full h-32 relative border rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied Supabase host is not in next.config remotePatterns */}
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <input {...form.register('cover_image_url')} type="hidden" />
            <FieldError message={errors.cover_image_url?.message} />
          </div>

          {/* Other Fields */}
          <div>
            <label htmlFor="icon_name" className="block text-sm font-medium">Icon Name</label>
            <input id="icon_name" {...form.register('icon_name')} className="w-full border p-2 rounded" placeholder="e.g., Camera" />
            <FieldError message={errors.icon_name?.message} />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
            <input id="slug" {...form.register('slug')} readOnly={isEditing} className="w-full border p-2 rounded bg-gray-50" />
            <FieldError message={errors.slug?.message} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" {...form.register('description')} className="w-full border p-2 rounded" rows={3} />
            <FieldError message={errors.description?.message} />
          </div>

          <div>
            <label htmlFor="display_order" className="block text-sm font-medium mb-1">Display Order</label>
            <input
              id="display_order"
              type="number"
              min={0}
              {...form.register('display_order', { valueAsNumber: true })}
              className="w-full border p-2 rounded"
            />
            <FieldError message={errors.display_order?.message} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...form.register('is_active')} />
            <span className="text-sm">Active</span>
          </label>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full bg-brand-dark text-white p-2 rounded hover:bg-brand-darkest transition-colors disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
