'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { ImageOff, Loader2, UploadCloud, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/api/uploadFile';
import {
  DROPZONE_ACCEPT,
  MAX_UPLOAD_BYTES,
  type UploadBucket,
} from '@/lib/storage/buckets';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  bucket: UploadBucket;
  path?: string;
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  initialImages?: string[];
  disabled?: boolean;
  value?: string[];
  showPreviews?: boolean;
}

interface PendingUpload {
  id: string;
  name: string;
  previewUrl: string;
  progress: number;
}

export default function ImageUploader({
  bucket,
  path,
  onUpload,
  maxFiles = 1,
  initialImages = [],
  disabled = false,
  value,
  showPreviews = true,
}: ImageUploaderProps) {
  const [internalImages, setInternalImages] = useState<string[]>(initialImages);
  const [pending, setPending] = useState<PendingUpload[]>([]);

  const isControlled = value !== undefined;
  const images = isControlled ? value : internalImages;

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const isUploading = pending.length > 0;
  const isSingle = maxFiles === 1;
  const remaining = Math.max(0, maxFiles - images.length - pending.length);
  const isFull = remaining === 0 && !isSingle;

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalImages(next);
      onUpload(next);
    },
    [isControlled, onUpload]
  );

  const onDrop = useCallback(
    async (accepted: File[], rejections: FileRejection[]) => {
      for (const { file, errors } of rejections) {
        const reason = errors.some((e) => e.code === 'file-too-large')
          ? 'is larger than 5MB'
          : errors.some((e) => e.code === 'file-invalid-type')
            ? 'is not a JPEG, PNG or WebP image'
            : 'could not be accepted';
        toast.error(`${file.name} ${reason}`);
      }

      if (accepted.length === 0) return;
      let files = accepted;
      if (isSingle) {
        files = accepted.slice(0, 1);
      } else if (accepted.length > remaining) {
        files = accepted.slice(0, remaining);
        toast.error(
          `Only ${maxFiles} image${maxFiles === 1 ? '' : 's'} allowed — ${
            accepted.length - remaining
          } skipped.`
        );
      }

      if (files.length === 0) return;

      const uploads: PendingUpload[] = files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
      }));

      setPending((current) => [...current, ...uploads]);

      const results = await Promise.allSettled(
        files.map((file, index) =>
          uploadFile({
            file,
            bucket,
            path,
            onProgress: (progress) =>
              setPending((current) =>
                current.map((item) =>
                  item.id === uploads[index].id ? { ...item, progress } : item
                )
              ),
          })
        )
      );

      const uploadedIds = new Set(uploads.map((upload) => upload.id));
      setPending((current) => current.filter((item) => !uploadedIds.has(item.id)));
      uploads.forEach((upload) => URL.revokeObjectURL(upload.previewUrl));

      const succeeded: string[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          succeeded.push(result.value.url);
        } else {
          const message =
            result.reason instanceof Error ? result.reason.message : 'Upload failed';
          toast.error(`${files[index].name}: ${message}`);
        }
      });

      if (succeeded.length === 0) return;

      const current = imagesRef.current;
      commit(isSingle ? succeeded.slice(0, 1) : [...current, ...succeeded]);

      toast.success(
        succeeded.length === 1 ? 'Image uploaded' : `${succeeded.length} images uploaded`
      );
    },
    [bucket, path, isSingle, remaining, maxFiles, commit]
  );

  const removeImage = (url: string) => {
    commit(images.filter((image) => image !== url));
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: DROPZONE_ACCEPT,
    maxSize: MAX_UPLOAD_BYTES,
    multiple: !isSingle,
    disabled: disabled || isUploading || isFull,
    noClick: false,
    noKeyboard: false,
  });

  const isDisabled = disabled || isUploading || isFull;

  return (
    <div className="flex flex-col gap-3">
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
          isDragActive
            ? 'border-brand-dark bg-brand-lightest/40'
            : 'border-gray-300 hover:border-brand-medium hover:bg-brand-lightest/20',
          isDisabled && 'cursor-not-allowed opacity-60 hover:border-gray-300 hover:bg-transparent'
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-brand-medium" />
        ) : (
          <UploadCloud className="h-6 w-6 text-brand-medium" />
        )}

        <p className="mt-2 text-sm font-medium text-brand-darkest">
          {isDragActive
            ? 'Drop to upload'
            : isFull
              ? `Limit of ${maxFiles} images reached`
              : 'Drag & drop, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG or WebP · up to 5MB{!isSingle && ` · ${remaining} slot${remaining === 1 ? '' : 's'} left`}
        </p>
      </div>

      {((showPreviews && images.length > 0) || pending.length > 0) && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {showPreviews &&
            images.map((url) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
            >
              <Image src={url} alt="" fill sizes="200px" className="object-cover" />

              <button
                type="button"
                onClick={() => removeImage(url)}
                disabled={disabled}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 focus:opacity-100 group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}

          {pending.map((upload) => (
            <li
              key={upload.id}
              className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
            >
              {/* A local `blob:` object URL for the in-flight upload — next/image cannot
                  optimize those, so this one stays a plain <img>. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={upload.previewUrl}
                alt=""
                className="h-full w-full object-cover opacity-40"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3">
                <Loader2 className="h-5 w-5 animate-spin text-brand-darkest" />
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full bg-brand-dark transition-[width] duration-150"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-brand-darkest">
                  {upload.progress}%
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* The parent shows its own empty state when it renders the gallery itself. */}
      {showPreviews && images.length === 0 && pending.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <ImageOff className="h-3.5 w-3.5" />
          No images yet
        </p>
      )}

      {!isDisabled && (
        <button
          type="button"
          onClick={open}
          className="self-start text-xs font-semibold text-brand-dark underline hover:text-brand-darkest"
        >
          Browse files
        </button>
      )}
    </div>
  );
}
