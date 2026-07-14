'use client'

import { useCallback, useState } from 'react'

export function useCollapsibleRows(initialIds: string[]) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set(initialIds))

  const toggle = useCallback((id: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isOpen = useCallback((id: string) => !collapsedIds.has(id), [collapsedIds])

  return { isOpen, toggle }
}
