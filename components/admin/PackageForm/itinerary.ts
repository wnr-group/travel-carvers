import {
  MAX_DAY_ENTRIES,
  type PackageFormInput,
} from '@/lib/validations/package.schema'

export type ItineraryDay = NonNullable<PackageFormInput['itinerary_days']>[number]
export type ItineraryEntry = NonNullable<ItineraryDay['entries']>[number]

export { MAX_DAY_ENTRIES }

export const MEALS = [
  { name: 'breakfast', label: 'Breakfast' },
  { name: 'lunch', label: 'Lunch' },
  { name: 'dinner', label: 'Dinner' },
] as const

export function createEntry(): ItineraryEntry {
  return {
    name: '',
    time_label: '',
    description: '',
    image_url: '',
    icon: '',
  }
}

export function createDay(dayNumber: number): ItineraryDay {
  return {
    day_number: dayNumber,
    title: '',
    timing: '',
    breakfast: false,
    lunch: false,
    dinner: false,
    // No seed entry: an entry needs a name, so a blank one would block saving the day.
    entries: [],
  }
}
