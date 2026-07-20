'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewPhotosProps {
  images: string[];
}

export default function ReviewPhotos({ images }: ReviewPhotosProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOpen = lightboxIndex !== null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);

  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-3">
      {/* Thumbnails grid */}
      <div className="flex flex-wrap gap-2">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="group relative h-16 w-24 overflow-hidden rounded-lg border border-brand-light bg-slate-50 transition hover:border-brand-medium active:scale-95"
            aria-label={`View photo ${index + 1}`}
          >
            <Image
              src={src}
              alt={`Review photo ${index + 1}`}
              fill
              sizes="96px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Review photo ${lightboxIndex + 1} of ${images.length}`}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition active:scale-95"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Large Image */}
          <div
            className="flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-[90vw] max-w-5xl">
              <Image
                src={images[lightboxIndex]}
                alt={`Expanded review photo ${lightboxIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {images.length > 1 && (
              <p className="py-2 text-center text-xs font-medium text-slate-300">
                {lightboxIndex + 1} of {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
