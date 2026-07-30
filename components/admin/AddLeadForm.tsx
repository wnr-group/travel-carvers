'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateAdminLead } from '@/lib/hooks/useAdminLeads';
import { useAdminPackages } from '@/lib/hooks/useAdminPackages';
import { LEAD_STATUSES, adminLeadSchema } from '@/lib/validations/lead.schema';

const INPUT =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  message: '',
  package_id: '',
  number_of_adults: 1,
  number_of_children: 0,
  number_of_infants: 0,
  travel_start_date: '',
  travel_end_date: '',
  status: 'new' as (typeof LEAD_STATUSES)[number],
};

interface AddLeadFormProps {
  open: boolean;
  onClose: () => void;
}

export default function AddLeadForm({ open, onClose }: AddLeadFormProps) {
  const createMutation = useCreateAdminLead();
  const packagesQuery = useAdminPackages({});
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    firstFieldRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the admin starts correcting it.
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      message: form.message.trim() || undefined,
      package_id: form.package_id || undefined,
      travel_start_date: form.travel_start_date || undefined,
      travel_end_date: form.travel_end_date || undefined,
    };

    const parsed = adminLeadSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string | undefined;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    try {
      await createMutation.mutateAsync(payload);

      toast.success(`Lead added for ${form.name.trim()}`);
      setForm(EMPTY);
      setErrors({});
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Could not add this lead');
    }
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
        {errors[key]}
      </p>
    ) : null;

  const packages = packagesQuery.data ?? [];

  return (
    <>
      {/* Full-screen backdrop — fixed so it always covers the whole viewport when scrolled */}
      <div
        className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Scrollable layer sits above the backdrop */}
      <div className="fixed inset-0 z-[151] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-lead-title"
          className="relative my-8 w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 id="add-lead-title" className="text-lg font-bold text-gray-900">
                Add a lead
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                For enquiries that came in by phone or email.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-name" className="mb-1 block text-sm font-medium text-brand-darkest">
                Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="lead-name"
                ref={firstFieldRef}
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(event) => set('name', event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                className={INPUT}
              />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="lead-phone" className="mb-1 block text-sm font-medium text-brand-darkest">
                Phone <span className="text-rose-600">*</span>
              </label>
              <input
                id="lead-phone"
                type="tel"
                required
                maxLength={20}
                value={form.phone}
                onChange={(event) => set('phone', event.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                className={INPUT}
              />
              {fieldError('phone')}
            </div>
          </div>

          <div>
            <label htmlFor="lead-email" className="mb-1 block text-sm font-medium text-brand-darkest">
              Email <span className="text-rose-600">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              required
              maxLength={100}
              value={form.email}
              onChange={(event) => set('email', event.target.value)}
              aria-invalid={errors.email ? true : undefined}
              className={INPUT}
            />
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor="lead-package" className="mb-1 block text-sm font-medium text-brand-darkest">
              Package <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <select
              id="lead-package"
              value={form.package_id}
              onChange={(event) => set('package_id', event.target.value)}
              aria-invalid={errors.package_id ? true : undefined}
              className={INPUT}
            >
              <option value="">No specific package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.title}
                </option>
              ))}
            </select>
            {fieldError('package_id')}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(
              [
                ['number_of_adults', 'Adults', 1],
                ['number_of_children', 'Children', 0],
                ['number_of_infants', 'Infants', 0],
              ] as const
            ).map(([key, label, min]) => (
              <div key={key}>
                <label htmlFor={`lead-${key}`} className="mb-1 block text-sm font-medium text-brand-darkest">
                  {label}
                </label>
                <input
                  id={`lead-${key}`}
                  type="number"
                  min={min}
                  max={99}
                  value={form[key]}
                  onChange={(event) => set(key, Number(event.target.value))}
                  aria-invalid={errors[key] ? true : undefined}
                  className={INPUT}
                />
                {fieldError(key)}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lead-start" className="mb-1 block text-sm font-medium text-brand-darkest">
                Travel start <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="lead-start"
                type="date"
                value={form.travel_start_date}
                onChange={(event) => set('travel_start_date', event.target.value)}
                className={INPUT}
              />
            </div>

            <div>
              <label htmlFor="lead-end" className="mb-1 block text-sm font-medium text-brand-darkest">
                Travel end <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="lead-end"
                type="date"
                min={form.travel_start_date || undefined}
                value={form.travel_end_date}
                onChange={(event) => set('travel_end_date', event.target.value)}
                aria-invalid={errors.travel_end_date ? true : undefined}
                className={INPUT}
              />
              {fieldError('travel_end_date')}
            </div>
          </div>

          <div>
            <label htmlFor="lead-status" className="mb-1 block text-sm font-medium text-brand-darkest">
              Status
            </label>
            <select
              id="lead-status"
              value={form.status}
              onChange={(event) =>
                set('status', event.target.value as (typeof LEAD_STATUSES)[number])
              }
              className={INPUT}
            >
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lead-message" className="mb-1 block text-sm font-medium text-brand-darkest">
              Notes <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="lead-message"
              rows={3}
              maxLength={2000}
              placeholder="What did they ask about?"
              value={form.message}
              onChange={(event) => set('message', event.target.value)}
              className={INPUT}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-darkest disabled:opacity-50"
            >
              {createMutation.isPending && (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              )}
              {createMutation.isPending ? 'Saving…' : 'Add lead'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
