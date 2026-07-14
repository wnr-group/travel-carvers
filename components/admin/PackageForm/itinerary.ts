import type { PackageFormInput } from '@/lib/validations/package.schema'

export type ItineraryDay = NonNullable<PackageFormInput['itinerary_days']>[number]

export const MAX_DAY_IMAGES = 5

export const ACTIVITIES = [
  { name: 'morning_activity', label: 'Morning' },
  { name: 'afternoon_activity', label: 'Afternoon' },
  { name: 'evening_activity', label: 'Evening' },
] as const

export const MEALS = [
  { name: 'breakfast', label: 'Breakfast' },
  { name: 'lunch', label: 'Lunch' },
  { name: 'dinner', label: 'Dinner' },
] as const

export function createDay(dayNumber: number): ItineraryDay {
  return {
    day_number: dayNumber,
    title: '',
    morning_activity: '',
    afternoon_activity: '',
    evening_activity: '',
    breakfast: false,
    lunch: false,
    dinner: false,
    images: [],
  }
}

