'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveDestinations, getDestinationMapPins } from '@/lib/api/public/destinations';

/**
 * Every active destination, for the footer and any other public listing.
 */
export function useDestinations() {
  return useQuery({
    queryKey: ['destinations', 'active'],
    queryFn: getActiveDestinations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Destinations with coordinates and package counts, for the world map.
 */
export function useDestinationMapPins() {
  return useQuery({
    queryKey: ['destinations', 'map-pins'],
    queryFn: getDestinationMapPins,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
