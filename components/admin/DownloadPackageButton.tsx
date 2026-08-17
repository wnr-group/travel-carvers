'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchJson } from '@/lib/api/fetchJson';
import { downloadPackagePdf } from '@/lib/packagePdf';
import type { PackageFormInput } from '@/lib/validations/package.schema';

/**
 * Downloads a package as a PDF brochure.
 *
 * The list rows only carry summary fields, so the full record — itinerary,
 * inclusions, stays — is fetched on click rather than up front: nobody should pay
 * for that payload just by opening the packages page.
 */
export default function DownloadPackageButton({
  packageId,
  title,
  className,
}: {
  packageId: string;
  title: string;
  className?: string;
}) {
  const [isBusy, setIsBusy] = useState(false);

  const handleDownload = async () => {
    if (isBusy) return;
    setIsBusy(true);

    try {
      const pkg = await fetchJson<PackageFormInput>(`/api/admin/packages/${packageId}`);
      await downloadPackagePdf(pkg);
      toast.success('PDF downloaded');
    } catch (error) {
      console.error('[package pdf]', error);
      toast.error('Could not build the PDF. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isBusy}
      aria-label={`Download ${title} as PDF`}
      title="Download as PDF"
      className={
        className ??
        'text-gray-500 transition-colors hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
      }
    >
      {isBusy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </button>
  );
}
