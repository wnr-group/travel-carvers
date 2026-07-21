import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe2, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import Breadcrumb from '@/components/customer/Breadcrumb';
import VisaCountryGrid from '@/components/customer/VisaCountryGrid';
import { createMetadata, SITE } from '@/lib/seo';
import { getVisaCountries } from '@/lib/api/public/visa';

export const revalidate = 3600;

export const metadata: Metadata = createMetadata({
  title: 'Visa Information | Travel Carvers',
  description: `Visa requirements and document checklists for every country we travel to. ${SITE.defaultDescription}`,
  path: '/visa',
  keywords: ['visa', 'visa requirements', 'travel documents', 'visa checklist', 'Travel Carvers'],
});

export default async function VisaPage() {
  const countries = await getVisaCountries().catch(() => []);

  return (
    <div className="min-h-screen bg-brand-tint-light pb-20">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Visa' }]} />

      {/* Hero — passport-inspired: dark cover, stamped rings, embossed type. */}
      <header className="relative mx-auto mt-6 max-w-7xl overflow-hidden rounded-3xl bg-gradient-brand-dark px-6 py-14 text-center sm:px-10 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15]">
          <span className="absolute -left-16 -top-16 h-64 w-64 rounded-full border-[3px] border-dashed border-white" />
          <span className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full border-[3px] border-dashed border-white" />
          <span className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <Globe2 aria-hidden="true" className="h-3.5 w-3.5" />
            Before you fly
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold text-white sm:text-6xl">
            Visa Information
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            Requirements change country by country. Pick your destination below and download
            the current checklist — everything you need to prepare, in one file.
          </p>

          {countries.length > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--logo-mint)]">
              <PlaneTakeoff aria-hidden="true" className="h-4 w-4" />
              {countries.length} {countries.length === 1 ? 'country' : 'countries'} available
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        {countries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-light bg-white/70 px-6 py-20 text-center">
            <Globe2 aria-hidden="true" className="mx-auto h-10 w-10 text-brand-light" />
            <h2 className="mt-4 font-display text-xl font-semibold text-brand-darkest">
              Visa guides are on their way
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-brand-medium">
              We are putting these together right now. In the meantime our team can walk you
              through the requirements for any destination.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-brand-darkest to-brand-medium px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.02]"
            >
              Ask our team
            </Link>
          </div>
        ) : (
          <VisaCountryGrid countries={countries} />
        )}

        {/* Reassurance strip */}
        <section className="mt-16 grid gap-4 rounded-3xl border border-brand-light/70 bg-white p-8 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Checked by our team',
              body: 'Each checklist is prepared and kept current by the consultants who book these trips.',
            },
            {
              icon: Globe2,
              title: 'Country specific',
              body: 'Requirements differ by passport and destination — these are the ones that apply to our tours.',
            },
            {
              icon: PlaneTakeoff,
              title: 'Still unsure?',
              body: 'Visa rules change. Talk to us before you book and we will confirm what you need.',
            },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <item.icon aria-hidden="true" className="mx-auto h-5 w-5 text-brand-medium sm:mx-0" />
              <h3 className="mt-3 font-display text-base font-semibold text-brand-darkest">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-medium">{item.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
