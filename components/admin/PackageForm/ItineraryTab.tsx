'use client';

import { useController, useFormContext, useWatch } from 'react-hook-form';
import {
  AlertCircle,
  CalendarPlus,
  ChevronDown,
  ImageIcon,
  Plus,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import ImageUploader from '@/components/admin/ImageUploader';
import { cn } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import FormSection from './FormSection';
import { INPUT_CLASSES } from './fields';
import { ACTIVITIES, MAX_DAY_IMAGES, MEALS, createDay } from './itinerary';
import { useCollapsibleRows } from './useCollapsibleRows';
import { useOrderedFieldArray } from './useOrderedFieldArray';

export default function ItineraryTab() {
  const { formState } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const { fields, append, removeAt } = useOrderedFieldArray('itinerary_days');

  const { isOpen, toggle } = useCollapsibleRows(fields.map((field) => field.id));

  const addDay = () => append(createDay(fields.length + 1));

  return (
    <div className="space-y-6">
      <FormSection
        title="Itinerary"
        description="One card per day. Days renumber themselves when you add or remove one."
      >
        {fields.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">
            <CalendarPlus className="mx-auto h-8 w-8 text-brand-medium" />
            <p className="mt-2 font-semibold text-brand-darkest">No days yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Break the trip down day by day so travellers know what to expect.
            </p>
            <button
              type="button"
              onClick={addDay}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest"
            >
              <Plus className="h-4 w-4" />
              Add the first day
            </button>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {fields.map((field, index) => (
                <DayCard
                  key={field.id}
                  index={index}
                  isOpen={isOpen(field.id)}
                  onToggle={() => toggle(field.id)}
                  onRemove={() => removeAt(index)}
                />
              ))}
            </ul>

            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40"
            >
              <Plus className="h-4 w-4" />
              Add day {fields.length + 1}
            </button>
          </>
        )}

        <FieldError message={formState.errors.itinerary_days?.message} />
      </FormSection>
    </div>
  );
}

function DayCard({
  index,
  isOpen,
  onToggle,
  onRemove,
}: {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { field: imagesField } = useController({
    control,
    name: `itinerary_days.${index}.images`,
  });
  const images: string[] = imagesField.value ?? [];

  const title = useWatch({ control, name: `itinerary_days.${index}.title` });
  const meals = useWatch({
    control,
    name: [
      `itinerary_days.${index}.breakfast`,
      `itinerary_days.${index}.lunch`,
      `itinerary_days.${index}.dinner`,
    ],
  });

  const mealCount = meals.filter(Boolean).length;
  const dayErrors = formState.errors.itinerary_days?.[index];
  const hasErrors = Boolean(dayErrors);

  return (
    <li
      className={cn(
        'overflow-hidden rounded-lg border bg-white',
        hasErrors ? 'border-red-300' : 'border-gray-200'
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />

          <span className="shrink-0 rounded-full bg-brand-lightest px-2.5 py-0.5 text-xs font-semibold text-brand-darkest">
            Day {index + 1}
          </span>

          <span className="truncate text-sm font-medium text-brand-darkest">
            {title || <span className="text-gray-400">Untitled day</span>}
          </span>

          {hasErrors && <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />}

          {!isOpen && (
            <span className="ml-auto flex shrink-0 items-center gap-3 text-xs text-gray-400">
              {mealCount > 0 && (
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {mealCount}
                </span>
              )}
              {images.length > 0 && (
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {images.length}
                </span>
              )}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove day ${index + 1}`}
          className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-gray-100 p-4">
          <input
            type="hidden"
            {...register(`itinerary_days.${index}.day_number`, { valueAsNumber: true })}
          />

          <div>
            <label
              htmlFor={`day-${index}-title`}
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Day Title
            </label>
            <input
              id={`day-${index}-title`}
              type="text"
              placeholder="e.g. Arrival in Kochi & sunset cruise"
              {...register(`itinerary_days.${index}.title`)}
              className={INPUT_CLASSES}
            />
            <FieldError message={dayErrors?.title?.message} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {ACTIVITIES.map((activity) => (
              <div key={activity.name}>
                <label
                  htmlFor={`day-${index}-${activity.name}`}
                  className="mb-1 block text-sm font-medium text-brand-darkest"
                >
                  {activity.label}
                </label>
                <textarea
                  id={`day-${index}-${activity.name}`}
                  rows={3}
                  placeholder={`What happens in the ${activity.label.toLowerCase()}?`}
                  {...register(`itinerary_days.${index}.${activity.name}`)}
                  className={INPUT_CLASSES}
                />
                <FieldError message={dayErrors?.[activity.name]?.message} />
              </div>
            ))}
          </div>

          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-brand-darkest">
              Meals included
            </legend>
            <div className="flex flex-wrap gap-4">
              {MEALS.map((meal) => (
                <label key={meal.name} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    {...register(`itinerary_days.${index}.${meal.name}`)}
                    className="accent-[color:var(--logo-forest)]"
                  />
                  <span className="text-sm text-brand-darkest">{meal.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand-darkest">
              Day Images
            </label>
            <ImageUploader
              bucket="itinerary-images"
              path="days"
              maxFiles={MAX_DAY_IMAGES}
              value={images}
              onUpload={imagesField.onChange}
            />
          </div>
        </div>
      )}
    </li>
  );
}
