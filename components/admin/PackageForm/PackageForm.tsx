'use client';

import { createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  packageSchema,
  type PackageFormInput,
  type PackageFormOutput,
} from '@/lib/validations/package.schema';
import { PACKAGE_FORM_TABS, type PackageTabId } from './tabs';

export type PackageFormMode = 'create' | 'edit';

/**
 * Whether this form is creating a package or editing an existing one.
 *
 * A context rather than a prop because the tabs take no props — they reach the form through
 * `useFormContext`, and BasicInfoTab is the one that needs to know (it must stop mirroring the
 * title into the slug once the package has a real, published URL).
 */
const PackageFormModeContext = createContext<PackageFormMode>('create');

export const usePackageFormMode = () => useContext(PackageFormModeContext);

interface PackageFormProps {
  mode?: PackageFormMode;
  defaultValues?: Partial<PackageFormInput>;
  onSubmit?: (data: PackageFormOutput) => void;
  isSubmitting?: boolean;
}

const EMPTY_PACKAGE: PackageFormInput = {
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  status: 'draft',
  is_featured: false,
  is_trending: false,
  is_new: false,
  show_price: true,
  duration_days: 1,
  duration_nights: 0,
  category_ids: [],
};

export default function PackageForm({
  mode = 'create',
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: PackageFormProps) {
  const [activeTab, setActiveTab] = useState<PackageTabId>('basic');
  const isEditing = mode === 'edit';

  const form = useForm<PackageFormInput, unknown, PackageFormOutput>({
    resolver: zodResolver(packageSchema),
    defaultValues: { ...EMPTY_PACKAGE, ...defaultValues },
    mode: 'onBlur',
  });

  const { errors } = form.formState;

  const current = PACKAGE_FORM_TABS.find((tab) => tab.id === activeTab);
  const ActiveTab = current?.Component;

  /** Jump to the first tab that has an error, or a failure on a hidden tab looks like nothing happened. */
  const goToFirstBrokenTab = (validationErrors: Record<string, unknown>) => {
    const firstBrokenTab = PACKAGE_FORM_TABS.find((tab) =>
      tab.fields.some((field) => field in validationErrors)
    );
    if (firstBrokenTab) setActiveTab(firstBrokenTab.id);
  };

  /**
   * Creating: the button you press decides the status, applied to a *copy* of the validated data
   * rather than written back into the form with setValue (which is async relative to this
   * handler, and would silently rewrite the Status dropdown the admin can see).
   */
  const submitWith = (status: PackageFormOutput['status']) =>
    form.handleSubmit((data) => onSubmit?.({ ...data, status }), goToFirstBrokenTab)();

  /**
   * Editing: the status is whatever the Status dropdown says. Forcing draft-or-published on save
   * would make it impossible to archive a package, and would quietly un-archive one.
   */
  const submitAsIs = () => form.handleSubmit((data) => onSubmit?.(data), goToFirstBrokenTab)();

  const tabHasErrors = (fields: readonly (keyof PackageFormInput)[]) =>
    fields.some((field) => field in errors);

  return (
    <PackageFormModeContext.Provider value={mode}>
      <FormProvider {...form}>
      <form onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="overflow-x-auto border-b border-gray-200">
          <nav className="flex min-w-max gap-1" role="tablist" aria-label="Package form sections">
            {PACKAGE_FORM_TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              const isBuilt = Boolean(tab.Component);
              const hasErrors = tabHasErrors(tab.fields);

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  disabled={!isBuilt}
                  title={isBuilt ? undefined : 'Not built yet'}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-brand-dark text-brand-darkest'
                      : 'border-transparent text-gray-500 hover:text-brand-dark',
                    !isBuilt && 'cursor-not-allowed text-gray-300 hover:text-gray-300'
                  )}
                >
                  {tab.label}
                  {hasErrors && <AlertCircle className="h-3.5 w-3.5 text-red-600" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="py-6">
          {ActiveTab ? (
            <ActiveTab />
          ) : (
            <p className="rounded-lg bg-gray-50 p-12 text-center text-sm text-gray-500">
              This tab hasn&apos;t been built yet.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <Link
            href="/admin/packages"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </Link>

          {isEditing ? (
            // One button when editing. The status comes from the Status dropdown on Basic Info,
            // so archiving (or un-archiving) a package works exactly as you'd expect.
            <button
              type="button"
              onClick={submitAsIs}
              disabled={!onSubmit || isSubmitting}
              className="rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => submitWith('draft')}
                disabled={!onSubmit || isSubmitting}
                className="rounded-lg border border-brand-dark px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>

              <button
                type="button"
                onClick={() => submitWith('published')}
                disabled={!onSubmit || isSubmitting}
                className="rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Package'}
              </button>
            </>
          )}
        </div>
      </form>
      </FormProvider>
    </PackageFormModeContext.Provider>
  );
}
