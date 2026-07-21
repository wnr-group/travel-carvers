'use client';

import { useQuery } from '@tanstack/react-query';
import { getNavCategories } from '@/lib/api/public/categories';

/**
 * Categories the admin flagged for the header/navigation menu.
 */
export function useNavCategories() {
  return useQuery({
    queryKey: ['categories', 'nav'],
    queryFn: getNavCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
