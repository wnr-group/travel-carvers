'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowRight, Compass, LocateFixed, Maximize2, Minus, Plus } from 'lucide-react';
import DestinationModal, {
  type DestinationModalData,
} from '@/components/customer/DestinationModal';
import { getPublishedPackagesByDestination } from '@/lib/api/public/destinations';
import { useDestinationMapPins } from '@/lib/hooks/useDestinations';
import { mapPackage } from '@/lib/packageList';
import type { DestinationMapPin } from '@/lib/types/destination';

const MODAL_PACKAGE_LIMIT = 2;

/**
 * Idle showreel: the map zooms through these regions in order, on a loop, until the
 * visitor touches it. Bounds are [[south, west], [north, east]].
 */
const REGION_TOUR: { name: string; bounds: L.LatLngBoundsLiteral }[] = [
  { name: 'Asia', bounds: [[-10, 35], [55, 145]] },
  { name: 'Europe', bounds: [[35, -10], [66, 40]] },
  { name: 'North America', bounds: [[10, -130], [62, -58]] },
  { name: 'South America', bounds: [[-55, -82], [13, -34]] },
];

/** Seconds the camera spends flying into a region, then milliseconds it lingers there. */
const REGION_FLY_SECONDS = 2.2;
const REGION_HOLD_MS = 2600;

/**
 * Chart-style palette: pale land on a paper-white sea, so the photo chips and pins
 * are the only saturated things on the canvas.
 *
 * Literals rather than `var(--…)` tokens: these values are interpolated into
 * Leaflet marker HTML and layer style options, neither of which resolves CSS
 * custom properties.
 */
const LAND_FILL = '#6B8E6B';
/** Country borders as hairlines of sea, the way an atlas separates landmasses. */
const LAND_EDGE = '#FFFFFF';
const SEA_FILL = '#FFFFFF';

/** Olive pin, kept legible on mid-green land by its white outline and light core. */
const PIN_FILL = '#5F6F52';
const PIN_CORE = '#FFFFFF';
const ROUTE_COLOR = '#5F6F52';

/** What the recentre control returns to. */
const WORLD_BOUNDS: L.LatLngBoundsLiteral = [[-50, -160], [70, 170]];


/** Pin markers carry admin-authored names — never interpolate those raw into HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * A gently bowed line between two pins. Leaflet polylines are straight, so the
 * curve is a quadratic bezier sampled into points, bent perpendicular to the chord.
 */
function arcBetween(
  from: L.LatLngTuple,
  to: L.LatLngTuple,
  bend = 0.2,
  steps = 48
): L.LatLngTuple[] {
  const [y1, x1] = from;
  const [y2, x2] = to;
  const midY = (y1 + y2) / 2;
  const midX = (x1 + x2) / 2;
  // Perpendicular to the chord, scaled by its length.
  const controlY = midY - (x2 - x1) * bend;
  const controlX = midX + (y2 - y1) * bend;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const inv = 1 - t;
    return [
      inv * inv * y1 + 2 * inv * t * controlY + t * t * y2,
      inv * inv * x1 + 2 * inv * t * controlX + t * t * x2,
    ] as L.LatLngTuple;
  });
}

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
  /** Renders the expand control when provided. */
  onExpand?: () => void;
}

