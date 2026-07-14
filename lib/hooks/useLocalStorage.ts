'use client'

import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

/**
 * Read and write a string value in localStorage
 */
export function useLocalStorage<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => value is T
) {
  const getSnapshot = () => {
    const stored = window.localStorage.getItem(key)
    return stored !== null && isValid(stored) ? stored : fallback
  }

  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback)

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, next)
      listeners.forEach((listener) => listener())
    },
    [key]
  )

  return [value, setValue] as const
}
