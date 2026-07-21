"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Coffee, Utensils, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { LeadFormModal } from "@/components/customer/LeadFormModal";
import { SimilarPackages } from "@/components/customer/SimilarPackages";
import ShareButtons from "@/components/customer/ShareButtons";
import { ReviewForm } from "@/components/customer/ReviewForm";
import ReviewPhotos from "@/components/customer/ReviewPhotos";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { isIconName } from "@/lib/icons";
import { youTubeEmbedUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getApprovedReviews } from "@/lib/api/public/reviews";
import { toReviewVM } from "@/lib/packageDetail";
import type {
  PackageDetail,
  ItineraryDayVM,
  GalleryImageVM,
  InclusionVM,
  StayVM,
  PlaceVM,
  PricingTierVM,
  ReviewVM,
  RatingBucketVM,
} from "@/lib/packageDetail";

/* -------------------- Company-wide static content --------------------- */
/* These are standard across every package (there are no per-package tables for them),
   so they stay as constants rather than being faked as package-specific data. */

const CANCELLATION_POLICY = [
  { window: "30+ days before departure", refund: "90% refund" },
  { window: "15–29 days before departure", refund: "50% refund" },
  { window: "7–14 days before departure", refund: "25% refund" },
  { window: "Within 7 days", refund: "No refund" },
];

const DOCUMENTS_NEEDED = [
  "Government-issued photo ID (passport for international travel)",
  "2 recent passport-size photographs",
  "Valid travel insurance certificate (recommended)",
  "Any visas or permits required for the destination",
];

const FAQS = [
  { q: "How do I book this package?", a: "Send an enquiry using the “Reserve Your Spot” button and our travel team will get back to you within 24 hours to confirm availability, customise the plan and share payment details." },
  { q: "Can the itinerary be customised?", a: "Yes. Every package is a starting point — tell us your dates, group size and preferences and we’ll tailor the trip around them." },
  { q: "What is the payment process?", a: "A deposit confirms your booking, with the balance due before departure. We’ll share the exact schedule and secure payment options when you enquire." },
  { q: "Is travel insurance included?", a: "Travel insurance is not included in the package price. We strongly recommend arranging cover, and can point you to trusted providers." },
  { q: "Who do I contact during the trip?", a: "You’ll have a dedicated point of contact and 24/7 support line for the duration of your journey." },
];

