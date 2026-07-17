'use client';

import React, { useState } from 'react';
import { Check, X, MapPin, Star, ChevronDown } from 'lucide-react';
import ReviewPhotos from '@/components/customer/ReviewPhotos';
import { ReviewForm } from '@/components/customer/ReviewForm';

interface Day {
  day_number: number;
  title: string;
  place_name?: string;
  altitude?: number;
  morning_activity?: string;
  afternoon_activity?: string;
  evening_activity?: string;
  description?: string;
}

interface PackageTabsProps {
  pkg: {
    id: string;
    title: string;
    short_description: string;
    full_description?: string;
    highlights?: string[];
    inclusions?: string[];
    exclusions?: string[];
    itinerary?: Day[];
    gallery?: { src: string; alt: string }[];
    pricing_tiers?: { label: string; sub: string; price: number }[];
    add_ons?: { label: string; price: number }[];
    faqs?: { q: string; a: string }[];
    reviews?: { name: string; rating: number; date: string; text: string; images?: string[] }[];
    best_time?: string;
  };
  onOpenLightbox: (index: number) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'info', label: 'Additional Info' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'reviews', label: 'Reviews' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function PackageTabs({ pkg, onOpenLightbox }: PackageTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  // Itinerary Skyline elevation details (helper if altitude is provided)
  const renderItinerarySkyline = () => {
    const itn = pkg.itinerary || [];
    const validAltitudes = itn.map((d) => d.altitude || 3500);
    if (validAltitudes.length < 2) return null;

    const minAlt = Math.min(...validAltitudes) - 400;
    const maxAlt = Math.max(...validAltitudes) + 300;
    const w = 800, h = 220, padX = 24, topPad = 26, bottomPad = 34;
    const usableH = h - topPad - bottomPad;
    const step = (w - padX * 2) / (itn.length - 1);
    
    const points = itn.map((d, i) => {
      const x = padX + i * step;
      const alt = d.altitude || 3500;
      const y = topPad + usableH - ((alt - minAlt) / (maxAlt - minAlt)) * usableH;
      return { x, y, alt, dayNum: d.day_number };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const fillPath = `${linePath} L${points[points.length - 1].x},${h - bottomPad + 10} L${points[0].x},${h - bottomPad + 10} Z`;

    return (
      <div className="mb-8 overflow-hidden rounded-2xl border border-brand-light/70 bg-gradient-to-b from-brand-lightest/40 to-white p-4 sm:p-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Elevation profile · metres above sea level</p>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skyline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B8E6B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6B8E6B" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#skyline-fill)" />
          <path d={linePath} fill="none" stroke="#2D5F2D" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5} fill="#FFFFFF" stroke="#1B4D1B" strokeWidth={2} />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-brand-darkest" fontSize="11" fontWeight={600}>
                {p.alt.toLocaleString()}m
              </text>
              <text x={p.x} y={h - bottomPad + 26} textAnchor="middle" className="fill-slate-400" fontSize="11">
                Day {p.dayNum}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Tab Selectors */}
      <div className="border-b border-brand-light/70 mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === t.id ? 'text-brand-darkest font-bold' : 'text-slate-500 hover:text-brand-dark'
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <span className="absolute inset-x-2 -bottom-[5px] h-0.5 rounded-full bg-brand-dark" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="mt-4">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-darkest mb-3">Overview</h2>
              <p className="leading-relaxed text-slate-600">{pkg.full_description || pkg.short_description}</p>
            </div>

            {pkg.highlights && pkg.highlights.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-semibold text-brand-darkest mb-4">Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand-dark">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-600">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pkg.best_time && (
              <div className="rounded-xl border border-brand-light/70 bg-brand-tint-subtle p-5">
                <h3 className="font-display text-base font-semibold text-brand-darkest">Best time to visit</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{pkg.best_time}</p>
              </div>
            )}
          </div>
        )}

