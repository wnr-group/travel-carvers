'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X } from 'lucide-react';
import { PackageCard } from '@/components/customer/PackageCard';
import type { DestinationDetail } from '@/lib/data/destinations';

interface DestinationModalProps {
  destination: DestinationDetail | null;
  onClose: () => void;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-light/70 bg-brand-tint-subtle px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-medium">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-brand-darkest">{value}</p>
    </div>
  );
}

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Lock scroll, close on Escape and move focus into the dialog while open.
  useEffect(() => {
    if (!destination) return;

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
  }, [destination, onClose]);

  if (!destination || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${destination.name} destination details`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1B4D1B]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300 focus:outline-none"
      >
        <button
          onClick={onClose}
          aria-label="Close destination details"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-lightest/60 text-brand-darkest transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-dark"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-medium">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {destination.country}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-brand-darkest">{destination.name}</h2>

          {/* Quick facts */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Fact label="Time zone" value={destination.timezone} />
            <Fact label="Currency" value={destination.currency} />
            <Fact label="Languages" value={destination.languages} />
          </div>

          {/* Description */}
          <p className="mt-5 leading-relaxed text-slate-700">{destination.description}</p>

          {/* Related packages */}
          <div className="mt-8">
            <h3 className="mb-4 font-display text-lg font-semibold text-brand-darkest">
              Related {destination.name} packages
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {destination.packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>

          {/* Explore More — CTA only, intentionally not wired to a route yet. */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.02] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
