'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DestinationModal, {
  type DestinationModalData,
} from '@/components/customer/DestinationModal';
import { getPublishedPackagesByDestination } from '@/lib/api/public/destinations';
import { useDestinationMapPins } from '@/lib/hooks/useDestinations';
import { mapPackage } from '@/lib/packageList';
import type { DestinationMapPin } from '@/lib/types/destination';

const MODAL_PACKAGE_LIMIT = 2;
const MAX_TOUR_STOPS = 8;

const LAND_FILL = '#527A52';
const SEA_FILL = '#FFFFFF';

const PIN_FILL = 'var(--map-wonder)';
const PIN_EDGE = 'var(--map-wonder-deep)';

let worldGeoJsonPromise: Promise<unknown> | null = null;

function loadWorldGeoJson(): Promise<unknown> {
  if (!worldGeoJsonPromise) {
    worldGeoJsonPromise = fetch('/data/world-countries.geojson')
      .then((res) => res.json())
      .catch((error) => {
        // Don't cache a failure — let the next mount retry.
        worldGeoJsonPromise = null;
        throw error;
      });
  }
  return worldGeoJsonPromise;
}

interface RealWorldMapProps {
  isPreview?: boolean;
}

export default function RealWorldMap({ isPreview = false }: RealWorldMapProps = {}) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationModalData | null>(null);
  const [pinPackageTotal, setPinPackageTotal] = useState<number | undefined>(undefined);
  const [isLoadingPinPackages, setIsLoadingPinPackages] = useState(false);
  /** Slug of the most recently clicked pin, so a stale in-flight fetch can be ignored. */
  const openRequestRef = useRef<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const autoPanRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);
  const programmaticMoveRef = useRef(false);
  const [showInteractOverlay, setShowInteractOverlay] = useState(!isPreview);

  // Every pin on this map comes from the destinations table — there is no built-in list.
  const { data: pins, isLoading: isLoadingPins } = useDestinationMapPins();
  const destinationPins = useMemo(() => pins ?? [], [pins]);

  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];
    return destinationPins.filter(
      (pin) =>
        pin.name.toLowerCase().includes(term) || pin.country.toLowerCase().includes(term)
    );
  }, [destinationPins, searchQuery]);

  const openDestinationPin = useCallback((pin: DestinationMapPin) => {
    openRequestRef.current = pin.slug;
    setSelectedDestination({
      name: pin.name,
      slug: pin.slug,
      country: pin.country,
      timezone: pin.timezone,
      currency: pin.currency,
      languages: pin.languages,
      description: pin.description,
      packages: [],
    });
    setPinPackageTotal(pin.package_count);
    setIsLoadingPinPackages(true);

    getPublishedPackagesByDestination(pin.id)
      .then((rows) => {
        if (openRequestRef.current !== pin.slug) return;

        const packages = rows.map(mapPackage).slice(0, MODAL_PACKAGE_LIMIT);
        setSelectedDestination((current) =>
          current?.slug === pin.slug ? { ...current, packages } : current
        );
      })
      .catch(() => {
        // Degraded, not broken: the modal still shows the destination's own details.
      })
      .finally(() => {
        if (openRequestRef.current === pin.slug) setIsLoadingPinPackages(false);
      });
  }, []);

  /** Any deliberate interaction cancels the idle fly-through for good. */
  const stopAutoPan = useCallback(() => {
    userInteractedRef.current = true;
    setShowInteractOverlay(false);
    if (autoPanRef.current) {
      clearInterval(autoPanRef.current);
      autoPanRef.current = null;
    }
  }, []);

  // ---- Map instance: created once, independent of the data ----
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0], // World center
      zoom: 2,
      minZoom: 2,
      maxZoom: 15,
      worldCopyJump: true,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      preferCanvas: true,
    });

    mapRef.current = map;

    const handleInteraction = () => {
      if (programmaticMoveRef.current) return;
      stopAutoPan();
    };

    map.on('drag', handleInteraction);
    map.on('zoomstart', handleInteraction);
    map.on('click', handleInteraction);

    let cancelled = false;

    loadWorldGeoJson()
      .then((geo) => {
        if (cancelled || !mapRef.current) return;
        L.geoJSON(geo as never, {
          interactive: false,
          style: {
            fillColor: LAND_FILL,
            fillOpacity: 1,
            color: SEA_FILL,
            weight: 0.5,
            opacity: 0.6,
          },
        }).addTo(mapRef.current);
      })
      .catch(() => {
        /* land layer failed to load — sea (white background) still renders */
      });

    return () => {
      cancelled = true;
      if (autoPanRef.current) clearInterval(autoPanRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [stopAutoPan]);

  // ---- Markers: one per destination row ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || destinationPins.length === 0) return;

    const destinationIcon = L.divIcon({
      className: 'custom-marker-destination',
      html: `<div style="
        width: 16px;
        height: 16px;
        background: radial-gradient(circle, ${PIN_FILL} 0%, ${PIN_EDGE} 70%);
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 15px rgba(255, 215, 0, 0.85), 0 0 28px rgba(255, 165, 0, 0.5);
        animation: pulse-marker 2s ease-in-out infinite;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const layer = L.layerGroup().addTo(map);

    destinationPins.forEach((pin) => {
      const marker = L.marker([pin.latitude, pin.longitude], {
        icon: destinationIcon,
        title: pin.name,
      }).addTo(layer);

      marker.on('click', () => {
        stopAutoPan();
        openDestinationPin(pin);
        map.flyTo([pin.latitude, pin.longitude], 6, { duration: 1.5 });
      });

      marker.bindTooltip(pin.name, {
        permanent: true,
        direction: 'top',
        className: 'custom-tooltip',
        opacity: 1,
      });
    });

    return () => {
      layer.remove();
    };
  }, [destinationPins, openDestinationPin, stopAutoPan]);

  // ---- Idle fly-through, routed via the real destinations ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || destinationPins.length === 0 || userInteractedRef.current) return;

    const stops = destinationPins.slice(0, MAX_TOUR_STOPS);
    let index = 0;

    const flyTo = (stop: DestinationMapPin, duration: number) => {
      programmaticMoveRef.current = true;
      map.flyTo([stop.latitude, stop.longitude], 5, { duration, easeLinearity: 0.25 });
      setTimeout(() => {
        programmaticMoveRef.current = false;
      }, duration * 1000 + 500);
    };

    const startTimeout = setTimeout(() => {
      if (userInteractedRef.current) return;

      flyTo(stops[0], 2);

      autoPanRef.current = setInterval(() => {
        if (userInteractedRef.current) return;
        index = (index + 1) % stops.length;
        flyTo(stops[index], 2.5);
      }, 5000);
    }, 1500);

    return () => {
      clearTimeout(startTimeout);
      if (autoPanRef.current) {
        clearInterval(autoPanRef.current);
        autoPanRef.current = null;
      }
    };
  }, [destinationPins]);

  const handleSelectPin = (pin: DestinationMapPin) => {
    stopAutoPan();
    mapRef.current?.flyTo([pin.latitude, pin.longitude], 8, { duration: 2 });
    openDestinationPin(pin);
    setSearchQuery('');
    setShowResults(false);
  };

  const hasNoDestinations = !isLoadingPins && destinationPins.length === 0;

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Search Bar - Hide in preview mode */}
      {!isPreview && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999] w-full max-w-md px-4">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowResults(event.target.value.trim() !== '');
              }}
              onFocus={() => searchQuery && setShowResults(true)}
              placeholder="Search destinations..."
              aria-label="Search destinations"
              className="w-full px-5 py-3 pr-12 rounded-full border-2 border-brand-sage bg-white/98 backdrop-blur-md shadow-2xl focus:outline-none focus:ring-3 focus:ring-brand-sage/40 focus:border-brand-olive transition-all duration-300 text-sm text-brand-olive placeholder:text-brand-sage/70 font-semibold hover:shadow-xl"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-brand-sage to-brand-olive rounded-full p-2 shadow-md group-hover:scale-110 transition-transform">
              <svg
                aria-hidden="true"
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
            <div className="absolute top-full mt-3 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-brand-sage/30 max-h-72 overflow-y-auto">
              {searchResults.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => handleSelectPin(pin)}
                  className="w-full px-5 py-3.5 text-left hover:bg-gradient-to-r hover:from-brand-sage/20 hover:to-brand-clay/20 transition-all duration-200 border-b border-brand-sage/10 last:border-b-0 flex items-center justify-between group first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-sage group-hover:scale-125 transition-transform" />
                    <div>
                      <p className="font-bold text-brand-olive text-sm">{pin.name}</p>
                      <p className="text-xs text-brand-sage font-medium">
                        {pin.country}
                        {pin.package_count > 0 &&
                          ` · ${pin.package_count} package${pin.package_count === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-brand-sage group-hover:translate-x-1 transition-transform"
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
            <div className="absolute top-full mt-3 w-full bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-brand-sage/30 px-5 py-4">
              <p className="text-sm text-brand-sage text-center font-medium">
                No destinations found
              </p>
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{
          // Sea = app background (pure white) to match the site theme
          background: SEA_FILL,
        }}
      />

      {/* Nothing to pin yet — say so rather than showing a blank world. */}
      {hasNoDestinations && (
        <div className="absolute inset-x-0 top-1/2 z-[900] -translate-y-1/2 px-6 text-center">
          <div className="mx-auto max-w-sm rounded-2xl bg-white/95 px-6 py-5 shadow-2xl backdrop-blur-md border border-brand-sage/40">
            <p className="text-sm font-bold text-brand-forest">No destinations yet</p>
            <p className="mt-1 text-xs text-gray-600">
              Destinations added in the admin panel appear here automatically.
            </p>
          </div>
        </div>
      )}

      {/* Tap to Interact Overlay */}
      {showInteractOverlay && !hasNoDestinations && (
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
            isPreview ? 'z-10' : 'z-[999]'
          }`}
        >
          <button
            onClick={() => setShowInteractOverlay(false)}
            className="bg-black/40 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl hover:bg-black/60 hover:scale-105 transition-all duration-300 border-2 border-white/40 animate-pulse-slow flex items-center gap-3"
          >
            <span className="text-2xl">👆</span>
            <span>Tap to Interact with Map</span>
          </button>
        </div>
      )}

      {/* Legend - Hide in preview mode */}
      {!isPreview && destinationPins.length > 0 && (
        <div className="absolute bottom-20 right-4 z-[1000] bg-gradient-to-br from-brand-olive/98 to-brand-olive/98 backdrop-blur-md px-5 py-4 rounded-2xl border-2 border-brand-clay/60 shadow-2xl hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3 text-sm">
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-[var(--map-wonder)] to-[var(--map-wonder-deep)]"
              style={{ boxShadow: '0 0 12px rgba(255, 215, 0, 0.8)' }}
            />
            <span className="text-white font-semibold">
              {destinationPins.length} {destinationPins.length === 1 ? 'Destination' : 'Destinations'}
            </span>
          </div>
        </div>
      )}

      {/* Rich destination modal (portaled to <body>) */}
      <DestinationModal
        destination={selectedDestination}
        totalPackages={pinPackageTotal}
        isLoadingPackages={isLoadingPinPackages}
        onClose={() => {
          openRequestRef.current = null;
          setSelectedDestination(null);
          setPinPackageTotal(undefined);
          setIsLoadingPinPackages(false);
        }}
      />

      <style jsx global>{`
        .leaflet-container {
          /* Sea = app background (pure white) to match the site theme */
          background: #fff !important;
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
          border: 2px solid var(--brand-clay) !important;
          color: #fff !important;
          font-weight: 700;
          font-size: 11px;
          border-radius: 6px;
          padding: 4px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 20px rgba(174, 229, 185, 0.3);
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }
        .custom-tooltip::before {
          border-top-color: var(--brand-clay) !important;
        }
        .leaflet-control-zoom {
          border: 2px solid var(--brand-clay) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background-color: var(--brand-olive) !important;
          color: var(--brand-clay) !important;
          border: none !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: var(--brand-clay) !important;
          color: var(--brand-olive) !important;
        }

        /* Marker pulse animation */
        @keyframes pulse-marker {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.85), 0 0 28px rgba(255, 165, 0, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 22px rgba(255, 215, 0, 1), 0 0 38px rgba(255, 165, 0, 0.7);
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
          0%,
          100% {
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
