'use client';

import { useState } from 'react';
import { 
  useAdminReviews, 
  useApproveReview, 
  useRejectReview, 
  useDeleteReview 
} from '@/lib/hooks/useAdminReviews';
import { 
  Check, 
  X, 
  Trash2, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const { data: reviews = [], isPending, isError, error } = useAdminReviews();
  const approveMutation = useApproveReview();
  const rejectMutation = useRejectReview();
  const deleteMutation = useDeleteReview();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Review for Modal View
  const [selectedReviewText, setSelectedReviewText] = useState<string | null>(null);

  // Stats calculation
  const totalCount = reviews.length;
  const pendingCount = reviews.filter(r => r.is_approved === null).length;
  const approvedCount = reviews.filter(r => r.is_approved === true).length;
  const rejectedCount = reviews.filter(r => r.is_approved === false).length;

  // Handlers
  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Review approved successfully');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      toast.success('Review rejected successfully');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to reject review');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the review by ${name}? This cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Review deleted successfully');
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to delete review');
      }
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    // Search matching
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      review.reviewer_name.toLowerCase().includes(searchLower) ||
      review.reviewer_email.toLowerCase().includes(searchLower) ||
      (review.packages?.title || '').toLowerCase().includes(searchLower) ||
      review.review_text.toLowerCase().includes(searchLower);

    // Status matching
    let matchesStatus = true;
    if (statusFilter === 'pending') matchesStatus = review.is_approved === null;
    else if (statusFilter === 'approved') matchesStatus = review.is_approved === true;
    else if (statusFilter === 'rejected') matchesStatus = review.is_approved === false;

    // Rating matching
    const matchesRating = ratingFilter === 'all' ? true : review.rating === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  // Pagination logic
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Safe page navigation
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-darkest">Review Management</h1>
          <p className="text-gray-600 mt-1">Approve, reject, and moderate guest reviews for travel packages.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-all duration-300 hover:shadow-md border-l-4 border-brand-darkest">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Reviews</p>
            <p className="text-3xl font-bold text-brand-darkest mt-2">{totalCount}</p>
          </div>
          <div className="bg-brand-darkest text-white p-3 rounded-lg shadow-sm">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-all duration-300 hover:shadow-md border-l-4 border-amber-500">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-amber-100 text-amber-600 p-3 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-all duration-300 hover:shadow-md border-l-4 border-brand-dark">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Approved</p>
            <p className="text-3xl font-bold text-brand-dark mt-2">{approvedCount}</p>
          </div>
          <div className="bg-brand-lightest text-brand-darkest p-3 rounded-lg">
            <ThumbsUp className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-all duration-300 hover:shadow-md border-l-4 border-rose-500">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rejected</p>
            <p className="text-3xl font-bold text-rose-600 mt-2">{rejectedCount}</p>
          </div>
          <div className="bg-rose-100 text-rose-600 p-3 rounded-lg">
            <ThumbsDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-t-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-base lg:text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium focus:border-brand-medium text-gray-900 placeholder-gray-400 bg-gray-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected');
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-base lg:text-sm bg-white text-gray-700 focus:ring-1 focus:ring-brand-medium"
            >
              <option value="all">All Reviews</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => {
                const val = e.target.value;
                setRatingFilter(val === 'all' ? 'all' : Number(val));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-base lg:text-sm bg-white text-gray-700 focus:ring-1 focus:ring-brand-medium"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 shadow-sm overflow-hidden">
        {isPending ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-dark mx-auto"></div>
            <p className="text-gray-500 mt-4 text-sm font-medium">Loading reviews...</p>
          </div>
        ) : isError ? (
          <div className="p-16 text-center">
            <p className="font-semibold text-rose-600">Error loading reviews</p>
            <p className="text-sm text-gray-500 mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-base">No reviews found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] border-collapse text-left text-[15px]">
              <thead className="bg-brand-lightest/40 border-b text-brand-darkest">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[20%]">Reviewer</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[20%]">Package</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[12%]">Rating</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[25%]">Review</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[10%]">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider w-[13%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedReviews.map((review) => {
                  const ratingStars = Array.from({ length: 5 }, (_, i) => i < review.rating);

                  return (
                    <tr 
                      key={review.id} 
                      className="transition-colors hover:bg-brand-lightest/10 duration-200"
                    >
                      {/* Reviewer Details */}
                      <td className="px-6 py-4">
                        <div className="text-base font-semibold text-gray-900">{review.reviewer_name}</div>
                        <div className="text-sm text-gray-500">{review.reviewer_email}</div>
                        <div className="text-xs text-gray-400 mt-1.5">
                          {new Date(review.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Package Name */}
                      <td className="px-6 py-4 text-base">
                        <div className="font-medium text-gray-800 line-clamp-2">
                          {review.packages?.title || 'General / Unknown'}
                        </div>
                      </td>

                      {/* Rating Stars */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {ratingStars.map((filled, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-4 h-4 ${filled ? 'fill-amber-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </td>

                      {/* Review Text */}
                      <td className="px-6 py-4">
                        <div className="text-gray-700 relative max-w-md">
                          <p className="line-clamp-2 text-sm leading-relaxed">{review.review_text}</p>
                          {review.review_text.length > 80 && (
                            <button
                              onClick={() => setSelectedReviewText(review.review_text)}
                              className="text-xs text-brand-dark hover:text-brand-darkest font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" /> Read Full Review
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {review.is_approved === null && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </span>
                        )}
                        {review.is_approved === true && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3 mr-1" /> Approved
                          </span>
                        )}
                        {review.is_approved === false && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <X className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Action */}
                          {review.is_approved !== true && (
                            <button
                              onClick={() => handleApprove(review.id)}
                              disabled={approveMutation.isPending}
                              title="Approve Review"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors border border-emerald-200 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {/* Reject Action */}
                          {review.is_approved !== false && (
                            <button
                              onClick={() => handleReject(review.id)}
                              disabled={rejectMutation.isPending}
                              title="Reject Review"
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors border border-amber-200 disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDelete(review.id, review.reviewer_name)}
                            disabled={deleteMutation.isPending}
                            title="Delete Review"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-200 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {!isPending && !isError && filteredReviews.length > 0 && (
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Show Info */}
            <div className="text-xs text-gray-500 font-medium">
              Showing <span className="text-gray-800 font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-gray-800 font-semibold">{endIndex}</span> of{' '}
              <span className="text-gray-800 font-semibold">{totalItems}</span> reviews
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPageSafe === 1}
                  className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    // Show current page, first, last, and pages adjacent to current page
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
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
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
                  className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Review Text Modal */}
      {selectedReviewText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-gray-100 overflow-hidden transform transition-all">
            <div className="bg-brand-darkest text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-lightest" /> Full Review Content
              </h3>
              <button 
                onClick={() => setSelectedReviewText(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedReviewText}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedReviewText(null)}
                className="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm hover:bg-brand-darkest transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
