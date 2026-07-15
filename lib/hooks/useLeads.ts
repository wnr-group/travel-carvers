'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLead } from '@/lib/api/leads';
import { toast } from 'sonner';

/**
 * Submit lead form (mutation hook)
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      toast.success('Thank you! We will contact you soon.');
      // Invalidate admin leads query if needed
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error) => {
      console.error('Lead submission error:', error);
      toast.error('Failed to submit. Please try again.');
    },
  });
}