/* --------------------------- Tabs ----------------------------- */

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "inclusions", label: "Inclusions" },
  { id: "stay", label: "Stay" },
  { id: "gallery", label: "Gallery" },
  { id: "pricing", label: "Pricing" },
  { id: "info", label: "Additional Info" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Reviews" },
  { id: "similar", label: "Similar Packages" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* --------------------------- Icons ----------------------------- */

const Icon = {
  chevron: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.8 5.9 21.2l1.5-6.9-5.2-4.7 6.9-.7L12 2.5z" />
    </svg>
  ),
  clock: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
      <path d="M16 4.5a3 3 0 010 6" strokeLinecap="round" />
      <path d="M17 14c3 .3 5 2.6 5 6" strokeLinecap="round" />
    </svg>
  ),
  pin: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M12 21s7-6.7 7-12a7 7 0 10-14 0c0 5.3 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  ),
  check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} {...p}>
      <path d="M4 12.5l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  x: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} {...p}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ),
  plane: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 00-3 0v4.5l-8 5v2l8-2.5V17l-2.5 1.8V20l3.5-1 3.5 1v-1.2L12 17v-4l9 2.5z" />
    </svg>
  ),
  shield: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
  close: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
    </svg>
  ),
};

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PackageDetailView({ detail }: { detail: PackageDetail }) {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [isSticky, setIsSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [guests, setGuests] = useState(2);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const navSentinel = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data: rawDbReviews } = useQuery({
    queryKey: ["reviews", "package", detail.id],
    queryFn: () => getApprovedReviews(detail.id),
  });

  const activeReviews = rawDbReviews ? rawDbReviews.map(toReviewVM) : detail.reviews;
  const reviewCount = activeReviews.length;
  const rating = reviewCount > 0
    ? Math.round((activeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount) * 10) / 10
    : null;

  const counts = [0, 0, 0, 0, 0];
  activeReviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1] += 1;
  });
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: reviewCount ? Math.round((counts[stars - 1] / reviewCount) * 100) : 0,
  }));

  useEffect(() => {
    const el = navSentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleTabsScroll = () => {
    const el = tabsContainerRef.current;
    if (!el) return;

    // Show left arrow if scrolled right
    setShowLeftArrow(el.scrollLeft > 5);

    // Show right arrow if not scrolled to the end
    const isEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    setShowRightArrow(!isEnd);
  };

  useEffect(() => {
    handleTabsScroll();
    // Delay checking to ensure mount layout measurements are ready
    const timer = setTimeout(handleTabsScroll, 300);
    window.addEventListener("resize", handleTabsScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleTabsScroll);
    };
  }, []);

  const goTo = (id: TabId) => {
    setActiveTab(id);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const total = detail.startingPrice != null ? guests * detail.startingPrice : 0;
  const ratingValue =
    reviewCount > 0 && rating != null
      ? `${rating} · ${reviewCount} reviews`
      : "New package";

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-body text-[15px] text-[--foreground]">
      <FontLoader />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 pt-5 text-xs text-slate-700 sm:px-8">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-brand-dark">Home</Link></li>
          <Icon.chevron className="h-3 w-3 text-slate-300" />
          <li><Link href="/packages" className="hover:text-brand-dark">Packages</Link></li>
          <Icon.chevron className="h-3 w-3 text-slate-300" />
          <li className="font-medium text-brand-dark">{detail.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="relative mx-auto mt-4 max-w-7xl px-5 sm:px-8">
        <div className="relative h-[52vh] min-h-[340px] w-full overflow-hidden rounded-2xl sm:h-[62vh]">
          <Image src={detail.cover} alt={detail.title} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
          <div className="absolute inset-0 overlay-brand-primary" />
          <div className="absolute inset-x-0 bottom-0 p-6 pb-16 sm:p-10 z-10">
            {detail.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Icon.pin className="h-3.5 w-3.5" /> {detail.location}
              </span>
            )}
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
              {detail.title}
            </h1>
            {detail.tagline && <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{detail.tagline}</p>}
          </div>
        </div>

        {/* Boarding-pass stat stub, overlapping hero */}
        <div className="ticket relative z-10 mx-auto -mt-8 grid grid-cols-2 gap-x-4 gap-y-6 max-w-4xl rounded-xl border border-brand-light bg-white px-6 py-5 shadow-[0_12px_40px_-15px_rgba(27,77,27,0.35)] sm:mx-6 sm:px-8 sm:flex sm:flex-nowrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-0">
          <Stat icon={<Icon.clock className="h-4 w-4" />} label="Duration" value={detail.duration} />
          <TicketDivider />
          <Stat
            icon={<Icon.star className="h-4 w-4 fill-current text-amber-400" />}
            label="Rating"
            value={ratingValue}
          />
          <TicketDivider />
          <Stat icon={<Icon.users className="h-4 w-4" />} label="Group size" value={detail.groupSize} />
          <TicketDivider />
          <Stat
            label="From"
            value={
              <span className="font-mono text-lg text-brand-darkest">
                {detail.startingPrice != null ? money(detail.startingPrice) : "On request"}
              </span>
            }
            sub={detail.startingPrice != null ? "per adult" : undefined}
          />
        </div>
      </header>

      <div ref={navSentinel} />

      {/* Sticky tab nav */}
      <div className={`sticky top-0 z-40 border-b border-brand-light/70 bg-white/90 backdrop-blur-md transition-shadow ${isSticky ? "shadow-sm" : ""}`}>
        <div className="relative mx-auto max-w-7xl">
          <div
            ref={tabsContainerRef}
            onScroll={handleTabsScroll}
            className="overflow-x-auto px-5 sm:px-8 scrollbar-hide"
          >
            <div className="flex min-w-max gap-1 py-1 px-12 sm:px-0">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => goTo(t.id)}
                  className={`relative whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors ${activeTab === t.id ? "text-brand-darkest font-semibold" : "text-slate-700 hover:text-brand-dark"
                    }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-dark" />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Visual fade-out and arrow indicator on mobile to suggest swiping left */}
          {showLeftArrow && (
            <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-2 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none sm:hidden z-10 w-16">
              <Icon.chevron className="w-5 h-5 text-brand-dark animate-pulse rotate-180" />
            </div>
          )}
          {/* Visual fade-out and arrow indicator on mobile to suggest swiping right */}
          {showRightArrow && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-2 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none sm:hidden z-10 w-16">
              <Icon.chevron className="w-5 h-5 text-brand-dark animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Body: content + sidebar */}
      <div ref={sectionRef} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-10 sm:px-8">
        <div className="lg:hidden mb-2">
          <ShareButtons title={detail.title} slug={detail.slug} />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <main className="min-w-0">
            {activeTab === "overview" && (
              <Overview tagline={detail.description || detail.tagline} highlights={detail.highlights} bestTime={detail.bestTime} />
            )}
            {activeTab === "itinerary" && <Itinerary days={detail.itinerary} />}
            {activeTab === "inclusions" && <Inclusions inclusions={detail.inclusions} exclusions={detail.exclusions} />}
            {activeTab === "stay" && <Stay stays={detail.stays} />}
            {activeTab === "gallery" && <Gallery gallery={detail.gallery} videos={detail.videos} onOpen={setLightbox} />}
            {activeTab === "pricing" && <Pricing tiers={detail.pricingTiers} />}
            {activeTab === "info" && <AdditionalInfo places={detail.places} />}
            {activeTab === "faqs" && <FAQs open={openFaq} setOpen={setOpenFaq} />}
            {activeTab === "reviews" && (
              <Reviews packageId={detail.id} rating={rating} reviewCount={reviewCount} ratingBreakdown={ratingBreakdown} reviews={activeReviews} />
            )}
            {activeTab === "similar" && (
              <SimilarPackages packageId={detail.id} categoryId={detail.categoryId} />
            )}
          </main>

          {/* Booking sidebar */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <BookingCard startingPrice={detail.startingPrice} guests={guests} setGuests={setGuests} total={total} onBookNow={() => setIsLeadFormOpen(true)} title={detail.title} slug={detail.slug} />
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-brand-light bg-white/95 px-5 py-3 backdrop-blur-md lg:hidden">
        <div>
          <p className="text-[11px] text-slate-700">From</p>
          <p className="font-mono text-lg font-semibold text-brand-darkest">
            {detail.startingPrice != null ? money(detail.startingPrice) : "On request"}
          </p>
        </div>
        <button
          onClick={() => setIsLeadFormOpen(true)}
          className="rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 active:scale-[0.98] cursor-pointer"
        >
          Reserve Your Spot
        </button>
      </div>
      <div className="h-16 lg:hidden" />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        packageId={detail.slug}
        packageTitle={detail.title}
      />

      {/* Lightbox */}
      {lightbox !== null && detail.gallery[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute right-6 top-6 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <Icon.close className="h-7 w-7" />
          </button>
          <img
            src={detail.gallery[lightbox].src}
            alt={detail.gallery[lightbox].alt}
            loading="lazy"
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/* --------------------------- Small pieces --------------------------- */

function Stat({ icon, label, value, sub }: { icon?: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon && <span className="text-brand-medium">{icon}</span>}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-600">{label}</p>
        <p className="text-sm font-semibold text-brand-darkest">{value}</p>
        {sub && <p className="text-[11px] text-slate-600">{sub}</p>}
      </div>
    </div>
  );
}

function TicketDivider() {
  return <span className="hidden h-8 w-px bg-brand-light/70 sm:block" />;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-medium">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-brand-darkest sm:text-3xl">{title}</h2>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-light/70 bg-white/50 px-6 py-12 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

/* ------------------------------ Tabs -------------------------------- */

function Overview({ tagline, highlights, bestTime }: { tagline: string; highlights: string[]; bestTime: string | null }) {
  return (
    <div className="space-y-10">
      <div>
        <SectionHeading eyebrow="The Trip" title="Overview" />
        <p className="max-w-2xl leading-relaxed text-slate-800">{tagline}</p>
      </div>

      {highlights.length > 0 && (
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-brand-darkest">Highlights</h3>
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-brand-dark">
                  <Icon.check className="h-3 w-3" />
                </span>
                <span className="text-sm leading-relaxed text-slate-800">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bestTime && (
        <div className="rounded-xl border border-brand-light/70 bg-brand-tint-subtle p-5">
          <h3 className="font-display text-base font-semibold text-brand-darkest">Best time to go</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{bestTime}</p>
        </div>
      )}
    </div>
  );
}

/* Day rows fade/slide in one after another when the itinerary tab opens. */
const ITINERARY_LIST_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const ITINERARY_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/** Breakfast / Lunch / Dinner each get their own icon; anything else falls back to a check. */
const MEAL_ICONS: Record<string, LucideIcon> = {
  Breakfast: Coffee,
  Lunch: Utensils,
  Dinner: UtensilsCrossed,
};

function MealIcon({ meal, className }: { meal: string; className?: string }) {
  // Static-registry lookup kept in one place, same pattern as DynamicIcon.
  const Component = MEAL_ICONS[meal];
  if (!Component) return <Icon.check className={className} />;
  return <Component className={className} aria-hidden="true" />;
}

/** The expandable body of a single day: segmented activities, meals, and photos. */
function DayDetails({ day }: { day: ItineraryDayVM }) {
  const isEmpty = day.activities.length === 0 && day.meals.length === 0 && day.images.length === 0;

  return (
    <div className="space-y-5 border-t border-brand-light/50 px-4 pb-5 pt-4 sm:px-5">
      {day.activities.length > 0 && (
        <ol className="relative space-y-4 pl-5">
          {/* Timeline spine linking the morning → afternoon → evening markers. */}
          <span aria-hidden className="absolute bottom-2 left-[3px] top-2 w-px bg-brand-light" />
          {day.activities.map((activity) => (
            <li key={activity.label} className="relative">
              <span
                aria-hidden
                className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-brand-dark ring-4 ring-white"
              />
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-medium">
                {activity.label}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-800">{activity.text}</p>
            </li>
          ))}
        </ol>
      )}

      {day.meals.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-medium">
            Meals included
          </p>
          <div className="flex flex-wrap gap-2">
            {day.meals.map((meal) => (
              <span
                key={meal}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-lightest px-3 py-1 text-xs font-medium text-brand-darkest"
              >
                <MealIcon meal={meal} className="h-3.5 w-3.5 text-brand-dark" />
                {meal}
              </span>
            ))}
          </div>
        </div>
      )}

      {day.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {day.images.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={src}
                alt={`${day.title} — photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {isEmpty && <p className="text-sm text-slate-600">Details for this day are coming soon.</p>}
    </div>
  );
}

