'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewPhotosProps {
  images: string[];
}

export default function ReviewPhotos({ images }: ReviewPhotosProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="mt-3">
      {/* Thumbnails grid */}
      <div className="flex flex-wrap gap-2">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className="group relative h-16 w-24 overflow-hidden rounded-lg border border-brand-light bg-slate-50 transition hover:border-brand-medium active:scale-95"
            aria-label={`View photo ${index + 1}`}
          >
            <img
              src={src}
              alt={`Review photo ${index + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeLightbox}
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
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition active:scale-95"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/50 text-white hover:bg-black/80 transition active:scale-95"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Large Image */}
          <div
            className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`Expanded review photo ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
            {images.length > 1 && (
              <p className="py-2 text-center text-xs font-medium text-slate-400">
                {lightboxIndex + 1} of {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
