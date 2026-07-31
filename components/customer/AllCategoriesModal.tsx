'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { HomeCategoryCard, type HomeCategory } from '@/components/customer/HomeCategoryCard';

interface AllCategoriesModalProps {
  open: boolean;
  categories: HomeCategory[];
  onClose: () => void;
}

export default function AllCategoriesModal({ open, categories, onClose }: AllCategoriesModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="All travel categories"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-light/60 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
              Browse
            </p>
            <h2 className="mt-1 text-2xl font-bold text-brand-forest">All Travel Categories</h2>
            <p className="mt-0.5 text-sm text-gray-600">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'} to explore
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close categories"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lightest/60 text-brand-darkest transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-dark"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <HomeCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
