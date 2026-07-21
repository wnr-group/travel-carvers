'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import FieldError from '@/components/admin/FieldError';
import { PACKAGE_STATUSES, PACKAGE_STATUS_LABELS } from '@/lib/types/package';
import { packagePath, slugify } from '@/lib/utils';
import {
  SHORT_DESCRIPTION_MAX,
  type PackageFormInput,
  type PackageFormOutput,
} from '@/lib/validations/package.schema';
import { cn } from '@/lib/utils';
import { usePackageFormMode } from './PackageForm';
import { INPUT_CLASSES } from './fields';

const FLAGS = [
  { name: 'is_featured', label: 'Featured', hint: 'Show in the featured carousel' },
  { name: 'is_trending', label: 'Trending', hint: 'Show in the trending section' },
  { name: 'is_new', label: 'New', hint: 'Badge this package as newly added' },
  {
    name: 'is_group_package',
    label: 'Group Package',
    hint: 'Shows the group size on the package card, set it under Pricing',
  },
] as const;

export default function BasicInfoTab() {
  const {
    register,
    control,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const isEditing = usePackageFormMode() === 'edit';

  const slug = useWatch({ control, name: 'slug' }) ?? '';
  const shortDescription = useWatch({ control, name: 'short_description' }) ?? '';
  const previewSlug = slugify(slug);
  const used = shortDescription.length;

  const titleField = register('title');

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-brand-darkest">
          Package Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          {...titleField}
          onChange={(e) => {
            titleField.onChange(e);
            // Mirror the title into the slug while creating, and only until the admin edits the
            // slug by hand. Never while editing: the package already has a public URL, and
            // retitling it must not silently rewrite that.
            if (!isEditing && !dirtyFields.slug) {
              setValue('slug', slugify(e.target.value));
            }
          }}
          placeholder="e.g. 7-Day Kerala Backwaters Escape"
          className={INPUT_CLASSES}
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-brand-darkest">
          URL Slug <span className="text-red-600">*</span>
        </label>
        <input
          id="slug"
          {...register('slug')}
          // Read-only once the package exists: the slug is its public URL, so changing it would
          // break every existing link and anything Google has indexed. The server enforces this
          // too — packageUpdateSchema omits the field entirely.
          readOnly={isEditing}
          placeholder="7-day-kerala-backwaters-escape"
          className={cn(INPUT_CLASSES, isEditing && 'bg-gray-50 text-gray-600')}
        />
        <p className="mt-1 text-xs text-gray-500">
          {isEditing
            ? 'The slug is the public URL and cannot be changed after creation.'
            : 'Auto-filled from the title; edit it to override.'}{' '}
          {previewSlug && (
            <>
              Preview: <code className="text-brand-dark">{packagePath(previewSlug)}</code>
            </>
          )}
        </p>
        <FieldError message={errors.slug?.message} />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label
            htmlFor="short_description"
            className="block text-sm font-medium text-brand-darkest"
          >
            Short Description <span className="text-red-600">*</span>
          </label>
          <span
            className={cn(
              'text-xs tabular-nums',
              used > SHORT_DESCRIPTION_MAX * 0.9 ? 'text-amber-600' : 'text-gray-500'
            )}
          >
            {used}/{SHORT_DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          id="short_description"
          rows={2}
          maxLength={SHORT_DESCRIPTION_MAX}
          {...register('short_description')}
          placeholder="One or two lines shown on package cards and search results."
          className={INPUT_CLASSES}
        />
        <FieldError message={errors.short_description?.message} />
      </div>

      <div>
        <label
          htmlFor="full_description"
          className="mb-1 block text-sm font-medium text-brand-darkest"
        >
          Full Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="full_description"
          rows={8}
          {...register('full_description')}
          placeholder="The full write-up shown on the package page. Describe the experience, the highlights and who it suits."
          className={INPUT_CLASSES}
        />
        <FieldError message={errors.full_description?.message} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-brand-darkest">
            Status
          </label>
          <select id="status" {...register('status')} className={cn(INPUT_CLASSES, 'bg-white')}>
            {PACKAGE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PACKAGE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Published and sold-out packages are visible to customers. A sold-out package is
            shown with a Sold Out badge and cannot be enquired about.
          </p>
          <FieldError message={errors.status?.message} />
        </div>

        <fieldset>
          <legend className="mb-1 block text-sm font-medium text-brand-darkest">
            Package Flags
          </legend>
          <div className="space-y-2 pt-1">
            {FLAGS.map((flag) => (
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
        </fieldset>
      </div>
    </div>
  );
}
