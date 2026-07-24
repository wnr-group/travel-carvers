'use client'

import { useCallback } from 'react'
import { useFieldArray, useFormContext, type FieldPath } from 'react-hook-form'
import type {
  PackageFormInput,
  PackageFormOutput,
} from '@/lib/validations/package.schema'
import { shiftedOrderValues } from './ordering'


const ORDER_CONFIG = {
  itinerary_days: { key: 'day_number', startAt: 1 },
  inclusions: { key: 'display_order', startAt: 0 },
  exclusions: { key: 'display_order', startAt: 0 },
  highlights: { key: 'display_order', startAt: 0 },
  travel_tips: { key: 'display_order', startAt: 0 },
  stay_details: { key: 'display_order', startAt: 0 },
  cancellation_policy: { key: 'display_order', startAt: 0 },
  required_documents: { key: 'display_order', startAt: 0 },
} as const

export type OrderedArrayName = keyof typeof ORDER_CONFIG

export function useOrderedFieldArray<TName extends OrderedArrayName>(name: TName) {
  const { control, getValues, setValue } = useFormContext<
    PackageFormInput,
    unknown,
    PackageFormOutput
  >()

  const { fields, append, remove } = useFieldArray({ control, name })
  const { key, startAt } = ORDER_CONFIG[name]

  const removeAt = useCallback(
    (index: number) => {
      const previousLength = getValues(name)?.length ?? 0

      remove(index)

      for (const update of shiftedOrderValues(previousLength, index, startAt)) {
        const path = `${name}.${update.index}.${key}` as FieldPath<PackageFormInput>
        setValue(path, update.value as never)
      }
    },
    [getValues, name, remove, setValue, key, startAt]
  )

  return { fields, append, removeAt }
}
