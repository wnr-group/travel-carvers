'use client';

import { useState } from 'react';
import { useCreateReview } from '@/lib/hooks/useReviews';
import { reviewSchema } from '@/lib/validations/review.schema';
import { Star, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadReviewPhoto } from '@/lib/api/reviews';

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
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      setValidationErrors(prev => ({ ...prev, photo: 'Maximum 5 photos allowed per review' }));
      return;
    }

    const newPhotos: { file: File; preview: string }[] = [];
    let hasError = false;

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({ ...prev, photo: 'Each image must be 5MB or smaller' }));
        hasError = true;
        return;
      }
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimes.includes(file.type) && !allowedExts.includes(fileExt)) {
        setValidationErrors(prev => ({ ...prev, photo: 'Only JPG, PNG, and WebP images are allowed' }));
        hasError = true;
        return;
      }
      
      newPhotos.push({
        file,
        preview: URL.createObjectURL(file)
      });
    });

    if (hasError) return;

    setPhotos(prev => [...prev, ...newPhotos]);
    setValidationErrors(prev => {
      const copy = { ...prev };
      delete copy.photo;
      return copy;
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          0.8
        );
      };
      img.onerror = () => {
        resolve(file);
      };
    });
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
      setUploading(true);
      const photoUrls: string[] = [];

      for (const p of photos) {
        const optimized = await optimizeImage(p.file);
        const formData = new FormData();
        formData.append('file', optimized);
        const url = await uploadReviewPhoto(formData);
        photoUrls.push(url);
      }

      await createReview.mutateAsync({
        reviewData: result.data,
        photoUrls,
      });

      setSubmitSuccess(true);
      
      // Reset form
      setRating(0);
      setName('');
      setEmail('');
      setReviewText('');
      photos.forEach(p => URL.revokeObjectURL(p.preview));
      setPhotos([]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setValidationErrors(prev => ({ ...prev, submit: 'Failed to submit review. Please try again.' }));
    } finally {
      setUploading(false);
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
          Thank you! Your review is under moderation and will be published once our team approves it.
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
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Add Photos (Optional)
          </label>
          <span className="text-[10px] text-slate-400 font-medium">
            {photos.length}/5 photos
          </span>
        </div>

        <div className="space-y-3">
          {photos.length < 5 && (
            <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-light/70 bg-slate-50/40 p-5 text-center transition hover:bg-slate-50/80">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <Upload className="h-6 w-6 text-brand-medium transition group-hover:scale-110" />
              <p className="mt-2 text-xs font-medium text-slate-800">
                Drag & drop or click to upload (up to 5)
              </p>
              <p className="mt-1 text-[10px] text-slate-600">
                JPEG, PNG, or WebP up to 5MB per photo
              </p>
            </div>
          )}

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {photos.map((p, index) => (
                <div key={index} className="relative inline-block overflow-hidden rounded-lg border border-brand-light bg-slate-50 p-1">
                  {/* Local object-URL preview before upload — next/image cannot optimize blob: URLs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-28 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="mt-1 max-w-[100px] truncate text-[9px] text-slate-500 px-1 text-center">
                    {p.file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {validationErrors.photo && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.photo}
          </p>
        )}
        {validationErrors.submit && (
          <p className="mt-1 flex items-center gap-1 text-xs text-rose-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {validationErrors.submit}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || createReview.isPending}
        className="w-full rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] py-3 text-sm font-semibold text-white shadow transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {uploading ? 'Uploading & Optimizing Photos...' : createReview.isPending ? 'Submitting Review...' : 'Submit Review'}
      </button>
    </form>
  );
}
