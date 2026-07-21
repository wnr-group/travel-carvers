'use client';

import { useRef, useState } from 'react';
import { FileSpreadsheet, FileText, Loader2, Plus, RefreshCw, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { uploadFile, type UploadedFile } from '@/lib/api/uploadFile';
import {
  useAdminVisaAttachments,
  useCreateVisaAttachment,
  useDeleteVisaAttachment,
  useReplaceVisaAttachmentFile,
  type VisaAttachment,
} from '@/lib/hooks/useVisaAttachments';
import { DOCUMENT_ACCEPT, MAX_DOCUMENT_BYTES } from '@/lib/storage/buckets';

const ACCEPT_ATTR = Object.values(DOCUMENT_ACCEPT).flat().join(',');
const MAX_MB = Math.floor(MAX_DOCUMENT_BYTES / (1024 * 1024));

function toFilePayload(uploaded: UploadedFile) {
  return {
    file_url: uploaded.url,
    file_path: uploaded.path,
    file_name: uploaded.name,
    file_type: uploaded.type,
    file_size: uploaded.size,
  };
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function FileGlyph({ type, name }: { type: string | null; name: string }) {
  const isSheet = type?.includes('spreadsheet') || name.toLowerCase().endsWith('.xlsx');
  const Glyph = isSheet ? FileSpreadsheet : FileText;
  return (
    <Glyph
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 ${isSheet ? 'text-emerald-600' : 'text-rose-600'}`}
    />
  );
}

export default function VisaAttachmentsPage() {
  const { data: attachments = [], isPending, isError, error } = useAdminVisaAttachments();
  const createMutation = useCreateVisaAttachment();
  const replaceMutation = useReplaceVisaAttachmentFile();
  const deleteMutation = useDeleteVisaAttachment();

  const [countryName, setCountryName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Which row is mid-replacement, so only that row shows a spinner. */
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<VisaAttachment | null>(null);

  const canSubmit = countryName.trim().length >= 2 && file !== null && !isUploading;

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !canSubmit) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFile({ file, bucket: 'visa-attachments', path: 'documents' });
      await createMutation.mutateAsync({
        country_name: countryName.trim(),
        ...toFilePayload(uploaded),
      });

      toast.success(`${countryName.trim()} added`);
      setCountryName('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Could not add this country');
    } finally {
      setIsUploading(false);
    }
  };

  /** Replace the document on an existing row; the country name is untouched. */
  const handleReplace = async (attachment: VisaAttachment, nextFile: File) => {
    setReplacingId(attachment.id);
    try {
      const uploaded = await uploadFile({
        file: nextFile,
        bucket: 'visa-attachments',
        path: 'documents',
      });
      await replaceMutation.mutateAsync({ id: attachment.id, file: toFilePayload(uploaded) });
      toast.success(`File updated for ${attachment.country_name}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Could not update the file');
    } finally {
      setReplacingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success(`${pendingDelete.country_name} removed`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Could not delete this country');
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-darkest">Visa Attachments</h1>
        <p className="mt-1 text-gray-600">
          One document per country. Customers pick a country from the Visa menu and download
          the file you attach here.
        </p>
      </header>

      {/* Add a country */}
      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-lg font-semibold text-brand-darkest">Add a country</h2>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label
              htmlFor="visa-country"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Country name
            </label>
            <input
              id="visa-country"
              type="text"
              value={countryName}
              onChange={(event) => setCountryName(event.target.value)}
              placeholder="e.g. Japan"
              maxLength={120}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium"
            />
          </div>

          <div>
            <label
              htmlFor="visa-file"
              className="mb-1 block text-sm font-medium text-brand-darkest"
            >
              Document <span className="font-normal text-gray-400">(PDF or XLSX, ≤{MAX_MB}MB)</span>
            </label>
            <input
              id="visa-file"
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 file:mr-3 file:rounded-md file:border-0 file:bg-brand-lightest file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-darkest focus:outline-none focus:ring-2 focus:ring-brand-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-darkest disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Plus aria-hidden="true" className="h-4 w-4" />
            )}
            {isUploading ? 'Uploading…' : 'Add country'}
          </button>
        </div>
      </form>

      {/* Existing countries */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-brand-darkest">
            Countries{attachments.length > 0 && ` (${attachments.length})`}
          </h2>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-gray-500">
            <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
            Loading…
          </div>
        ) : isError ? (
          <p className="px-6 py-12 text-center text-sm text-rose-600">
            {error instanceof Error ? error.message : 'Could not load visa attachments'}
          </p>
        ) : attachments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Upload aria-hidden="true" className="mx-auto h-8 w-8 text-brand-medium" />
            <p className="mt-2 font-semibold text-brand-darkest">No countries yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Add one above and it will appear in the customer Visa menu.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex flex-wrap items-center gap-4 px-6 py-4 sm:flex-nowrap"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-brand-darkest">{attachment.country_name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
                    <FileGlyph type={attachment.file_type} name={attachment.file_name} />
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:text-brand-dark hover:underline"
                    >
                      {attachment.file_name}
                    </a>
                    {attachment.file_size ? (
                      <span className="shrink-0 text-gray-400">
                        · {formatSize(attachment.file_size)}
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* A label wrapping a hidden input keeps this a one-click replace. */}
                  <label
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-lightest/40 ${
                      replacingId === attachment.id ? 'pointer-events-none opacity-60' : ''
                    }`}
                  >
                    {replacingId === attachment.id ? (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw aria-hidden="true" className="h-4 w-4" />
                    )}
                    {replacingId === attachment.id ? 'Updating…' : 'Update file'}
                    <input
                      type="file"
                      accept={ACCEPT_ATTR}
                      className="sr-only"
                      onChange={(event) => {
                        const next = event.target.files?.[0];
                        event.target.value = '';
                        if (next) void handleReplace(attachment, next);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setPendingDelete(attachment)}
                    aria-label={`Delete ${attachment.country_name}`}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this country?"
        message={
          pendingDelete
            ? `${pendingDelete.country_name} and its file (${pendingDelete.file_name}) will be permanently removed, and it will disappear from the customer Visa menu.`
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
