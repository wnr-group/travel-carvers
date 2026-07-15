'use client';

import { useState } from 'react';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { reviewSchema, type ReviewFormData } from '@/lib/validations/review.schema';
import { Star, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  packageId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ packageId, onSuccess }: ReviewFormProps) {
  const createReview = useCreateReview(packageId);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isApprovedImmediately, setIsApprovedImmediately] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({ ...prev, photo: 'Image must be 5MB or smaller' }));
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy.photo;
        return copy;
      });
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    const formData = {
      package_id: packageId,
      reviewer_name: name,
      reviewer_email: email,
      rating: rating,
      review_text: reviewText,
    };

    const result = reviewSchema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      if (rating === 0) {
        errors.rating = 'Please select a rating between 1 and 5 stars';
      }
      setValidationErrors(errors);
      return;
    }

    try {
      const data = await createReview.mutateAsync(result.data);
      setIsApprovedImmediately(rating >= 4);
      setSubmitSuccess(true);
      
      // Reset form
      setRating(0);
      setName('');
      setEmail('');
      setReviewText('');
      setPhoto(null);
      setPhotoPreview(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-2xl border border-brand-medium/30 bg-brand-lightest/20 p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-medium/20 text-brand-dark">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-brand-darkest">
          Review Submitted!
        </h3>
        <p className="mt-2 text-sm text-slate-800">
          {isApprovedImmediately
            ? 'Thank you! Your review has been automatically approved and is now live.'
            : 'Thank you! Your review is under moderation and will be published shortly.'}
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-6 inline-flex rounded-full bg-brand-dark px-5 py-2 text-xs font-semibold text-white shadow transition hover:bg-brand-darkest"
        >
          Submit Another Review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-brand-light bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-brand-darkest">
        Share Your Experience
      </h3>

      {/* Star Rating Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          Rating *
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => {
                setRating(star);
                setValidationErrors(prev => {
                  const copy = { ...prev };
                  delete copy.rating;
                  return copy;
                });
              }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="group p-1 transition duration-150 hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 group-hover:text-amber-200'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 font-mono text-xs font-medium text-slate-600">
              ({rating} {rating === 1 ? 'star' : 'stars'})
            </span>
          )}
        </div>
        {validationErrors.rating && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.rating}
          </p>
        )}
      </div>

      {/* Grid for Name & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reviewer_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Your Name *
          </label>
          <input
            id="reviewer_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-brand-light/70 px-3.5 py-2 text-sm text-brand-darkest placeholder:text-slate-400 outline-none transition focus:border-brand-medium focus:ring-1 focus:ring-brand-medium"
          />
          {validationErrors.reviewer_name && (
            <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {validationErrors.reviewer_name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reviewer_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
            Email Address *
          </label>
          <input
            id="reviewer_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full rounded-lg border border-brand-light/70 px-3.5 py-2 text-sm text-brand-darkest placeholder:text-slate-400 outline-none transition focus:border-brand-medium focus:ring-1 focus:ring-brand-medium"
          />
          {validationErrors.reviewer_email && (
            <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {validationErrors.reviewer_email}
            </p>
          )}
        </div>
      </div>

      {/* Review Text Area */}
      <div>
        <label htmlFor="review_text" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Review Comments *
        </label>
        <textarea
          id="review_text"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell us about your experience with this package..."
          className="w-full rounded-lg border border-brand-light/70 px-3.5 py-2 text-sm text-brand-darkest placeholder:text-slate-400 outline-none transition focus:border-brand-medium focus:ring-1 focus:ring-brand-medium resize-y"
        />
        {validationErrors.review_text && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.review_text}
          </p>
        )}
      </div>

      {/* Optional Photo Upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
          Add Photos (Optional)
        </label>
        {!photoPreview ? (
          <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-light/70 bg-slate-50/40 p-5 text-center transition hover:bg-slate-50/80">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Upload className="h-6 w-6 text-brand-medium transition group-hover:scale-110" />
            <p className="mt-2 text-xs font-medium text-slate-800">
              Drag & drop or click to upload
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              JPEG, PNG, or WebP up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative inline-block overflow-hidden rounded-lg border border-brand-light bg-slate-50 p-1">
            <img
              src={photoPreview}
              alt="Preview"
              className="h-24 w-36 rounded object-cover"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="mt-1 max-w-[140px] truncate text-[10px] text-slate-600 px-1 text-center">
              {photo?.name}
            </p>
          </div>
        )}
        {validationErrors.photo && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.photo}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={createReview.isPending}
        className="w-full rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] py-3 text-sm font-semibold text-white shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {createReview.isPending ? 'Submitting Review...' : 'Submit Review'}
      </button>
    </form>
  );
}
