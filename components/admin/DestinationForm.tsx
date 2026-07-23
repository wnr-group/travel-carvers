'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import FieldError from '@/components/admin/FieldError';
import ImageUploader from '@/components/admin/ImageUploader';
import { useAdminPackages } from '@/lib/hooks/useAdminPackages';
import { cn, slugify } from '@/lib/utils';
import type { Destination } from '@/lib/types/destination';
import {
  destinationSchema,
  type DestinationFormInput,
  type DestinationFormOutput,
} from '@/lib/validations/destination.schema';

const INPUT_CLASSES =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium';

const EMPTY_DESTINATION: DestinationFormInput = {
  name: '',
  country: '',
  city: '',
  timezone: '',
  currency: '',
  languages: '',
  slug: '',
  hero_image_url: '',
  description: '',
  latitude: undefined as unknown as number,
  longitude: undefined as unknown as number,
  is_featured: false,
  is_popular: false,
  is_active: true,
  meta_title: '',
  meta_description: '',
  og_image: '',
  package_ids: [],
};

const numberField = {
  setValueAs: (value: unknown) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
};

function errorMessage(error: unknown): string {
  if (!error) return 'Please check this field.';

  if (Array.isArray(error)) {
    for (const item of error) {
      const nested = errorMessage(item);
      if (nested !== 'Please check this field.') return nested;
    }
    return 'One or more entries are invalid.';
  }

  const message = (error as { message?: unknown }).message;
  return typeof message === 'string' && message ? message : 'Please check this field.';
}

/** Human labels for the toast, so "latitude" reads as "Latitude" and not a raw key. */
const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  country: 'Country',
  city: 'City',
  slug: 'Slug',
  description: 'Description',
  hero_image_url: 'Hero image',
  latitude: 'Latitude',
  longitude: 'Longitude',
  timezone: 'Time zone',
  currency: 'Currency',
  languages: 'Languages',
  meta_title: 'Meta title',
  meta_description: 'Meta description',
  og_image: 'OG image',
  package_ids: 'Packages',
};

