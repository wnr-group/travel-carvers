import { META_DESCRIPTION_MAX, META_TITLE_MAX } from '@/lib/validations/package.schema'

export function truncate(text: string, max: number): string {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (clean.length <= max) return clean

  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')

  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()
}

/** What the meta title would be if the admin leaves it blank. */
export function suggestMetaTitle(packageTitle: string | undefined): string {
  return packageTitle ? truncate(packageTitle, META_TITLE_MAX) : ''
}

/**
 * What the meta description would be if the admin leaves it blank.
 */
export function suggestMetaDescription(shortDescription: string | undefined): string {
  return shortDescription ? truncate(shortDescription, META_DESCRIPTION_MAX) : ''
}

/** Split the comma-separated keywords field into the individual keywords. */
export function parseKeywords(keywords: string | undefined): string[] {
  if (!keywords) return []

  return keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}
