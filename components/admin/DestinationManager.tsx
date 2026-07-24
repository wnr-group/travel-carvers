'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Edit, ImageOff, MapPin, Plus, Search, Trash2, X } from 'lucide-react';
import DestinationForm from '@/components/admin/DestinationForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  useAdminDestinations,
  useCreateDestination,
  useDeleteDestination,
  useUpdateDestination,
} from '@/lib/hooks/useAdminDestinations';
import type { Destination } from '@/lib/types/destination';
import type { DestinationFormOutput } from '@/lib/validations/destination.schema';

type ToggleFilter = 'all' | 'yes' | 'no';

const PAGE_SIZE = 10;

function matchesToggle(filter: ToggleFilter, value: boolean): boolean {
  return filter === 'all' || (filter === 'yes') === value;
}

export default function DestinationManager() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Destination | null>(null);

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [featured, setFeatured] = useState<ToggleFilter>('all');
  const [popular, setPopular] = useState<ToggleFilter>('all');
  const [page, setPage] = useState(1);

  const { data: destinations, isPending, isError, error } = useAdminDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();

  const countries = useMemo(() => {
    const unique = new Set((destinations ?? []).map((destination) => destination.country));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [destinations]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (destinations ?? []).filter((destination) => {
      if (term) {
        const haystack =
          `${destination.name} ${destination.country} ${destination.city ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (country !== 'all' && destination.country !== country) return false;
      if (!matchesToggle(featured, destination.is_featured)) return false;
      if (!matchesToggle(popular, destination.is_popular)) return false;
      return true;
    });
  }, [destinations, search, country, featured, popular]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilters =
    search !== '' || country !== 'all' || featured !== 'all' || popular !== 'all';

  const resetFilters = () => {
    setSearch('');
    setCountry('all');
    setFeatured('all');
    setPopular('all');
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (destination: Destination) => {
    setEditing(destination);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (data: DestinationFormOutput) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      closeForm();
    } catch {
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
    } catch {
      // Toast already shown by the hook.
    } finally {
      setPendingDelete(null);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (showForm) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-6 text-xl font-bold text-brand-darkest">
          {editing ? `Edit ${editing.name}` : 'New destination'}
        </h2>
        <DestinationForm
          destination={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-brand-darkest">Destinations</h1>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-white transition-colors hover:bg-brand-darkest sm:w-auto"
        >
          <Plus className="h-5 w-5" /> Add Destination
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-lg bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name, country or city"
            aria-label="Search destinations"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="country-filter" className="sr-only">
            Filter by country
          </label>
          <select
            id="country-filter"
            value={country}
            onChange={(event) => {
              setCountry(event.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium"
          >
            <option value="all">All countries</option>
            {countries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {/* Reachable whenever a filter is on, not just from the "no matches" state. */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-brand-darkest"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-black/5" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold text-red-600">Could not load destinations</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <MapPin className="mx-auto h-8 w-8 text-brand-medium" />
          <p className="mt-2 font-semibold text-brand-darkest">No destinations yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add your first destination to start pinning packages on the map.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white hover:bg-brand-darkest"
          >
            <Plus className="h-4 w-4" /> Add Destination
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <p className="font-semibold text-brand-darkest">No destinations match these filters</p>
          <button
            onClick={resetFilters}
            className="mt-3 text-sm font-medium text-brand-dark underline hover:text-brand-darkest"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b bg-brand-lightest/40 text-brand-darkest">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Country</th>
                    <th className="p-4 text-left">Coordinates</th>
                    <th className="p-4 text-left">Packages</th>
                    <th className="p-4 text-left">Flags</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((destination) => (
                    <tr key={destination.id} className="border-b">
                      <td className="p-4">
                        {destination.hero_image_url ? (
                          <Image
                            src={destination.hero_image_url}
                            alt=""
                            width={56}
                            height={40}
                            className="h-10 w-14 rounded object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-14 items-center justify-center rounded bg-gray-100">
                            <ImageOff className="h-4 w-4 text-gray-400" />
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="block font-medium text-brand-darkest">
                          {destination.name}
                        </span>
                        <span className="block text-xs text-gray-500">/{destination.slug}</span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {destination.country}
                        {destination.city && (
                          <span className="block text-xs text-gray-400">{destination.city}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-600">
                        {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-brand-lightest px-2.5 py-1 text-xs font-semibold text-brand-darkest">
                          {destination.package_count}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {destination.is_featured && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Featured
                            </span>
                          )}
                          {destination.is_popular && (
                            <span className="rounded bg-brand-lightest px-2 py-0.5 text-xs font-medium text-brand-darkest">
                              Popular
                            </span>
                          )}
                          {!destination.is_active && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(destination)}
                            aria-label={`Edit ${destination.name}`}
                            className="rounded p-1.5 text-gray-500 transition-colors hover:bg-brand-lightest/60 hover:text-brand-darkest"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setPendingDelete(destination)}
                            aria-label={`Delete ${destination.name}`}
                            className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete destination"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.name}"? Its ${pendingDelete.package_count} package link${
                pendingDelete.package_count === 1 ? '' : 's'
              } will be removed. The packages themselves are not deleted.`
            : ''
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
