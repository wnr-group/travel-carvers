'use client';

import { useEffect, useState } from 'react';
import { useHomepageSections, useUpdateHomepageSections } from '@/lib/hooks/useHomepageSections';
import { 
  Save, 
  Sparkles, 
  Bookmark, 
  Flame, 
  Info, 
  Loader2, 
  LayoutGrid,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomepageManagerPage() {
  const { data, isPending, isError, error } = useHomepageSections();
  const updateMutation = useUpdateHomepageSections();

  // Form states
  const [id, setId] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  
  const [featuredTitle, setFeaturedTitle] = useState('');
  const [featuredDescription, setFeaturedDescription] = useState('');
  
  const [trendingTitle, setTrendingTitle] = useState('');
  const [trendingDescription, setTrendingDescription] = useState('');

  // Sync form states with retrieved query data
  useEffect(() => {
    if (data) {
      setId(data.id || '');
      setHeroTitle(data.hero_title || '');
      setHeroSubtitle(data.hero_subtitle || '');
      setHeroCtaText(data.hero_cta_text || '');
      setFeaturedTitle(data.featured_title || '');
      setFeaturedDescription(data.featured_description || '');
      setTrendingTitle(data.trending_title || '');
      setTrendingDescription(data.trending_description || '');
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id: id || undefined,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
        featured_title: featuredTitle,
        featured_description: featuredDescription,
        trending_title: trendingTitle,
        trending_description: trendingDescription,
      });
      toast.success('Homepage sections updated successfully!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update sections');
    }
  };

  if (isPending) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
        <p className="text-gray-500 mt-4 text-sm font-medium">Fetching homepage configuration...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center max-w-md mx-auto">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Error Loading Configuration</h3>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest">Homepage Manager</h1>
          <p className="text-gray-600 mt-1">Configure layout, headers, and descriptions for site sections.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Hero Header settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Hero Section Settings</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control main titles and CTA text visible at the top of the homepage.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="heroTitle" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Hero Title</label>
              <textarea
                id="heroTitle"
                rows={2}
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Explore Your Next Adventure With Us"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Hero Subtitle</label>
              <textarea
                id="heroSubtitle"
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Describe your tours and mission briefly..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="heroCta" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Call to Action (CTA) Button Text</label>
                <input
                  id="heroCta"
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="e.g. Book a Tour"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Featured Packages Headers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Featured Packages Section</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control the header title and description for featured packages.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="featuredTitle" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Section Title</label>
              <input
                id="featuredTitle"
                type="text"
                value={featuredTitle}
                onChange={(e) => setFeaturedTitle(e.target.value)}
                placeholder="e.g. Featured Tours"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="featuredDesc" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Section Description</label>
              <textarea
                id="featuredDesc"
                rows={3}
                value={featuredDescription}
                onChange={(e) => setFeaturedDescription(e.target.value)}
                placeholder="e.g. Hand-picked adventures selected by our experts..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Trending Packages Headers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Trending Packages Section</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control the header title and description for trending packages.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="trendingTitle" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Section Title</label>
              <input
                id="trendingTitle"
                type="text"
                value={trendingTitle}
                onChange={(e) => setTrendingTitle(e.target.value)}
                placeholder="e.g. Popular Adventures"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="trendingDesc" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Section Description</label>
              <textarea
                id="trendingDesc"
                rows={3}
                value={trendingDescription}
                onChange={(e) => setTrendingDescription(e.target.value)}
                placeholder="e.g. Discover which tour destinations are currently trending among travelers..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Informational Callout regarding package flags */}
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 md:p-6 flex items-start gap-4">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-amber-900">How to Control Featured & Trending Tours</h3>
            <p className="text-xs leading-relaxed text-amber-800">
              The headers above control the titles and introductory descriptions visible on the website. To choose which specific packages appear under these categories, edit packages in the <strong>Packages</strong> section and toggle the <strong>Is Featured</strong> or <strong>Is Trending</strong> flags.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-brand-dark text-white rounded-lg flex items-center gap-2 hover:bg-brand-darkest transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
