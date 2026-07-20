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
    mutationFn: ({
      reviewData,
      photoUrls,
    }: {
      reviewData: {
        package_id: string;
        reviewer_name: string;
        reviewer_email: string;
        rating: number;
        review_text: string;
      };
      photoUrls?: string[];
    }) => createReview(reviewData, photoUrls),
    onSuccess: () => {
      toast.success('Thank you! Your review is under moderation and will be published once approved.');
      // Invalidate package reviews query
      queryClient.invalidateQueries({ queryKey: ['reviews', 'package', packageId] });
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review. Please try again.');
    },
  });
}
