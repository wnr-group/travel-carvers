'use client';

import { useEffect, useRef, useState } from 'react';
import { usePublicTrustBadges, type TrustBadge } from '@/lib/hooks/useTrustBadges';
import {
  Shield,
  Award,
  Sparkles,
  Heart,
  Globe2,
  Smile,
  Compass,
  MapPin,
  Clock,
  Loader2,
} from 'lucide-react';

// The section is admin-driven but curated: numeric badges become animated stat
// cards, text-only badges become pills. Sensible caps keep the layout tidy no
// matter how many an admin adds.
const MAX_STAT_CARDS = 8;
const MAX_PILLS = 10;

// Static fallback so the section still renders when the trust_badges table is
// empty or the query errors. Mixes numeric (cards) and text-only (pills).
const FALLBACK_BADGES: TrustBadge[] = [
  { id: 'fb-1', text: '10,000+ Happy Travellers', icon: 'Smile', display_order: 1, created_at: '' },
  { id: 'fb-2', text: '50+ Destinations', icon: 'Globe2', display_order: 2, created_at: '' },
  { id: 'fb-3', text: '15+ Years Experience', icon: 'Award', display_order: 3, created_at: '' },
  { id: 'fb-4', text: '24/7 Support', icon: 'Clock', display_order: 4, created_at: '' },
  { id: 'fb-5', text: 'World Class', icon: '', display_order: 5, created_at: '' },
  { id: 'fb-6', text: 'Award Winning', icon: '', display_order: 6, created_at: '' },
  { id: 'fb-7', text: 'Best Price', icon: '', display_order: 7, created_at: '' },
  { id: 'fb-8', text: 'Secure Booking', icon: '', display_order: 8, created_at: '' },
  { id: 'fb-9', text: 'Expert Guides', icon: '', display_order: 9, created_at: '' },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Award,
  Sparkles,
  Heart,
  Globe2,
  Smile,
  Compass,
  MapPin,
  Clock,
};

function renderIcon(iconName: string, className?: string) {
  const IconComponent = ICON_MAP[iconName];
  if (IconComponent) return <IconComponent className={className} />;
  if (iconName && iconName.length <= 2) {
    return <span className="text-2xl leading-none select-none">{iconName}</span>;
  }
  return <Sparkles className={className} />;
}

/** Splits "10,000+ Happy Travellers" → { number: "10,000+", description: "Happy Travellers" }. */
function parseBadgeText(text: string) {
  const parts = text.split(' ');
  const firstWord = parts[0];
  const hasNumber = /[\d+%]/g.test(firstWord) || firstWord.toLowerCase() === '24/7';
  if (hasNumber && parts.length > 1) {
    return { number: firstWord, description: parts.slice(1).join(' ') };
  }
  return { number: '', description: text };
}

/** "10,000+" → { value: 10000, suffix: "+" } ; "24/7" → null (render as-is). */
function parseNumeric(numStr: string): { value: number; suffix: string } | null {
  const match = numStr.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  if (match[2].includes('/')) return null;
  const value = parseFloat(match[1].replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;
  return { value, suffix: match[2] };
}

/** Number that counts up from 0 once `active`, respecting reduced motion. */
function CountUp({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [display, setDisplay] = useState(0);
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reduce]);

  const current = reduce ? value : display;
  const isInt = Number.isInteger(value);
  const shown = isInt ? Math.round(current).toLocaleString('en-US') : current.toFixed(1);
  return (
    <>
      {shown}
      {suffix}
    </>
  );
}

type StatBadge = TrustBadge & { number: string; description: string; numeric: { value: number; suffix: string } | null };

export default function TrustBadges() {
  const { data: badges = [], isLoading } = usePublicTrustBadges();
  const [isVisible, setIsVisible] = useState(false);
  const [reduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const source = badges.length > 0 ? badges : FALLBACK_BADGES;

  // Numeric badges → stat cards; text-only badges → pills.
  const stats: StatBadge[] = [];
  const pills: TrustBadge[] = [];
  for (const badge of source) {
    const { number, description } = parseBadgeText(badge.text);
    if (number) {
      stats.push({ ...badge, number, description, numeric: parseNumeric(number) });
    } else {
      pills.push(badge);
    }
  }
  const statCards = stats.slice(0, MAX_STAT_CARDS);
  const pillItems = pills.slice(0, MAX_PILLS);

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-brand-dark" />
        <span className="ml-2 text-sm font-medium text-brand-darkest/50">Loading…</span>
      </div>
    );
  }

  if (statCards.length === 0 && pillItems.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {/* Numeric badges → animated stat cards */}
      {statCards.length > 0 && (
        <div className="flex flex-wrap justify-center gap-5">
          {statCards.map((stat, i) => (
            <div
              key={stat.id}
              style={reduce ? undefined : { animation: 'float 4s ease-in-out infinite', animationDelay: `${i * 0.25}s` }}
              className="group flex w-[calc(50%-0.625rem)] max-w-44 flex-col items-center rounded-2xl border border-brand-light/40 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-medium/50 hover:shadow-lg sm:w-40"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand-primary text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                {renderIcon(stat.icon, 'h-7 w-7')}
              </div>
              <h3 className="text-2xl font-bold text-brand-darkest tabular-nums md:text-3xl">
                {stat.numeric ? (
                  <CountUp value={stat.numeric.value} suffix={stat.numeric.suffix} active={isVisible} />
                ) : (
                  stat.number
                )}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-brand-darkest/50">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Text-only badges → pills */}
      {pillItems.length > 0 && (
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {pillItems.map((pill) => (
            <span
              key={pill.id}
              className="rounded-full border border-brand-light/50 bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-sm"
            >
              {pill.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
