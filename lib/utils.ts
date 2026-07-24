import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ZodError } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Turn a display name into a URL-safe slug: "Group Tours & Cruises" -> "group-tours-cruises"
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Public URL of a package.
 */
export function packagePath(slug: string) {
  return `/packages/${slug}`
}

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
])

/**
    Check youtube url
 */
export function isYouTubeUrl(value: string) {
  try {
    const { hostname } = new URL(value.trim())
    return YOUTUBE_HOSTS.has(hostname.replace(/^www\./, ''))
  } catch {
    return false
  }
}

/**
 * Extract the video id from any recognised YouTube URL shape
 * (watch?v=, youtu.be/, /embed/, /shorts/). Returns null when none is found.
 */
export function youTubeId(value: string): string | null {
  try {
    const url = new URL(value.trim())
    if (!isYouTubeUrl(value)) return null
    if (url.hostname.replace(/^www\./, '') === 'youtu.be') return url.pathname.slice(1) || null
    const fromQuery = url.searchParams.get('v')
    if (fromQuery) return fromQuery
    const fromPath = url.pathname.match(/\/(?:embed|shorts|v)\/([^/?#]+)/)
    return fromPath ? fromPath[1] : null
  } catch {
    return null
  }
}

/**
 * Privacy-friendly (no-cookie) embed URL for a YouTube video, or null if the
 * URL isn't a YouTube link we can parse.
 */
export function youTubeEmbedUrl(value: string): string | null {
  const id = youTubeId(value)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

/**
 * Format a price for display. When there is no price , display as '-'
 */
export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a timestamp as a short, locale-aware date.
 */
export function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * ZodError into a single message suitable for an API response.
 */
export function firstZodIssue(error: ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Invalid request body'
  const path = issue.path.join('.')
  return path ? `${path}: ${issue.message}` : issue.message
}