        {/* ITINERARY */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-darkest mb-2">Itinerary</h2>
              <p className="text-slate-500 text-sm mb-6">See our detailed day-by-day routing elevation details.</p>
            </div>

            {renderItinerarySkyline()}

            <ol className="space-y-4">
              {pkg.itinerary?.map((d) => (
                <li key={d.day_number} className="flex gap-4 rounded-xl border border-brand-light/60 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-darkest font-mono text-sm font-semibold text-white">
                    {String(d.day_number).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-semibold text-brand-darkest">{d.title}</h3>
                      {d.place_name && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-lightest px-2 py-0.5 font-mono text-[11px] font-medium text-brand-dark">
                          <MapPin className="h-3 w-3" /> {d.place_name} {d.altitude ? `· ${d.altitude.toLocaleString()}m` : ''}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {d.description || [d.morning_activity, d.afternoon_activity, d.evening_activity].filter(Boolean).join('. ')}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* INCLUSIONS */}
        {activeTab === 'inclusions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="rounded-xl border border-brand-light/70 p-5 bg-white">
              <h3 className="mb-4 font-display text-lg font-semibold text-brand-darkest border-b border-brand-lightest pb-2">Included</h3>
              <ul className="space-y-2.5">
                {pkg.inclusions?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
              <h3 className="mb-4 font-display text-lg font-semibold text-slate-500 border-b border-slate-200 pb-2">Not included</h3>
              <ul className="space-y-2.5">
                {pkg.exclusions?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-500">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in duration-300">
            {pkg.gallery?.map((g, i) => (
              <button
                key={i}
                onClick={() => onOpenLightbox(i)}
                className={`group overflow-hidden rounded-xl bg-slate-100 cursor-pointer ${
                  i === 1 || i === 4 ? 'row-span-2' : ''
                }`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}

        {/* PRICING */}
        {activeTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="font-display text-2xl font-bold text-brand-darkest mb-4">Pricing Packages</h2>
            <div className="overflow-hidden rounded-xl border border-brand-light/70">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-tint-subtle text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Details</th>
                    <th className="px-5 py-3 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light/60">
                  {pkg.pricing_tiers?.map((t) => (
                    <tr key={t.label}>
                      <td className="px-5 py-4 font-medium text-brand-darkest">{t.label}</td>
                      <td className="px-5 py-4 text-slate-500">{t.sub}</td>
                      <td className="px-5 py-4 text-right font-mono font-semibold text-brand-darkest">
                        {money(t.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pkg.add_ons && pkg.add_ons.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Optional add-ons</h3>
                <div className="space-y-2.5">
                  {pkg.add_ons.map((a) => (
                    <div key={a.label} className="flex items-center justify-between rounded-lg border border-brand-light/60 px-4 py-3 text-sm bg-white">
                      <span className="text-slate-600">{a.label}</span>
                      <span className="font-mono font-medium text-brand-dark">+{money(a.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADDITIONAL INFO */}
        {activeTab === 'info' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Cancellation Policy</h3>
              <div className="overflow-hidden rounded-xl border border-brand-light/70 bg-white">
                <div className="flex items-center justify-between px-5 py-3.5 text-sm border-b border-brand-lightest">
                  <span className="text-slate-600">30+ days before departure</span>
                  <span className="font-mono font-medium text-brand-darkest">90% refund</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5 text-sm border-b border-brand-lightest bg-brand-tint-subtle">
                  <span className="text-slate-600">15–29 days before departure</span>
                  <span className="font-mono font-medium text-brand-darkest">50% refund</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5 text-sm border-b border-brand-lightest">
                  <span className="text-slate-600">7–14 days before departure</span>
                  <span className="font-mono font-medium text-brand-darkest">25% refund</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3.5 text-sm bg-brand-tint-subtle">
                  <span className="text-slate-600">Within 7 days</span>
                  <span className="font-mono font-medium text-brand-darkest">No refund</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Documents required</h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                  Government-issued photo ID (passport for foreign nationals)
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                  2 passport-size photographs, for Inner Line Permits
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
                  Valid travel insurance certificate
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h2 className="font-display text-2xl font-bold text-brand-darkest mb-4">Frequently Asked Questions</h2>
            <div className="divide-y divide-brand-light/60 rounded-xl border border-brand-light/70 bg-white">
              {pkg.faqs?.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-brand-darkest">{f.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-brand-medium transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 animate-in slide-in-from-top-1 duration-200">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row gap-6 rounded-xl border border-brand-light/70 p-5 sm:items-center sm:gap-10 bg-white">
              <div className="text-center sm:text-left">
                <p className="font-display text-4xl font-bold text-brand-darkest">4.8</p>
                <div className="mt-1 flex justify-center gap-0.5 text-amber-400 sm:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-400">{pkg.reviews?.length || 0} reviews</p>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-dark px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-darkest active:scale-95 cursor-pointer"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>
              <div className="flex-1 space-y-1.5">
                {[
                  { stars: 5, pct: 78 },
                  { stars: 4, pct: 15 },
                  { stars: 3, pct: 5 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map((r) => (
                  <div key={r.stars} className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="w-8 shrink-0">{r.stars} star</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-dark" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {showReviewForm && (
              <div className="animate-in fade-in duration-300">
                <ReviewForm
                  packageId={pkg.id}
                  onSuccess={() => setShowReviewForm(false)}
                />
              </div>
            )}

            <div className="space-y-4">
              {pkg.reviews?.map((r, i) => (
                <div key={i} className="rounded-xl border border-brand-light/60 p-5 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-brand-darkest">{r.name}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`h-3.5 w-3.5 fill-current ${idx < r.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.text}</p>
                  {r.images && r.images.length > 0 && (
                    <ReviewPhotos images={r.images} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
