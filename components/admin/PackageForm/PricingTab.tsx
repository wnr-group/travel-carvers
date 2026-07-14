'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import FieldError from '@/components/admin/FieldError';
import { PACKAGE_DIFFICULTIES } from '@/lib/types/package';
import { cn, formatPrice } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import FormSection from './FormSection';
import { INPUT_CLASSES, numberField, emptyToUndefined } from './fields';

const PRICES = [
  { name: 'price_adult', label: 'Adult Price', hint: 'Per adult' },
  { name: 'price_child', label: 'Child Price', hint: 'Per child' },
  { name: 'price_infant', label: 'Infant Price', hint: 'Per infant' },
] as const;

export default function PricingTab() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const showPrice = useWatch({ control, name: 'show_price' });
  const adultPrice = useWatch({ control, name: 'price_adult' });

  return (
    <div className="space-y-6">
      <FormSection
        title="Pricing"
        description="Leave a price blank if it doesn't apply — blank is not the same as zero."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {PRICES.map((price) => (
            <div key={price.name}>
              <label
                htmlFor={price.name}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                {price.label}
              </label>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  ₹
                </span>
                <input
                  id={price.name}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register(price.name, numberField)}
                  className={cn(INPUT_CLASSES, 'pl-7')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{price.hint}</p>
              <FieldError message={errors[price.name]?.message} />
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            {...register('show_price')}
            className="mt-1 accent-[color:var(--logo-forest)]"
          />
          <span>
            <span className="block text-sm text-brand-darkest">Show price publicly</span>
            <span className="block text-xs text-gray-500">
              {showPrice
                ? 'Customers see the price on the package page.'
                : 'The price is hidden; customers see an enquiry prompt instead. It is still stored.'}
            </span>
          </span>
        </label>

        {showPrice && adultPrice !== undefined && !Number.isNaN(adultPrice) && (
          <p className="text-sm text-gray-600">
            Customers will see{' '}
            <strong className="text-brand-darkest">{formatPrice(adultPrice)}</strong> per adult.
          </p>
        )}
      </FormSection>

      <FormSection title="Duration" description="How long the trip runs. Both are required.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="duration_days"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Number of Days <span className="text-red-600">*</span>
            </label>
            <input
              id="duration_days"
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              placeholder="7"
              {...register('duration_days', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.duration_days?.message} />
          </div>

          <div>
            <label
              htmlFor="duration_nights"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Number of Nights <span className="text-red-600">*</span>
            </label>
            <input
              id="duration_nights"
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              placeholder="6"
              {...register('duration_nights', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.duration_nights?.message} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Additional Details" description="All optional.">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="difficulty_level"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty_level"
              {...register('difficulty_level', emptyToUndefined)}
              className={cn(INPUT_CLASSES, 'bg-white')}
            >
              <option value="">Not specified</option>
              {PACKAGE_DIFFICULTIES.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            <FieldError message={errors.difficulty_level?.message} />
          </div>

          <div>
            <label
              htmlFor="age_restriction"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Age Restriction
            </label>
            <input
              id="age_restriction"
              type="text"
              placeholder="e.g. 12+ years"
              {...register('age_restriction')}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.age_restriction?.message} />
          </div>

          <div>
            <label
              htmlFor="group_size_min"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Min Group Size
            </label>
            <input
              id="group_size_min"
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              placeholder="2"
              {...register('group_size_min', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.group_size_min?.message} />
          </div>

          <div>
            <label
              htmlFor="group_size_max"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Max Group Size
            </label>
            <input
              id="group_size_max"
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              placeholder="12"
              {...register('group_size_max', numberField)}
              className={INPUT_CLASSES}
            />
            <FieldError message={errors.group_size_max?.message} />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