export default function RealWorldMap({ isPreview = false, onExpand }: RealWorldMapProps = {}) {
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
  /** True once the land layer is on the map, so the tour never flies over blank sea. */
  const [isLandReady, setIsLandReady] = useState(false);

  // Every pin on this map comes from the destinations table — there is no built-in list.
  const { data: pins, isLoading: isLoadingPins } = useDestinationMapPins();
  const allPins = useMemo(() => pins ?? [], [pins]);

  /** Chained west→east so the flight routes read as one itinerary. */
  const destinationPins = useMemo(
    () => [...allPins].sort((a, b) => a.longitude - b.longitude),
    [allPins]
  );

  // Search spans every destination, not just the ones the active filter shows.
  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];
    return allPins.filter(
      (pin) =>
        pin.name.toLowerCase().includes(term) || pin.country.toLowerCase().includes(term)
    );
  }, [allPins, searchQuery]);

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

  /** Any deliberate interaction cancels the idle region showreel for good. */
  const stopAutoPan = useCallback(() => {
    userInteractedRef.current = true;
    setShowInteractOverlay(false);
    if (autoPanRef.current) {
      clearTimeout(autoPanRef.current);
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
      // Leaflet's own control is replaced by the styled buttons in the overlay.
      zoomControl: false,
      // No tile provider here — the land is our own GeoJSON — so there is no
      // upstream attribution to carry, and the "Leaflet" tag is just chrome.
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      /**
       * SVG, not canvas. Leaflet animates a zoom by CSS-transforming the renderer
       * rather than redrawing each frame: a canvas is a bitmap, so it scales up
       * blurry and only sharpens on `zoomend` — which is exactly the "continents
       * load slowly" lag during the auto-zoom tour. SVG paths are vectors, so the
       * browser re-rasterises them crisply throughout the flight.
       *
       * Affordable here because the land is only ~10.7k points over 293 rings;
       * canvas would win if this map drew thousands of features.
       */
      preferCanvas: false,
      // Render half a viewport beyond the edges so panning doesn't trigger a redraw.
      renderer: L.svg({ padding: 0.5 }),
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
            color: LAND_EDGE,
            weight: 0.6,
            opacity: 0.55,
          },
        }).addTo(mapRef.current);

        // Gates the tour: flying before the land is drawn shows an empty sea.
        setIsLandReady(true);
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

    const pinSvg = `<svg width="26" height="34" viewBox="0 0 24 32" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.37 18.63 0 12 0z"
              fill="${PIN_FILL}" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12" cy="12" r="4.4" fill="${PIN_CORE}"/>
      </svg>`;

    const layer = L.layerGroup().addTo(map);

    // Dashed itinerary between consecutive pins, with a plane riding each leg.
    for (let i = 0; i < destinationPins.length - 1; i += 1) {
      const from = destinationPins[i];
      const to = destinationPins[i + 1];
      const points = arcBetween(
        [from.latitude, from.longitude],
        [to.latitude, to.longitude]
      );

      L.polyline(points, {
        color: ROUTE_COLOR,
        weight: 1.6,
        opacity: 0.5,
        dashArray: '1 7',
        interactive: false,
      }).addTo(layer);

      // Rotate the plane along the tangent at the apex of the arc.
      const mid = Math.floor(points.length / 2);
      const [aY, aX] = points[mid - 1];
      const [bY, bX] = points[mid + 1];
      const heading = (Math.atan2(bY - aY, bX - aX) * 180) / Math.PI;

      L.marker(points[mid], {
        interactive: false,
        icon: L.divIcon({
          className: 'tc-route-plane',
          html: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="${ROUTE_COLOR}" stroke-width="1.6" stroke-linecap="round"
              stroke-linejoin="round" style="transform: rotate(${-heading}deg)">
              <path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l4.2 4.2-2.5 2.5-2-.4a.5.5 0 0 0-.5.8l2.4 2.4 2.4 2.4a.5.5 0 0 0 .8-.5l-.4-2 2.5-2.5 4.2 4.2a.5.5 0 0 0 .8-.5z"/>
            </svg>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
      }).addTo(layer);
    }

    destinationPins.forEach((pin) => {
      // Thumbnail + name, no package count — the count lives in the modal, and
      // every extra line of text is another neighbour buried at world zoom.
      const thumb = pin.hero_image_url
        ? `<span class="tc-chip-photo" style="background-image:url('${escapeHtml(pin.hero_image_url)}')"></span>`
        : `<span class="tc-chip-photo tc-chip-photo-empty">${escapeHtml(pin.name.charAt(0))}</span>`;

      // Pin and label are one marker, with the label pinned beside the pin head —
      // level with the point rather than floating above or below it. Being part of
      // the icon also means it can never drift out of step with its pin.
      const marker = L.marker([pin.latitude, pin.longitude], {
        title: pin.name,
        icon: L.divIcon({
          className: 'tc-pin',
          html: `<span class="tc-pin-glow"></span>${pinSvg}
            <span class="tc-chip">${thumb}<span class="tc-chip-name">${escapeHtml(pin.name)}</span></span>`,
          iconSize: [26, 34],
          // Anchor at the tip, so the pin points at the real coordinate.
          iconAnchor: [13, 34],
        }),
      }).addTo(layer);

      marker.on('click', () => {
        stopAutoPan();
        openDestinationPin(pin);
        map.flyTo([pin.latitude, pin.longitude], 6, { duration: 1.5 });
      });
    });

    return () => {
      layer.remove();
    };
  }, [destinationPins, openDestinationPin, stopAutoPan]);

  // ---- Idle showreel: Asia → Europe → North America → South America, on a loop ----
  useEffect(() => {
    const map = mapRef.current;
    // Wait for the land: a fixed timer used to start the flight while the GeoJSON
    // was still in flight, so the first region was framed over an empty sea.
    if (!map || !isLandReady || userInteractedRef.current) return;

    let index = 0;
    let resetMoveFlag: NodeJS.Timeout | null = null;

    const zoomTo = (region: (typeof REGION_TOUR)[number]) => {
      // Leaflet fires zoomstart/drag for its own animation too — flag it so the
      // showreel doesn't read its own camera work as a visitor touching the map.
      programmaticMoveRef.current = true;

      map.flyToBounds(region.bounds, {
        duration: REGION_FLY_SECONDS,
        easeLinearity: 0.25,
        padding: [24, 24],
      });

      if (resetMoveFlag) clearTimeout(resetMoveFlag);
      resetMoveFlag = setTimeout(() => {
        programmaticMoveRef.current = false;
      }, REGION_FLY_SECONDS * 1000 + 500);
    };

    const step = () => {
      if (userInteractedRef.current) return;
      zoomTo(REGION_TOUR[index]);
      index = (index + 1) % REGION_TOUR.length;
      autoPanRef.current = setTimeout(step, REGION_FLY_SECONDS * 1000 + REGION_HOLD_MS);
    };

    // The land is already drawn by now; this is just a beat before departure.
    autoPanRef.current = setTimeout(step, 900);

    return () => {
      if (autoPanRef.current) {
        clearTimeout(autoPanRef.current);
        autoPanRef.current = null;
      }
      if (resetMoveFlag) clearTimeout(resetMoveFlag);
    };
  }, [isLandReady]);

  const handleSelectPin = (pin: DestinationMapPin) => {
    stopAutoPan();
    mapRef.current?.flyTo([pin.latitude, pin.longitude], 8, { duration: 2 });
    openDestinationPin(pin);
    setSearchQuery('');
    setShowResults(false);
  };

  const zoomBy = (delta: number) => {
    stopAutoPan();
    const map = mapRef.current;
    if (map) map.setZoom(map.getZoom() + delta);
  };

  const recenter = () => {
    stopAutoPan();
    mapRef.current?.flyToBounds(WORLD_BOUNDS, { duration: 1.2, padding: [40, 40] });
  };

  const hasNoDestinations = !isLoadingPins && allPins.length === 0;

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* Search Bar - Hide in preview mode */}
      {!isPreview && (
        // Extra right padding on mobile keeps the field clear of the close button,
        // which shares this row on a narrow screen.
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[999] w-full max-w-md pl-4 pr-20 sm:pr-4">
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

      {/* Zoom / recenter / expand, replacing Leaflet's default control. In the
          expanded view the search field spans the width on mobile, so the stack
          drops below it rather than hiding underneath. */}
      <div
        className={`absolute left-4 z-[900] flex flex-col gap-2 ${
          isPreview ? 'top-4' : 'top-20'
        }`}
      >
        <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-brand-forest/10">
          <button
            type="button"
            onClick={() => zoomBy(1)}
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center text-brand-forest transition-colors hover:bg-brand-mist cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
          <div className="mx-2 h-px bg-brand-forest/10" />
          <button
            type="button"
            onClick={() => zoomBy(-1)}
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center text-brand-forest transition-colors hover:bg-brand-mist cursor-pointer"
          >
            <Minus className="h-4.5 w-4.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={recenter}
          aria-label="Recentre the map"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-forest shadow-lg ring-1 ring-brand-forest/10 transition-colors hover:bg-brand-mist cursor-pointer"
        >
          <LocateFixed className="h-4.5 w-4.5" />
        </button>

        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            aria-label="Open the full-screen map"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-forest shadow-lg ring-1 ring-brand-forest/10 transition-colors hover:bg-brand-mist cursor-pointer"
          >
            <Maximize2 className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Live count, top right of the card preview only. The expanded view gives
          that corner to the search field and the close button. */}
      {!hasNoDestinations && isPreview && (
        <div className="absolute right-4 top-4 z-[900] max-w-[45vw] rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg ring-1 ring-brand-forest/10 backdrop-blur-sm">
          <span className="flex items-center gap-2 text-xs font-bold text-brand-forest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live Atlas
          </span>
          <p className="mt-0.5 text-[11px] font-semibold text-gray-500">
            {allPins.length}+ Destinations
          </p>
        </div>
      )}

      {/* How-to card, bottom left. */}
      {!hasNoDestinations && (
        <div className="absolute bottom-4 left-4 z-[900] hidden max-w-[15rem] rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-brand-forest/10 backdrop-blur-sm sm:block">
          <div className="flex items-start gap-3">
            <Compass className="mt-0.5 h-6 w-6 shrink-0 text-brand-forest" />
            <div>
              <p className="text-sm font-bold text-brand-forest">Discover Amazing Places</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                Click any destination marker to explore its best travel packages.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Destination index link, bottom right. */}
      <Link
        href="/destinations"
        className="absolute bottom-4 right-4 z-[900] inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-brand-forest shadow-lg ring-1 ring-brand-forest/10 transition-all hover:gap-3 hover:bg-brand-mist"
      >
        View All Destinations
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>

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

        /* Belt and braces with attributionControl:false — also covers the badge
           Leaflet re-adds if a layer ever declares its own attribution. */
        .leaflet-control-attribution {
          display: none !important;
        }
        /* Destination label, riding beside its own pin head. */
        .tc-chip {
          position: absolute;
          left: 30px;
          top: 12px;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 3px 11px 3px 3px;
          border-radius: 999px;
          background: #fff;
          border: 1px solid rgba(26, 60, 52, 0.1);
          box-shadow: 0 4px 12px rgba(26, 60, 52, 0.14);
          white-space: nowrap;
        }

        .tc-chip-photo {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(45, 95, 45, 0.15);
        }

        .tc-chip-photo-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--brand-forest);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
        }

        .tc-chip-name {
          font-size: 11.5px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--brand-forest);
        }

        /* Phones show the same labels, just tighter — the photo and name stay. */
        @media (max-width: 639px) {
          .tc-chip {
            gap: 5px;
            padding: 2px 8px 2px 2px;
          }

          .tc-chip-photo {
            width: 20px;
            height: 20px;
          }

          .tc-chip-name {
            font-size: 10px;
          }

          .tc-chip-photo-empty {
            font-size: 10px;
          }
        }

        /* Pin sits over a soft halo so it reads against the land fill. The icon box
           is only the pin; the label overflows it and must stay visible. */
        .tc-pin {
          filter: drop-shadow(0 4px 6px rgba(26, 60, 52, 0.35));
          overflow: visible;
        }

        .tc-pin-glow {
          position: absolute;
          left: 50%;
          bottom: -6px;
          width: 26px;
          height: 10px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(45, 95, 45, 0.28), transparent 70%);
        }

        .tc-route-plane {
          opacity: 0.75;
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
