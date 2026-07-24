import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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

      {/* Hero — aligned with the main hero section style: crystal clear background image with a dynamic gradient overlay */}
      <header className="relative mx-auto mt-6 max-w-7xl overflow-hidden rounded-3xl bg-brand-paper px-6 py-16 text-center sm:px-10 sm:py-24 shadow-xl z-0 flex items-center justify-center">
        {/* Absolute Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/passport-img.jpg"
            alt="Passport and Travel Documents"
            fill
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.9] contrast-105"
            priority
          />
          {/* Elegant Gradient Overlay matching the homepage hero for perfect text contrast and visible background */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-forest/75 via-brand-forest/50 to-black/40 backdrop-blur-[0.5px]" />
        </div>

        {/* Decorative passport ring watermarks */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15 z-10">
          <span className="absolute -left-16 -top-16 h-64 w-64 rounded-full border-[3px] border-dashed border-white" />
          <span className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full border-[3px] border-dashed border-white" />
          <span className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm w-fit mx-auto">
            <Globe2 aria-hidden="true" className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>Before you fly</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
              Visa Information
            </h1>
            <p className="text-base sm:text-lg text-white/95 font-medium max-w-xl mx-auto leading-relaxed pt-2 drop-shadow">
              Requirements change country by country. Pick your destination below and download the current checklist — everything you need to prepare, in one file.
            </p>
          </div>

          {countries.length > 0 && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-md">
                <PlaneTakeoff aria-hidden="true" className="h-4 w-4" />
                {countries.length} {countries.length === 1 ? 'country' : 'countries'} available
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
        {countries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-light bg-white/70 px-6 py-20 text-center shadow-sm">
            <Globe2 aria-hidden="true" className="mx-auto h-10 w-10 text-brand-medium" />
            <h2 className="mt-4 font-display text-xl font-bold text-brand-darkest">
              Visa guides are on their way
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-brand-medium font-medium">
              We are putting these together right now. In the meantime our team can walk you
              through the requirements for any destination.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-brand-darkest to-brand-medium px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.02]"
            >
              Ask our team
            </Link>
          </div>
        ) : (
          <VisaCountryGrid countries={countries} />
        )}

        {/* Reassurance strip */}
        <section className="mt-16 grid gap-6 rounded-3xl border border-brand-forest/15 bg-white p-8 sm:grid-cols-3 shadow-lg">
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
              <div className="w-10 h-10 rounded-xl bg-brand-forest/10 flex items-center justify-center mx-auto sm:mx-0 mb-3 text-brand-forest">
                <item.icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-brand-darkest">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 font-medium">{item.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}