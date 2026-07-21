'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { fetchJson } from '@/lib/api/fetchJson'
import { ADMIN_DESTINATIONS_KEY } from '@/lib/queryKeys'
import type { Destination } from '@/lib/types/destination'
import type { DestinationFormOutput } from '@/lib/validations/destination.schema'

export function useAdminDestinations() {
  return useQuery({
    queryKey: ADMIN_DESTINATIONS_KEY,
    queryFn: () => fetchJson<Destination[]>('/api/admin/destinations'),
  })
}

function useDestinationMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<Destination>,
  successMessage: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage)
      queryClient.invalidateQueries({ queryKey: ADMIN_DESTINATIONS_KEY })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useCreateDestination() {
  return useDestinationMutation(
    (data: DestinationFormOutput) =>
      fetchJson<Destination>('/api/admin/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    'Destination created'
  )
}

export function useUpdateDestination() {
  return useDestinationMutation(
    ({ id, data }: { id: string; data: DestinationFormOutput }) =>
      fetchJson<Destination>(`/api/admin/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    'Destination updated'
  )
}

export function useDeleteDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fetchJson<{ id: string }>(`/api/admin/destinations/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Destination deleted')
      queryClient.invalidateQueries({ queryKey: ADMIN_DESTINATIONS_KEY })
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
