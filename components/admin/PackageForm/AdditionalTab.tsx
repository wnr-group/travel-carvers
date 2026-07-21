'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { CalendarRange, FileCheck, Lightbulb, MapPin, Plus, Trash2, Wallet } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import { cn } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import FormSection from './FormSection';
import { INPUT_CLASSES } from './fields';
import {
  MONTHS,
  WEATHER_CONDITIONS,
  createCancellationRow,
  createDocumentRow,
  createPeriod,
  createPlace,
  createTip,
  standardCancellationRows,
  standardDocumentRows,
  wrapsYearEnd,
} from './additional';
import { useOrderedFieldArray } from './useOrderedFieldArray';

export default function AdditionalTab() {
  return (
    <div className="space-y-6">
      <TravelTipsSection />
      <BestTimeSection />
      <PlacesSection />
      <CancellationPolicySection />
      <RequiredDocumentsSection />
    </div>
  );
}

/** Shared empty-state panel, so all three lists look the same when they're empty. */
function Empty({ icon: Icon, children }: { icon: typeof Lightbulb; children: React.ReactNode }) {
  return (
    <p className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
      <Icon className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="shrink-0 self-start rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

/**
 * Travel tips 
 */
function TravelTipsSection() {
  const { register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, removeAt } = useOrderedFieldArray('travel_tips');

  return (
    <FormSection
      title="Travel Tips"
      description="Short pieces of advice shown as a list. They appear in the order below."
    >
      {fields.length === 0 ? (
        <Empty icon={Lightbulb}>No travel tips yet.</Empty>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2"
            >
              <span className="mt-2 w-5 shrink-0 text-center text-xs font-medium tabular-nums text-gray-400">
                {index + 1}
              </span>

              <div className="flex-1">
                <input
                  type="text"
                  aria-label={`Travel tip ${index + 1}`}
                  placeholder="e.g. Carry light cotton clothing and a rain jacket"
                  {...register(`travel_tips.${index}.tip`)}
                  className={INPUT_CLASSES}
                />
                <FieldError message={formState.errors.travel_tips?.[index]?.tip?.message} />
              </div>

              <input
                type="hidden"
                {...register(`travel_tips.${index}.display_order`, { valueAsNumber: true })}
              />

              <RemoveButton onClick={() => removeAt(index)} label={`Remove tip ${index + 1}`} />
            </li>
          ))}
        </ul>
      )}

      <AddButton onClick={() => append(createTip(fields.length))}>Add tip</AddButton>
    </FormSection>
  );
}

/**
 * Best time to visit.
 */
function BestTimeSection() {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, remove } = useFieldArray({ control, name: 'best_time_to_visit' });

  return (
    <FormSection
      title="Best Time to Visit"
      description="One or more seasons. A period may run across the year end — October to March is a normal season, not a mistake."
    >
      {fields.length === 0 ? (
        <Empty icon={CalendarRange}>No seasons added yet.</Empty>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => (
            <BestTimeRow
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              control={control}
              register={register}
              error={formState.errors.best_time_to_visit?.[index]}
            />
          ))}
        </ul>
      )}

      <AddButton onClick={() => append(createPeriod())}>Add season</AddButton>
    </FormSection>
  );
}

type FormContext = ReturnType<typeof useFormContext<PackageFormInput, unknown, PackageFormOutput>>;


