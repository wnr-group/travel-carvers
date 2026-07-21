'use client';

import { useMemo, useState } from 'react';
import { ArrowDownToLine, FileSpreadsheet, FileText, Search, Stamp } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import {
  visaDownloadUrl,
  visaFileKind,
  visaFileSize,
  type VisaCountry,
} from '@/lib/api/public/visa';

function startDownload(country: VisaCountry) {
  const link = document.createElement('a');
  link.href = visaDownloadUrl(country);
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export default function VisaCountryGrid({ countries }: { countries: VisaCountry[] }) {
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<VisaCountry | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return countries;
    return countries.filter((country) => country.country_name.toLowerCase().includes(term));
  }, [countries, query]);

  const confirmDownload = () => {
    if (!pending) return;
    startDownload(pending);
    setPending(null);
  };

  return (
    <>
      {/* Search — only earns its place once the list is long enough to scan. */}
      {countries.length > 6 && (
        <div className="mx-auto mb-10 max-w-md">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-medium"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search countries…"
              aria-label="Search countries"
              className="w-full rounded-full border border-brand-light/70 bg-white py-3 pl-11 pr-4 text-sm text-brand-darkest shadow-sm placeholder:text-brand-medium/70 focus:border-brand-medium focus:outline-none focus:ring-2 focus:ring-brand-medium/30"
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-light bg-white/60 px-6 py-14 text-center text-sm text-brand-medium">
          No country matches “{query}”.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => {
            const kind = visaFileKind(country);
            const size = visaFileSize(country);
            const updated = formatUpdated(country.updated_at);
            const Glyph = kind === 'XLSX' ? FileSpreadsheet : FileText;

            return (
              <li key={country.id}>
                <button
                  type="button"
                  onClick={() => setPending(country)}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-brand-light/70 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-medium hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  {/* Passport-stamp monogram, tilted like a real one. */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-3 -top-3 flex h-24 w-24 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-brand-light/60 text-lg font-black tracking-widest text-brand-light/70 transition-all duration-500 group-hover:rotate-[24deg] group-hover:border-brand-medium/50 group-hover:text-brand-medium/60"
                  >
                    {monogram(country.country_name)}
                  </span>

                  <span className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-medium">
                    <Stamp aria-hidden="true" className="h-3.5 w-3.5" />
                    Visa details
                  </span>

                  <h2 className="relative mt-3 pr-16 font-display text-2xl font-semibold text-brand-darkest">
                    {country.country_name}
                  </h2>

                  {/* Ticket-style perforation. */}
                  <span aria-hidden="true" className="my-5 block border-t border-dashed border-brand-light" />

                  <span className="relative mt-auto flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2 text-xs text-brand-medium">
                      <Glyph
                        aria-hidden="true"
                        className={`h-4 w-4 shrink-0 ${kind === 'XLSX' ? 'text-emerald-600' : 'text-rose-600'}`}
                      />
                      <span className="truncate">
                        {kind}
                        {size ? ` · ${size}` : ''}
                        {updated ? ` · ${updated}` : ''}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand-darkest px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-brand-dark">
                      <ArrowDownToLine aria-hidden="true" className="h-3.5 w-3.5" />
                      Download
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        variant="default"
        title={pending ? `Download ${pending.country_name} visa details?` : ''}
        message={pending ? `This will download “${pending.file_name}” to your device.` : ''}
        confirmLabel="Download"
        cancelLabel="Cancel"
        onConfirm={confirmDownload}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
