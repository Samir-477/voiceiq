'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { RevenueKpiCards } from '@/components/revenue/revenue-kpi-cards';
import { RevenueLossChart } from '@/components/revenue/revenue-loss-chart';
import { TopDemandedProducts } from '@/components/revenue/top-demanded-products';
import { ProductCategoryDemand } from '@/components/revenue/product-category-demand';
import { RevenueRecoveryInsights } from '@/components/revenue/revenue-recovery-insights';
import type { 
  RevenueSummaryResponse, 
  RevenueByRegionItem, 
  CategoryDemandConversionItem 
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/api-client';

export default function RevenueIntelligencePage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: summary, isLoading: loadingSummary } = useQuery<RevenueSummaryResponse>({
    queryKey: ['revenue-summary', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/revenue/summary${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: regionData, isLoading: loadingRegion } = useQuery<RevenueByRegionItem[]>({
    queryKey: ['revenue-region', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/revenue/by-region${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: categoryData, isLoading: loadingCategory } = useQuery<CategoryDemandConversionItem[]>({
    queryKey: ['revenue-category', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/revenue/category-demand${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const loading = loadingSummary || loadingRegion || loadingCategory;

  // Pre-compute a lookup map from category name → item for O(1) access
  const categoryMap = useMemo(
    () => new Map((categoryData ?? []).map(c => [c.category.toLowerCase(), c])),
    [categoryData]
  );

  // Transform category data for TopDemandedProducts component using summary.category_breakdown
  const topProducts = useMemo(() => {
    if (!summary?.category_breakdown) return [];

    return Object.entries(summary.category_breakdown)
      .map(([name, count]) => {
        const match = categoryMap.get(name.toLowerCase());
        return {
          id: name,
          name: name,
          requests: count,
          fulfillmentPct: match ? Math.round(match.conversion_pct) : 0,
        };
      })
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
  }, [summary, categoryMap]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header
        title="Revenue Intelligence"
        subtitle="Track missed sales & product demand from call data"
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />

          <RevenueKpiCards metrics={summary || null} loading={loadingSummary} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
            <RevenueLossChart data={regionData || []} loading={loadingRegion} />
            <TopDemandedProducts data={topProducts} loading={loading} />
          </div>

          <div className="mt-6">
            <ProductCategoryDemand data={categoryData || []} loading={loadingCategory} />
          </div>

          <div className="mt-6">
            <RevenueRecoveryInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