function BestTimeRow({
  index,
  onRemove,
  control,
  register,
  error,
}: {
  index: number;
  onRemove: () => void;
  control: FormContext['control'];
  register: FormContext['register'];
  error: NonNullable<FormContext['formState']['errors']['best_time_to_visit']>[number];
}) {
  const period = useWatch({ control, name: `best_time_to_visit.${index}` });
  const wraps = period ? wrapsYearEnd(period) : false;

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          <div>
            <label
              htmlFor={`best-time-${index}-start`}
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Start month
            </label>
            <select
              id={`best-time-${index}-start`}
              {...register(`best_time_to_visit.${index}.month_start`)}
              className={cn(INPUT_CLASSES, 'bg-white')}
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <FieldError message={error?.month_start?.message} />
          </div>

          <div>
            <label
              htmlFor={`best-time-${index}-end`}
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              End month
            </label>
            <select
              id={`best-time-${index}-end`}
              {...register(`best_time_to_visit.${index}.month_end`)}
              className={cn(INPUT_CLASSES, 'bg-white')}
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <FieldError message={error?.month_end?.message} />
          </div>

          <div>
            <label
              htmlFor={`best-time-${index}-weather`}
              className="mb-1 block text-xs font-medium text-gray-600"
            >
              Weather
            </label>
            <select
              id={`best-time-${index}-weather`}
              {...register(`best_time_to_visit.${index}.weather_condition`)}
              className={cn(INPUT_CLASSES, 'bg-white')}
            >
              <option value="">Not specified</option>
              {WEATHER_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            <FieldError message={error?.weather_condition?.message} />
          </div>
        </div>

        <RemoveButton onClick={onRemove} label={`Remove season ${index + 1}`} />
      </div>

      <div className="mt-3">
        <label
          htmlFor={`best-time-${index}-description`}
          className="mb-1 block text-xs font-medium text-gray-600"
        >
          Description
        </label>
        <textarea
          id={`best-time-${index}-description`}
          rows={2}
          placeholder="e.g. Clear skies and calm backwaters — the peak season for cruising."
          {...register(`best_time_to_visit.${index}.description`)}
          className={INPUT_CLASSES}
        />
        <FieldError message={error?.description?.message} />
      </div>

      {wraps && (
        <p className="mt-2 text-xs text-gray-500">
          This season runs across the year end ({period?.month_start} → {period?.month_end} of the
          following year).
        </p>
      )}
    </li>
  );
}

/** Small "use the standard terms" affordance, shared by the two fallback-backed lists. */
function UseStandardButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 ml-2 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

/**
 * Cancellation policy. Empty means the package falls back to the company-wide terms,
 * which is what every package did before this section existed.
 */
