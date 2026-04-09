'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { AudienceSplitCard } from '@/components/dashboard/audience-split-card';
import { VoiceQualityCard } from '@/components/dashboard/voice-quality-card';
import { TopPersonasCard } from '@/components/dashboard/top-personas-card';
import { RegionPerformanceTable } from '@/components/dashboard/region-performance-table';
import { WeeklyCallBreakdownChart } from '@/components/dashboard/weekly-call-breakdown-chart';
import { CallIntentDistributionChart } from '@/components/dashboard/call-intent-distribution-chart';
import { TopMissedProductsChart } from '@/components/dashboard/top-missed-products-chart';
import { StoresAttentionList } from '@/components/dashboard/stores-attention-list';
import { ExecutiveSummaryBanner } from '@/components/dashboard/executive-summary-banner';
import { useMemo } from 'react';
import { calculateTrend } from '@/lib/trend-utils';
import { mockOverviewData } from './mock-data';
import type { KpiMetric } from '@/types';

export default function OverviewPage() {
  const overview = mockOverviewData;

  const kpis = useMemo((): KpiMetric[] => {
    if (!overview) return [];

    return [
      // ── Row 1: 4 KPI cards ──────────────────────────────────────────────
      {
        id: 'total_calls',
        label: 'Total Calls',
        value: (overview.total_calls || 0).toLocaleString(),
        trend: calculateTrend(overview.total_calls_trend),
        icon: 'phone-incoming',
        color: 'blue',
      },
      {
        id: 'qualified_calls',
        label: 'Qualified Calls',
        value: `${Math.round(((overview.answered_calls || 0) / Math.max(overview.total_calls || 1, 1)) * 100)}%`,
        trend: calculateTrend(overview.answered_calls_trend),
        icon: 'check-circle',
        color: 'green',
      },
      {
        id: 'purchase_intent',
        label: 'Purchase Intent',
        value: (overview.high_intent_inquiries || 0).toLocaleString(),
        trend: calculateTrend(overview.high_intent_trend),
        icon: 'crosshair',
        color: 'orange',
      },
      {
        id: 'junk_calls',
        label: 'Junk Calls',
        value: (overview.missed_calls || 0).toLocaleString(),
        trend: calculateTrend(overview.missed_calls_trend),
        icon: 'x-circle',
        color: 'red',
      },
      // ── Row 2: 5 compact stat cards ─────────────────────────────────────
      {
        id: 'revenue_at_risk',
        label: 'Revenue at Risk',
        value: '₹4.3L',
        trend: 0,
        icon: 'indian-rupee',
        color: 'red',
      },
      {
        id: 'complaint_rate',
        label: 'Complaint Rate',
        value: '26%',
        trend: 0,
        icon: 'shield-alert',
        color: 'red',
      },
      {
        id: 'conversion_rate',
        label: 'Conversion Rate',
        value: `${overview.new_callers_percent || 0}%`,
        trend: 0,
        icon: 'trending-up',
        color: 'orange',
      },
      {
        id: 'stores_attention',
        label: 'Stores Need Attention',
        value: (overview.stockout_calls || 0).toLocaleString(),
        trend: 0,
        icon: 'store',
        color: 'red',
      },
      {
        id: 'zero_call_stores',
        label: 'Zero Call Stores',
        value: '5',
        trend: 0,
        icon: 'package-x',
        color: 'orange',
      },
    ];
  }, [overview]);

  return (
    <div className="min-h-screen">
      <Header title="Overview" subtitle="Key metrics and insights at a glance" />

      <div className="px-8 pb-8">
        <div className="space-y-6 animate-fade-in-up">
          <LocationFilterBar />

          {/* KPI Row 1 — 4 main cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.slice(0, 4).map((kpi) => (
              <KpiCard key={kpi.id} metric={kpi} />
            ))}
          </div>

          {/* KPI Row 2 — 5 compact cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpis.slice(4).map((kpi) => (
              <KpiCard key={kpi.id} metric={kpi} compact />
            ))}
          </div>

          <ExecutiveSummaryBanner />

          {/* Demographics & Quality Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            <AudienceSplitCard />
            <VoiceQualityCard />
            <TopPersonasCard />
          </div>

          {/* Region Performance */}
          <RegionPerformanceTable />

          {/* Weekly Call Breakdown & Intent Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
            <div className="lg:col-span-3">
              <WeeklyCallBreakdownChart />
            </div>
            <div className="lg:col-span-2">
              <CallIntentDistributionChart />
            </div>
          </div>

          {/* Products & Stores Alert */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <TopMissedProductsChart />
            <StoresAttentionList />
          </div>
        </div>
      </div>
    </div>
  );
}
