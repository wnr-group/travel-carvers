import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * Admin analytics
 */

export interface AnalyticsKpis {
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  leadsAllTime: number;
  conversionRate: number;
  totalReviews: number;
  averageRating: number | null;
}

export interface NameCount {
  name: string;
  count: number;
}

export interface DateCount {
  /** YYYY-MM-DD (UTC) */
  date: string;
  count: number;
}

export interface RatingCount {
  rating: number;
  count: number;
}

export interface AnalyticsSummary {
  kpis: AnalyticsKpis;
  leadsByStatus: NameCount[];
  leadsByPackage: NameCount[];
  leadsTrend: DateCount[];
  ratingDistribution: RatingCount[];
  topPackages: NameCount[];
}

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted'] as const;

const TREND_DAYS = 30;
const PACKAGE_BAR_LIMIT = 8;
const TOP_PACKAGES_LIMIT = 5;

/** Label used when a lead was submitted without a package. */
const GENERAL_ENQUIRY = 'General enquiry';

interface LeadRow {
  created_at: string;
  status: string | null;
  packages: { title: string } | null;
}

interface ReviewRow {
  rating: number | null;
}

/** Midnight UTC, `daysAgo` days before today. */
function utcDayStart(daysAgo: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [leadsRes, reviewsRes] = await Promise.all([
    supabaseAdmin
      .from('leads')
      .select('created_at, status, packages ( title )')
      .overrideTypes<LeadRow[], { merge: false }>(),
    supabaseAdmin.from('reviews').select('rating').overrideTypes<ReviewRow[], { merge: false }>(),
  ]);

  if (leadsRes.error) throw leadsRes.error;
  if (reviewsRes.error) throw reviewsRes.error;

  const leads = leadsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  // ---- KPI windows (UTC day boundaries) ----
  const todayStart = utcDayStart(0).getTime();
  const weekStart = utcDayStart(6).getTime(); // today + previous 6 days
  const monthStart = utcDayStart(29).getTime();

  let leadsToday = 0;
  let leadsThisWeek = 0;
  let leadsThisMonth = 0;
  let converted = 0;

  const statusCounts = new Map<string, number>(LEAD_STATUSES.map((status) => [status, 0]));
  const packageCounts = new Map<string, number>();
  const trendCounts = new Map<string, number>();
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    trendCounts.set(toDateKey(utcDayStart(i)), 0);
  }

  for (const lead of leads) {
    const createdAt = new Date(lead.created_at).getTime();
    if (Number.isNaN(createdAt)) continue;

    if (createdAt >= todayStart) leadsToday++;
    if (createdAt >= weekStart) leadsThisWeek++;
    if (createdAt >= monthStart) leadsThisMonth++;

    const status = lead.status ?? 'new';
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
    if (status === 'converted') converted++;

    const packageName = lead.packages?.title ?? GENERAL_ENQUIRY;
    packageCounts.set(packageName, (packageCounts.get(packageName) ?? 0) + 1);

    const dateKey = toDateKey(new Date(createdAt));
    if (trendCounts.has(dateKey)) {
      trendCounts.set(dateKey, (trendCounts.get(dateKey) ?? 0) + 1);
    }
  }

  // ---- Reviews ----
  const ratingCounts = new Map<number, number>([1, 2, 3, 4, 5].map((star) => [star, 0]));
  let ratingSum = 0;
  let ratedCount = 0;
  for (const review of reviews) {
    const rating = review.rating ?? 0;
    if (rating >= 1 && rating <= 5) {
      ratingCounts.set(rating, (ratingCounts.get(rating) ?? 0) + 1);
      ratingSum += rating;
      ratedCount++;
    }
  }

  const rankedPackages = [...packageCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    kpis: {
      leadsToday,
      leadsThisWeek,
      leadsThisMonth,
      leadsAllTime: leads.length,
      conversionRate: leads.length ? Math.round((converted / leads.length) * 1000) / 10 : 0,
      totalReviews: reviews.length,
      averageRating: ratedCount ? Math.round((ratingSum / ratedCount) * 10) / 10 : null,
    },
    leadsByStatus: LEAD_STATUSES.map((status) => ({
      name: status,
      count: statusCounts.get(status) ?? 0,
    })),
    leadsByPackage: rankedPackages.slice(0, PACKAGE_BAR_LIMIT),
    leadsTrend: [...trendCounts.entries()].map(([date, count]) => ({ date, count })),
    ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: ratingCounts.get(rating) ?? 0,
    })),
    topPackages: rankedPackages.slice(0, TOP_PACKAGES_LIMIT),
  };
}
