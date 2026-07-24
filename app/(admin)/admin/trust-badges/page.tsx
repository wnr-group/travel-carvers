'use client';

import { useState } from 'react';
import {
  useTrustBadges,
  useCreateTrustBadge,
  useDeleteTrustBadge,
  type TrustBadgeType,
} from '@/lib/hooks/useTrustBadges';
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
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const BADGE_TYPE_OPTIONS: {
  value: TrustBadgeType;
  label: string;
  hint: string;
  example: string;
}[] = [
  {
    value: 'stat',
    label: 'Stat badge',
    hint: 'Icon + a big leading number, then a short label.',
    example: 'e.g. “10,000+ Happy Travellers”',
  },
  {
    value: 'text',
    label: 'Text badge',
    hint: 'A compact button-sized pill. Text only — no icon, no card.',
    example: 'e.g. “Best Price Guarantee”',
  },
];

// A map of selectable Lucide icons for Trust Badges (stat badges only).
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
  const [badgeType, setBadgeType] = useState<TrustBadgeType>('stat');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Pending delete (drives the confirmation dialog)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; text: string } | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        text,
        icon,
        badge_type: badgeType,
        display_order: Number(displayOrder),
      });
      toast.success('Trust badge created successfully!');
      setText('');
      setIcon('Shield');
      setBadgeType('stat');
      setDisplayOrder(0);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create trust badge');
    }
  };

  const handleDelete = (id: string, badgeText: string) => setPendingDelete({ id, text: badgeText });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success('Trust badge deleted successfully');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete badge');
    } finally {
      setPendingDelete(null);
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

            <fieldset>
              <legend className="block text-[15px] font-semibold text-gray-700 mb-1.5">
                Badge Style
              </legend>
              <div className="space-y-2">
                {BADGE_TYPE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors ${
                      badgeType === option.value
                        ? 'border-brand-medium bg-brand-lightest/30'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="badgeType"
                      value={option.value}
                      checked={badgeType === option.value}
                      onChange={() => setBadgeType(option.value)}
                      className="mt-0.5 accent-[color:var(--logo-forest)]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        {option.label}
                      </span>
                      <span className="block text-xs text-gray-500">{option.hint}</span>
                      <span className="block text-xs text-gray-400 italic">{option.example}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Text badges render as plain pills, so an icon choice would be a dead control. */}
            {badgeType === 'stat' && (
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
            )}

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
                These badges render in the “Trusted by Thousands” section on the homepage, sorted by
                display order. Stat badges appear first as number cards, text badges follow in the
                same card style — pick the style that fits the wording.
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
                    {/* Mirrors the homepage: stat badges get the icon chip, text badges
                        get the pill they actually render as. */}
                    {badge.badge_type === 'stat' ? (
                      <div className="p-2.5 bg-brand-lightest/20 rounded-lg">
                        {renderBadgeIcon(badge.icon)}
                      </div>
                    ) : (
                      <span className="rounded-full border border-brand-medium/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-medium">
                        Pill
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-base text-gray-900">{badge.text}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 font-semibold ${
                            badge.badge_type === 'stat'
                              ? 'bg-brand-lightest/60 text-brand-darkest'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {badge.badge_type === 'stat' ? 'Stat' : 'Text'}
                        </span>
                        <span>Order: {badge.display_order}</span>
                      </p>
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

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete trust badge"
        message={pendingDelete ? `Delete the trust badge “${pendingDelete.text}”? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
