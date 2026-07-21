'use client';

import React from 'react';
import { Shield, Plane } from 'lucide-react';

interface BookingSidebarProps {
  startingPrice: number;
  packageTitle: string;
  packageId: string;
  guests: number;
  setGuests: (n: number) => void;
  onBookNow: () => void;
}

export function BookingSidebar({
  startingPrice,
  guests,
  setGuests,
  onBookNow,
}: BookingSidebarProps) {
  const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const total = guests * startingPrice;

  return (
    <div className="ticket sticky top-24 rounded-2xl border border-brand-light bg-white p-6 shadow-[0_20px_50px_-20px_rgba(27,77,27,0.3)]">
      <p className="text-xs uppercase tracking-wide text-slate-400">Starting from</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-brand-darkest">
        {money(startingPrice)}
        <span className="ml-1 text-sm font-normal text-slate-400">/ adult</span>
      </p>

      <div className="my-5 border-t border-dashed border-brand-light" />

      <label className="mb-1.5 block text-xs font-medium text-slate-500">Travellers</label>
      <div className="flex items-center justify-between rounded-lg border border-brand-light/70 px-3 py-2">
        <button
          onClick={() => setGuests(Math.max(1, guests - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest font-bold text-lg select-none"
        >
          –
        </button>
        <span className="font-mono text-sm font-medium text-brand-darkest">{guests}</span>
        <button
          onClick={() => setGuests(Math.min(12, guests + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest font-bold text-lg select-none"
        >
          +
        </button>
      </div>

      <div className="my-5 border-t border-dashed border-brand-light" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Estimated total</span>
        <span className="font-mono text-base font-semibold text-brand-darkest">{money(total)}</span>
      </div>

      <button
        onClick={onBookNow}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-brand-forest to-brand-sage py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        Reserve Your Spot
      </button>

      <div className="mt-4 space-y-2 text-xs text-slate-500">
        <p className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-brand-medium" /> Free cancellation up to 30 days out
        </p>
        <p className="flex items-center gap-2">
          <Plane className="h-3.5 w-3.5 text-brand-medium" /> Reserve now, pay later available
        </p>
      </div>
    </div>
  );
}
