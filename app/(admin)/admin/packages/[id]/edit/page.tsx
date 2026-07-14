'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import PackageForm from '@/components/admin/PackageForm/PackageForm';
import { fetchJson } from '@/lib/api/fetchJson';
import { useAdminPackage } from '@/lib/hooks/useAdminPackage';
import { ADMIN_PACKAGES_KEY } from '@/lib/queryKeys';
import { packagePath } from '@/lib/utils';
import type { PackageFormOutput } from '@/lib/validations/package.schema';

export default function EditPackagePage({
  params,
}: {
  // Route params are a promise in Next 16; `use()` unwraps it in a client component.
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: pkg, isPending, isError, error } = useAdminPackage(id);

  const updatePackage = useMutation({
    mutationFn: (data: PackageFormOutput) =>
      fetchJson<{ id: string }>(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      toast.success('Package updated');

      queryClient.invalidateQueries({ queryKey: ADMIN_PACKAGES_KEY });

      router.push('/admin/packages');
    },

    onError: (mutationError: Error) => {
      toast.error(mutationError.message || 'Could not save the package');
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to packages
        </Link>

        <h1 className="mt-2 text-3xl font-bold text-brand-darkest">
          {pkg ? pkg.title : 'Edit Package'}
        </h1>

        {pkg?.slug && (
          <p className="mt-1 text-sm text-gray-500">
            <code>{packagePath(pkg.slug)}</code>
          </p>
        )}
      </div>

      {isPending ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-white p-12 text-gray-500 shadow">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading package...
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
          <p className="mt-2 font-semibold text-red-600">Could not load this package</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Link
            href="/admin/packages"
            className="mt-4 inline-block text-sm text-brand-dark underline hover:text-brand-darkest"
          >
            Back to packages
          </Link>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
          <PackageForm
            key={id}
            mode="edit"
            defaultValues={pkg}
            onSubmit={(data) => updatePackage.mutate(data)}
            isSubmitting={updatePackage.isPending}
          />
        </div>
      )}
    </div>
  );
}
