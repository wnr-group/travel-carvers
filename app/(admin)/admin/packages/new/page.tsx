'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import PackageForm from '@/components/admin/PackageForm/PackageForm';
import { fetchJson } from '@/lib/api/fetchJson';
import { ADMIN_DESTINATIONS_KEY, ADMIN_PACKAGES_KEY } from '@/lib/queryKeys';
import { PACKAGE_STATUS_LABELS } from '@/lib/types/package';
import type { PackageFormOutput } from '@/lib/validations/package.schema';

export default function NewPackagePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createPackage = useMutation({
    mutationFn: (data: PackageFormOutput) =>
      fetchJson<{ id: string }>('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),

    onSuccess: (_result, data) => {
      toast.success(`Package saved as ${PACKAGE_STATUS_LABELS[data.status]}`);

      queryClient.invalidateQueries({ queryKey: ADMIN_PACKAGES_KEY });
      // Saving can create a destination, so the picker list and the map pins are stale.
      queryClient.invalidateQueries({ queryKey: ADMIN_DESTINATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });

      router.push('/admin/packages');
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Could not save the package');
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
        <h1 className="mt-2 text-3xl font-bold text-brand-darkest">New Package</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <PackageForm
          onSubmit={(data) => createPackage.mutate(data)}
          isSubmitting={createPackage.isPending}
        />
      </div>
    </div>
  );
}
