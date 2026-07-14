import type { PackageFormInput } from '@/lib/validations/package.schema'

export type ChecklistItem = NonNullable<PackageFormInput['inclusions']>[number]

export type ChecklistField = 'inclusions' | 'exclusions'

export const DEFAULT_ICON: Record<ChecklistField, string> = {
  inclusions: 'Check',
  exclusions: 'Ban',
}

export function createItem(field: ChecklistField, displayOrder: number): ChecklistItem {
  return {
    text: '',
    icon: DEFAULT_ICON[field],
    display_order: displayOrder,
  }
}
