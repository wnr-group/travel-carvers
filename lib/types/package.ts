export type PackageStatus = 'draft' | 'published' | 'archived'
export const PACKAGE_STATUSES: PackageStatus[] = ['draft', 'published', 'archived']

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
