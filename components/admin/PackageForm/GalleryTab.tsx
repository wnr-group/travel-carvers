'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reorder, useDragControls } from 'framer-motion';
import { useController, useFormContext } from 'react-hook-form';
import { GripVertical, ImageOff, Pencil, Star, Trash2, Video } from 'lucide-react';
import FieldError from '@/components/admin/FieldError';
import ImageUploader from '@/components/admin/ImageUploader';
import { cn, isYouTubeUrl } from '@/lib/utils';
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema';
import FormSection from './FormSection';
import { INPUT_CLASSES } from './fields';
import {
  MAX_GALLERY_IMAGES,
  mergeUploadedUrls,
  normalize,
  type GalleryImage,
} from './gallery';

export default function GalleryTab() {
  const { control, formState } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >();
  const { errors } = formState;

  const { field: galleryField } = useController({ control, name: 'gallery_images' });
  const { field: videoField } = useController({ control, name: 'video_urls' });

  const images: GalleryImage[] = galleryField.value ?? [];
  const videos: string[] = videoField.value ?? [];

  const commitImages = (next: GalleryImage[]) => galleryField.onChange(normalize(next));

  const handleUpload = (urls: string[]) => {
    galleryField.onChange(mergeUploadedUrls(urls, images));
  };

  const setCover = (url: string) => {
    commitImages(images.map((image) => ({ ...image, is_cover: image.url === url })));
  };

  const removeImage = (url: string) => {
    commitImages(images.filter((image) => image.url !== url));
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Images"
        description={`Up to ${MAX_GALLERY_IMAGES} images. The first one becomes the cover; drag to reorder.`}
      >
        <ImageUploader
          bucket="package-images"
          path="gallery"
          maxFiles={MAX_GALLERY_IMAGES}
          value={images.map((image) => image.url)}
          showPreviews={false}
          onUpload={handleUpload}
        />

        {images.length === 0 ? (
          <p className="flex items-center gap-1.5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            <ImageOff className="h-4 w-4" />
            No images yet. Upload one to get started.
          </p>
        ) : (
          <Reorder.Group
            axis="y"
            values={images}
            onReorder={commitImages}
            className="space-y-2"
          >
            {images.map((image) => (
              <GalleryRow
                key={image.url}
                image={image}
                position={image.display_order + 1}
                onSetCover={() => setCover(image.url)}
                onRemove={() => removeImage(image.url)}
              />
            ))}
          </Reorder.Group>
        )}

        <FieldError message={errors.gallery_images?.message} />
      </FormSection>

      <VideosSection
        videos={videos}
        onChange={videoField.onChange}
        error={errors.video_urls?.message}
      />
    </div>
  );
}


function GalleryRow({
  image,
  position,
  onSetCover,
  onRemove,
}: {
  image: GalleryImage;
  position: number;
  onSetCover: () => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={image}
      dragListener={false}
      dragControls={controls}
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-white p-2',
        image.is_cover ? 'border-brand-dark' : 'border-gray-200'
      )}
    >
      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        aria-label={`Reorder image ${position}`}
        className="cursor-grab touch-none p-1 text-gray-400 hover:text-brand-dark active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <span className="w-5 text-center text-xs font-medium tabular-nums text-gray-400">
        {position}
      </span>

      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
        <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
      </div>

      {image.is_cover && (
        <span className="flex items-center gap-1 rounded-full bg-brand-lightest px-2 py-0.5 text-xs font-semibold text-brand-darkest">
          <Star className="h-3 w-3 fill-current" />
          Cover
        </span>
      )}

      <div className="ml-auto flex items-center gap-1">
        {!image.is_cover && (
          <button
            type="button"
            onClick={onSetCover}
            className="rounded-md px-2 py-1 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-lightest/50"
          >
            Set cover
          </button>
        )}

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove image ${position}`}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}

/**
 * YouTube URLs.
 */
function VideosSection({
  videos,
  onChange,
  error,
}: {
  videos: string[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  const validate = (url: string): string | null => {
    const trimmed = url.trim();
    if (!trimmed) return 'Enter a YouTube URL';
    if (!isYouTubeUrl(trimmed)) return 'That is not a YouTube link';
    if (videos.includes(trimmed)) return 'That video has already been added';
    return null;
  };

  const addVideo = () => {
    const problem = validate(draft);
    if (problem) {
      setDraftError(problem);
      return;
    }

    onChange([...videos, draft.trim()]);
    setDraft('');
    setDraftError(null);
  };

  const saveEdit = (index: number) => {
    const trimmed = editDraft.trim();

    const others = videos.filter((_, i) => i !== index);
    const problem = !trimmed
      ? 'Enter a YouTube URL'
      : !isYouTubeUrl(trimmed)
        ? 'That is not a YouTube link'
        : others.includes(trimmed)
          ? 'That video has already been added'
          : null;

    if (problem) {
      setEditError(problem);
      return;
    }

    onChange(videos.map((video, i) => (i === index ? trimmed : video)));
    setEditingIndex(null);
    setEditError(null);
  };

  return (
    <FormSection title="Videos" description="YouTube links shown on the package page.">
      <div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (draftError) setDraftError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addVideo();
              }
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            aria-label="YouTube URL"
            className={INPUT_CLASSES}
          />
          <button
            type="button"
            onClick={addVideo}
            className="shrink-0 rounded-lg bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-darkest"
          >
            Add video
          </button>
        </div>
        <FieldError message={draftError ?? undefined} />
      </div>

      {videos.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">No videos added.</p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video, index) => (
            <li
              key={video}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="url"
                    value={editDraft}
                    autoFocus
                    onChange={(e) => {
                      setEditDraft(e.target.value);
                      if (editError) setEditError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit(index);
                      }
                      if (e.key === 'Escape') {
                        setEditingIndex(null);
                        setEditError(null);
                      }
                    }}
                    aria-label={`Edit video ${index + 1}`}
                    className={INPUT_CLASSES}
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(index)}
                    className="shrink-0 rounded-md bg-brand-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-darkest"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setEditError(null);
                    }}
                    className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 shrink-0 text-red-600" />
                  <span className="truncate text-sm text-brand-darkest">{video}</span>

                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIndex(index);
                        setEditDraft(video);
                        setEditError(null);
                      }}
                      aria-label={`Edit video ${index + 1}`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-brand-lightest/50 hover:text-brand-dark"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(videos.filter((_, i) => i !== index))}
                      aria-label={`Remove video ${index + 1}`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {editError && <FieldError message={editError} />}
      <FieldError message={error} />
    </FormSection>
  );
}
