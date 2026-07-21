
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
  CheckCircle,
} from 'lucide-react';

const MAX_STAT_CARDS = 4;
const MAX_PILLS = 6;

const FALLBACK_BADGES: TrustBadge[] = [
  { id: 'fb-1', text: '10,000+ Happy Travellers', icon: 'Smile', display_order: 1, created_at: '' },
  { id: 'fb-2', text: '50+ Destinations', icon: 'Globe2', display_order: 2, created_at: '' },
  { id: 'fb-3', text: '15+ Years Experience', icon: 'Award', display_order: 3, created_at: '' },
  { id: 'fb-4', text: '24/7 Support', icon: 'Clock', display_order: 4, created_at: '' },
  { id: 'fb-5', text: 'Best Price Guarantee', icon: '', display_order: 5, created_at: '' },
  { id: 'fb-6', text: 'Secure Booking', icon: '', display_order: 6, created_at: '' },
  { id: 'fb-7', text: 'Expert Local Guides', icon: '', display_order: 7, created_at: '' },
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
  return <Sparkles className={className} />;
}

function parseBadgeText(text: string) {
  const parts = text.split(' ');
  const firstWord = parts[0];
  const hasNumber = /[\d+%]/g.test(firstWord) || firstWord.toLowerCase() === '24/7';
  if (hasNumber && parts.length > 1) {
    return { number: firstWord, description: parts.slice(1).join(' ') };
  }
  return { number: '', description: text };
}

function parseNumeric(numStr: string): { value: number; suffix: string } | null {
  const match = numStr.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  if (match[2].includes('/')) return null;
  const value = parseFloat(match[1].replace(/,/g, ''));
  if (!Number.isFinite(value)) return null;
  return { value, suffix: match[2] };
}

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
  const containerRef = useRef<HTMLDivElement>(null);

  const source = badges.length > 0 ? badges : FALLBACK_BADGES;

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
        <Loader2 className="h-5 w-5 animate-spin text-brand-forest" />
        <span className="ml-2 text-sm font-medium text-brand-forest/50">Loading…</span>
      </div>
    );
  }

  if (statCards.length === 0 && pillItems.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >

      {/* Redesigned Stat Cards with Minimal Clean Icon Badges */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.id}
              className="group flex flex-col items-center rounded-2xl border border-brand-sage/30 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-forest/5 text-brand-forest transition-colors group-hover:bg-brand-forest group-hover:text-white">
                {renderIcon(stat.icon, 'h-6 w-6')}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-forest tabular-nums">
                {stat.numeric ? (
                  <CountUp value={stat.numeric.value} suffix={stat.numeric.suffix} active={isVisible} />
                ) : (
                  stat.number
                )}
              </h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Redesigned Text-only Badges (Pills) with Modern Check Indicators */}
      {pillItems.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {pillItems.map((pill) => (
            <div
              key={pill.id}
              className="inline-flex items-center gap-2 rounded-full border border-brand-forest/15 bg-white px-4 py-2 text-xs font-bold text-brand-forest shadow-sm hover:border-brand-forest transition-all"
            >
              <CheckCircle className="h-3.5 w-3.5 text-brand-sage" />
              <span>{pill.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

