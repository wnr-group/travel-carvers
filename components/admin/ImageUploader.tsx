'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Uploads go through the admin API (service-role key) rather than the browser
      // Supabase client, which carries no session and would upload as `anon`.
      const res = await fetch('/api/admin/categories/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? 'Upload failed');

      onUpload(json.data.url);
      toast.success('Image uploaded');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Let the same file be re-selected after a failure.
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-lightest file:text-brand-darkest hover:file:bg-brand-light disabled:opacity-50"
      />
      {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
    </div>
  );
}
