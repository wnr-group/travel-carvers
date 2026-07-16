'use client';

import { useEffect, useRef, useState } from 'react';
import { usePublicTrustBadges } from '@/lib/hooks/useTrustBadges';
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
  const { data: badges = [], isLoading, isError } = usePublicTrustBadges();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || badges.length === 0) return;
    
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
  }, [isLoading, badges.length]);

  if (isLoading) {
    return (
      <section className="py-12 bg-white border-b border-[#A9B388]/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#2D5F2D]" />
          <span className="ml-2 text-sm text-gray-500 font-medium">Loading trust badges...</span>
        </div>
      </section>
    );
  }

  if (isError || badges.length === 0) {
    return null; // Fallback silently
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-[#FEFAE0]/40 to-white border-b border-[#A9B388]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          ref={containerRef}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {badges.map((badge, i) => {
            const { number, description } = parseBadgeText(badge.text);
            return (
              <div 
                key={badge.id}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-4 p-3.5 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-[#A9B388]/20 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#2D5F2D]/30 group text-center sm:text-left"
                style={{
                  transitionDelay: `${i * 100}ms`
                }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#2D5F2D] to-[#5F7A5F] text-white flex items-center justify-center shadow-md shadow-[#2D5F2D]/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
                  {renderIcon(badge.icon, "w-5 h-5 sm:w-6 h-6")}
                </div>
                <div className="flex-grow min-w-0 w-full">
                  {number ? (
                    <>
                      <div className="text-lg sm:text-2xl font-extrabold text-[#1B4D1B] tracking-tight group-hover:text-[#2D5F2D] transition-colors truncate">
                        {number}
                      </div>
                      <div className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5 leading-snug break-words">
                        {description}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs sm:text-sm font-bold text-[#1B4D1B] group-hover:text-[#2D5F2D] transition-colors mt-1 leading-snug break-words">
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
