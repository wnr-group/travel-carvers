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
  Loader2
} from 'lucide-react';

// Static fallback so the section still renders when the trust_badges table
// is empty or the query errors — mirrors the testimonials fallback pattern.
const FALLBACK_BADGES: TrustBadge[] = [
  { id: 'fb-1', text: '10,000+ Happy Travelers', icon: 'Smile', display_order: 1, created_at: '' },
  { id: 'fb-2', text: '50+ Destinations Worldwide', icon: 'Globe2', display_order: 2, created_at: '' },
  { id: 'fb-3', text: '15+ Years of Experience', icon: 'Award', display_order: 3, created_at: '' },
  { id: 'fb-4', text: '24/7 Customer Support', icon: 'Clock', display_order: 4, created_at: '' },
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
  Clock
};

function renderIcon(iconName: string, className?: string) {
  const IconComponent = ICON_MAP[iconName];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // Check if emoji
  if (iconName && iconName.length <= 2) {
    return <span className="text-3xl leading-none select-none">{iconName}</span>;
  }
  
  return <Award className={className} />;
}

function parseBadgeText(text: string) {
  const parts = text.split(' ');
  const firstWord = parts[0];
  
  // Match digits, plus sign, percentage sign, or standard time patterns like 24/7
  const hasNumber = /[\d+%]/g.test(firstWord) || firstWord.toLowerCase() === '24/7';
  
  if (hasNumber && parts.length > 1) {
    return {
      number: firstWord,
      description: parts.slice(1).join(' ')
    };
  }
  
  return {
    number: '',
    description: text
  };
}

export default function TrustBadges() {
  const { data: badges = [], isLoading } = usePublicTrustBadges();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep the DB data as the primary source; fall back to defaults when empty.
  const badgesToRender = badges.length > 0 ? badges : FALLBACK_BADGES;

  useEffect(() => {
    if (isLoading || badgesToRender.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, badgesToRender.length]);

  if (isLoading) {
    return (
      <section className="py-12 bg-white border-b border-[#A9B388]/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-dark" />
          <span className="ml-2 text-sm text-gray-500 font-medium">Loading trust badges...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-[#FEFAE0]/40 to-white border-b border-[#A9B388]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          ref={containerRef}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {badgesToRender.map((badge, i) => {
            const { number, description } = parseBadgeText(badge.text);
            return (
              <div 
                key={badge.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-4 p-3.5 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#A9B388]/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-dark/30 group text-center sm:text-left"
                style={{
                  transitionDelay: `${i * 100}ms`
                }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-brand-primary text-white flex items-center justify-center shadow-md shadow-brand-dark/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
                  {renderIcon(badge.icon, "w-5 h-5 sm:w-6 sm:h-6")}
                </div>
                <div className="flex-grow min-w-0 w-full">
                  {number ? (
                    <>
                      <div className="text-lg sm:text-2xl font-extrabold text-brand-darkest tracking-tight group-hover:text-brand-dark transition-colors truncate">
                        {number}
                      </div>
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5 leading-snug break-words">
                        {description}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs sm:text-sm font-bold text-brand-darkest group-hover:text-brand-dark transition-colors mt-1 leading-snug break-words">
                      {description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