function Itinerary({ days }: { days: ItineraryDayVM[] }) {
  // Collapsed by default — a day expands only when clicked (single day open at a time).
  const [openDay, setOpenDay] = useState<number | null>(null);

  return (
    <div>
      <SectionHeading eyebrow="Day by Day" title="Itinerary" />

      {days.length === 0 ? (
        <EmptyNote>A detailed day-by-day itinerary for this package is coming soon.</EmptyNote>
      ) : (
        <motion.ol
          className="space-y-3"
          variants={ITINERARY_LIST_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {days.map((d) => {
            const isOpen = openDay === d.n;
            return (
              <motion.li
                key={d.n}
                variants={ITINERARY_ITEM_VARIANTS}
                className="overflow-hidden rounded-xl border border-brand-light/60 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenDay(isOpen ? null : d.n)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-brand-tint-subtle/50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-darkest font-mono text-sm font-semibold text-white">
                    {String(d.n).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 font-display text-base font-semibold text-brand-darkest">
                    {d.title}
                  </span>
                  <Icon.chevron
                    className={`h-4 w-4 shrink-0 text-brand-medium transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <DayDetails day={d} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ol>
      )}
    </div>
  );
}

function InclusionIcon({ icon, included }: { icon: string | null; included: boolean }) {
  const className = `mt-0.5 h-4 w-4 shrink-0 ${included ? "text-brand-medium" : "text-slate-600"}`;
  if (icon && isIconName(icon)) {
    return <DynamicIcon name={icon} className={className} />;
  }
  return included ? <Icon.check className={className} /> : <Icon.x className={className} />;
}

function Inclusions({ inclusions, exclusions }: { inclusions: InclusionVM[]; exclusions: InclusionVM[] }) {
  return (
    <div>
      <SectionHeading eyebrow="What You Get" title="Inclusions & Exclusions" />
      {inclusions.length === 0 && exclusions.length === 0 ? (
        <EmptyNote>Inclusion details for this package will be published shortly.</EmptyNote>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-light/70 p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Included</h3>
            <ul className="space-y-2.5">
              {inclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <InclusionIcon icon={item.icon} included />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-slate-700">Not included</h3>
            <ul className="space-y-2.5">
              {exclusions.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <InclusionIcon icon={item.icon} included={false} />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/** Responsive, privacy-friendly YouTube embed. Renders nothing for a URL we can't parse. */
function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = youTubeEmbedUrl(url);
  if (!embed) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-brand-light/60 bg-black">
      <iframe
        src={embed}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

function Gallery({ gallery, videos, onOpen }: { gallery: GalleryImageVM[]; videos: string[]; onOpen: (i: number) => void }) {
  const hasImages = gallery.length > 0;
  // A video may be an unparseable URL, so gate the section on something renderable.
  const playableVideos = videos.filter((url) => youTubeEmbedUrl(url) !== null);
  const hasVideos = playableVideos.length > 0;

  return (
    <div>
      <SectionHeading eyebrow="In Pictures" title="Gallery" />
      {!hasImages && !hasVideos ? (
        <EmptyNote>No photos or videos have been added for this package yet.</EmptyNote>
      ) : (
        <div className="space-y-8">
          {hasImages && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => onOpen(i)}
                  className={`group overflow-hidden rounded-xl bg-slate-100 ${i === 1 || i === 4 ? "row-span-2" : ""}`}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}

          {hasVideos && (
            <div>
              <h3 className="mb-4 font-display text-lg font-semibold text-brand-darkest">Videos</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {playableVideos.map((url, i) => (
                  <VideoEmbed key={url} url={url} title={`Package video ${i + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Pricing({ tiers }: { tiers: PricingTierVM[] }) {
  return (
    <div>
      <SectionHeading eyebrow="Cost Breakdown" title="Pricing" />
      {tiers.length === 0 ? (
        <EmptyNote>Pricing for this package is available on request — send us an enquiry and we’ll share a tailored quote.</EmptyNote>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-brand-light/70">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-tint-subtle text-left text-xs uppercase tracking-wide text-slate-700">
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Details</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light/60">
                {tiers.map((t) => (
                  <tr key={t.label}>
                    <td className="px-5 py-4 font-medium text-brand-darkest">{t.label}</td>
                    <td className="px-5 py-4 text-slate-700">{t.sub}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold text-brand-darkest">{money(t.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-600">Prices are per person, in INR, and exclude flights and travel insurance.</p>
        </>
      )}
    </div>
  );
}

function PlaceCard({ place }: { place: PlaceVM }) {
  return (
    <div className="rounded-xl border border-brand-light/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="flex items-center gap-1.5 font-display text-base font-semibold text-brand-darkest">
          <Icon.pin className="h-4 w-4 shrink-0 text-brand-medium" />
          {place.name}
        </h4>
        {place.entryFee && (
          <span className="shrink-0 rounded-full bg-brand-tint-subtle px-2.5 py-1 text-xs font-medium text-brand-darkest">
            {place.entryFee}
          </span>
        )}
      </div>
      {place.description && <p className="mt-2 text-sm leading-relaxed text-slate-800">{place.description}</p>}
      {place.distance && <p className="mt-2 text-xs text-slate-600">{place.distance} from hotel</p>}
    </div>
  );
}

function AdditionalInfo({ places }: { places: PlaceVM[] }) {
  return (
    <div className="space-y-10">
      {places.length > 0 && (
        <div>
          <SectionHeading eyebrow="Around the Trip" title="Places to Visit" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {places.map((place, i) => (
              <PlaceCard key={i} place={place} />
            ))}
          </div>
        </div>
      )}

      <div>
        <SectionHeading eyebrow="Fine Print" title="Additional Information" />
        <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Cancellation policy</h3>
        <div className="overflow-hidden rounded-xl border border-brand-light/70">
          {CANCELLATION_POLICY.map((c, i) => (
            <div
              key={c.window}
              className={`flex items-center justify-between px-5 py-3.5 text-sm ${i % 2 ? "bg-brand-tint-subtle" : ""}`}
            >
              <span className="text-slate-800">{c.window}</span>
              <span className="font-mono font-medium text-brand-darkest">{c.refund}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-display text-base font-semibold text-brand-darkest">Documents required</h3>
        <ul className="space-y-2.5">
          {DOCUMENTS_NEEDED.map((d, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
              <Icon.check className="mt-0.5 h-4 w-4 shrink-0 text-brand-medium" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FAQs({ open, setOpen }: { open: number | null; setOpen: (i: number | null) => void }) {
  return (
    <div>
      <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
      <div className="divide-y divide-brand-light/60 rounded-xl border border-brand-light/70 bg-white">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-brand-darkest">{f.q}</span>
                <Icon.chevron className={`h-4 w-4 shrink-0 text-brand-medium transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>
              {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-800">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Reviews({ packageId, rating, reviewCount, ratingBreakdown, reviews }: { packageId: string; rating: number | null; reviewCount: number; ratingBreakdown: RatingBucketVM[]; reviews: ReviewVM[] }) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  return (
    <div>
      <SectionHeading eyebrow="Traveler Voices" title="Reviews" />

      {reviewCount === 0 ? (
        <div className="space-y-6">
          <EmptyNote>No reviews yet — be the first to share your experience once you travel with us.</EmptyNote>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-darkest active:scale-95 cursor-pointer"
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </button>
          </div>
          {showReviewForm && (
            <div className="animate-in fade-in duration-300">
              <ReviewForm packageId={packageId} onSuccess={() => setShowReviewForm(false)} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-6 rounded-xl border border-brand-light/70 p-5 sm:flex-row sm:items-center sm:gap-10">
            <div className="text-center sm:text-left">
              <p className="font-display text-4xl font-semibold text-brand-darkest">{rating}</p>
              <div className="mt-1 flex justify-center gap-0.5 text-amber-400 sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon.star key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-600">{reviewCount} reviews</p>
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-dark px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-darkest active:scale-95 cursor-pointer"
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-xs text-slate-700">
                  <span className="w-8 shrink-0">{r.stars} star</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-brand-primary" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {showReviewForm && (
            <div className="mb-6 animate-in fade-in duration-300">
              <ReviewForm packageId={packageId} onSuccess={() => setShowReviewForm(false)} />
            </div>
          )}

          <div className="space-y-5">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-xl border border-brand-light/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand-darkest">{r.name}</p>
                  <span className="text-xs text-slate-600">{r.date}</span>
                </div>
                <div className="mt-1 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i2) => (
                    <Icon.star key={i2} className={`h-3.5 w-3.5 ${i2 < r.rating ? "" : "text-slate-200"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-800">{r.text}</p>
                {r.images && r.images.length > 0 && (
                  <ReviewPhotos images={r.images} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------- Stay ------------------------------- */

function HotelRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${rating} star hotel`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon.star key={i} className={`h-4 w-4 ${i < rating ? "" : "text-slate-200"}`} />
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: StayVM }) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-light/60 sm:flex">
      {hotel.image && (
        <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-56">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-brand-darkest">{hotel.name}</h3>
            {hotel.location && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-700">
                <Icon.pin className="h-3.5 w-3.5" />
                {hotel.location}
              </p>
            )}
          </div>
          {hotel.rating != null && <HotelRating rating={hotel.rating} />}
        </div>

        {hotel.roomType && <p className="mt-2 text-sm text-slate-800">{hotel.roomType}</p>}

        {hotel.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hotel.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-brand-tint-subtle px-2.5 py-1 text-xs text-brand-darkest"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {(hotel.checkIn || hotel.checkOut) && (
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
            {hotel.checkIn && (
              <span>
                Check-in: <span className="font-medium text-brand-darkest">{hotel.checkIn}</span>
              </span>
            )}
            {hotel.checkOut && (
              <span>
                Check-out: <span className="font-medium text-brand-darkest">{hotel.checkOut}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stay({ stays }: { stays: StayVM[] }) {
  return (
    <div>
      <SectionHeading eyebrow="Where You Stay" title="Stay Details" />
      {stays.length === 0 ? (
        <EmptyNote>Accommodation details for this package will be shared soon.</EmptyNote>
      ) : (
        <div className="space-y-5">
          {stays.map((hotel, i) => (
            <HotelCard key={i} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Booking sidebar -------------------------- */

function BookingCard({ startingPrice, guests, setGuests, total, onBookNow, title, slug }: { startingPrice: number | null; guests: number; setGuests: (n: number) => void; total: number; onBookNow: () => void; title: string; slug: string }) {
  return (
    <div className="ticket rounded-2xl border border-brand-light bg-white p-6 shadow-[0_20px_50px_-20px_rgba(27,77,27,0.3)]">
      <p className="text-xs uppercase tracking-wide text-slate-600">Starting from</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-brand-darkest">
        {startingPrice != null ? money(startingPrice) : "On request"}
        {startingPrice != null && <span className="ml-1 text-sm font-normal text-slate-600">/ adult</span>}
      </p>

      {startingPrice != null && (
        <>
          <div className="my-5 border-t border-dashed border-brand-light" />

          <label className="mb-1.5 block text-xs font-medium text-slate-700">Travellers</label>
          <div className="flex items-center justify-between rounded-lg border border-brand-light/70 px-3 py-2">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest"
            >
              –
            </button>
            <span className="font-mono text-sm font-medium text-brand-darkest">{guests}</span>
            <button
              onClick={() => setGuests(Math.min(12, guests + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-brand-dark hover:bg-brand-lightest"
            >
              +
            </button>
          </div>

          <div className="my-5 border-t border-dashed border-brand-light" />

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Estimated total</span>
            <span className="font-mono text-base font-semibold text-brand-darkest">{money(total)}</span>
          </div>
        </>
      )}

      <button
        onClick={onBookNow}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-[#1A3C34] to-[#A9B388] py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-medium/30 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        Reserve Your Spot
      </button>

      <div className="mt-4 space-y-2 text-xs text-slate-700">
        <p className="flex items-center gap-2">
          <Icon.shield className="h-3.5 w-3.5 text-brand-medium" /> Free cancellation up to 30 days out
        </p>
        <p className="flex items-center gap-2">
          <Icon.plane className="h-3.5 w-3.5 text-brand-medium" /> Reserve now, pay later available
        </p>
      </div>

      <ShareButtons title={title} slug={slug} />
    </div>
  );
}

/* ---------------------------- Font + CSS ------------------------------ */

function FontLoader() {
  return (
    <style>{`
      .ticket {
        position: relative;
        background-image:
          radial-gradient(circle at 0 50%, transparent 8px, white 8.5px),
          radial-gradient(circle at 100% 50%, transparent 8px, white 8.5px);
      }
    `}</style>
  );
}
