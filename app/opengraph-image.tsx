import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/seo';

/**
 * Default social card, generated rather than served from a file.
 *
 * The previous `/images/og-default.jpg` was not an image at all — it was an Apache
 * "Object not found!" HTML error page saved with a .jpg extension, so every share
 * preview on the site was broken. Generating it here means the card cannot silently rot
 * again, and needs no design asset checked into the repo.
 *
 * Replace this with real brand artwork by dropping an `opengraph-image.jpg` into the
 * same folder — the file convention takes precedence over this route.
 */
export const alt = `${SITE.name} — ${SITE.defaultTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand tokens, duplicated as literals: this renders in an isolated image runtime with
// no access to the stylesheet's CSS custom properties.
const FOREST = '#2D5F2D';
const FOREST_DARK = '#1B4D1B';
const ACCENT = '#FACC15';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: `linear-gradient(135deg, ${FOREST_DARK} 0%, ${FOREST} 100%)`,
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          <div style={{ width: 48, height: 6, background: ACCENT, borderRadius: 3 }} />
          {SITE.name}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Explore Your Next Adventure
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 880,
          }}
        >
          Handcrafted domestic &amp; international tour packages.
        </div>
      </div>
    ),
    size,
  );
}
