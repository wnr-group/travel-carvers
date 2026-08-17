export const CACHE_TTL_MS = 35 * 1000;

const LOGO_SRC = '/logo.png';
const LOGO_PX = 128;

interface Entry {
  dataUrl: string;
  expiry: ReturnType<typeof setTimeout>;
}

const cache = new Map<string, Entry>();
const inFlight = new Map<string, Promise<string | null>>();

function remember(key: string, dataUrl: string): void {
  const existing = cache.get(key);
  if (existing) clearTimeout(existing.expiry);

  const expiry = setTimeout(() => {
    cache.delete(key);
  }, CACHE_TTL_MS);

  // Never hold a Node process open (harmless no-op in browsers).
  (expiry as unknown as { unref?: () => void }).unref?.();

  cache.set(key, { dataUrl, expiry });
}

interface LoadOptions {
  /** Longest edge, in pixels, after downscaling. */
  maxPx: number;
  /** JPEG for photos (far smaller), PNG where transparency matters. */
  format: 'image/jpeg' | 'image/png';
}

function decode(src: string, { maxPx, format }: LoadOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    // Required for remote (Supabase) images, or the canvas is tainted and
    // toDataURL throws when we try to read it back.
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      try {
        const scale = Math.min(1, maxPx / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          resolve(null);
          return;
        }

        // JPEG has no alpha, so flatten onto white rather than onto black.
        if (format === 'image/jpeg') {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, width, height);
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL(format, format === 'image/jpeg' ? 0.72 : undefined));
      } catch {
        // Tainted canvas or an unsupported format — not worth failing the PDF over.
        resolve(null);
      }
    };

    // A missing image must never block the document it decorates.
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function load(src: string, options: LoadOptions): Promise<string | null> {
  // No DOM (SSR, scripts, tests) — callers treat this as "no image".
  if (typeof document === 'undefined') return null;

  const key = `${src}|${options.maxPx}|${options.format}`;

  const cached = cache.get(key);
  if (cached) return cached.dataUrl;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const task = decode(src, options)
    .then((dataUrl) => {
      if (dataUrl) remember(key, dataUrl);
      return dataUrl;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, task);
  return task;
}

/** The brand mark, as a PNG data URL, or null when it cannot be read. */
export function getBrandLogoDataUrl(): Promise<string | null> {
  return load(LOGO_SRC, { maxPx: LOGO_PX, format: 'image/png' });
}

/** A package photo, as a JPEG data URL, or null when it cannot be read. */
export function getPdfImage(url: string, maxPx = 900): Promise<string | null> {
  return load(url, { maxPx, format: 'image/jpeg' });
}

/** Drops everything immediately. Exposed for tests and asset replacement. */
export function clearPdfAssetCache(): void {
  for (const entry of cache.values()) clearTimeout(entry.expiry);
  cache.clear();
}
