'use client';

import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Globe, Lightbulb, Wand2 } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import { cn, packagePath } from '@/lib/utils';
import {
  META_DESCRIPTION_MAX,
  META_TITLE_MAX,
  type PackageFormInput,
  type PackageFormOutput,
} from '@/lib/validations/package.schema';
import FormSection from './FormSection';
import { INPUT_CLASSES, emptyToUndefined } from './fields';
import { parseKeywords, suggestMetaDescription, suggestMetaTitle } from './seo';

const SEO_TIPS = [
  'Put the destination in the title — most people search for a place, not a package name.',
  'Front-load the important words. Google cuts the title off around 60 characters.',
  'Write the description for a human deciding whether to click, not for a crawler.',
  'Keywords carry almost no weight with Google today. Filling them in is harmless, but the title and description are what actually matter.',
  'The OG image is what appears when someone shares the link on WhatsApp or Facebook. Without one, the preview is a blank grey box.',
];

export default function SEOTab() {
  const { control, register, getValues, setValue, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();
  const { errors, touchedFields } = formState;

  // Read from the shared form: these live on the Basic Info tab, but SEO derives from them.
  const packageTitle = useWatch({ control, name: 'title' });
  const shortDescription = useWatch({ control, name: 'short_description' });
  const slug = useWatch({ control, name: 'slug' });

  const metaTitle = useWatch({ control, name: 'meta_title' }) ?? '';
  const metaDescription = useWatch({ control, name: 'meta_description' }) ?? '';
  const metaKeywords = useWatch({ control, name: 'meta_keywords' }) ?? '';
  const ogImage = useWatch({ control, name: 'og_image' });

  const suggestedTitle = suggestMetaTitle(packageTitle);
  const suggestedDescription = suggestMetaDescription(shortDescription);

  const hasAutoFilled = useRef(false);

  useEffect(() => {
    if (hasAutoFilled.current) return;
    hasAutoFilled.current = true;

    const current = getValues();

    if (!current.meta_title && !touchedFields.meta_title && suggestedTitle) {
      setValue('meta_title', suggestedTitle, { shouldDirty: true });
    }

    if (!current.meta_description && !touchedFields.meta_description && suggestedDescription) {
      setValue('meta_description', suggestedDescription, { shouldDirty: true });
    }
  }, [getValues, setValue, suggestedTitle, suggestedDescription, touchedFields]);

  /** Explicit regenerate — this one *does* overwrite, because the admin asked for it. */
  const regenerate = () => {
    if (suggestedTitle) setValue('meta_title', suggestedTitle, { shouldDirty: true });
    if (suggestedDescription) {
      setValue('meta_description', suggestedDescription, { shouldDirty: true });
    }
  };

  // What Google would actually show: the admin's value if there is one, otherwise the suggestion.
  const previewTitle = metaTitle || suggestedTitle;
  const previewDescription = metaDescription || suggestedDescription;
  const keywords = parseKeywords(metaKeywords);

  const canSuggest = Boolean(suggestedTitle || suggestedDescription);

  return (
    <div className="space-y-6">
      <FormSection
        title="Search Metadata"
        description="How this package appears in Google. Leave a field blank and the package title or short description is used instead."
      >
        {canSuggest && (
          <button
            type="button"
            onClick={regenerate}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40"
          >
            <Wand2 className="h-4 w-4" />
            Regenerate from package
          </button>
        )}

        <div>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <label htmlFor="meta_title" className="block text-sm font-medium text-brand-darkest">
              Meta Title
            </label>
            <CharacterCount used={metaTitle.length} max={META_TITLE_MAX} />
          </div>
          <input
            id="meta_title"
            type="text"
            maxLength={META_TITLE_MAX}
            placeholder={suggestedTitle || 'Falls back to the package title'}
            {...register('meta_title')}
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.meta_title?.message} />
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-brand-darkest"
            >
              Meta Description
            </label>
            <CharacterCount used={metaDescription.length} max={META_DESCRIPTION_MAX} />
          </div>
          <textarea
            id="meta_description"
            rows={3}
            maxLength={META_DESCRIPTION_MAX}
            placeholder={suggestedDescription || 'Falls back to the short description'}
            {...register('meta_description')}
            className={INPUT_CLASSES}
          />
          <FieldError message={errors.meta_description?.message} />
        </div>

        <div>
          <label
            htmlFor="meta_keywords"
            className="mb-1 block text-sm font-medium text-brand-darkest"
          >
            Meta Keywords
          </label>
          <input
            id="meta_keywords"
            type="text"
            placeholder="kerala backwaters, houseboat, alleppey"
            {...register('meta_keywords')}
            className={INPUT_CLASSES}
          />
          <p className="mt-1 text-xs text-gray-500">
            Comma separated.{' '}
            {keywords.length > 0 &&
              `${keywords.length} keyword${keywords.length === 1 ? '' : 's'}.`}
          </p>
          <FieldError message={errors.meta_keywords?.message} />
        </div>

        <div>
          <label htmlFor="og_image" className="mb-1 block text-sm font-medium text-brand-darkest">
            OG Image URL
          </label>
          <input
            id="og_image"
            type="url"
            placeholder="https://..."
            {...register('og_image', emptyToUndefined)}
            className={INPUT_CLASSES}
          />
          <p className="mt-1 text-xs text-gray-500">
            Shown when the link is shared on social media.
          </p>
          <FieldError message={errors.og_image?.message} />

          {ogImage && (
            <div className="mt-2 h-32 w-full max-w-sm overflow-hidden rounded-lg border bg-gray-100">
              <img src={ogImage} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </FormSection>

      <FormSection
        title="Google Search Preview"
        description="Roughly how the result will look. Updates as you type."
      >
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Globe className="h-3.5 w-3.5" />
            <span>travelcarvers.in</span>
          </div>

          <p className="mt-0.5 text-xs text-gray-500">
            {slug ? packagePath(slug) : '/package/…'}
          </p>

          <p className="mt-1 truncate text-lg text-[#1a0dab]">
            {previewTitle || 'Your package title will appear here'}
          </p>

          <p className="mt-1 line-clamp-2 text-sm text-gray-700">
            {previewDescription ||
              'Your meta description will appear here. Write one that makes someone want to click.'}
          </p>
        </div>

        {!metaTitle && suggestedTitle && (
          <p className="text-xs text-gray-500">
            Using the package title, because the meta title is blank.
          </p>
        )}
      </FormSection>

      <FormSection title="SEO Tips">
        <ul className="space-y-2">
          {SEO_TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              {tip}
            </li>
          ))}
        </ul>
      </FormSection>
    </div>
  );
}

/**
 * Live character counter.
 */
function CharacterCount({ used, max }: { used: number; max: number }) {
  return (
    <span
      className={cn(
        'text-xs tabular-nums',
        used >= max ? 'text-red-600' : used > max * 0.9 ? 'text-amber-600' : 'text-gray-500'
      )}
    >
      {used}/{max}
    </span>
  );
}
