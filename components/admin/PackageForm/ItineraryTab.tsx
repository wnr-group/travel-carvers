'use client';

import { useController, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  AlertCircle,
  CalendarPlus,
  ChevronDown,
  ImageIcon,
  ListPlus,
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
import IconSelect from './IconSelect';
import { MAX_DAY_ENTRIES, MEALS, createDay, createEntry } from './itinerary';
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

  const title = useWatch({ control, name: `itinerary_days.${index}.title` });
  const meals = useWatch({
    control,
    name: [
      `itinerary_days.${index}.breakfast`,
      `itinerary_days.${index}.lunch`,
      `itinerary_days.${index}.dinner`,
    ],
  });
  const entries = useWatch({ control, name: `itinerary_days.${index}.entries` });

  const mealCount = meals.filter(Boolean).length;
  const entryCount = entries?.length ?? 0;
  const imageCount = (entries ?? []).filter((entry) => entry?.image_url).length;
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
              {entryCount > 0 && (
                <span className="flex items-center gap-1">
                  <ListPlus className="h-3.5 w-3.5" />
                  {entryCount}
                </span>
              )}
              {mealCount > 0 && (
                <span className="flex items-center gap-1">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  {mealCount}
                </span>
              )}
              {imageCount > 0 && (
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {imageCount}
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

          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
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

            <div>
              <label
                htmlFor={`day-${index}-timing`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Timing <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id={`day-${index}-timing`}
                type="text"
                placeholder="e.g. 9:00 AM – 6:00 PM"
                {...register(`itinerary_days.${index}.timing`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={dayErrors?.timing?.message} />
            </div>
          </div>

          <EntriesEditor dayIndex={index} />

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
        </div>
      )}
    </li>
  );
}

/** The ordered list of things that happen on a day. Order is the array order. */
function EntriesEditor({ dayIndex }: { dayIndex: number }) {
  const { control, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `itinerary_days.${dayIndex}.entries`,
  });

  const entriesError = formState.errors.itinerary_days?.[dayIndex]?.entries;
  const isFull = fields.length >= MAX_DAY_ENTRIES;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="block text-sm font-medium text-brand-darkest">Itinerary entries</label>
        <span className="text-xs text-gray-400">
          {fields.length} of {MAX_DAY_ENTRIES}
        </span>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
          Nothing scheduled for this day yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, entryIndex) => (
            <EntryRow
              key={field.id}
              dayIndex={dayIndex}
              entryIndex={entryIndex}
              onRemove={() => remove(entryIndex)}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => append(createEntry())}
        disabled={isFull}
        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Add entry
      </button>

      <FieldError message={entriesError?.message} />
    </div>
  );
}

function EntryRow({
  dayIndex,
  entryIndex,
  onRemove,
}: {
  dayIndex: number;
  entryIndex: number;
  onRemove: () => void;
}) {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const base = `itinerary_days.${dayIndex}.entries.${entryIndex}` as const;

  const { field: imageField } = useController({ control, name: `${base}.image_url` });
  const { field: iconField } = useController({ control, name: `${base}.icon` });

  const errors = formState.errors.itinerary_days?.[dayIndex]?.entries?.[entryIndex];

  // The uploader works in lists; an entry holds exactly one image.
  const imageValue = imageField.value ? [imageField.value] : [];

  return (
    <li className="rounded-lg border border-gray-200 p-3">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-xs font-semibold text-brand-darkest">
          {entryIndex + 1}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-brand-medium">
          Entry {entryIndex + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove entry ${entryIndex + 1}`}
          className="ml-auto rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <div>
          <label
            htmlFor={`${base}-name`}
            className="mb-1 block text-sm font-medium text-brand-darkest"
          >
            Itinerary Name
          </label>
          <input
            id={`${base}-name`}
            type="text"
            placeholder="e.g. Visit Fort Kochi"
            {...register(`${base}.name`)}
            className={INPUT_CLASSES}
          />
          <FieldError message={errors?.name?.message} />
        </div>

        <div>
          <label
            htmlFor={`${base}-time`}
            className="mb-1 block text-sm font-medium text-brand-darkest"
          >
            Time <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id={`${base}-time`}
            type="text"
            placeholder="e.g. 9:00 AM"
            {...register(`${base}.time_label`)}
            className={INPUT_CLASSES}
          />
          <FieldError message={errors?.time_label?.message} />
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor={`${base}-description`}
          className="mb-1 block text-sm font-medium text-brand-darkest"
        >
          Description <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          id={`${base}-description`}
          rows={3}
          placeholder="What happens here?"
          {...register(`${base}.description`)}
          className={INPUT_CLASSES}
        />
        <FieldError message={errors?.description?.message} />
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-darkest">
            Image <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <ImageUploader
            bucket="itinerary-images"
            path="entries"
            maxFiles={1}
            value={imageValue}
            onUpload={(urls) => imageField.onChange(urls[0] ?? '')}
          />
          <FieldError message={errors?.image_url?.message} />
        </div>

        <div>
          <label
            htmlFor={`${base}-icon`}
            className="mb-1 block text-sm font-medium text-brand-darkest"
          >
            Icon <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <IconSelect
            id={`${base}-icon`}
            label={`Icon for entry ${entryIndex + 1}`}
            value={iconField.value ?? ''}
            onChange={iconField.onChange}
            onBlur={iconField.onBlur}
          />
          <FieldError message={errors?.icon?.message} />
        </div>
      </div>
    </li>
  );
}
