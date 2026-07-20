# Sprint 2 (MVP 2.5) - Detailed Jira Tickets

**Sprint Goal**: Polish user experience and implement marketing features  
**Duration**: 2 weeks  
**Team**: 2 junior developers  
**Total Estimated Time**: 35 hours

**Prerequisites**: Sprint 1 (MVP 2.0) must be completed first

---

## TVLCVR-55: Add Share Buttons to Package Detail Pages

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 3 hours  
**Assignee**: Developer A

### Description
Add social sharing buttons (WhatsApp, Facebook, Email) to package detail pages so users can easily share packages they're interested in with friends and family. This increases organic reach and word-of-mouth marketing.

### Business Value
Social sharing is critical for travel websites - 78% of travelers share packages they're considering with friends/family before booking. Each share is a potential new lead. WhatsApp is especially important for Indian market (90%+ penetration).

### Acceptance Criteria
- [ ] Share buttons are visible on package detail page (sticky or in a prominent location)
- [ ] Three share methods: WhatsApp, Facebook, Email
- [ ] Buttons are styled consistently with brand colors
- [ ] WhatsApp opens with pre-filled message and package URL
- [ ] Facebook opens share dialog with package details
- [ ] Email opens mail client with subject, body, and link
- [ ] Share includes package title and URL
- [ ] Buttons work on mobile and desktop
- [ ] Buttons have hover/active states
- [ ] Analytics tracking for share clicks (optional)
- [ ] Copy link button with success feedback

### Technical Details

**Files to Create**:
```
components/customer/ShareButtons.tsx
```

**Files to Modify**:
```
app/(customer)/packages/[slug]/PackageDetailView.tsx
```

