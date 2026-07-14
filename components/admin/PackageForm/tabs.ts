import type { ComponentType } from 'react'
import type { PackageFormInput } from '@/lib/validations/package.schema'
import AdditionalTab from './AdditionalTab'
import BasicInfoTab from './BasicInfoTab'
import CategoriesTab from './CategoriesTab'
import GalleryTab from './GalleryTab'
import InclusionsTab from './InclusionsTab'
import ItineraryTab from './ItineraryTab'
import PricingTab from './PricingTab'
import SEOTab from './SEOTab'
import StayTab from './StayTab'

export type PackageTabId =
  | 'basic'
  | 'pricing'
  | 'categories'
  | 'gallery'
  | 'itinerary'
  | 'inclusions'
  | 'stay'
  | 'additional'
  | 'seo'

export interface PackageFormTab {
  id: PackageTabId
  label: string
  fields: readonly (keyof PackageFormInput)[]
  Component?: ComponentType
}

export const PACKAGE_FORM_TABS: readonly PackageFormTab[] = [
  {
    id: 'basic',
    label: 'Basic Info',
    fields: [
      'title',
      'slug',
      'short_description',
      'full_description',
      'status',
      'is_featured',
      'is_trending',
      'is_new',
    ],
    Component: BasicInfoTab,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    fields: [
      'price_adult',
      'price_child',
      'price_infant',
      'show_price',
      'duration_days',
      'duration_nights',
      'difficulty_level',
      'group_size_min',
      'group_size_max',
      'age_restriction',
    ],
    Component: PricingTab,
  },
  {
    id: 'categories',
    label: 'Categories & Location',
    fields: [
      'category_ids',
      'subcategory_ids',
      'destination_name',
      'main_destination_lat',
      'main_destination_lng',
    ],
    Component: CategoriesTab,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    fields: ['gallery_images', 'video_urls'],
    Component: GalleryTab,
  },
  {
    id: 'itinerary',
    label: 'Itinerary',
    fields: ['itinerary_days'],
    Component: ItineraryTab,
  },
  {
    id: 'inclusions',
    label: 'Inclusions',
    fields: ['inclusions', 'exclusions'],
    Component: InclusionsTab,
  },
  {
    id: 'stay',
    label: 'Stay',
    fields: ['stay_details'],
    Component: StayTab,
  },
  {
    id: 'additional',
    label: 'Additional',
    fields: ['travel_tips', 'best_time_to_visit', 'places_to_visit'],
    Component: AdditionalTab,
  },
  {
    id: 'seo',
    label: 'SEO',
    fields: ['meta_title', 'meta_description', 'meta_keywords', 'og_image'],
    Component: SEOTab,
  },
]
