
export const INPUT_CLASSES =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-medium'

export const numberField = {
  setValueAs: (value: unknown) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
}

export const emptyToUndefined = {
  setValueAs: (value: unknown) => (value === '' ? undefined : value),
}
