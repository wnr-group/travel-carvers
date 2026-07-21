'use client';

import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface TouristLocation {
  name: string;
  region: string;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
  isWonder?: boolean;
}

const locations: TouristLocation[] = [
  // Seven Wonders
  { name: 'Great Wall of China', region: 'China', x: 75, y: 35, isWonder: true },
  { name: 'Petra', region: 'Jordan', x: 60, y: 45, isWonder: true },
  { name: 'Christ the Redeemer', region: 'Brazil', x: 30, y: 70, isWonder: true },
  { name: 'Machu Picchu', region: 'Peru', x: 25, y: 65, isWonder: true },
  { name: 'Chichen Itza', region: 'Mexico', x: 18, y: 48, isWonder: true },
  { name: 'Colosseum', region: 'Rome', x: 52, y: 38, isWonder: true },
  { name: 'Taj Mahal', region: 'India', x: 70, y: 48, isWonder: true },

  // Europe
  { name: 'Paris', region: 'France', x: 50, y: 35 },
  { name: 'Barcelona', region: 'Spain', x: 49, y: 38 },
  { name: 'London', region: 'UK', x: 49, y: 33 },
  { name: 'Amsterdam', region: 'Netherlands', x: 51, y: 33 },
  { name: 'Prague', region: 'Czech Republic', x: 53, y: 35 },
  { name: 'Athens', region: 'Greece', x: 55, y: 40 },

  // Asia
  { name: 'Tokyo', region: 'Japan', x: 82, y: 40 },
  { name: 'Dubai', region: 'UAE', x: 62, y: 48 },
  { name: 'Bangkok', region: 'Thailand', x: 74, y: 52 },
  { name: 'Singapore', region: 'Singapore', x: 76, y: 55 },
  { name: 'Bali', region: 'Indonesia', x: 78, y: 58 },

  // India
  { name: 'Delhi', region: 'India', x: 70, y: 46 },
  { name: 'Jaipur', region: 'India', x: 69, y: 47 },
  { name: 'Mumbai', region: 'India', x: 68, y: 50 },
  { name: 'Goa', region: 'India', x: 68, y: 52 },
  { name: 'Bangalore', region: 'India', x: 69, y: 53 },
  { name: 'Kerala', region: 'India', x: 69, y: 55 },
  { name: 'Kolkata', region: 'India', x: 72, y: 50 },
  { name: 'Varanasi', region: 'India', x: 71, y: 48 },
];

export default function WorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<TouristLocation | null>(null);

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col">
      {/* Header with Logo */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-brand-olive to-transparent py-6 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-4xl font-black italic bg-gradient-to-r from-brand-clay to-white bg-clip-text text-transparent tracking-tight leading-none">
              Travel
            </h2>
            <div className="flex items-center gap-2 -mt-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-brand-clay to-transparent"></div>
              <h3 className="text-2xl md:text-3xl font-light text-white tracking-[0.2em] uppercase">
                CARVERS
              </h3>
            </div>
          </div>

          {/* Tagline */}
          <h1 className="hidden md:block text-2xl font-semibold text-white">
            Discover Your Next Adventure
          </h1>
        </div>
      </div>

      {/* Mobile Tagline */}
      <div className="md:hidden absolute top-24 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-xl font-semibold text-white text-center px-4">
          Discover Your Next Adventure
        </h1>
      </div>

      {/* Map Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pt-32 md:pt-24 pb-24">
        <div className="relative w-full max-w-6xl aspect-[2/1] bg-gradient-to-br from-brand-olive to-brand-olive rounded-2xl shadow-2xl border-4 border-brand-clay/30 overflow-hidden">
          {/* Map Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23aee5b9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* World Map SVG Outline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            {/* Simplified world map continents */}
            <g fill="#B99470" fillOpacity="0.3" stroke="#B99470" strokeWidth="2">
              {/* North America */}
              <path d="M 100 150 Q 120 100 180 120 L 220 140 L 200 200 L 150 220 L 100 200 Z" />

              {/* South America */}
              <path d="M 180 300 L 220 280 L 240 320 L 230 380 L 200 400 L 180 350 Z" />

              {/* Europe */}
              <path d="M 480 150 L 520 140 L 540 160 L 520 180 L 480 170 Z" />

              {/* Africa */}
              <path d="M 500 220 L 540 220 L 560 280 L 540 340 L 500 340 L 480 280 Z" />

              {/* Asia */}
              <path d="M 620 120 L 780 100 L 820 140 L 800 200 L 740 220 L 680 180 L 620 160 Z" />

              {/* Australia */}
              <path d="M 760 340 L 820 340 L 840 380 L 800 400 L 760 380 Z" />
            </g>
          </svg>

          {/* Location Markers */}
          {locations.map((location, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
              }}
              onMouseEnter={() => setHoveredLocation(location)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => setSelectedLocation(location)}
            >
              {/* Marker Dot */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  location.isWonder
                    ? 'bg-yellow-400 ring-4 ring-yellow-400/50 shadow-lg shadow-yellow-400/50'
                    : 'bg-brand-clay ring-2 ring-brand-clay/50'
                } ${hoveredLocation === location || selectedLocation === location ? 'scale-150' : 'scale-100'} group-hover:scale-150`}
              >
                {location.isWonder && (
                  <div className="absolute -top-1 -right-1 text-yellow-400 text-xs">⭐</div>
                )}
              </div>

              {/* Location Label */}
              <div
                className={`absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-200 ${
                  hoveredLocation === location || selectedLocation === location
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <div className="bg-brand-olive text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg border border-brand-clay/30">
                  {location.name}
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-brand-olive/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-brand-clay/30">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-white">Seven Wonders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-clay rounded-full"></div>
                <span className="text-white">Tourist Spots</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-olive to-brand-olive text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-brand-clay/50 z-20 animate-slide-up">
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-brand-clay text-brand-olive rounded-full flex items-center justify-center text-sm font-bold hover:bg-white transition-colors"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-brand-clay">
            {selectedLocation.name}
            {selectedLocation.isWonder && ' ⭐'}
          </h2>
          <p className="text-white/80 mt-1">{selectedLocation.region}</p>
        </div>
      )}

      {/* Bottom Tagline */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
        <p className="text-lg text-white/90 font-medium drop-shadow-lg">
          Explore destinations around the world
        </p>
      </div>
    </div>
  );
}
