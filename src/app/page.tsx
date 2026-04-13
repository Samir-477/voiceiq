'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { AudienceSplitCard } from '@/components/dashboard/audience-split-card';
import { VoiceQualityCard } from '@/components/dashboard/voice-quality-card';
import { RegionPerformanceTable } from '@/components/dashboard/region-performance-table';
import { WeeklyCallBreakdownChart } from '@/components/dashboard/weekly-call-breakdown-chart';
import { CallIntentDistributionChart } from '@/components/dashboard/call-intent-distribution-chart';
import { TopMissedProductsChart } from '@/components/dashboard/top-missed-products-chart';
import { StoresAttentionList } from '@/components/dashboard/stores-attention-list';
import { ExecutiveSummaryBanner } from '@/components/dashboard/executive-summary-banner';
import { calculateTrend } from '@/lib/trend-utils';
import type {
  KpiSummaryResponse,
  AudienceResponse,
  VoiceQualityResponse,
  IntentDistributionResponse,
  WeeklyVolumeKpiItem,
  MissedProductItem,
  RegionPerformanceItem,
  StoreListItem,
} from '@/types/api';
import type { KpiMetric } from '@/types';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth, fetchRawWithAuth } from '@/lib/api-client';

export default function OverviewPage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);

  // ── Queries ────────────────────────────────────────────────────────────────
  
  const { data: kpiSummary, isLoading: loadingSummary } = useQuery<KpiSummaryResponse>({
    queryKey: ['kpi-summary', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/summary${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: audience, isLoading: loadingAudience } = useQuery<AudienceResponse>({
    queryKey: ['kpi-audience', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/audience${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: voiceQuality, isLoading: loadingVoice } = useQuery<VoiceQualityResponse>({
    queryKey: ['kpi-voice', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/voice-quality${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: intentData, isLoading: loadingIntent } = useQuery<IntentDistributionResponse>({
    queryKey: ['kpi-intent', filters],
    queryFn: () => fetchRawWithAuth(`/api/v1/analytics/kpi/intent-distribution${qs}`),
  });

  const { data: weeklyData, isLoading: loadingWeekly } = useQuery<WeeklyVolumeKpiItem[]>({
    queryKey: ['kpi-weekly', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/weekly${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: missedProducts, isLoading: loadingMissed } = useQuery<MissedProductItem[]>({
    queryKey: ['kpi-missed', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/missed-products${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: regionPerf, isLoading: loadingRegion } = useQuery<RegionPerformanceItem[]>({
    queryKey: ['kpi-region', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/region${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: storesAttention, isLoading: loadingAttention } = useQuery<StoreListItem[]>({
    queryKey: ['kpi-attention', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/stores-attention${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });


  const intentDist = useMemo(() => {
    return Array.isArray(intentData?.intents) ? intentData.intents : [];
  }, [intentData]);

  // Map kpiSummary → KpiMetric[] for KpiCard components
  const kpis = useMemo((): KpiMetric[] => {
    if (!kpiSummary) return [];

    return [
      // ── Row 1: 4 main KPI cards ──────────────────────────────────────────────
      {
        id: 'total_calls',
        label: 'Total Calls',
        value: (kpiSummary.total_calls || 0).toLocaleString(),
        trend: calculateTrend(kpiSummary.total_calls_trend ?? []),
        icon: 'phone-incoming',
        color: 'blue',
      },
      {
        id: 'qualified_calls',
        label: 'Qualified Calls',
        value: `${(kpiSummary.qualified_pct || 0).toFixed(1)}%`,
        trend: calculateTrend(kpiSummary.qualified_trend ?? []),
        icon: 'check-circle',
        color: 'green',
      },
      {
        id: 'high_intent_calls',
        label: 'High Intent Calls',
        value: (kpiSummary.high_intent_calls || 0).toLocaleString(),
        trend: calculateTrend(kpiSummary.high_intent_trend ?? []),
        icon: 'crosshair',
        color: 'orange',
      },
      {
        id: 'junk_calls',
        label: 'Junk / Noise',
        value: (kpiSummary.noise_calls || 0).toLocaleString(),
        trend: calculateTrend(kpiSummary.noise_trend ?? []),
        icon: 'x-circle',
        color: 'red',
      },

      // ── Row 2: 5 compact stat cards ─────────────────────────────────────────
      {
        id: 'missed_opportunities',
        label: 'Missed Opportunities',
        value: (kpiSummary.missed_opportunity_calls || 0).toLocaleString(),
        trend: 0,
        icon: 'target',
        color: 'red',
      },
      {
        id: 'complaint_rate',
        label: 'Complaint Rate',
        value: `${(kpiSummary.complaint_rate_pct || 0).toFixed(1)}%`,
        trend: 0,
        icon: 'shield-alert',
        color: 'red',
      },
      {
        id: 'conversion_rate',
        label: 'Conversion Rate',
        value: `${(kpiSummary.conversion_rate_pct || 0).toFixed(1)}%`,
        trend: 0,
        icon: 'trending-up',
        color: 'orange',
      },
      {
        id: 'stores_attention',
        label: 'Stores Need Attention',
        value: (kpiSummary.stores_attention_count ?? storesAttention?.length ?? 0).toLocaleString(),
        trend: 0,
        icon: 'store',
        color: 'red',
      },
      {
        id: 'avg_score',
        label: 'Avg Score',
        value: kpiSummary.avg_score != null ? kpiSummary.avg_score.toFixed(1) : '—',
        trend: 0,
        icon: 'shield-check',
        color: 'green',
      },
    ];
  }, [kpiSummary, storesAttention]);

  return (
    <div className="min-h-screen">
      <Header title="Overview" subtitle="Key metrics and insights at a glance" />

      <div className="px-8 pb-8">
        <div className="space-y-6 animate-fade-in-up">
          <LocationFilterBar />

          {/* KPI Row 1 — 4 main cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {loadingSummary && !kpiSummary
              ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-[110px] animate-pulse"
                />
              ))
              : kpis.slice(0, 4).map((kpi: KpiMetric) => <KpiCard key={kpi.id} metric={kpi} />)}
          </div>

          {/* KPI Row 2 — 5 compact cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {loadingSummary && !kpiSummary
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-[90px] animate-pulse"
                />
              ))
              : kpis.slice(4).map((kpi: KpiMetric) => <KpiCard key={kpi.id} metric={kpi} compact />)}
          </div>

          <ExecutiveSummaryBanner
            kpiSummary={kpiSummary || null}
            missedProducts={missedProducts || []}
            storesAttentionCount={kpiSummary?.stores_attention_count ?? storesAttention?.length ?? 0}
            loading={loadingSummary || loadingMissed}
          />

          {/* Demographics & Quality Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <AudienceSplitCard data={audience || null} loading={loadingAudience} />
            <VoiceQualityCard data={voiceQuality || null} loading={loadingVoice} />
          </div>

          {/* Region Performance */}
          <RegionPerformanceTable data={regionPerf || []} loading={loadingRegion} />

          {/* Weekly Call Breakdown & Intent Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
            <div className="lg:col-span-3">
              <WeeklyCallBreakdownChart data={weeklyData || []} loading={loadingWeekly} />
            </div>
            <div className="lg:col-span-2">
              <CallIntentDistributionChart data={intentDist} loading={loadingIntent} />
            </div>
          </div>

          {/* Products & Stores Alert */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <TopMissedProductsChart data={missedProducts || []} loading={loadingMissed} />
            <StoresAttentionList data={storesAttention || []} loading={loadingAttention} />
          </div>
        </div>
      </div>
    </div>
  );
}
