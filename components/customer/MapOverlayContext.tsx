'use client';

import { createContext, useContext, useMemo, useState } from 'react';

interface MapOverlayValue {
  isMapExpanded: boolean;
  setMapExpanded: (value: boolean) => void;
}

const MapOverlayContext = createContext<MapOverlayValue>({
  isMapExpanded: false,
  setMapExpanded: () => {},
});

export function MapOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isMapExpanded, setMapExpanded] = useState(false);

  const value = useMemo(() => ({ isMapExpanded, setMapExpanded }), [isMapExpanded]);

  return <MapOverlayContext.Provider value={value}>{children}</MapOverlayContext.Provider>;
}

export function useMapOverlay(): MapOverlayValue {
  return useContext(MapOverlayContext);
}
