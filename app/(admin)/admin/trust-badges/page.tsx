'use client';

import { useState } from 'react';
import { useTrustBadges, useCreateTrustBadge, useDeleteTrustBadge } from '@/lib/hooks/useTrustBadges';
import { 
  Plus, 
  Trash2, 
  Shield, 
  Award, 
  Sparkles, 
  Heart, 
  Globe2, 
  Smile,
  Compass,
  MapPin,
  Clock,
  Loader2,
  Info,
  BadgeAlert
} from 'lucide-react';
import { toast } from 'sonner';

// A map of selectable Lucide icons for Trust Badges
const ICON_OPTIONS = [
  { value: 'Shield', label: 'Shield / Security', icon: Shield },
  { value: 'Award', label: 'Award / Trust', icon: Award },
  { value: 'Sparkles', label: 'Sparkles / Quality', icon: Sparkles },
  { value: 'Heart', label: 'Heart / Care', icon: Heart },
  { value: 'Globe2', label: 'Globe / Destination', icon: Globe2 },
  { value: 'Smile', label: 'Smile / Hospitality', icon: Smile },
  { value: 'Compass', label: 'Compass / Guidance', icon: Compass },
  { value: 'MapPin', label: 'Map Pin / Location', icon: MapPin },
  { value: 'Clock', label: 'Clock / 24-7 Support', icon: Clock }
];

export default function TrustBadgesPage() {
  const { data: badges = [], isPending, isError, error } = useTrustBadges();
  const createMutation = useCreateTrustBadge();
  const deleteMutation = useDeleteTrustBadge();

  // Form states
  const [text, setText] = useState('');
  const [icon, setIcon] = useState('Shield');
  const [displayOrder, setDisplayOrder] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        text,
        icon,
        display_order: Number(displayOrder),
      });
      toast.success('Trust badge created successfully!');
      setText('');
      setIcon('Shield');
      setDisplayOrder(0);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create trust badge');
    }
  };

  const handleDelete = async (id: string, badgeText: string) => {
    if (confirm(`Are you sure you want to delete the trust badge "${badgeText}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Trust badge deleted successfully');
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to delete badge');
      }
    }
  };

  // Helper to render the matching Lucide icon dynamically
  const renderBadgeIcon = (iconName: string) => {
    const matched = ICON_OPTIONS.find(opt => opt.value === iconName);
    const IconComponent = matched ? matched.icon : Shield;
    return <IconComponent className="w-6 h-6 text-brand-medium flex-shrink-0" />;
  };

  if (isPending) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
        <p className="text-gray-500 mt-4 text-sm font-medium">Loading trust badges...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center max-w-md mx-auto">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Error Loading Badges</h3>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest">Trust Badges</h1>
          <p className="text-gray-600 mt-1">Manage certification seals, service qualities, and footer trust indicators.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-brand-darkest mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <Plus className="w-5 h-5 text-brand-medium" />
            <span>Add Trust Badge</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="badgeText" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Badge Text</label>
              <input
                id="badgeText"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. 100% Secure Checkout"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="badgeIcon" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Select Icon</label>
              <select
                id="badgeIcon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 bg-white text-gray-900 cursor-pointer"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="displayOrder" className="block text-[15px] font-semibold text-gray-700 mb-1.5">Display Order</label>
              <input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900"
                min="0"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-2.5 bg-brand-dark text-white rounded-lg flex items-center justify-center gap-2 hover:bg-brand-darkest transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Badge
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Badges List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 flex items-start gap-4">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-amber-900">Placement Note</h3>
              <p className="text-xs leading-relaxed text-amber-800">
                These trust badges are automatically rendered in the website footer on all pages. They reassure visitors about checkout safety, booking support, and service quality.
              </p>
            </div>
          </div>

          {badges.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-500 shadow-sm">
              <BadgeAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-base">No trust badges configured</p>
              <p className="text-sm text-gray-400 mt-1">Use the form on the left to create your first badge.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-lightest/20 rounded-lg">
                      {renderBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-gray-900">{badge.text}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Order: {badge.display_order}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(badge.id, badge.text)}
                    disabled={deleteMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer focus:outline-none"
                    title="Delete Badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
