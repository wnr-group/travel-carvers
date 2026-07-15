'use client';

import { useEffect, useState } from 'react';
import { useSiteSettings, useUpdateSiteSettings } from '@/lib/hooks/useSiteSettings';
import {
  Save,
  Building2,
  Globe2,
  Share2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SiteSettingsPage() {
  const { data, isPending, isError, error } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();

  // Form states
  const [id, setId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPricesGlobally, setShowPricesGlobally] = useState(true);
  
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Sync form states with query data. Initialising editable form fields from fetched data is an
  // intentional effect here; the cascading-render lint rule doesn't apply to this one-time sync.
  useEffect(() => {
    if (data) {
      setId(data.id || '');
      setCompanyName(data.company_name || '');
      setContactEmail(data.contact_email || '');
      setContactPhone(data.contact_phone || '');
      setAddress(data.address || '');
      setShowPricesGlobally(data.show_prices_globally !== false); // default to true
      setFacebookUrl(data.facebook_url || '');
      setInstagramUrl(data.instagram_url || '');
      setTwitterUrl(data.twitter_url || '');
      setLinkedinUrl(data.linkedin_url || '');
    }
  }, [data]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id: id || undefined,
        company_name: companyName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        address,
        show_prices_globally: showPricesGlobally,
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        twitter_url: twitterUrl,
        linkedin_url: linkedinUrl,
      });
      toast.success('Site settings saved successfully!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to save settings');
    }
  };

  if (isPending) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
        <p className="text-gray-500 mt-4 text-sm font-medium">Fetching site configurations...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center max-w-md mx-auto">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Error Loading Settings</h3>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest">Site Settings</h1>
          <p className="text-gray-600 mt-1">Manage global settings, company details, pricing display, and social profiles.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Company details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Company Information</h2>
              <p className="text-sm text-gray-500 mt-0.5">Define metadata used in emails, footer text, and contact sections.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label htmlFor="companyName" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Company Name</label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Travel Carvers"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Contact Email</label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. info@travelcarvers.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Contact Phone</label>
              <input
                id="contactPhone"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Company Address</label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete office address..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Global Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Global Visibility</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control pricing visibility settings across the public website.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="space-y-0.5 max-w-[80%]">
              <h3 className="font-semibold text-[15px] text-gray-900">Show Prices Globally</h3>
              <p className="text-xs text-gray-500">
                When enabled, pricing structures are visible to all website users. Turn off to switch to an &ldquo;Inquiry Only&rdquo; catalog model.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPricesGlobally}
                onChange={(e) => setShowPricesGlobally(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-medium/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-medium"></div>
            </label>
          </div>
        </div>

        {/* Section 3: Social Media settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="p-2 bg-brand-lightest/30 text-brand-darkest rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-darkest">Social Profiles</h2>
              <p className="text-sm text-gray-500 mt-0.5">Control destination URLs for website header/footer social link badges.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="facebookUrl" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Facebook Profile URL</label>
              <input
                id="facebookUrl"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="instagramUrl" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Instagram Profile URL</label>
              <input
                id="instagramUrl"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="twitterUrl" className="block text-[15px] font-semibold text-gray-700 mb-1.5">X (formerly Twitter) URL</label>
              <input
                id="twitterUrl"
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-[15px] font-semibold text-gray-700 mb-1.5">LinkedIn Page URL</label>
              <input
                id="linkedinUrl"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/company/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
              />
            </div>
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
                <Save className="w-4 h-4" /> Save Configuration
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
