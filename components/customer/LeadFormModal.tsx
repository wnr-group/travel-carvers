'use client';

import { useEffect, useRef } from 'react';
import { LeadForm } from './LeadForm';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
  packageTitle?: string;
}

export function LeadFormModal({ isOpen, onClose, packageId, packageTitle }: LeadFormModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Prevent background scrolling, close on Escape, and move focus into the dialog when it opens.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">

      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={packageTitle ? `Enquiry form for ${packageTitle}` : 'Travel enquiry form'}
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 scrollbar-hide focus:outline-none"
      >

        {/* Elegant Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-brand-lightest/50 text-brand-darkest hover:bg-brand-light transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          aria-label="Close enquiry form"
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Wrapper */}
        <div className="p-6 pt-16 sm:p-10 md:p-12">
          <LeadForm
            packageId={packageId}
            packageTitle={packageTitle}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
