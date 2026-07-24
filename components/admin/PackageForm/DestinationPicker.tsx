'use client';

import { useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Loader2, MapPin, Plus, X } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import { useAdminDestinations } from '@/lib/hooks/useAdminDestinations';
import type { PackageFormInput, PackageFormOutput } from '@/lib/validations/package.schema';
import { INPUT_CLASSES } from './fields';

export default function DestinationPicker() {
  const { control, formState } = useFormContext<PackageFormInput, unknown, PackageFormOutput>();
  const { errors } = formState;

  const { data: destinations, isPending, isError } = useAdminDestinations();

  const { field: destinationField } = useController({ control, name: 'destination_id' });
  const { field: newDestinationField } = useController({ control, name: 'new_destination' });

  const [countryOverride, setCountryOverride] = useState<string | null>(null);

  const selected = useMemo(
    () => (destinations ?? []).find((item) => item.id === destinationField.value) ?? null,
    [destinations, destinationField.value]
  );

  const country = countryOverride ?? selected?.country ?? '';

  const countries = useMemo(
    () =>
      Array.from(new Set((destinations ?? []).map((item) => item.country)))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [destinations]
  );

  const inCountry = useMemo(
    () =>
      (destinations ?? [])
        .filter((item) => item.country === country)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [destinations, country]
  );

  const isCreating = Boolean(newDestinationField.value);
  const draft = newDestinationField.value ?? null;

  const handleCountryChange = (next: string) => {
    setCountryOverride(next);
    if (selected && selected.country !== next) destinationField.onChange(null);
  };

  const startCreating = () => {
    destinationField.onChange(null);
    newDestinationField.onChange({
      name: '',
      country, 
      latitude: undefined as unknown as number,
      longitude: undefined as unknown as number,
    });
  };

  const cancelCreating = () => newDestinationField.onChange(null);

  const setDraft = (patch: Partial<NonNullable<typeof draft>>) =>
    newDestinationField.onChange({ ...draft, ...patch });

  /** Number inputs hand back strings; '' must become undefined, not NaN. */
  const toNumber = (value: string) => (value === '' ? undefined : Number(value));

  const newErrors = errors.new_destination as
    | Partial<Record<'name' | 'country' | 'latitude' | 'longitude', { message?: string }>>
    | undefined;

  if (isCreating) {
    return (
      <div className="space-y-4 rounded-lg border border-brand-medium/40 bg-brand-lightest/20 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-darkest">
            <MapPin className="h-4 w-4" />
            New destination
          </p>
          <button
            type="button"
            onClick={cancelCreating}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-white hover:text-brand-darkest"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="new-destination-country" className="mb-1 block text-sm font-medium text-brand-darkest">
              Country <span className="text-red-600">*</span>
            </label>
            {/* A list, not a locked select: a brand-new country must still be typeable,
                but reusing an existing spelling keeps the grouping clean. */}
            <input
              id="new-destination-country"
              type="text"
              list="known-countries"
              placeholder="e.g. India"
              value={draft?.country ?? ''}
              onChange={(event) => setDraft({ country: event.target.value })}
              className={INPUT_CLASSES}
            />
            <datalist id="known-countries">
              {countries.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <FieldError message={newErrors?.country?.message} />
          </div>

          <div>
            <label htmlFor="new-destination-name" className="mb-1 block text-sm font-medium text-brand-darkest">
              Destination <span className="text-red-600">*</span>
            </label>
            <input
              id="new-destination-name"
              type="text"
              placeholder="e.g. Alleppey"
              value={draft?.name ?? ''}
              onChange={(event) => setDraft({ name: event.target.value })}
              className={INPUT_CLASSES}
            />
            <p className="mt-1 text-xs text-gray-500">
              The place itself, not the country — e.g. “Kerala”, “Goa”, “Manali”.
            </p>
            <FieldError message={newErrors?.name?.message} />
          </div>

          <div>
            <label htmlFor="new-destination-lat" className="mb-1 block text-sm font-medium text-brand-darkest">
              Latitude <span className="text-red-600">*</span>
            </label>
            <input
              id="new-destination-lat"
              type="number"
              step="any"
              min="-90"
              max="90"
              placeholder="9.4981"
              value={draft?.latitude ?? ''}
              onChange={(event) => setDraft({ latitude: toNumber(event.target.value) })}
              className={INPUT_CLASSES}
            />
            <FieldError message={newErrors?.latitude?.message} />
          </div>

          <div>
            <label htmlFor="new-destination-lng" className="mb-1 block text-sm font-medium text-brand-darkest">
              Longitude <span className="text-red-600">*</span>
            </label>
            <input
              id="new-destination-lng"
              type="number"
              step="any"
              min="-180"
              max="180"
              placeholder="76.3388"
              value={draft?.longitude ?? ''}
              onChange={(event) => setDraft({ longitude: toNumber(event.target.value) })}
              className={INPUT_CLASSES}
            />
            <FieldError message={newErrors?.longitude?.message} />
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Saved with the package, then pinned on the world map at these coordinates and listed
          in Destinations. If this destination already exists, the package is linked to it
          instead of creating a duplicate.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPending ? (
        <p className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading destinations...
        </p>
      ) : isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Could not load destinations. You can still add a new one.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="destination_country" className="mb-1 block text-sm font-medium text-brand-darkest">
              Country
            </label>
            <select
              id="destination_country"
              value={country}
              onChange={(event) => handleCountryChange(event.target.value)}
              className={INPUT_CLASSES}
            >
              <option value="">Select a country</option>
              {countries.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="destination_id" className="mb-1 block text-sm font-medium text-brand-darkest">
              Destination
            </label>
            <select
              id="destination_id"
              value={destinationField.value ?? ''}
              onChange={(event) => destinationField.onChange(event.target.value || null)}
              disabled={!country}
              className={`${INPUT_CLASSES} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">
                {!country
                  ? 'Pick a country first'
                  : inCountry.length === 0
                    ? 'No destinations in this country yet'
                    : 'No destination'}
              </option>
              {inCountry.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.city ? `${destination.name} (${destination.city})` : destination.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.destination_id?.message} />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={startCreating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-brand-medium px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/30"
      >
        <Plus className="h-4 w-4" />
        {country ? `Add a new destination in ${country}` : 'Add a new destination'}
      </button>

      <p className="text-xs text-gray-500">
        The package is pinned on the world map at this destination and listed under it in the
        Destinations section.
      </p>
    </div>
  );
}
