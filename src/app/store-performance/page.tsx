'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { StoreKpis } from '@/components/store-performance/store-kpis';
import { CustomerPersonaBreakdown } from '@/components/store-performance/customer-persona-breakdown';
import { ProductCategoryPerformance } from '@/components/store-performance/product-category-performance';
import { StoreDetailsTable } from '@/components/store-performance/store-details-table';
import { ConversionAttributionAnalysis, WeeklyPerformanceTrendChart } from '@/components/store-performance/conversion-attribution';
import { StorePerformanceIntelligence } from '@/components/store-performance/store-intelligence';
import type {
  StoreListItem,
  ConversionDriverItem,
  PersonaBreakdownItem,
  CategoryDemandConversionItem,
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/api-client';

export default function StorePerformancePage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: storeList, isLoading: loadingList } = useQuery<StoreListItem[]>({
    queryKey: ['store-list', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/store/list${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: conversionDrivers, isLoading: loadingDrivers } = useQuery<ConversionDriverItem[]>({
    queryKey: ['store-drivers', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/store/conversion-drivers${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: personaBreakdown, isLoading: loadingPersona } = useQuery<PersonaBreakdownItem[]>({
    queryKey: ['store-persona', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/store/persona-breakdown${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: categoryPerformance, isLoading: loadingCategory } = useQuery<CategoryDemandConversionItem[]>({
    queryKey: ['revenue-category', filters], // Shared cache with Revenue page
    queryFn: () => fetchWithAuth(`/api/v1/analytics/revenue/category-demand${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const loading = loadingList || loadingDrivers || loadingPersona || loadingCategory;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header
        title="Store Performance"
        subtitle="Monitor store metrics, customer personas, and conversion drivers"
      />

      <div className="px-8 pb-8">
        <div className="animate-fade-in-up">
          <LocationFilterBar />

          {/* KPI Row */}
          <div className="mt-6">
            <StoreKpis 
              data={storeList && storeList.length > 0 ? {
                activeStores: { 
                  value: String(storeList.filter(s => (s.total_calls || 0) > 0).length), 
                  subtitle: 'above zero calls' 
                },
                zeroCallStores: { 
                  value: String(storeList.filter(s => (s.total_calls || 0) === 0).length), 
                  subtitle: 'need attention',
                  trendUp: false 
                },
                totalCalls: { 
                  value: storeList.reduce((acc, s) => acc + (s.total_calls || 0), 0).toLocaleString(), 
                  subtitle: 'across all stores' 
                },
                avgConversion: { 
                  value: `${(storeList.reduce((acc, s) => acc + (s.conversion_pct || 0), 0) / (storeList.length || 1)).toFixed(1)}%`, 
                  subtitle: 'average rate',
                  trendUp: true 
                },
                avgHandleTime: { 
                  value: (() => {
                    const times = storeList
                      .map(s => s.avg_handle_time)
                      .filter(t => t && t.includes('m'));
                    if (times.length === 0) return '—';
                    
                    const totalSecs = times.reduce((acc, t) => {
                      const match = t.match(/(\d+)m\s*(\d+)s/);
                      if (match) return acc + parseInt(match[1]) * 60 + parseInt(match[2]);
                      const mMatch = t.match(/(\d+)m/);
                      if (mMatch) return acc + parseInt(mMatch[1]) * 60;
                      return acc;
                    }, 0);

                    const avgSecs = Math.round(totalSecs / times.length);
                    const m = Math.floor(avgSecs / 60);
                    const s = avgSecs % 60;
                    return `${m}m ${s}s`;
                  })(),
                  subtitle: 'per call' 
                }
              } : null} 
              loading={loadingList} 
            />
          </div>

          {/* Row 1: Persona Breakdown + Product Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: 340 }}>
            <CustomerPersonaBreakdown data={personaBreakdown || []} loading={loadingPersona} />
            <ProductCategoryPerformance data={categoryPerformance || []} loading={loadingCategory} />
          </div>

          {/* Store Details Table */}
          <StoreDetailsTable data={storeList || []} loading={loadingList} />

          {/* Conversion Attribution Analysis */}
          <ConversionAttributionAnalysis data={conversionDrivers || []} loading={loadingDrivers} />

          {/* Weekly Performance Trend */}
          <WeeklyPerformanceTrendChart />

          {/* Store Intelligence */}
          <StorePerformanceIntelligence />
        </div>
      </div>
    </div>
  );
}
