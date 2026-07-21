export type PackageStatus = 'draft' | 'published' | 'archived' | 'sold_out'
export const PACKAGE_STATUSES: PackageStatus[] = ['draft', 'published', 'archived', 'sold_out']

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  sold_out: 'Sold Out',
}

export const PUBLIC_PACKAGE_STATUSES: PackageStatus[] = ['published', 'sold_out']

export type PackageDifficulty = 'easy' | 'moderate' | 'hard'
export const PACKAGE_DIFFICULTIES: PackageDifficulty[] = ['easy', 'moderate', 'hard']

export interface AdminPackage {
  id: string
  title: string
  slug: string
  short_description: string | null
  status: PackageStatus
  price_adult: number | null
  view_count: number
  created_at: string
  cover_image_url: string | null
  categories: PackageCategoryRef[]
}

export interface PackageCategoryRef {
  id: string
  name: string
}
