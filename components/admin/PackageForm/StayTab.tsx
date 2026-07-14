'use client';

import { useController, useFormContext, useWatch } from 'react-hook-form';
import { AlertCircle, BedDouble, ChevronDown, Hotel, Plus, Star, Trash2 } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import ImageUploader from '@/components/admin/ImageUploader';
import StarRating from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import CheckboxGroup from './CheckboxGroup';
import FormSection from './FormSection';
import { INPUT_CLASSES } from './fields';
import { AMENITIES, createHotel } from './stay';
import { useCollapsibleRows } from './useCollapsibleRows';
import { useOrderedFieldArray } from './useOrderedFieldArray';

export default function StayTab() {
  const { formState } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();

  const { fields, append, removeAt } = useOrderedFieldArray('stay_details');
  const { isOpen, toggle } = useCollapsibleRows(fields.map((field) => field.id));

  return (
    <FormSection
      title="Stay Details"
      description="The hotels on this package, in the order guests stay in them."
    >
      {fields.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center">
          <Hotel className="mx-auto h-8 w-8 text-brand-medium" />
          <p className="mt-2 font-semibold text-brand-darkest">No hotels yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add the accommodation so travellers know where they&apos;re staying.
          </p>
          <button
            type="button"
            onClick={() => append(createHotel(0))}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest"
          >
            <Plus className="h-4 w-4" />
            Add the first hotel
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {fields.map((field, index) => (
              <HotelCard
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
            onClick={() => append(createHotel(fields.length))}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40"
          >
            <Plus className="h-4 w-4" />
            Add hotel
          </button>
        </>
      )}

      <FieldError message={formState.errors.stay_details?.message} />
    </FormSection>
  );
}


function HotelCard({
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

  const { field: ratingField } = useController({
    control,
    name: `stay_details.${index}.rating`,
  });
  const { field: amenitiesField } = useController({
    control,
    name: `stay_details.${index}.amenities`,
  });
  const { field: imageField } = useController({
    control,
    name: `stay_details.${index}.image_url`,
  });

  const amenities: string[] = amenitiesField.value ?? [];
  const imageUrl = imageField.value;

  const name = useWatch({ control, name: `stay_details.${index}.hotel_name` });

  const hotelErrors = formState.errors.stay_details?.[index];
  const hasErrors = Boolean(hotelErrors);

  const toggleAmenity = (amenity: string) => {
    amenitiesField.onChange(
      amenities.includes(amenity)
        ? amenities.filter((item) => item !== amenity)
        : [...amenities, amenity]
    );
  };

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
            Hotel {index + 1}
          </span>

          <span className="truncate text-sm font-medium text-brand-darkest">
            {name || <span className="text-gray-400">Unnamed hotel</span>}
          </span>

          {hasErrors && <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />}

          {!isOpen && (
            <span className="ml-auto flex shrink-0 items-center gap-3 text-xs text-gray-400">
              {typeof ratingField.value === 'number' && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {ratingField.value}
                </span>
              )}
              {amenities.length > 0 && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  {amenities.length}
                </span>
              )}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove hotel ${index + 1}`}
          className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-gray-100 p-4">
          <input
            type="hidden"
            {...register(`stay_details.${index}.display_order`, { valueAsNumber: true })}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`hotel-${index}-name`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Hotel Name <span className="text-red-600">*</span>
              </label>
              <input
                id={`hotel-${index}-name`}
                type="text"
                placeholder="e.g. Taj Malabar Resort & Spa"
                {...register(`stay_details.${index}.hotel_name`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={hotelErrors?.hotel_name?.message} />
            </div>

            <div>
              <label
                htmlFor={`hotel-${index}-location`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Location
              </label>
              <input
                id={`hotel-${index}-location`}
                type="text"
                placeholder="e.g. Willingdon Island, Kochi"
                {...register(`stay_details.${index}.location`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={hotelErrors?.location?.message} />
            </div>

            <div>
              <label
                htmlFor={`hotel-${index}-room`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Room Type
              </label>
              <input
                id={`hotel-${index}-room`}
                type="text"
                placeholder="e.g. Deluxe Sea View"
                {...register(`stay_details.${index}.room_type`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={hotelErrors?.room_type?.message} />
            </div>

            <div>
              <span className="mb-1 block text-sm font-medium text-brand-darkest">Rating</span>
              <StarRating
                name={`stay_details-${index}-rating`}
                label={`Star rating for hotel ${index + 1}`}
                value={ratingField.value}
                onChange={ratingField.onChange}
                onBlur={ratingField.onBlur}
              />
              <FieldError message={hotelErrors?.rating?.message} />
            </div>

            <div>
              <label
                htmlFor={`hotel-${index}-checkin`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Check-in
              </label>
              <input
                id={`hotel-${index}-checkin`}
                type="time"
                {...register(`stay_details.${index}.check_in_date`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={hotelErrors?.check_in_date?.message} />
            </div>

            <div>
              <label
                htmlFor={`hotel-${index}-checkout`}
                className="mb-1 block text-sm font-medium text-brand-darkest"
              >
                Check-out
              </label>
              <input
                id={`hotel-${index}-checkout`}
                type="time"
                {...register(`stay_details.${index}.check_out_date`)}
                className={INPUT_CLASSES}
              />
              <FieldError message={hotelErrors?.check_out_date?.message} />
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-brand-darkest">Amenities</span>
            <CheckboxGroup
              legend={`Amenities for hotel ${index + 1}`}
              name={`stay_details-${index}-amenities`}
              options={AMENITIES.map((amenity) => ({ id: amenity, name: amenity }))}
              selected={amenities}
              onToggle={toggleAmenity}
            />
            <FieldError message={hotelErrors?.amenities?.message} />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-brand-darkest">Hotel Image</span>
            <ImageUploader
              bucket="hotel-images"
              path="stays"
              maxFiles={1}
              value={imageUrl ? [imageUrl] : []}
              onUpload={(urls) => imageField.onChange(urls[0] ?? undefined)}
            />
            <FieldError message={hotelErrors?.image_url?.message} />
          </div>
        </div>
      )}
    </li>
  );
}