**ShareButtons Component**:
```tsx
'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonsProps {
  packageTitle: string;
  packageUrl: string;
  description?: string;
}

export function ShareButtons({ packageTitle, packageUrl, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(packageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out this amazing travel package: ${packageTitle}\n${packageUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(packageUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out: ${packageTitle}`);
    const body = encodeURIComponent(
      `Hi,\n\nI found this interesting travel package and thought you might like it:\n\n${packageTitle}\n\n${description || ''}\n\nView details: ${packageUrl}\n\nBest regards`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-brand-dark flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Share this package
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {/* WhatsApp */}
        <button
          onClick={shareToWhatsApp}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition font-medium text-sm"
          aria-label="Share on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition font-medium text-sm"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>

        {/* Email */}
        <button
          onClick={shareViaEmail}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white rounded-lg hover:bg-brand-darkest transition font-medium text-sm"
          aria-label="Share via Email"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-brand-light text-brand-dark rounded-lg hover:bg-brand-lightest transition font-medium text-sm"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
```

**Integration in PackageDetailView**:
```tsx
// app/(customer)/packages/[slug]/PackageDetailView.tsx
import { ShareButtons } from '@/components/customer/ShareButtons';

export default function PackageDetailView({ pkg }: { pkg: PackageDetail }) {
  const packageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/packages/${pkg.slug}`;

  return (
    <div>
      {/* Existing package content */}
      
      {/* Share Buttons Section */}
      <section className="mt-12 p-6 bg-brand-lightest rounded-2xl">
        <ShareButtons
          packageTitle={pkg.title}
          packageUrl={packageUrl}
          description={pkg.short_description}
        />
      </section>
    </div>
  );
}
```

**Sticky Share Button (Mobile)**:
```tsx
// Optional: Floating share button on mobile
<div className="md:hidden fixed bottom-20 right-4 z-40">
  <button
    onClick={() => setShowShareModal(true)}
    className="bg-brand-dark text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
  >
    <Share2 className="w-6 h-6" />
  </button>
</div>
```

### Definition of Done
- [ ] Share buttons visible on package pages
- [ ] All acceptance criteria met
- [ ] WhatsApp share works on mobile and desktop
- [ ] Facebook share dialog opens correctly
- [ ] Email pre-fills subject and body
- [ ] Copy link provides visual feedback
- [ ] Code reviewed and merged
- [ ] Tested on iOS and Android

### Dependencies
None

---

## TVLCVR-56: Add Similar Packages Section

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 5 hours  
**Assignee**: Developer A

### Description
Add a "Similar Packages" or "You May Also Like" section at the bottom of package detail pages. This helps with discovery and keeps users engaged by showing alternative options in the same category or destination.

### Business Value
Similar packages increase time on site and conversion by showing alternatives if the current package doesn't perfectly match the user's needs. Studies show 35% of users explore at least one similar package before making an inquiry.

### Acceptance Criteria
- [ ] "Similar Packages" section appears at bottom of package detail page
- [ ] Shows 3-6 similar packages
- [ ] Similarity based on: same category, same destination, or similar price range
- [ ] Uses standard package card design
- [ ] Cards are clickable and navigate to package detail
- [ ] Section has heading "You May Also Like" or "Similar Packages"
- [ ] Responsive grid (1 col mobile, 2 tablet, 3 desktop)
- [ ] Loading skeleton while fetching
- [ ] Section hidden if no similar packages found
- [ ] Current package is excluded from results

### Technical Details

**Files to Create**:
```
components/customer/SimilarPackages.tsx
```

**Files to Modify**:
```
lib/api/public/packages.ts
app/(customer)/packages/[slug]/PackageDetailView.tsx
```

**Similarity Algorithm**:
```typescript
// lib/api/public/packages.ts
export async function getSimilarPackages(
  currentPackageId: string,
  categoryId?: string,
  destination?: string,
  priceRange?: { min: number; max: number }
) {
  let query = supabase
    .from('packages')
    .select(`
      *,
      package_gallery (
        image_url,
        is_cover
      ),
      package_categories (
        categories (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .neq('id', currentPackageId); // Exclude current package

  // Priority 1: Same category
  if (categoryId) {
    const { data: sameCategoryPackages } = await query
      .eq('package_categories.category_id', categoryId)
      .limit(6);
    
    if (sameCategoryPackages && sameCategoryPackages.length >= 3) {
      return sameCategoryPackages;
    }
  }

  // Priority 2: Same destination
  if (destination) {
    const { data: sameDestinationPackages } = await query
      .ilike('destination_name', `%${destination}%`)
      .limit(6);
    
    if (sameDestinationPackages && sameDestinationPackages.length >= 3) {
      return sameDestinationPackages;
    }
  }

  // Priority 3: Similar price range (±30%)
  if (priceRange) {
    const { data: similarPricePackages } = await query
      .gte('price_adult', priceRange.min * 0.7)
      .lte('price_adult', priceRange.max * 1.3)
      .limit(6);
    
    if (similarPricePackages && similarPricePackages.length >= 3) {
      return similarPricePackages;
    }
  }

  // Fallback: Random featured packages
  const { data: fallbackPackages } = await query
    .eq('is_featured', true)
    .limit(6);

  return fallbackPackages || [];
}
```

**SimilarPackages Component**:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { getSimilarPackages } from '@/lib/api/public/packages';
import { PackageCard } from '@/components/customer/PackageCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface SimilarPackagesProps {
  currentPackageId: string;
  categoryId?: string;
  destination?: string;
  priceRange?: { min: number; max: number };
}

export function SimilarPackages({
  currentPackageId,
  categoryId,
  destination,
  priceRange,
}: SimilarPackagesProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSimilarPackages() {
      try {
        const similarPackages = await getSimilarPackages(
          currentPackageId,
          categoryId,
          destination,
          priceRange
        );
        setPackages(similarPackages || []);
      } catch (error) {
        console.error('Failed to load similar packages:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSimilarPackages();
  }, [currentPackageId, categoryId, destination, priceRange]);

  if (isLoading) {
    return (
      <section className="py-16 bg-brand-lightest">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-brand-darkest mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="package-card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return null; // Don't show section if no similar packages
  }

  return (
    <section className="py-16 bg-brand-lightest">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-brand-darkest mb-2">
          You May Also Like
        </h2>
        <p className="text-brand-medium mb-8">
          Explore more packages similar to this one
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.slice(0, 6).map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Integration**:
```tsx
// app/(customer)/packages/[slug]/PackageDetailView.tsx
import { SimilarPackages } from '@/components/customer/SimilarPackages';

export default function PackageDetailView({ pkg }: { pkg: PackageDetail }) {
  const categoryId = pkg.package_categories?.[0]?.categories?.id;
  const priceRange = pkg.price_adult
    ? { min: pkg.price_adult, max: pkg.price_adult }
    : undefined;

  return (
    <div>
      {/* Existing package content */}
      
      {/* Similar Packages */}
      <SimilarPackages
        currentPackageId={pkg.id}
        categoryId={categoryId}
        destination={pkg.destination_name}
        priceRange={priceRange}
      />
    </div>
  );
}
```

### Definition of Done
- [ ] Similar packages section renders correctly
- [ ] All acceptance criteria met
- [ ] Similarity algorithm works as expected
- [ ] Loading states work
- [ ] Section hidden when no results
- [ ] Responsive on all devices
- [ ] Code reviewed and merged
- [ ] Performance tested (doesn't slow page load)

### Dependencies
None

---

## TVLCVR-57: Implement Review Photo Upload

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 8 hours  
**Assignee**: Developer B

### Description
Complete the review photo upload feature. The UI already exists in ReviewForm component, but photos are not being uploaded to Supabase Storage or saved to the database. Users should be able to upload a photo with their review.

### Business Value
Reviews with photos are 3x more trustworthy than text-only reviews. Photo reviews increase conversion by 15-20% and provide social proof. They also make the site more engaging and authentic.

### Acceptance Criteria
- [ ] User can select a photo when submitting a review
- [ ] Photo preview shows before submission
- [ ] Photo is uploaded to Supabase Storage bucket `review-photos`
- [ ] Photo URL is saved in `reviews.photo_url` column
- [ ] Photo appears in review display on package pages
- [ ] Photo size limited to 5MB
- [ ] Accepted formats: JPG, PNG, WebP
- [ ] Photo is resized/optimized before upload (max 1200px width)
- [ ] Loading indicator during upload
- [ ] Error handling for upload failures
- [ ] User can remove photo before submitting

### Technical Details

**Files to Create**:
```
supabase/migrations/20260716000001_add_review_photo_url.sql
```

**Files to Modify**:
```
components/customer/ReviewForm.tsx
lib/validations/review.schema.ts
lib/api/reviews.ts
```

**Database Migration**:
```sql
-- supabase/migrations/20260716000001_add_review_photo_url.sql
-- Add photo_url column to reviews table
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create review-photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-photos'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads (optional)
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'review-photos');
```

**Update Review Schema**:
```typescript
// lib/validations/review.schema.ts
export const reviewSchema = z.object({
  package_id: z.string().uuid(),
  reviewer_name: z.string().min(2, 'Name must be at least 2 characters'),
  reviewer_email: z.string().email('Invalid email address'),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().min(20, 'Review must be at least 20 characters'),
  photo_url: z.string().url().optional().nullable(), // Add this
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
```

**Photo Upload in ReviewForm**:
```tsx
// components/customer/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { X, Upload, Loader2 } from 'lucide-react';

export function ReviewForm({ packageId, onSuccess }: ReviewFormProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5MB or smaller');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    setPhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Upload photo to Supabase Storage
  const uploadPhoto = async (file: File): Promise<string | null> => {
    setIsUploadingPhoto(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `reviews/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('review-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('review-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo');
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Upload photo first if present
    let photoUrl: string | null = null;
    if (photo) {
      photoUrl = await uploadPhoto(photo);
      if (!photoUrl) {
        toast.error('Photo upload failed. Please try again.');
        return;
      }
    }

    const formData = {
      package_id: packageId,
      reviewer_name: name,
      reviewer_email: email,
      rating: rating,
      review_text: reviewText,
      photo_url: photoUrl, // Add photo URL
    };

    const result = reviewSchema.safeParse(formData);

    if (!result.success) {
      // Handle validation errors
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
      toast.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Existing form fields... */}

      {/* Photo Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-brand-darkest mb-2">
          Add a Photo (Optional)
        </label>
        
        {!photoPreview ? (
          <div className="border-2 border-dashed border-brand-light rounded-xl p-6 text-center hover:border-brand-medium transition">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
              id="review-photo"
              disabled={isUploadingPhoto}
            />
            <label
              htmlFor="review-photo"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-brand-medium" />
              <span className="text-sm text-brand-dark font-medium">
                Click to upload a photo
              </span>
              <span className="text-xs text-brand-medium">
                JPG, PNG or WebP • Max 5MB
              </span>
            </label>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={photoPreview}
              alt="Review photo preview"
              width={400}
              height={300}
              className="rounded-xl object-cover w-full max-h-64"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              disabled={isUploadingPhoto}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploadingPhoto || createReview.isPending}
        className="w-full py-3 bg-brand-dark text-white rounded-full font-semibold hover:bg-brand-darkest disabled:opacity-50 transition"
      >
        {isUploadingPhoto ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading photo...
          </span>
        ) : createReview.isPending ? (
          'Submitting...'
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
```

**Display Review Photos**:
```tsx
// In your review display component
{review.photo_url && (
  <div className="mt-3">
    <Image
      src={review.photo_url}
      alt="Review photo"
      width={400}
      height={300}
      className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition"
      onClick={() => {/* Open in lightbox/modal */}}
    />
  </div>
)}
```

**Image Optimization (Optional but Recommended)**:
```typescript
// Optional: Use sharp or similar to resize before upload
import sharp from 'sharp';

async function optimizeImage(file: File): Promise<Buffer> {
  const buffer = await file.arrayBuffer();
  return sharp(Buffer.from(buffer))
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85 })
    .toBuffer();
}
```

### Definition of Done
- [ ] Migration applied successfully
- [ ] Photo upload works in ReviewForm
- [ ] Photos saved to Supabase Storage
- [ ] Photo URLs saved in database
- [ ] Photos display in review cards
- [ ] All acceptance criteria met
- [ ] Error handling works
- [ ] Code reviewed and merged
- [ ] Tested on mobile and desktop

### Dependencies
None

---

## TVLCVR-58: Implement Newsletter Backend

**Type**: Story  
**Priority**: Medium  
**Estimated Time**: 6 hours  
**Assignee**: Developer B

### Description
Implement the backend for newsletter subscriptions. The Footer component already has a newsletter signup form UI, but it's not connected to any backend. Users should be able to subscribe to newsletters and admin should be able to view subscribers.

### Business Value
Email marketing has 4200% ROI (industry average). Building a subscriber list allows marketing campaigns for new packages, special offers, and travel tips. Early subscriber acquisition is critical for launch momentum.

### Acceptance Criteria
- [ ] `newsletters` table created in database
- [ ] API endpoint `POST /api/newsletter` handles subscriptions
- [ ] Email addresses are validated and stored
- [ ] Duplicate subscriptions are prevented
- [ ] Confirmation email sent to subscriber (double opt-in)
- [ ] Unsubscribe functionality implemented
- [ ] Admin panel page to view subscribers
- [ ] Export subscribers to CSV feature
- [ ] Success/error messages shown to user
- [ ] GDPR compliant (consent checkbox if in EU)

### Technical Details

**Files to Create**:
```
supabase/migrations/20260716000002_create_newsletters_table.sql
app/api/newsletter/route.ts
app/api/newsletter/verify/route.ts
app/api/newsletter/unsubscribe/route.ts
app/(admin)/admin/newsletter/page.tsx
lib/api/newsletter.ts
```

**Files to Modify**:
```
components/customer/Footer.tsx
```

**Database Migration**:
```sql
-- supabase/migrations/20260716000002_create_newsletters_table.sql
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(64),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  source VARCHAR(50) DEFAULT 'footer', -- Track where they subscribed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_newsletters_email ON newsletters(email);
CREATE INDEX idx_newsletters_verified ON newsletters(is_verified);

-- Grant permissions
GRANT SELECT, INSERT ON newsletters TO authenticated;
```

**Newsletter API**:
```typescript
// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendNewsletterVerificationEmail } from '@/lib/email/mailgun';
import crypto from 'crypto';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = newsletterSchema.parse(body);

    // Check if already subscribed
    const { data: existing } = await supabaseAdmin
      .from('newsletters')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.is_verified) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter.' },
          { status: 400 }
        );
      } else {
        // Resend verification
        return NextResponse.json(
          { message: 'Verification email resent. Please check your inbox.' },
          { status: 200 }
        );
      }
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert subscription
    const { error: insertError } = await supabaseAdmin
      .from('newsletters')
      .insert({
        email: email.toLowerCase(),
        verification_token: verificationToken,
        source: source || 'footer',
      });

    if (insertError) throw insertError;

    // Send verification email
    await sendNewsletterVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: 'Subscription successful! Please check your email to confirm.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
```

**Verification Endpoint**:
```typescript
// app/api/newsletter/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new Response('Missing verification token', { status: 400 });
  }

  try {
    // Find subscription by token
    const { data: subscription, error } = await supabaseAdmin
      .from('newsletters')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verification_token: null,
      })
      .eq('verification_token', token)
      .eq('is_verified', false)
      .select()
      .single();

    if (error || !subscription) {
      return new Response(
        'Invalid or expired verification link',
        { status: 400 }
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/newsletter/verified', request.url)
    );
  } catch (error) {
    console.error('Verification error:', error);
    return new Response('Verification failed', { status: 500 });
  }
}
```

**Mailgun Email Template**:
```typescript
// lib/email/mailgun.ts
export async function sendNewsletterVerificationEmail(
  email: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/verify?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1B4D1B 0%, #5F7A5F 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: #1B4D1B; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Travel Carvers!</h1>
          </div>
          <div class="content">
            <h2>Confirm Your Subscription</h2>
            <p>Thank you for subscribing to our newsletter! You'll receive:</p>
            <ul>
              <li>Exclusive travel deals and packages</li>
              <li>Travel inspiration and destination guides</li>
              <li>Early access to new packages</li>
              <li>Expert travel tips and advice</li>
            </ul>
            <p>Click the button below to confirm your subscription:</p>
            <a href="${verificationUrl}" class="button">Confirm Subscription</a>
            <p style="color: #666; font-size: 14px;">
              Or copy this link: ${verificationUrl}
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              If you didn't subscribe to this newsletter, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Travel Carvers. All rights reserved.</p>
            <p>📧 info@travelcarvers.com | 📱 +91 98765 43210</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Confirm Your Newsletter Subscription - Travel Carvers',
    html,
  });
}
```

**Update Footer Component**:
```tsx
// components/customer/Footer.tsx
const handleSubscribe = async (event: SyntheticEvent<HTMLFormElement>) => {
  event.preventDefault();

  const trimmed = email.trim();
  if (!trimmed) {
    setError('Please enter your email address.');
    return;
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    setError('Please enter a valid email address.');
    return;
  }

  setError(null);
  
  // Call API
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed, source: 'footer' }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Subscription failed');
      return;
    }

    setEmail('');
    toast.success('Subscription successful! Check your email to confirm.');
  } catch (err) {
    console.error('Subscription error:', err);
    setError('Something went wrong. Please try again.');
  }
};
```

**Admin Page to View Subscribers**:
```tsx
// app/(admin)/admin/newsletter/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    // Use server action or API route to fetch
    const response = await fetch('/api/admin/newsletter');
    const data = await response.json();
    setSubscribers(data.subscribers);
    setIsLoading(false);
  }

  async function exportToCsv() {
    const csv = [
      'Email,Verified,Subscribed At',
      ...subscribers.map(s => 
        `${s.email},${s.is_verified},${s.subscribed_at}`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-darkest">
          Newsletter Subscribers
        </h1>
        <button
          onClick={exportToCsv}
          className="px-6 py-3 bg-brand-dark text-white rounded-lg hover:bg-brand-darkest"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-brand-darkest text-white">
            <tr>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Subscribed</th>
              <th className="px-6 py-4 text-left">Source</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b">
                <td className="px-6 py-4">{subscriber.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    subscriber.is_verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscriber.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(subscriber.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{subscriber.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Definition of Done
- [ ] Migration applied successfully
- [ ] API endpoints work correctly
- [ ] Verification emails sent
- [ ] Double opt-in process complete
- [ ] Admin page shows subscribers
- [ ] Export to CSV works
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Tested end-to-end

### Dependencies
- TVLCVR-59 (Mailgun setup) should be done in parallel

---

## TVLCVR-59: Configure Mailgun Email Templates

**Type**: Task  
**Priority**: Medium  
**Estimated Time**: 4 hours  
**Assignee**: Developer A

### Description
Set up Mailgun account and configure email templates for lead notifications and review verifications. Update the email helper functions to use proper templates with brand styling.

### Business Value
Professional email templates improve brand perception and email deliverability. Transactional emails have 8x higher open rates than marketing emails - critical for lead notifications and user verification.

### Acceptance Criteria
- [ ] Mailgun account created and verified
- [ ] Domain configured (or sandbox for testing)
- [ ] API key added to environment variables
- [ ] Email templates created with brand styling
- [ ] Lead notification email template
- [ ] Review verification email template
- [ ] Newsletter verification email template (from TVLCVR-58)
- [ ] All emails tested and working
- [ ] Emails are mobile-responsive
- [ ] Unsubscribe links included where required

### Technical Details

**Mailgun Setup**:
1. Create account at mailgun.com
2. Verify domain (or use sandbox for testing)
3. Get API key
4. Add to `.env.local`:

```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxxx
MAILGUN_DOMAIN=mail.travelcarvers.com
MAILGUN_FROM_EMAIL=noreply@travelcarvers.com
MAILGUN_FROM_NAME="Travel Carvers"
```

**Update Mailgun Client**:
```typescript
// lib/email/mailgun.ts
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN || '',
      {
        from: `${process.env.MAILGUN_FROM_NAME} <${process.env.MAILGUN_FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
        text: text || stripHtml(html),
      }
    );
    
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
```

**Lead Notification Template**:
```typescript
// lib/email/templates/leadNotification.ts
export function getLeadNotificationTemplate(lead: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1B4D1B 0%, #5F7A5F 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .info-row { display: flex; margin: 15px 0; }
          .label { font-weight: bold; color: #1B4D1B; min-width: 150px; }
          .value { color: #333; }
          .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #1B4D1B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🎉 New Lead Received!</h1>
          </div>
          
          <div class="content">
            <p style="font-size: 16px; color: #666;">You have received a new inquiry. Here are the details:</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${lead.name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${lead.email}">${lead.email}</a></span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${lead.phone}">${lead.phone}</a></span>
              </div>
              ${lead.packages?.title ? `
              <div class="info-row">
                <span class="label">Package:</span>
                <span class="value">${lead.packages.title}</span>
              </div>
              ` : ''}
              ${lead.travel_start_date ? `
              <div class="info-row">
                <span class="label">Travel Date:</span>
                <span class="value">${new Date(lead.travel_start_date).toLocaleDateString()}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Travelers:</span>
                <span class="value">${lead.number_of_adults} Adult(s), ${lead.number_of_children} Child(ren), ${lead.number_of_infants} Infant(s)</span>
              </div>
              ${lead.message ? `
              <div style="margin-top: 15px;">
                <span class="label">Message:</span>
                <p style="color: #333; margin: 10px 0; line-height: 1.6;">${lead.message}</p>
              </div>
              ` : ''}
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads" class="button">
                View in Admin Panel
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Pro Tip:</strong> Respond within 24 hours to increase conversion rates by 60%!
            </p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Travel Carvers Admin Panel</p>
            <p>This is an automated notification email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendLeadNotification(lead: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@travelcarvers.com';
  
  return sendEmail({
    to: adminEmail,
    subject: `New Lead: ${lead.name} - ${lead.packages?.title || 'General Inquiry'}`,
    html: getLeadNotificationTemplate(lead),
  });
}
```

**Review Verification Template**:
(Already created in previous tickets, ensure it matches brand styling)

**Testing**:
```typescript
// Create test script: scripts/test-email.ts
import { sendLeadNotification } from '@/lib/email/templates/leadNotification';

const testLead = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  packages: { title: 'Bali Paradise - 7 Days' },
  travel_start_date: '2026-08-15',
  number_of_adults: 2,
  number_of_children: 1,
  number_of_infants: 0,
  message: 'We are interested in this package for our family vacation.',
};

sendLeadNotification(testLead)
  .then(() => console.log('✅ Test email sent'))
  .catch((err) => console.error('❌ Test failed:', err));
```

Run test:
```bash
npx tsx scripts/test-email.ts
```

### Definition of Done
- [ ] Mailgun account setup complete
- [ ] All email templates created
- [ ] Templates are brand-consistent
- [ ] Emails are mobile-responsive
- [ ] Test emails sent and received
- [ ] All acceptance criteria met
- [ ] Code reviewed and merged
- [ ] Documentation updated

### Dependencies
None (can be done in parallel with TVLCVR-58)

---

## TVLCVR-60: Test Email Delivery End-to-End

**Type**: Task  
**Priority**: Medium  
**Estimated Time**: 2 hours  
**Assignee**: Developer A

### Description
Comprehensive testing of all email functionality to ensure emails are delivered correctly, render properly across email clients, and don't end up in spam folders.

### Business Value
Email deliverability is critical - if lead notifications don't reach the admin, leads are lost. If verification emails go to spam, conversions drop. Testing prevents revenue loss.

### Acceptance Criteria
- [ ] Lead notification emails received when form submitted
- [ ] Review verification emails sent and links work
- [ ] Newsletter verification emails sent and links work
- [ ] Emails render correctly in Gmail, Outlook, Apple Mail
- [ ] Emails render correctly on mobile devices
- [ ] Images load properly
- [ ] Links are clickable and work
- [ ] Unsubscribe links work
- [ ] Emails don't go to spam (check spam score)
- [ ] Email tracking works (if enabled)

### Technical Details

**Test Checklist**:

1. **Lead Notification Test**:
   - Submit a lead form from the website
   - Verify admin receives email within 1 minute
   - Check all lead details are present
   - Click "View in Admin Panel" link - should work
   - Check email on mobile - should be readable

2. **Review Verification Test**:
   - Submit a review
   - Verify verification email received
   - Click verification link - should redirect to success page
   - Check review is marked as verified in database
   - Test expired token - should show error

3. **Newsletter Verification Test**:
   - Subscribe to newsletter from footer
   - Verify confirmation email received
   - Click confirmation link - should verify subscription
   - Try subscribing again - should show already subscribed message

4. **Spam Score Test**:
   - Use https://www.mail-tester.com/
   - Send test email to provided address
   - Check spam score (should be 8/10 or higher)
   - Fix any issues flagged

5. **Email Client Testing**:
   - Forward test emails to:
     - Gmail
     - Outlook.com
     - Apple Mail (if available)
   - Check rendering in each client

**Spam Score Improvements**:
```typescript
// Ensure these are set in email headers
const emailHeaders = {
  'List-Unsubscribe': `<${unsubscribeUrl}>`,
  'X-Entity-Ref-ID': lead.id,
  'Precedence': 'bulk',
};
```

**SPF, DKIM, DMARC Setup**:
```bash
# Add these DNS records for your domain
# SPF:
v=spf1 include:mailgun.org ~all

# DKIM:
(Mailgun provides this - add to DNS)

# DMARC:
v=DMARC1; p=none; rua=mailto:postmaster@travelcarvers.com
```

**Test Script**:
```bash
#!/bin/bash
# scripts/test-emails.sh

echo "🧪 Testing Email Delivery..."

echo "1️⃣ Testing Lead Notification..."
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "package_id": "",
    "number_of_adults": 2,
    "number_of_children": 0,
    "number_of_infants": 0,
    "travel_start_date": "2026-08-01",
    "message": "This is a test inquiry"
  }'

echo "\n2️⃣ Testing Newsletter Subscription..."
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

echo "\n✅ Tests complete. Check your email inbox."
```

### Definition of Done
- [ ] All acceptance criteria met
- [ ] All email types tested
- [ ] Spam score is acceptable (8/10+)
- [ ] No emails in spam folder
- [ ] Mobile rendering verified
- [ ] Documentation updated with test results
- [ ] Issues fixed if any found

### Dependencies
- TVLCVR-58 (Newsletter backend)
- TVLCVR-59 (Mailgun setup)

---

## TVLCVR-61: Add Trust Badges Section to Homepage

**Type**: Story  
**Priority**: Low  
**Estimated Time**: 3 hours  
**Assignee**: Developer B

### Description
Add trust badges section to the homepage. Trust badges (e.g., "50+ Destinations", "24/7 Support", "10,000+ Happy Travelers") are managed in the admin panel but not currently displayed on the homepage.

### Business Value
Trust badges increase conversion by 15-20% by building credibility and reducing purchase anxiety. They're especially important for travel sites where trust is critical for high-value purchases.

### Acceptance Criteria
- [ ] Trust badges section appears on homepage
- [ ] Badges load from database (trust_badges table)
- [ ] Only active badges (is_active=true) are shown
- [ ] Badges are ordered by display_order
- [ ] Each badge shows icon, value, and title
- [ ] Badges cycle/animate automatically (optional)
- [ ] Section is responsive (2 cols mobile, 4 cols desktop)
- [ ] Loading state while fetching
- [ ] Empty state if no active badges

### Technical Details

**Files to Create**:
```
components/customer/TrustBadges.tsx
lib/hooks/useTrustBadges.ts (may already exist)
```

**Files to Modify**:
```
app/(customer)/HomeView.tsx
```

**TrustBadges Component**:
```tsx
'use client';

import { useTrustBadges } from '@/lib/hooks/useTrustBadges';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import * as Icons from 'lucide-react';

export function TrustBadges() {
  const { data: badges, isLoading } = useTrustBadges();

  if (isLoading) {
    return (
      <section className="py-12 bg-brand-lightest">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeleton key={i} variant="trust-badge" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeBadges = badges?.filter(b => b.is_active) || [];

  if (activeBadges.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-brand-lightest">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {activeBadges.map((badge) => {
            const IconComponent = Icons[badge.icon_name as keyof typeof Icons];
            
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl hover:shadow-lg transition group"
              >
                {IconComponent && (
                  <div className="mb-4 p-4 bg-brand-lightest rounded-full group-hover:scale-110 transition">
                    <IconComponent className="w-8 h-8 text-brand-dark" />
                  </div>
                )}
                <div className="text-3xl font-bold text-brand-darkest mb-2">
                  {badge.value}
                </div>
                <div className="text-sm font-medium text-brand-medium">
                  {badge.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Integration in Homepage**:
```tsx
// app/(customer)/HomeView.tsx
import { TrustBadges } from '@/components/customer/TrustBadges';

export default function HomeView() {
  return (
    <div>
      <HeroSection />
      
      {/* Add Trust Badges after hero */}
      <TrustBadges />
      
      {/* Rest of homepage sections */}
    </div>
  );
}
```

**Optional: Cycling Animation**:
```tsx
// Make badges cycle with animation
const [visibleBadges, setVisibleBadges] = useState(activeBadges.slice(0, 4));

useEffect(() => {
  if (activeBadges.length <= 4) return;

  const interval = setInterval(() => {
    setVisibleBadges((prev) => {
      const currentIndex = activeBadges.indexOf(prev[0]);
      const nextIndex = (currentIndex + 1) % activeBadges.length;
      return activeBadges.slice(nextIndex, nextIndex + 4);
    });
  }, 5000);

  return () => clearInterval(interval);
}, [activeBadges]);
```

### Definition of Done
- [ ] Trust badges section visible on homepage
- [ ] All acceptance criteria met
- [ ] Badges load from database
- [ ] Responsive design works
- [ ] Code reviewed and merged
- [ ] Tested with different numbers of badges

### Dependencies
None

---

## TVLCVR-62: Add Testimonials Auto-Scroll Section to Homepage

**Type**: Story  
**Priority**: Low  
**Estimated Time**: 4 hours  
**Assignee**: Developer B

### Description
Add an auto-scrolling testimonials/reviews section to the homepage. This should pull reviews with rating >= 4 from the database and display them in an infinite horizontal scroll.

### Business Value
Social proof is one of the most powerful conversion tools. Reviews increase trust and conversion by 20-30%. Auto-scrolling testimonials keep the homepage dynamic and engaging.

### Acceptance Criteria
- [ ] Testimonials section appears on homepage
- [ ] Reviews with rating >= 4 and is_visible=true are shown
- [ ] Auto-scrolls horizontally (infinite loop)
- [ ] Each testimonial shows: reviewer name, rating stars, review text, package name
- [ ] Smooth animation (no jank)
- [ ] Pauses on hover (optional)
- [ ] Responsive (stacks on mobile)
- [ ] Shows at least 6 reviews in carousel
- [ ] Falls back gracefully if no reviews exist

### Technical Details

**Files to Create**:
```
components/customer/TestimonialsScroll.tsx
```

**Files to Modify**:
```
app/(customer)/HomeView.tsx
lib/api/public/reviews.ts
```

**Get Positive Reviews**:
```typescript
// lib/api/public/reviews.ts
export async function getPositiveReviews(limit: number = 20) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      reviewer_name,
      rating,
      review_text,
      created_at,
      packages (
        title,
        slug
      )
    `)
    .eq('is_visible', true)
    .gte('rating', 4)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}
```

**TestimonialsScroll Component**:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { getPositiveReviews } from '@/lib/api/public/reviews';
import { Star } from 'lucide-react';
import Link from 'next/link';

export function TestimonialsScroll() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getPositiveReviews();
        setReviews(data || []);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, []);

  if (isLoading || reviews.length === 0) {
    return null;
  }

  // Duplicate reviews for infinite scroll effect
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <h2 className="text-4xl font-bold text-brand-darkest text-center mb-3">
          What Our Travelers Say
        </h2>
        <p className="text-center text-brand-medium text-lg">
          Real experiences from real travelers
        </p>
      </div>

      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling container */}
        <div className="flex gap-6 animate-scroll hover:pause-animation">
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0 w-[400px] bg-brand-lightest rounded-2xl p-6 hover:shadow-lg transition"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-brand-darkest mb-4 line-clamp-4 leading-relaxed">
                "{review.review_text}"
              </p>

              {/* Reviewer */}
              <div className="flex items-center justify-between border-t border-brand-light pt-4">
                <div>
                  <p className="font-semibold text-brand-darkest">
                    {review.reviewer_name}
                  </p>
                  {review.packages && (
                    <Link
                      href={`/packages/${review.packages.slug}`}
                      className="text-sm text-brand-medium hover:text-brand-dark"
                    >
                      {review.packages.title}
                    </Link>
                  )}
                </div>
                <div className="text-xs text-brand-medium">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**CSS Animation**:
```css
/* Add to globals.css */
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-400px * var(--review-count) - 1.5rem * var(--review-count)));
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.pause-animation:hover {
  animation-play-state: paused;
}
```

**Alternative: Using CSS only**:
```tsx
<style jsx>{`
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - 1.5rem));
    }
  }

  .scrolling-wrapper {
    animation: scroll ${reviews.length * 5}s linear infinite;
  }

  .scrolling-wrapper:hover {
    animation-play-state: paused;
  }
`}</style>
```

**Integration in Homepage**:
```tsx
// app/(customer)/HomeView.tsx
import { TestimonialsScroll } from '@/components/customer/TestimonialsScroll';

export default function HomeView() {
  return (
    <div>
      <HeroSection />
      <TrustBadges />
      
      {/* Categories section */}
      <CategoryShowcase />
      
      {/* Featured packages */}
      <FeaturedPackages />
      
      {/* Add Testimonials */}
      <TestimonialsScroll />
    </div>
  );
}
```

### Definition of Done
- [ ] Testimonials section visible on homepage
- [ ] All acceptance criteria met
- [ ] Auto-scroll animation smooth
- [ ] Pause on hover works
- [ ] Responsive design
- [ ] Code reviewed and merged
- [ ] Tested with various review counts

### Dependencies
None

---

## Sprint 2 Summary

**Total Tickets**: 8  
**Total Estimated Time**: 35 hours  
**Duration**: 2 weeks (10 working days)  
**Team**: 2 developers

### Developer Allocation

**Developer A** (18 hours):
- TVLCVR-55: Share buttons (3h)
- TVLCVR-56: Similar packages (5h)
- TVLCVR-59: Mailgun templates (4h)
- TVLCVR-60: Email testing (2h)
- Buffer time: 4h

**Developer B** (17 hours):
- TVLCVR-57: Review photo upload (8h)
- TVLCVR-58: Newsletter backend (6h)
- TVLCVR-61: Trust badges (3h)
- TVLCVR-62: Testimonials scroll (4h)
- Buffer time: 4h

### Success Metrics
- [ ] All 8 tickets completed and merged
- [ ] Zero critical bugs
- [ ] Email deliverability > 95%
- [ ] Photo uploads work consistently
- [ ] Newsletter verified subscriptions > 80%
- [ ] Testimonials scroll smoothly (no jank)

### Definition of Sprint Done
- [ ] All tickets meet acceptance criteria
- [ ] Code reviewed and merged to main
- [ ] All features tested end-to-end
- [ ] Email system fully operational
- [ ] Build passes
- [ ] Ready for user acceptance testing

---

**Sprint 2 tickets ready! 🚀**
