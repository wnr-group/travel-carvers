'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPackageReviews, createReview } from '@/lib/api/reviews';
import { toast } from 'sonner';

/**
 * Get reviews for a package
 */
export function usePackageReviews(packageId: string) {
  return useQuery({
    queryKey: ['reviews', 'package', packageId],
    queryFn: () => getPackageReviews(packageId),
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

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
