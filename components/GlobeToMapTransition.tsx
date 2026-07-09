'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AnimatedGlobe from '@/components/AnimatedGlobe';

const RealWorldMap = dynamic(() => import('@/components/RealWorldMap'), { ssr: false });

export default function GlobeToMapTransition() {
  const [stage, setStage] = useState<'globe' | 'transition' | 'map'>('globe');

  useEffect(() => {
    // Show globe for 3 seconds
    const timer1 = setTimeout(() => {
      setStage('transition');
    }, 3000);

    // Transition to map
    const timer2 = setTimeout(() => {
      setStage('map');
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Globe Stage */}
      {stage === 'globe' && (
        <div className="absolute inset-0 z-20">
          <AnimatedGlobe />
        </div>
      )}

      {/* Transition Stage */}
      {stage === 'transition' && (
        <div
          className="absolute inset-0 z-20"
          style={{
            animation: 'flattenGlobe 1.5s ease-in-out forwards',
          }}
        >
          <AnimatedGlobe />
        </div>
      )}

      {/* Map Stage */}
      {(stage === 'map' || stage === 'transition') && (
        <div
          className={`absolute inset-0 z-10 ${
            stage === 'map' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <RealWorldMap />
        </div>
      )}

      <style jsx global>{`
        @keyframes spinGlobe {
          0% {
            transform: rotateY(0deg) scale(1);
          }
          100% {
            transform: rotateY(360deg) scale(1);
          }
        }

        @keyframes flattenGlobe {
          0% {
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: perspective(1000px) rotateX(90deg) rotateY(0deg) scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: perspective(1000px) rotateX(180deg) rotateY(0deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
