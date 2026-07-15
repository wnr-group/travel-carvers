import { FullPageLoader } from '@/components/shared';

/** Global route-transition fallback: the brand spinning-logo loader (no generic spinner). */
export default function Loading() {
  return <FullPageLoader message="Loading Travel Carvers…" />;
}
