'use client';

import { useEffect } from 'react';
import SearchAutocomplete from './SearchAutocomplete';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal shell for global search
 * {@link SearchAutocomplete}, which is reusable outside the modal too.
 */
export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[12vh] sm:p-6 sm:pt-[14vh]">
      {/* Blurred backdrop — clicking it closes the modal */}
      <div
        className="absolute inset-0 bg-brand-darkest/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        <SearchAutocomplete onClose={onClose} autoFocus />
      </div>
    </div>
  );
}
