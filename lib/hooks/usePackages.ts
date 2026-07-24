'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getPublishedPackages,
  getPackageBySlug,
  getTrendingPackages,
  getFeaturedPackages,
  getPackagesByCategory,
  getPackagesByCategorySlug,
  getGroupPackages,
} from '@/lib/api/public/packages';

/**
 * Get all published packages
 */
export function usePackages() {
  return useQuery({
    queryKey: ['packages', 'published'],
    queryFn: () => getPublishedPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single package by slug
 */
export function usePackage(slug: string) {
  return useQuery({
    queryKey: ['packages', 'slug', slug],
    queryFn: () => getPackageBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get trending packages
 */
export function useTrendingPackages() {
  return useQuery({
    queryKey: ['packages', 'trending'],
    queryFn: getTrendingPackages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get featured packages
 */
export function useFeaturedPackages() {
  return useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: getFeaturedPackages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get packages by category slug (e.g. the homepage's Group Tours showcase)
 */
export function usePackagesByCategorySlug(slug: string, limit?: number) {
  return useQuery({
    queryKey: ['packages', 'category-slug', slug, limit ?? null],
    queryFn: () => getPackagesByCategorySlug(slug, limit),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Group packages: the group-tours category plus anything flagged `is_group_package`.
 */
export function useGroupPackages(categorySlug: string, limit?: number) {
  return useQuery({
    queryKey: ['packages', 'group', categorySlug, limit ?? null],
    queryFn: () => getGroupPackages(categorySlug, limit),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get packages by category
 */
export function usePackagesByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['packages', 'category', categoryId],
    queryFn: () => getPackagesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
