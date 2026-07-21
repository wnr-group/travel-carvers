import {
  DEFAULT_CANCELLATION_POLICY,
  DEFAULT_REQUIRED_DOCUMENTS,
} from '@/lib/packageDefaults'
import {
  MONTHS,
  WEATHER_CONDITIONS,
  type PackageFormInput,
} from '@/lib/validations/package.schema'

export { MONTHS, WEATHER_CONDITIONS }

export type TravelTip = NonNullable<PackageFormInput['travel_tips']>[number]
export type BestTimePeriod = NonNullable<PackageFormInput['best_time_to_visit']>[number]
export type PlaceToVisit = NonNullable<PackageFormInput['places_to_visit']>[number]
export type CancellationRow = NonNullable<PackageFormInput['cancellation_policy']>[number]
export type DocumentRow = NonNullable<PackageFormInput['required_documents']>[number]

export function createTip(displayOrder: number): TravelTip {
  return { tip: '', display_order: displayOrder }
}

export function createCancellationRow(displayOrder: number): CancellationRow {
  return { window_label: '', refund_text: '', display_order: displayOrder }
}

export function createDocumentRow(displayOrder: number): DocumentRow {
  return { document_text: '', display_order: displayOrder }
}

/** Turns the company-wide defaults into editable rows. */
export function standardCancellationRows(): CancellationRow[] {
  return DEFAULT_CANCELLATION_POLICY.map((rule, index) => ({
    window_label: rule.window,
    refund_text: rule.refund,
    display_order: index,
  }))
}

export function standardDocumentRows(): DocumentRow[] {
  return DEFAULT_REQUIRED_DOCUMENTS.map((text, index) => ({
    document_text: text,
    display_order: index,
  }))
}

export function createPeriod(): BestTimePeriod {
  return {
    month_start: 'January',
    month_end: 'December',
    weather_condition: '',
    description: '',
  }
}

export function createPlace(): PlaceToVisit {
  return {
    place_name: '',
    description: '',
    distance_from_hotel: '',
    entry_fee: '',
  }
}

export function wrapsYearEnd(period: BestTimePeriod): boolean {
  const start = MONTHS.indexOf(period.month_start as (typeof MONTHS)[number])
  const end = MONTHS.indexOf(period.month_end as (typeof MONTHS)[number])

  if (start === -1 || end === -1) return false
  return end < start
}
