'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  type Testimonial,
} from '@/lib/hooks/useTestimonials';
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Loader2,
  MessageSquare,
  ArrowUpDown,
  User,
  Heart,
  X,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';

/**
 * Number input for display order that keeps its own draft state and only
 * commits (one API call) on blur or Enter — avoids a mutation per keystroke.
 */
function DisplayOrderInput({
  value,
  onCommit,
  className,
}: {
  value: number;
  onCommit: (next: number) => void;
  className?: string;
}) {
  // Remounted via `key={value}` at the call site whenever the persisted value
  // changes, so the draft always starts from the latest server value.
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0) {
      setDraft(String(value)); // revert invalid input
      return;
    }
    if (next !== value) onCommit(next);
  };

  return (
    <input
      type="number"
      min="0"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLInputElement).blur();
        }
      }}
      className={className}
    />
  );
}

export default function TestimonialManager() {
  const { data: testimonials = [], isPending, isError, error } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  // Modal and view states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Edit / Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  // Deletion state
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Pagination Logic
  const totalItems = testimonials.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTestimonials = testimonials.slice(startIndex, endIndex);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setReviewText('');
    setRating(5);
    setPhotoUrl(null);
    setIsFeatured(false);
    setDisplayOrder(0);
    setIsModalOpen(false);
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setName(testimonial.customer_name);
    setRole(testimonial.customer_role || '');
    setReviewText(testimonial.review_text);
    setRating(testimonial.rating);
    setPhotoUrl(testimonial.photo_url);
    setIsFeatured(testimonial.is_featured);
    setDisplayOrder(testimonial.display_order);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Customer name is required.');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Review text is required.');
      return;
    }

    const payload = {
      customer_name: name.trim(),
      customer_role: role.trim(),
      review_text: reviewText.trim(),
      rating,
      photo_url: photoUrl,
      is_featured: isFeatured,
      display_order: Number(displayOrder),
    };

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload });
        toast.success('Testimonial updated successfully!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Testimonial created successfully!');
      }
      resetForm();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'An error occurred.');
    }
  };

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    try {
      await updateMutation.mutateAsync({
        id: testimonial.id,
        data: { is_featured: !testimonial.is_featured },
      });
      toast.success(testimonial.is_featured ? 'Testimonial unfeatured.' : 'Testimonial featured!');
    } catch {
      toast.error('Failed to update testimonial status.');
    }
  };

  const handleDisplayOrderChange = async (testimonial: Testimonial, newOrder: number) => {
    try {
      await updateMutation.mutateAsync({
        id: testimonial.id,
        data: { display_order: newOrder },
      });
      toast.success('Display order updated.');
    } catch {
      toast.error('Failed to update display order.');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteMutation.mutateAsync(pendingDelete.id);
      toast.success('Testimonial deleted successfully.');
    } catch {
      toast.error('Failed to delete testimonial.');
    } finally {
      setPendingDelete(null);
    }
  };

  if (isPending) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-dark" />
        <p className="text-gray-500 mt-4 text-sm font-medium">Loading testimonials...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center max-w-md mx-auto">
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Error Loading Testimonials</h3>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest tracking-tight">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage customer reviews, ratings, and testimonials displayed on the site.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark hover:bg-brand-darkest text-white rounded-lg font-semibold shadow-sm transition-all hover:shadow-md cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Tabs Layout Selector & Statistics Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
        {/* Toggle tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-brand-darkest shadow-sm'
                : 'text-gray-600 hover:text-brand-darkest'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              viewMode === 'card'
                ? 'bg-white text-brand-darkest shadow-sm'
                : 'text-gray-600 hover:text-brand-darkest'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Card View</span>
          </button>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          Total Testimonials: <span className="text-brand-darkest font-bold">{testimonials.length}</span>
        </div>
      </div>

      {/* Testimonials List Display */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-500 shadow-sm">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-base">No testimonials yet</p>
          <p className="text-sm text-gray-400 mt-1">Click the &quot;Add Testimonial&quot; button to write your first review.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Default Table Format */
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl text-left border-collapse">
              <thead className="border-b bg-brand-lightest/40 text-brand-darkest text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Review</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Display Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTestimonials.map((t) => (
                  <tr key={t.id} className="border-b last:border-b-0 hover:bg-brand-lightest/20 transition-colors">
                    {/* Customer Photo & Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                          {t.photo_url ? (
                            <Image src={t.photo_url} alt={t.customer_name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{t.customer_name}</div>
                          {t.customer_role && (
                            <div className="text-xs text-gray-500 font-medium">{t.customer_role}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Review Snippet */}
                    <td className="p-4 max-w-xs md:max-w-md">
                      <p className="text-sm text-gray-600 line-clamp-2 italic leading-relaxed">
                        &quot;{t.review_text}&quot;
                      </p>
                    </td>

                    {/* Rating stars */}
                    <td className="p-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < t.rating ? 'fill-current' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Featured Status Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(t)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                          t.is_featured
                            ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                            : 'bg-gray-50 border-gray-200 text-gray-505 hover:border-amber-200 hover:text-amber-700'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${t.is_featured ? 'fill-current text-amber-600' : ''}`} />
                        <span>{t.is_featured ? 'Featured' : 'Feature'}</span>
                      </button>
                    </td>

                    {/* Display Order input */}
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                        <DisplayOrderInput
                          key={t.display_order}
                          value={t.display_order}
                          onCommit={(next) => handleDisplayOrderChange(t, next)}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-700"
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(t)}
                          className="p-1.5 hover:bg-slate-100 text-gray-500 hover:text-brand-dark rounded-lg cursor-pointer transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPendingDelete({ id: t.id, name: t.customer_name })}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card format */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                      {t.photo_url ? (
                        <Image src={t.photo_url} alt={t.customer_name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{t.customer_name}</h3>
                      {t.customer_role && (
                        <span className="text-xs text-gray-505 font-medium">{t.customer_role}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating ? 'fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 italic leading-relaxed">
                  &quot;{t.review_text}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleFeatured(t)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      t.is_featured
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-amber-200 hover:text-amber-700'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${t.is_featured ? 'fill-current' : ''}`} />
                    <span>{t.is_featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Order:</span>
                    <DisplayOrderInput
                      key={t.display_order}
                      value={t.display_order}
                      onCommit={(next) => handleDisplayOrderChange(t, next)}
                      className="w-10 px-1 border border-gray-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-brand-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="p-1.5 hover:bg-slate-50 text-gray-500 hover:text-brand-dark rounded-lg cursor-pointer transition-colors"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPendingDelete({ id: t.id, name: t.customer_name })}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Section */}
      {!isPending && !isError && testimonials.length > 0 && (
        <div className="bg-white border border-gray-150 rounded-lg shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          {/* Show Info */}
          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-800 font-semibold">{startIndex + 1}</span> to{' '}
            <span className="text-gray-800 font-semibold">{endIndex}</span> of{' '}
            <span className="text-gray-800 font-semibold">{totalItems}</span> testimonials
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPageSafe === 1}
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  return p === 1 || p === totalPages || Math.abs(p - currentPageSafe) <= 1;
                })
                .map((p, idx, arr) => {
                  const isCurrent = p === currentPageSafe;
                  
                  return (
                    <div key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-gray-400 px-1 text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPageSafe === totalPages}
                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Dialog Modal for Adding/Editing Testimonial with Live Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-150 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-brand-darkest">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Split layout (Form on left, Live Preview on right) */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Side */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Photo</label>
                  <ImageUploader
                    bucket="testimonial-images"
                    maxFiles={1}
                    onUpload={(urls) => setPhotoUrl(urls[0] || null)}
                    initialImages={photoUrl ? [photoUrl] : []}
                    value={photoUrl ? [photoUrl] : []}
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
                  <input
                    id="customerName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-405"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="customerRole" className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Location</label>
                  <input
                    id="customerRole"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Travel Blogger, London"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-405"
                  />
                </div>

                {/* Review text */}
                <div>
                  <label htmlFor="reviewText" className="block text-sm font-semibold text-gray-700 mb-1.5">Review Text</label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe their experience..."
                    rows={4}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900 placeholder-gray-405 resize-none"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured toggle & Display Order */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3.5 py-2">
                    <label htmlFor="isFeaturedModal" className="text-xs font-semibold text-gray-600 cursor-pointer">Feature on Home</label>
                    <input
                      id="isFeaturedModal"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-brand-dark cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="displayOrderModal" className="text-xs font-semibold text-gray-600 whitespace-nowrap">Display Order</label>
                    <input
                      id="displayOrderModal"
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/50 text-gray-900"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </form>

              {/* Live Preview Side */}
              <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center border border-gray-150 border-dashed">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Live Preview</div>

                {/* Styled Testimonial Preview Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                          {photoUrl ? (
                            <Image src={photoUrl} alt="Preview" fill sizes="48px" className="object-cover" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight">
                            {name.trim() || 'Customer Name'}
                          </h3>
                          <span className="text-xs text-gray-500 font-medium">
                            {role.trim() || 'Role / Location'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rating ? 'fill-current' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-5 italic leading-relaxed">
                      &quot;{reviewText.trim() || 'Write the customer\'s review experience here to see the live preview update instantly...'}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-4">
                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700">
                        <Heart className="w-2.5 h-2.5 fill-current" />
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      Display Order: {displayOrder}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-5 py-2 bg-brand-dark text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-brand-darkest transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : editingId ? (
                  'Update Testimonial'
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete Testimonial"
        message={
          pendingDelete
            ? `Are you sure you want to delete the testimonial from "${pendingDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

