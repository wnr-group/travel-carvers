'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '@/lib/hooks/usePackageFilters';

interface PackageSortingProps {
  value: string;
  onChange: (value: string) => void;
}

export function PackageSorting({ value, onChange }: PackageSortingProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs font-bold text-[#1A3C34]/70 uppercase tracking-wider">
        Sort by
      </label>
      <div className="relative">
        <select
          id="sort"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-full border border-[#A9B388]/30 bg-white py-2 pl-4 pr-10 text-xs font-bold text-[#1A3C34] outline-none transition-all focus:border-[#1A3C34] focus:ring-4 focus:ring-[#1A3C34]/15 cursor-pointer shadow-sm hover:border-[#1A3C34]/30 uppercase tracking-wider"
        >
          {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
            <option key={key} value={key} className="text-[#1A3C34] font-bold">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A3C34]" />
      </div>
    </div>
  );
}
