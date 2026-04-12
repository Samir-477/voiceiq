'use client';

import { useState, useEffect, useMemo } from 'react';
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
  IntentDistributionItem,
  IntentDistributionResponse,
  WeeklyVolumeKpiItem,
  MissedProductItem,
  RegionPerformanceItem,
  StoreListItem,
} from '@/types/api';
import type { KpiMetric } from '@/types';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { toast } from 'sonner';


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || '';

export default function OverviewPage() {
  const { filters } = useFilters();
  const [kpiSummary, setKpiSummary] = useState<KpiSummaryResponse | null>(null);
  const [audience, setAudience] = useState<AudienceResponse | null>(null);
  const [voiceQuality, setVoiceQuality] = useState<VoiceQualityResponse | null>(null);
  const [intentDist, setIntentDist] = useState<IntentDistributionItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyVolumeKpiItem[]>([]);
  const [missedProducts, setMissedProducts] = useState<MissedProductItem[]>([]);
  const [regionPerf, setRegionPerf] = useState<RegionPerformanceItem[]>([]);
  const [storesAttention, setStoresAttention] = useState<StoreListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        const qs = buildQueryString(filters);

        // Fetch all 8 Executive KPI APIs in parallel
        const [
          summaryRes,
          audienceRes,
          voiceQualityRes,
          intentRes,
          weeklyRes,
          missedRes,
          regionRes,
          attentionRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/kpi/summary${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/audience${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/voice-quality${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/intent-distribution${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/weekly${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/missed-products${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/region${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/stores-attention${qs}`, { headers }),
        ]);

        if (
          !summaryRes.ok || !audienceRes.ok || !voiceQualityRes.ok || !intentRes.ok ||
          !weeklyRes.ok || !missedRes.ok || !regionRes.ok || !attentionRes.ok
        ) {
          throw new Error('Failed to fetch executive analytics data');
        }

        const summaryData = await summaryRes.json();
        const audienceData = await audienceRes.json();
        const voiceQualityData = await voiceQualityRes.json();
        const intentData = await intentRes.json();
        const weeklyRawData = await weeklyRes.json();
        const missedData = await missedRes.json();
        const regionData = await regionRes.json();
        const attentionData = await attentionRes.json();

        // API responses may be wrapped in an array — handle both cases
        setKpiSummary(Array.isArray(summaryData) ? summaryData[0] : summaryData);
        setAudience(Array.isArray(audienceData) ? audienceData[0] : audienceData);
        setVoiceQuality(Array.isArray(voiceQualityData) ? voiceQualityData[0] : voiceQualityData);
        // intent-distribution returns { total, intents: [] } — extract the array
        const intentWrapper = intentData as IntentDistributionResponse;
        setIntentDist(Array.isArray(intentWrapper.intents) ? intentWrapper.intents : []);
        setWeeklyData(Array.isArray(weeklyRawData[0]) ? weeklyRawData[0] : weeklyRawData);
        setMissedProducts(Array.isArray(missedData[0]) ? missedData[0] : missedData);
        setRegionPerf(Array.isArray(regionData[0]) ? regionData[0] : regionData);
        setStoresAttention(Array.isArray(attentionData[0]) ? attentionData[0] : attentionData);

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load executive dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

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
        id: 'purchase_intent',
        label: 'Purchase Intent',
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
        value: storesAttention.length.toLocaleString(),
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
            {loading && !kpiSummary
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
            {loading && !kpiSummary
              ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-[90px] animate-pulse"
                />
              ))
              : kpis.slice(4).map((kpi: KpiMetric) => <KpiCard key={kpi.id} metric={kpi} compact />)}
          </div>

          <ExecutiveSummaryBanner
            kpiSummary={kpiSummary}
            missedProducts={missedProducts}
            storesAttentionCount={storesAttention.length}
            loading={loading}
          />

          {/* Demographics & Quality Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <AudienceSplitCard data={audience} loading={loading} />
            <VoiceQualityCard data={voiceQuality} loading={loading} />
          </div>

          {/* Region Performance */}
          <RegionPerformanceTable data={regionPerf} loading={loading} />

          {/* Weekly Call Breakdown & Intent Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
            <div className="lg:col-span-3">
              <WeeklyCallBreakdownChart data={weeklyData} loading={loading} />
            </div>
            <div className="lg:col-span-2">
              <CallIntentDistributionChart data={intentDist} loading={loading} />
            </div>
          </div>

          {/* Products & Stores Alert */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <TopMissedProductsChart data={missedProducts} loading={loading} />
            <StoresAttentionList data={storesAttention} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
