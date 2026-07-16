'use client';

import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Inbox,
  Percent,
  MessageSquare,
  Star,
  Trophy,
} from 'lucide-react';
import ChartCard from '@/components/admin/charts/ChartCard';
import KpiCard from '@/components/admin/charts/KpiCard';
import CategoryPieChart from '@/components/admin/charts/CategoryPieChart';
import CountBarChart from '@/components/admin/charts/CountBarChart';
import TrendLineChart from '@/components/admin/charts/TrendLineChart';
import { STATUS_COLORS, STATUS_LABELS } from '@/components/admin/charts/theme';
import { useAdminAnalytics } from '@/lib/hooks/useAdminAnalytics';

export default function AnalyticsPage() {
  const { data, isPending, isError, error } = useAdminAnalytics();

  const kpis = data?.kpis;

  const statusSlices = (data?.leadsByStatus ?? []).map((entry) => ({
    name: STATUS_LABELS[entry.name] ?? entry.name,
    value: entry.count,
    color: STATUS_COLORS[entry.name] ?? '#6b7280',
  }));

  const ratingBars = (data?.ratingDistribution ?? []).map((entry) => ({
    name: `${entry.rating}★`,
    count: entry.count,
  }));

  const hasLeads = (kpis?.leadsAllTime ?? 0) > 0;
  const hasReviews = (kpis?.totalReviews ?? 0) > 0;
  const topPackagesMax = data?.topPackages[0]?.count ?? 0;

  if (isError) {
    return (
      <div className="py-4">
        <h1 className="text-3xl font-bold text-brand-darkest mb-8">Analytics</h1>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="font-semibold text-red-600">Could not load analytics</p>
          <p className="mt-1 text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-darkest">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Lead and review performance. Daily windows use UTC days; the trend covers the last 30 days.
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 mb-6">
        <KpiCard label="Leads Today" value={kpis?.leadsToday ?? 0} icon={CalendarDays} isPending={isPending} />
        <KpiCard label="Leads This Week" value={kpis?.leadsThisWeek ?? 0} sub="last 7 days" icon={CalendarRange} isPending={isPending} />
        <KpiCard label="Leads This Month" value={kpis?.leadsThisMonth ?? 0} sub="last 30 days" icon={CalendarClock} isPending={isPending} />
        <KpiCard label="Leads All Time" value={kpis?.leadsAllTime ?? 0} icon={Inbox} isPending={isPending} />
        <KpiCard
          label="Conversion Rate"
          value={`${kpis?.conversionRate ?? 0}%`}
          sub="converted / all leads"
          icon={Percent}
          isPending={isPending}
        />
        <KpiCard label="Total Reviews" value={kpis?.totalReviews ?? 0} icon={MessageSquare} isPending={isPending} />
        <KpiCard
          label="Average Rating"
          value={kpis?.averageRating != null ? kpis.averageRating.toFixed(1) : '—'}
          sub={kpis?.averageRating != null ? 'out of 5' : 'no reviews yet'}
          icon={Star}
          isPending={isPending}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Leads by Status"
          description="Lifecycle: new → contacted → qualified → converted"
          isPending={isPending}
          isEmpty={!hasLeads}
          emptyText="No leads yet — status breakdown will appear here."
        >
          <CategoryPieChart data={statusSlices} />
        </ChartCard>

        <ChartCard
          title="Review Ratings"
          description="Count of submitted reviews per star"
          isPending={isPending}
          isEmpty={!hasReviews}
          emptyText="No reviews yet — the rating distribution will appear here."
        >
          <CountBarChart data={ratingBars} layout="vertical" unit="reviews" />
        </ChartCard>

        <ChartCard
          title="Leads by Package"
          description="Which packages generate enquiries"
          isPending={isPending}
          isEmpty={!hasLeads}
          emptyText="No leads yet — package demand will appear here."
          height={Math.max(240, (data?.leadsByPackage.length ?? 0) * 44)}
        >
          <CountBarChart data={data?.leadsByPackage ?? []} layout="horizontal" unit="leads" />
        </ChartCard>

        {/* Top 5 — a ranked list reads faster than another chart */}
        <section className="bg-white rounded-lg shadow p-5" aria-label="Popular packages">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-brand-dark" aria-hidden="true" />
            <h2 className="font-semibold text-brand-darkest">Popular Packages</h2>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Top 5 by lead count</p>

          <div className="mt-4">
            {isPending ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-brand-lightest/60" />
                ))}
              </div>
            ) : !data || data.topPackages.length === 0 ? (
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 px-6 text-center">
                <p className="text-sm text-gray-500">No leads yet — rankings will appear here.</p>
              </div>
            ) : (
              <ol className="space-y-3">
                {data.topPackages.map((pkg, index) => (
                  <li key={pkg.name} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-lightest text-xs font-bold text-brand-darkest">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-brand-darkest">{pkg.name}</span>
                        <span className="shrink-0 text-sm font-semibold text-brand-darkest">
                          {pkg.count}
                          <span className="ml-1 text-xs font-normal text-gray-400">
                            {pkg.count === 1 ? 'lead' : 'leads'}
                          </span>
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-lightest/60">
                        <div
                          className="h-full rounded-full bg-brand-dark"
                          style={{ width: `${topPackagesMax ? (pkg.count / topPackagesMax) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <div className="lg:col-span-2">
          <ChartCard
            title="Leads Trend"
            description="New leads per day, last 30 days"
            isPending={isPending}
            isEmpty={!hasLeads}
            emptyText="No leads yet — the daily trend will appear here."
          >
            <TrendLineChart data={data?.leadsTrend ?? []} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
