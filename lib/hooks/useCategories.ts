'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getActiveCategories,
  getCategoryBySlug,
  getActiveSubcategories,
} from '@/lib/api/public/categories';

/**
 * Get all active categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: getActiveCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get single category by slug
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get all active subcategories
 */
export function useSubcategories() {
  return useQuery({
    queryKey: ['subcategories', 'active'],
    queryFn: getActiveSubcategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
