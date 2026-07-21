export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string | null;
  slug: string;
  hero_image_url: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
  currency: string | null;
  languages: string | null;
  is_featured: boolean;
  is_popular: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
  package_ids: string[];
  package_count: number;
}


export interface DestinationMapPin {
  id: string;
  name: string;
  slug: string;
  country: string;
  latitude: number;
  longitude: number;
  hero_image_url: string | null;
  package_count: number;
  timezone: string | null;
  currency: string | null;
  languages: string | null;
  description: string | null;
}

export interface DestinationSummary {
  id: string;
  name: string;
  country: string;
  city: string | null;
  slug: string;
  hero_image_url: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
  currency: string | null;
  languages: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  updated_at: string | null;
}
