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
 * Format a price for display. Returns a dash when there is no price, so the table and the
 * cards render the same placeholder for a package that has none.
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
