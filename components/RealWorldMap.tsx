'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DestinationModal from '@/components/customer/DestinationModal';
import { getDestinationDetail, type DestinationDetail } from '@/lib/data/destinations';

interface RealWorldMapProps {
  isPreview?: boolean;
}

interface TouristLocation {
  name: string;
  region: string;
  lat: number;
  lng: number;
  isWonder?: boolean;
}

const locations: TouristLocation[] = [
  // Seven Wonders
  { name: 'Great Wall of China', region: 'China', lat: 40.4319, lng: 116.5704, isWonder: true },
  { name: 'Petra', region: 'Jordan', lat: 30.3285, lng: 35.4444, isWonder: true },
  { name: 'Christ the Redeemer', region: 'Brazil', lat: -22.9519, lng: -43.2105, isWonder: true },
  { name: 'Machu Picchu', region: 'Peru', lat: -13.1631, lng: -72.5450, isWonder: true },
  { name: 'Chichen Itza', region: 'Mexico', lat: 20.6843, lng: -88.5678, isWonder: true },
  { name: 'Colosseum', region: 'Rome', lat: 41.8902, lng: 12.4922, isWonder: true },
  { name: 'Taj Mahal', region: 'India', lat: 27.1751, lng: 78.0421, isWonder: true },

  // Europe
  { name: 'Paris', region: 'France', lat: 48.8584, lng: 2.2945 },
  { name: 'Barcelona', region: 'Spain', lat: 41.4036, lng: 2.1744 },
  { name: 'London', region: 'UK', lat: 51.5007, lng: -0.1246 },
  { name: 'Amsterdam', region: 'Netherlands', lat: 52.3752, lng: 4.8840 },
  { name: 'Prague', region: 'Czech Republic', lat: 50.0865, lng: 14.4114 },
  { name: 'Athens', region: 'Greece', lat: 37.9715, lng: 23.7267 },

  // Asia
  { name: 'Tokyo', region: 'Japan', lat: 35.6586, lng: 139.7454 },
  { name: 'Dubai', region: 'UAE', lat: 25.1972, lng: 55.2744 },
  { name: 'Bangkok', region: 'Thailand', lat: 13.7500, lng: 100.4917 },
  { name: 'Singapore', region: 'Singapore', lat: 1.2838, lng: 103.8607 },
  { name: 'Bali', region: 'Indonesia', lat: -8.5069, lng: 115.2625 },

  // India
  { name: 'Delhi', region: 'India', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur', region: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Mumbai', region: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Goa', region: 'India', lat: 15.2993, lng: 74.1240 },
  { name: 'Bangalore', region: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Kerala', region: 'India', lat: 10.8505, lng: 76.2711 },
  { name: 'Kolkata', region: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Varanasi', region: 'India', lat: 25.3176, lng: 82.9739 },
];

export default function RealWorldMap({ isPreview = false }: RealWorldMapProps = {}) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<TouristLocation | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TouristLocation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const autoPanRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const programmaticMoveRef = useRef(false);
  const [showInteractOverlay, setShowInteractOverlay] = useState(!isPreview);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with world view
    const map = L.map(mapContainerRef.current, {
      center: [20, 0], // World center
      zoom: 2,
      minZoom: 2,
      maxZoom: 15,
      worldCopyJump: true,
      zoomControl: true,
      scrollWheelZoom: true, // Enable scroll wheel zoom on map
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
    });

    mapRef.current = map;

    // Continuous auto-pan function
    const startAutoPan = () => {
      let currentIndex = 0;
      const tourPoints = [
        { lat: 30, lng: 95, zoom: 4 },   // Asia
        { lat: 48, lng: 15, zoom: 4 },   // Europe
        { lat: 25, lng: 55, zoom: 5 },   // Middle East
        { lat: 20, lng: 78, zoom: 4 },   // India
        { lat: 35, lng: 139, zoom: 5 },  // Japan
        { lat: 1, lng: 103, zoom: 5 },   // Singapore
        { lat: -8, lng: 115, zoom: 5 },  // Bali
        { lat: 13, lng: 100, zoom: 5 },  // Thailand
      ];

      // Start with first location immediately
      if (mapRef.current) {
        programmaticMoveRef.current = true;
        mapRef.current.flyTo([tourPoints[0].lat, tourPoints[0].lng], tourPoints[0].zoom, {
          duration: 2,
          easeLinearity: 0.25,
        });
        setTimeout(() => { programmaticMoveRef.current = false; }, 2500);
      }

      autoPanRef.current = setInterval(() => {
        if (!userInteractedRef.current && mapRef.current) {
          currentIndex = (currentIndex + 1) % tourPoints.length;
          const point = tourPoints[currentIndex];

          programmaticMoveRef.current = true;
          mapRef.current.flyTo([point.lat, point.lng], point.zoom, {
            duration: 2.5,
            easeLinearity: 0.2,
          });
          setTimeout(() => { programmaticMoveRef.current = false; }, 3000);
        }
      }, 5000); // Move to next point every 5 seconds
    };

    // Stop auto-pan on any user interaction (but ignore programmatic moves)
    const stopAutoPan = () => {
      if (programmaticMoveRef.current) {
        return;
      }
      userInteractedRef.current = true;
      setShowInteractOverlay(false);
      if (autoPanRef.current) {
        clearInterval(autoPanRef.current);
        autoPanRef.current = null;
      }
      map.off('drag', stopAutoPan);
      map.off('zoomstart', stopAutoPan);
      map.off('click', stopAutoPan);
    };

    // Attach event listeners immediately
    map.on('drag', stopAutoPan);
    map.on('zoomstart', stopAutoPan);
    map.on('click', stopAutoPan);

    // Start auto-tour after brief delay (let map render)
    const zoomTimeout = setTimeout(() => {
      if (!userInteractedRef.current) {
        startAutoPan();
      }
    }, 1500);

    // Land-only layer (ocean is transparent)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
      attribution: '©Esri',
      maxZoom: 16,
      className: 'land-only-layer',
    }).addTo(map);

    // Labels overlay - country names, capitals, and ocean names
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png', {
      attribution: '©CartoDB',
      maxZoom: 16,
      subdomains: 'abcd',
      opacity: 0.7,
    }).addTo(map);

    // Custom icon for regular locations - glowing brown
    const regularIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 14px;
        height: 14px;
        background: radial-gradient(circle, #D2691E 0%, #8B4513 70%);
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(210, 105, 30, 0.8), 0 0 25px rgba(210, 105, 30, 0.4);
        animation: pulse-marker 2s ease-in-out infinite;
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    // Custom icon for Seven Wonders - glowing gold
    const wonderIcon = L.divIcon({
      className: 'custom-marker-wonder',
      html: `<div style="
        width: 18px;
        height: 18px;
        background: radial-gradient(circle, #FFD700 0%, #FFA500 70%);
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 35px rgba(255, 165, 0, 0.6);
        position: relative;
        animation: pulse-wonder 2s ease-in-out infinite;
      ">
        <span style="position: absolute; top: -22px; left: -10px; font-size: 18px; filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.8));">⭐</span>
      </div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    // Add markers
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: location.isWonder ? wonderIcon : regularIcon,
        title: location.name,
      }).addTo(map);

      marker.on('click', () => {
        userInteractedRef.current = true;
        setShowInteractOverlay(false);
        if (autoPanRef.current) {
          clearInterval(autoPanRef.current);
          autoPanRef.current = null;
        }
        // Destinations with hardcoded details open the rich modal; the rest keep
        // the lightweight info card.
        const detail = getDestinationDetail(location.name);
        if (detail) {
          setSelectedDestination(detail);
        } else {
          setSelectedLocation(location);
        }
        map.flyTo([location.lat, location.lng], 6, {
          duration: 1.5,
        });
      });

      // Bind tooltip - permanent (always visible) with different styles
      marker.bindTooltip(location.name, {
        permanent: true,
        direction: 'top',
        className: location.isWonder ? 'custom-tooltip-wonder' : 'custom-tooltip',
        opacity: 1,
      });
    });

    return () => {
      clearTimeout(zoomTimeout);
      if (autoPanRef.current) {
        clearInterval(autoPanRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.region.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
    setShowResults(true);
  };

  // Handle location selection from search
  const handleSelectLocation = (location: TouristLocation) => {
    userInteractedRef.current = true;
    setShowInteractOverlay(false);
    if (autoPanRef.current) {
      clearInterval(autoPanRef.current);
      autoPanRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lng], 8, {
        duration: 2,
      });
      setSelectedLocation(location);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  // Handle manual interaction overlay click
  const handleInteractClick = () => {
    setShowInteractOverlay(false);
  };

  return (
    <div className="w-full h-full relative flex flex-col">
        {/* Search Bar - Hide in preview mode */}
        {!isPreview && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999] w-full max-w-md px-4">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              placeholder="Search destinations..."
              className="w-full px-5 py-3 pr-12 rounded-full border-2 border-[#A9B388] bg-white/98 backdrop-blur-md shadow-2xl focus:outline-none focus:ring-3 focus:ring-[#A9B388]/40 focus:border-[#5F6F52] transition-all duration-300 text-sm text-[#5F6F52] placeholder:text-[#A9B388]/70 font-semibold hover:shadow-xl"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-[#A9B388] to-[#5F6F52] rounded-full p-2 shadow-md group-hover:scale-110 transition-transform">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#A9B388]/30 max-h-72 overflow-y-auto">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(location)}
                  className="w-full px-5 py-3.5 text-left hover:bg-gradient-to-r hover:from-[#A9B388]/20 hover:to-[#B99470]/20 transition-all duration-200 border-b border-[#A9B388]/10 last:border-b-0 flex items-center justify-between group first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#A9B388] group-hover:scale-125 transition-transform"></div>
                    <div>
                      <p className="font-bold text-[#5F6F52] text-sm group-hover:text-[#5F6F52] transition-colors">
                        {location.name}
                        {location.isWonder && ' ⭐'}
                      </p>
                      <p className="text-xs text-[#A9B388] font-medium">{location.region}</p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-[#A9B388] group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-3 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#A9B388]/30 px-5 py-4">
              <p className="text-sm text-[#A9B388] text-center font-medium">No destinations found</p>
            </div>
          )}
        </div>
        )}

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #FEFAE0 0%, #FEFAE0 50%, #FEFAE0 100%)',
          }}
        />

        {/* Tap to Interact Overlay */}
        {showInteractOverlay && (
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${isPreview ? 'z-10' : 'z-[999]'}`}>
            <button
              onClick={handleInteractClick}
              className="bg-black/40 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl hover:bg-black/60 hover:scale-105 transition-all duration-300 border-2 border-white/40 animate-pulse-slow flex items-center gap-3"
            >
              <span className="text-2xl">👆</span>
              <span>Tap to Interact with Map</span>
            </button>
          </div>
        )}

        {/* Legend - Hide in preview mode */}
        {!isPreview && (
        <div className="absolute bottom-20 right-4 z-[1000] bg-gradient-to-br from-[#5F6F52]/98 to-[#5F6F52]/98 backdrop-blur-md px-5 py-4 rounded-2xl border-2 border-[#B99470]/60 shadow-2xl hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full border-2 border-white shadow-lg" style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)' }}></div>
              <span className="text-white font-bold">Seven Wonders ⭐</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-white shadow-lg" style={{ boxShadow: '0 0 12px rgba(210, 105, 30, 0.7)' }}></div>
              <span className="text-white font-semibold">Tourist Destinations</span>
            </div>
          </div>
        </div>
        )}

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#5F6F52] to-[#5F6F52] text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-[#B99470]/60 ${isPreview ? 'z-10' : 'z-[1000]'} max-w-md`}>
            <button
              onClick={() => setSelectedLocation(null)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-[#B99470] text-[#5F6F52] rounded-full flex items-center justify-center text-lg font-bold hover:bg-white transition-colors shadow-lg"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-[#B99470] mb-1">
              {selectedLocation.name}
              {selectedLocation.isWonder && ' ⭐'}
            </h2>
            <p className="text-white/90 text-sm mb-2">{selectedLocation.region}</p>
            <p className="text-white/70 text-xs font-mono">
              📍 {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
            </p>
          </div>
        )}

        {/* Rich destination modal (portaled to <body>) */}
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />

      <style jsx global>{`
        .leaflet-container {
          background: linear-gradient(135deg, #FEFAE0 0%, #FEFAE0 50%, #FEFAE0 100%) !important;
        }

        /* Apply vibrant color to landmass */
        .land-only-layer {
          filter: sepia(55%) saturate(85%) hue-rotate(65deg) brightness(105%) contrast(105%);
        }

        /* Ensure markers and tooltips are visible */
        .leaflet-marker-pane {
          z-index: 600 !important;
        }

        .leaflet-tooltip-pane {
          z-index: 650 !important;
        }

        .leaflet-popup-pane {
          z-index: 700 !important;
        }

        .leaflet-control {
          z-index: 800 !important;
        }
        .custom-tooltip {
          background: linear-gradient(135deg, rgba(48, 96, 41, 0.98) 0%, rgba(122, 148, 116, 0.98) 100%) !important;
          border: 2px solid #B99470 !important;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 11px;
          border-radius: 6px;
          padding: 4px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(174, 229, 185, 0.3);
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }
        .custom-tooltip::before {
          border-top-color: #B99470 !important;
        }
        .custom-tooltip-wonder {
          background: linear-gradient(135deg, rgba(255, 140, 0, 0.98) 0%, rgba(255, 215, 0, 0.98) 100%) !important;
          border: 2px solid #fff !important;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 12px;
          border-radius: 6px;
          padding: 4px 8px;
          box-shadow: 0 4px 12px rgba(255, 140, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.5);
          white-space: nowrap;
          backdrop-filter: blur(4px);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .custom-tooltip-wonder::before {
          border-top-color: #fff !important;
        }
        .leaflet-control-zoom {
          border: 2px solid #B99470 !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background-color: #5F6F52 !important;
          color: #B99470 !important;
          border: none !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #B99470 !important;
          color: #5F6F52 !important;
        }

        /* Marker pulse animations */
        @keyframes pulse-marker {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(210, 105, 30, 0.8), 0 0 25px rgba(210, 105, 30, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(210, 105, 30, 1), 0 0 35px rgba(210, 105, 30, 0.6);
          }
        }

        @keyframes pulse-wonder {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 35px rgba(255, 165, 0, 0.6);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 50px rgba(255, 165, 0, 0.8);
          }
        }

        /* Map fade-in on load */
        .leaflet-container {
          animation: mapFadeIn 1.5s ease-out;
        }

        @keyframes mapFadeIn {
          from {
            opacity: 0;
            filter: blur(5px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }

        /* Slow pulse animation for interact button */
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(140, 163, 132, 0.6);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(140, 163, 132, 0.9);
          }
        }
      `}</style>
    </div>
  );
}
