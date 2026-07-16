'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReview } from '@/lib/api/reviews';
import { toast } from 'sonner';

/**
 * Submit review (mutation hook)
 */
export function useCreateReview(packageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      if (data.is_approved) {
        toast.success('Thank you! Your review is live.');
      } else {
        toast.success('Thank you! Your review is under review and will be published soon.');
      }
      // Invalidate package reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'package', packageId] });
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    },
  });
}
