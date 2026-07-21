'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useController, useFormContext } from 'react-hook-form';
import { AlertCircle, Loader2 } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import { useAdminCategories } from '@/lib/hooks/useAdminCategories';
import { useAdminSubcategories } from '@/lib/hooks/useAdminSubcategories';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import CheckboxGroup from './CheckboxGroup';
import FormSection from './FormSection';
import { INPUT_CLASSES } from './fields';

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

/** Loading / error / empty panels, kept consistent with the admin list pages. */
function Loading({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </p>
  );
}

function LoadError({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">{children}</p>
  );
}

/**
 * The Categories & Location tab.
 */
export default function CategoriesTab() {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();
  const { errors } = formState;

  const categoriesQuery = useAdminCategories();
  const subcategoriesQuery = useAdminSubcategories();

  const { field: categoryField } = useController({ control, name: 'category_ids' });
  const { field: subcategoryField } = useController({ control, name: 'subcategory_ids' });

  const selectedCategories = useMemo(() => categoryField.value ?? [], [categoryField.value]);
  const selectedSubcategories = useMemo(
    () => subcategoryField.value ?? [],
    [subcategoryField.value]
  );

  const subcategories = subcategoriesQuery.data;

  const availableSubcategories = useMemo(() => {
    if (!subcategories || selectedCategories.length === 0) return [];

    return subcategories.filter((sub) =>
      sub.category_ids.some((id) => selectedCategories.includes(id))
    );
  }, [subcategories, selectedCategories]);

  const handleCategoryToggle = (id: string) => {
    const nextCategories = toggle(selectedCategories, id);
    categoryField.onChange(nextCategories);

    if (!subcategories) return;

    const stillValid = selectedSubcategories.filter((subId) => {
      const sub = subcategories.find((candidate) => candidate.id === subId);
      return sub?.category_ids.some((catId) => nextCategories.includes(catId)) ?? false;
    });

    if (stillValid.length !== selectedSubcategories.length) {
      subcategoryField.onChange(stillValid);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Categories"
        description="At least one category is required. It decides where the package appears on the site."
      >
        {categoriesQuery.isPending ? (
          <Loading label="Loading categories..." />
        ) : categoriesQuery.isError ? (
          <LoadError
            message={
              categoriesQuery.error instanceof Error
                ? `Could not load categories: ${categoriesQuery.error.message}`
                : 'Could not load categories.'
            }
          />
        ) : categoriesQuery.data.length === 0 ? (
          <Empty>
            No categories exist yet.{' '}
            <Link href="/admin/categories" className="text-brand-dark underline">
              Create one first
            </Link>
            .
          </Empty>
        ) : (
          <CheckboxGroup
            legend="Categories"
            name="category_ids"
            options={categoriesQuery.data.map((category) => ({
              id: category.id,
              name: category.name,
              badge: category.is_active ? undefined : 'inactive',
            }))}
            selected={selectedCategories}
            onToggle={handleCategoryToggle}
          />
        )}

        <FieldError message={errors.category_ids?.message} />
      </FormSection>

      <FormSection
        title="Subcategories"
        description="Optional. Only subcategories belonging to the categories you picked are shown."
      >
        {subcategoriesQuery.isPending ? (
          <Loading label="Loading subcategories..." />
        ) : subcategoriesQuery.isError ? (
          <LoadError
            message={
              subcategoriesQuery.error instanceof Error
                ? `Could not load subcategories: ${subcategoriesQuery.error.message}`
                : 'Could not load subcategories.'
            }
          />
        ) : selectedCategories.length === 0 ? (
          <Empty>Pick a category above to see its subcategories.</Empty>
        ) : availableSubcategories.length === 0 ? (
          <Empty>The selected categories have no subcategories.</Empty>
        ) : (
          <CheckboxGroup
            legend="Subcategories"
            name="subcategory_ids"
            options={availableSubcategories.map((sub) => ({
              id: sub.id,
              name: sub.name,
              badge: sub.is_active ? undefined : 'inactive',
            }))}
            selected={selectedSubcategories}
            onToggle={(id) => subcategoryField.onChange(toggle(selectedSubcategories, id))}
          />
        )}

        <FieldError message={errors.subcategory_ids?.message} />
      </FormSection>

      <FormSection title="Location" description="Where the trip is centred. All optional.">
        <div>
          <label
            htmlFor="destination_name"
            className="mb-1 block text-sm font-medium text-brand-darkest"
          >
            Destination Name
          </label>
          <input
            id="destination_name"
            type="text"
            placeholder="e.g. Alleppey, Kerala"
            {...register('destination_name')}
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.destination_name?.message} />
        </div>
      </FormSection>
    </div>
  );
}
