'use client';

import { useController, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import {
  subcategorySchema,
  SubcategoryFormInput,
  SubcategoryFormOutput,
} from '@/lib/validations/category.schema';
import { ADMIN_SUBCATEGORIES_KEY } from '@/lib/queryKeys';
import { useAdminCategories } from '@/lib/hooks/useAdminCategories';
import type { Subcategory } from '@/lib/types/category';
import { slugify } from '@/lib/utils';
import CheckboxGroup from '@/components/admin/PackageForm/CheckboxGroup';
import FieldError from './FieldError';
import ImageUploader from './ImageUploader';

interface SubcategoryFormProps {
  subcategory?: Subcategory | null;
  onClose: () => void;
}

export default function SubcategoryForm({ subcategory, onClose }: SubcategoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!subcategory;

  const categoriesQuery = useAdminCategories();

  // input, context, transformed-output — same pattern as CategoryForm
  const form = useForm<SubcategoryFormInput, unknown, SubcategoryFormOutput>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: subcategory?.name ?? '',
      slug: subcategory?.slug ?? '',
      description: subcategory?.description ?? '',
      cover_image_url: subcategory?.cover_image_url ?? '',
      icon_name: subcategory?.icon_name ?? '',
      display_order: subcategory?.display_order ?? 0,
      is_active: subcategory?.is_active ?? true,
      category_ids: subcategory?.category_ids ?? [],
    },
  });

  const { errors } = form.formState;
  const coverImageUrl = useWatch({ control: form.control, name: 'cover_image_url' });
  const { field: categoriesField } = useController({
    control: form.control,
    name: 'category_ids',
  });
  const selectedCategories = categoriesField.value ?? [];

  const saveMutation = useMutation({
    mutationFn: async (data: SubcategoryFormOutput) => {
      const url = isEditing
        ? `/api/admin/subcategories/${subcategory.id}`
        : '/api/admin/subcategories';
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
      toast.success(isEditing ? 'Subcategory updated' : 'Subcategory created');
      queryClient.invalidateQueries({ queryKey: ADMIN_SUBCATEGORIES_KEY });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save subcategory');
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name, { shouldValidate: true });
    if (!isEditing && !form.formState.dirtyFields.slug) {
      form.setValue('slug', slugify(name));
    }
  };

  const toggleCategory = (id: string) => {
    const next = selectedCategories.includes(id)
      ? selectedCategories.filter((item) => item !== id)
      : [...selectedCategories, id];
    categoriesField.onChange(next);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-darkest">
            {isEditing ? 'Edit Subcategory' : 'Add Subcategory'}
          </h2>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4" noValidate>
          <div>
            <label htmlFor="sub-name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="sub-name"
              {...form.register('name')}
              onChange={handleNameChange}
              className="w-full border p-2 rounded text-base lg:text-sm"
            />
            <FieldError message={errors.name?.message} />
          </div>

          {/* Parent categories — the whole point of this form */}
          <div>
            <span className="block text-sm font-medium mb-2">Parent Categories</span>
            {categoriesQuery.isPending ? (
              <p className="flex items-center gap-2 rounded bg-gray-50 p-3 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading categories...
              </p>
            ) : categoriesQuery.isError ? (
              <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Could not load categories. Close and try again.
              </p>
            ) : categoriesQuery.data.length === 0 ? (
              <p className="rounded bg-gray-50 p-3 text-sm text-gray-500">
                No categories exist yet. Create a category first.
              </p>
            ) : (
              <CheckboxGroup
                legend="Parent categories"
                name="category_ids"
                columns={2}
                options={categoriesQuery.data.map((category) => ({
                  id: category.id,
                  name: category.name,
                  badge: category.is_active ? undefined : 'inactive',
                }))}
                selected={selectedCategories}
                onToggle={toggleCategory}
              />
            )}
            <FieldError message={errors.category_ids?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            {/* Shown on the customer category page's subcategory cards */}
            <ImageUploader
              bucket="category-images"
              path="subcategories"
              maxFiles={1}
              initialImages={coverImageUrl ? [coverImageUrl] : []}
              onUpload={(urls) =>
                form.setValue('cover_image_url', urls[0] ?? '', { shouldValidate: true })
              }
            />
            <input {...form.register('cover_image_url')} type="hidden" />
            <FieldError message={errors.cover_image_url?.message} />
          </div>

          <div>
            <label htmlFor="sub-slug" className="block text-sm font-medium mb-1">Slug</label>
            <input
              id="sub-slug"
              {...form.register('slug')}
              readOnly={isEditing}
              className="w-full border p-2 rounded bg-gray-50 text-base lg:text-sm"
            />
            <FieldError message={errors.slug?.message} />
          </div>

          <div>
            <label htmlFor="sub-icon" className="block text-sm font-medium mb-1">Icon Name</label>
            <input
              id="sub-icon"
              {...form.register('icon_name')}
              className="w-full border p-2 rounded text-base lg:text-sm"
              placeholder="e.g., Heart"
            />
            <FieldError message={errors.icon_name?.message} />
          </div>

          <div>
            <label htmlFor="sub-description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="sub-description"
              {...form.register('description')}
              className="w-full border p-2 rounded text-base lg:text-sm"
              rows={3}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div>
            <label htmlFor="sub-display-order" className="block text-sm font-medium mb-1">Display Order</label>
            <input
              id="sub-display-order"
              type="number"
              min={0}
              {...form.register('display_order', { valueAsNumber: true })}
              className="w-full border p-2 rounded text-base lg:text-sm"
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
            {saveMutation.isPending ? 'Saving...' : 'Save Subcategory'}
          </button>
        </form>
      </div>
    </div>
  );
}