interface DestinationFormProps {
  destination?: Destination | null;
  onSubmit: (data: DestinationFormOutput) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Create/edit form for a destination
 */
export default function DestinationForm({
  destination,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: DestinationFormProps) {
  const isEditing = Boolean(destination);
  const [packageSearch, setPackageSearch] = useState('');

  const form = useForm<DestinationFormInput, unknown, DestinationFormOutput>({
    resolver: zodResolver(destinationSchema),
    mode: 'onBlur',
    defaultValues: destination
      ? {
          ...destination,
          city: destination.city ?? '',
          hero_image_url: destination.hero_image_url ?? '',
          description: destination.description ?? '',
          // The table stores these as NULL; the inputs need '' or React warns about switching
          // an input from uncontrolled to controlled.
          timezone: destination.timezone ?? '',
          currency: destination.currency ?? '',
          languages: destination.languages ?? '',
          meta_title: destination.meta_title ?? '',
          meta_description: destination.meta_description ?? '',
          og_image: destination.og_image ?? '',
        }
      : EMPTY_DESTINATION,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = form;

  const heroImageUrl = useWatch({ control, name: 'hero_image_url' });
  const selectedPackageIds = useWatch({ control, name: 'package_ids' }) ?? [];
  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });

  const { data: packages, isPending: packagesLoading } = useAdminPackages({});

  const visiblePackages = useMemo(() => {
    const term = packageSearch.trim().toLowerCase();
    const all = packages ?? [];
    if (!term) return all;
    return all.filter((pkg) => pkg.title.toLowerCase().includes(term));
  }, [packages, packageSearch]);

  const nameField = register('name');

  const togglePackage = (id: string) => {
    const next = selectedPackageIds.includes(id)
      ? selectedPackageIds.filter((packageId) => packageId !== id)
      : [...selectedPackageIds, id];

    setValue('package_ids', next, { shouldDirty: true });
  };

  const hasCoordinates = typeof latitude === 'number' && !Number.isNaN(latitude) &&
    typeof longitude === 'number' && !Number.isNaN(longitude);


  const handleInvalid = (formErrors: FieldErrors<DestinationFormInput>) => {
    const [field, error] = Object.entries(formErrors)[0] ?? [];
    const label = field ? FIELD_LABELS[field] ?? field : null;
    const message = errorMessage(error);

    toast.error(label ? `${label}: ${message}` : 'Please fix the highlighted fields.');

    if (field) {
      document
        .getElementById(field)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, handleInvalid)} noValidate className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-brand-darkest">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            {...nameField}
            onChange={(event) => {
              nameField.onChange(event);
              if (!isEditing && !dirtyFields.slug) {
                setValue('slug', slugify(event.target.value));
              }
            }}
            placeholder="e.g. Bali"
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="country" className="mb-1 block text-sm font-medium text-brand-darkest">
            Country <span className="text-red-600">*</span>
          </label>
          <input
            id="country"
            {...register('country')}
            placeholder="e.g. Indonesia"
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.country?.message} />
        </div>

        <div>
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-brand-darkest">
            City
          </label>
          <input
            id="city"
            {...register('city')}
            placeholder="Optional"
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.city?.message} />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-brand-darkest">
            Slug <span className="text-red-600">*</span>
          </label>
          <input
            id="slug"
            {...register('slug')}
            readOnly={isEditing}
            placeholder="bali"
            className={cn(INPUT_CLASSES, isEditing && 'bg-gray-50 text-gray-600')}
          />
          <p className="mt-1 text-xs text-gray-500">
            {isEditing
              ? 'The slug is the public URL and cannot be changed after creation.'
              : 'Auto-filled from the name; edit it to override.'}
          </p>
          <FieldError message={errors.slug?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-brand-darkest">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          placeholder="Shown on the destination page beneath the hero."
          className={INPUT_CLASSES}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-brand-darkest">Hero Image</span>
        <ImageUploader
          bucket="destination-images"
          path="heroes"
          maxFiles={1}
          value={heroImageUrl ? [heroImageUrl] : []}
          onUpload={(urls) => setValue('hero_image_url', urls[0] ?? '', { shouldDirty: true })}
        />
        <FieldError message={errors.hero_image_url?.message} />
      </div>

      {/* Coordinates  */}
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="flex items-center gap-1.5 px-1 text-sm font-medium text-brand-darkest">
          <MapPin className="h-4 w-4" />
          Map Position
        </legend>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="latitude" className="mb-1 block text-sm font-medium text-brand-darkest">
              Latitude <span className="text-red-600">*</span>
            </label>
            <input
              id="latitude"
              type="number"
              inputMode="decimal"
              step="any"
              min="-90"
              max="90"
              placeholder="-8.4095"
              {...register('latitude', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.latitude?.message} />
          </div>

          <div>
            <label htmlFor="longitude" className="mb-1 block text-sm font-medium text-brand-darkest">
              Longitude <span className="text-red-600">*</span>
            </label>
            <input
              id="longitude"
              type="number"
              inputMode="decimal"
              step="any"
              min="-180"
              max="180"
              placeholder="115.1889"
              {...register('longitude', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.longitude?.message} />
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          {hasCoordinates ? (
            <>
              Pin preview:{' '}
              <a
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=10/${latitude}/${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark underline hover:text-brand-darkest"
              >
                {latitude.toFixed(4)}, {longitude.toFixed(4)} on OpenStreetMap
              </a>
            </>
          ) : (
            'Both values are required — this is where the homepage map drops the pin.'
          )}
        </p>
      </fieldset>

      {/* Quick facts — these three render as the fact row in the world-map modal. */}
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-brand-darkest">Quick Facts</legend>

        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              { name: 'timezone', label: 'Time zone', placeholder: 'e.g. GST · UTC+4' },
              { name: 'currency', label: 'Currency', placeholder: 'e.g. UAE Dirham (AED)' },
              { name: 'languages', label: 'Languages', placeholder: 'e.g. Arabic · English' },
            ] as const
          ).map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                type="text"
                {...register(field.name)}
                placeholder={field.placeholder}
                className={INPUT_CLASSES}
              />
              <FieldError message={errors[field.name]?.message} />
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Shown on the world-map modal. Leave any blank and it is simply omitted.
        </p>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            { name: 'is_featured', label: 'Featured', hint: 'Highlight in featured collections' },
            { name: 'is_popular', label: 'Popular', hint: 'Mark as a popular destination' },
            { name: 'is_active', label: 'Active', hint: 'Visible to customers' },
          ] as const
        ).map((flag) => (
          <label key={flag.name} className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              {...register(flag.name)}
              className="mt-1 accent-[color:var(--logo-forest)]"
            />
            <span>
              <span className="block text-sm text-brand-darkest">{flag.label}</span>
              <span className="block text-xs text-gray-500">{flag.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {/* Package mapping */}
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-brand-darkest">
          Packages ({selectedPackageIds.length} linked)
        </legend>

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={packageSearch}
            onChange={(event) => setPackageSearch(event.target.value)}
            placeholder="Search packages..."
            aria-label="Search packages to link"
            className={cn(INPUT_CLASSES, 'pl-9')}
          />
        </div>

        {packagesLoading ? (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded-lg bg-black/5" />
            ))}
          </div>
        ) : visiblePackages.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
            {packageSearch ? 'No packages match that search.' : 'No packages available to link yet.'}
          </p>
        ) : (
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {visiblePackages.map((pkg) => {
              const checked = selectedPackageIds.includes(pkg.id);

              return (
                <li key={pkg.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-2 transition-colors',
                      checked
                        ? 'border-brand-medium bg-brand-lightest/40'
                        : 'border-transparent hover:bg-gray-50'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePackage(pkg.id)}
                      className="accent-[color:var(--logo-forest)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-brand-darkest">{pkg.title}</span>
                      <span className="block text-xs capitalize text-gray-500">{pkg.status}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        <FieldError message={errors.package_ids?.message} />
      </fieldset>

      {/* SEO */}
      <fieldset className="rounded-lg border border-gray-200 p-4">
        <legend className="px-1 text-sm font-medium text-brand-darkest">SEO</legend>

        <div className="space-y-4">
          <div>
            <label htmlFor="meta_title" className="mb-1 block text-sm font-medium text-brand-darkest">
              Meta Title
            </label>
            <input
              id="meta_title"
              {...register('meta_title')}
              placeholder="Falls back to the destination name"
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.meta_title?.message} />
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Meta Description
            </label>
            <textarea
              id="meta_description"
              rows={2}
              {...register('meta_description')}
              placeholder="Falls back to the description"
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.meta_description?.message} />
          </div>

          <div>
            <label htmlFor="og_image" className="mb-1 block text-sm font-medium text-brand-darkest">
              OG Image URL
            </label>
            <input
              id="og_image"
              type="url"
              {...register('og_image')}
              placeholder="Falls back to the hero image"
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.og_image?.message} />
          </div>
        </div>
      </fieldset>

      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">This destination could not be saved yet:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(field)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                  className="underline hover:no-underline"
                >
                  {FIELD_LABELS[field] ?? field}
                </button>
                {` — ${errorMessage(error)}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <X className="mr-1 inline h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create destination'}
        </button>
      </div>
    </form>
  );
}