function CancellationPolicySection() {
  const { register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, removeAt } = useOrderedFieldArray('cancellation_policy');

  const addStandard = () =>
    standardCancellationRows().forEach((row, index) =>
      append({ ...row, display_order: fields.length + index })
    );

  return (
    <FormSection
      title="Cancellation Policy"
      description="Leave empty to use the standard company policy. Add rows here only to override it for this package."
    >
      {fields.length === 0 ? (
        <Empty icon={Wallet}>Using the standard cancellation policy.</Empty>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2"
            >
              <span className="mt-2 w-5 shrink-0 text-center text-xs font-medium tabular-nums text-gray-400">
                {index + 1}
              </span>

              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    aria-label={`Cancellation window ${index + 1}`}
                    placeholder="e.g. 30+ days before departure"
                    {...register(`cancellation_policy.${index}.window_label`)}
                    className={INPUT_CLASSES}
                  />
                  <FieldError
                    message={formState.errors.cancellation_policy?.[index]?.window_label?.message}
                  />
                </div>

                <div>
                  <input
                    type="text"
                    aria-label={`Refund for window ${index + 1}`}
                    placeholder="e.g. 90% refund"
                    {...register(`cancellation_policy.${index}.refund_text`)}
                    className={INPUT_CLASSES}
                  />
                  <FieldError
                    message={formState.errors.cancellation_policy?.[index]?.refund_text?.message}
                  />
                </div>
              </div>

              <input
                type="hidden"
                {...register(`cancellation_policy.${index}.display_order`, {
                  valueAsNumber: true,
                })}
              />

              <RemoveButton
                onClick={() => removeAt(index)}
                label={`Remove cancellation row ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center">
        <AddButton onClick={() => append(createCancellationRow(fields.length))}>
          Add row
        </AddButton>
        {fields.length === 0 && (
          <UseStandardButton onClick={addStandard}>Start from the standard policy</UseStandardButton>
        )}
      </div>

      <FieldError message={formState.errors.cancellation_policy?.message} />
    </FormSection>
  );
}

/**
 * Documents the traveller must bring. Same fallback rule as the cancellation policy.
 */
function RequiredDocumentsSection() {
  const { register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, removeAt } = useOrderedFieldArray('required_documents');

  const addStandard = () =>
    standardDocumentRows().forEach((row, index) =>
      append({ ...row, display_order: fields.length + index })
    );

  return (
    <FormSection
      title="Documents Required"
      description="Leave empty to use the standard document list. Add rows here only to override it for this package."
    >
      {fields.length === 0 ? (
        <Empty icon={FileCheck}>Using the standard document list.</Empty>
      ) : (
        <ul className="space-y-2">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-2"
            >
              <span className="mt-2 w-5 shrink-0 text-center text-xs font-medium tabular-nums text-gray-400">
                {index + 1}
              </span>

              <div className="flex-1">
                <input
                  type="text"
                  aria-label={`Document ${index + 1}`}
                  placeholder="e.g. Government-issued photo ID"
                  {...register(`required_documents.${index}.document_text`)}
                  className={INPUT_CLASSES}
                />
                <FieldError
                  message={formState.errors.required_documents?.[index]?.document_text?.message}
                />
              </div>

              <input
                type="hidden"
                {...register(`required_documents.${index}.display_order`, {
                  valueAsNumber: true,
                })}
              />

              <RemoveButton
                onClick={() => removeAt(index)}
                label={`Remove document ${index + 1}`}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center">
        <AddButton onClick={() => append(createDocumentRow(fields.length))}>Add document</AddButton>
        {fields.length === 0 && (
          <UseStandardButton onClick={addStandard}>Start from the standard list</UseStandardButton>
        )}
      </div>

      <FieldError message={formState.errors.required_documents?.message} />
    </FormSection>
  );
}

/**
 * Places to visit. Also has no display_order, so a plain useFieldArray.
 */
function PlacesSection() {
  const { control, register, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();

  const { fields, append, remove } = useFieldArray({ control, name: 'places_to_visit' });

  return (
    <FormSection
      title="Places to Visit"
      description="Attractions included or nearby. Only the name is really needed — the rest is detail."
    >
      {fields.length === 0 ? (
        <Empty icon={MapPin}>No places added yet.</Empty>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => {
            const error = formState.errors.places_to_visit?.[index];

            return (
              <li key={field.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-start gap-2">
                  <div className="grid flex-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor={`place-${index}-name`}
                        className="mb-1 block text-xs font-medium text-gray-600"
                      >
                        Place name
                      </label>
                      <input
                        id={`place-${index}-name`}
                        type="text"
                        placeholder="e.g. Mattancherry Palace"
                        {...register(`places_to_visit.${index}.place_name`)}
                        className={INPUT_CLASSES}
                      />
                      <FieldError message={error?.place_name?.message} />
                    </div>

                    <div>
                      <label
                        htmlFor={`place-${index}-distance`}
                        className="mb-1 block text-xs font-medium text-gray-600"
                      >
                        Distance from hotel
                      </label>
                      <input
                        id={`place-${index}-distance`}
                        type="text"
                        placeholder="e.g. 4 km"
                        {...register(`places_to_visit.${index}.distance_from_hotel`)}
                        className={INPUT_CLASSES}
                      />
                      <FieldError message={error?.distance_from_hotel?.message} />
                    </div>

                    <div>
                      <label
                        htmlFor={`place-${index}-fee`}
                        className="mb-1 block text-xs font-medium text-gray-600"
                      >
                        Entry fee
                      </label>
                      <input
                        id={`place-${index}-fee`}
                        type="text"
                        placeholder="e.g. ₹50 or Free"
                        {...register(`places_to_visit.${index}.entry_fee`)}
                        className={INPUT_CLASSES}
                      />
                      <FieldError message={error?.entry_fee?.message} />
                    </div>
                  </div>

                  <RemoveButton onClick={() => remove(index)} label={`Remove place ${index + 1}`} />
                </div>

                <div className="mt-3">
                  <label
                    htmlFor={`place-${index}-description`}
                    className="mb-1 block text-xs font-medium text-gray-600"
                  >
                    Description
                  </label>
                  <textarea
                    id={`place-${index}-description`}
                    rows={2}
                    placeholder="What makes it worth seeing?"
                    {...register(`places_to_visit.${index}.description`)}
                    className={INPUT_CLASSES}
                  />
                  <FieldError message={error?.description?.message} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AddButton onClick={() => append(createPlace())}>Add place</AddButton>
    </FormSection>
  );
}
