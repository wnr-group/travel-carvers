export interface Subcategory {
  id: string
  name: string
  slug: string
  display_order: number
  is_active: boolean
  category_ids: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image_url: string | null
  icon_name: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
