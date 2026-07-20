import type { PackageFormInput } from '@/lib/validations/package.schema'

export type Hotel = NonNullable<PackageFormInput['stay_details']>[number]

export const AMENITIES = [
  'WiFi',
  'Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Room Service',
  'Parking',
  'Airport Shuttle',
  'Beach Access',
  'AC',
  'TV',
] as const

export {
  MIN_HOTEL_RATING as MIN_RATING,
  MAX_HOTEL_RATING as MAX_RATING,
} from '@/lib/validations/package.schema'

export const DEFAULT_RATING = 3

export function createHotel(displayOrder: number): Hotel {
  return {
    hotel_name: '',
    location: '',
    room_type: '',
    rating: DEFAULT_RATING,
    amenities: [],
    check_in_date: '',
    check_out_date: '',
    display_order: displayOrder,
    image_url: undefined,
  }
}
