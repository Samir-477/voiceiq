'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { OperationsKpis } from '@/components/operations/operations-kpis';
import { WeeklyCallVolumeChart } from '@/components/operations/weekly-call-volume';
import { CallsByRegionChart } from '@/components/operations/calls-by-region';
import { GeographicBreakdown } from '@/components/operations/geographic-breakdown';
import { OperationsIntelligence } from '@/components/operations/operations-intelligence';
import type {
  OpsSummaryResponse,
  WeeklyVolumeItem,
  RegionVolumeItem,
  GeoStateRow,
  GeoCityRow,
  GeoStoreRow,
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/api-client';

export default function OperationsPage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);
  const geoQsPrefix = qs ? `${qs}&` : '?';

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: opsSummary, isLoading: loadingSummary } = useQuery<OpsSummaryResponse>({
    queryKey: ['ops-summary', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/summary${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: weeklyVolume, isLoading: loadingWeekly } = useQuery<WeeklyVolumeItem[]>({
    queryKey: ['ops-weekly', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/weekly-volume${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: regionVolume, isLoading: loadingRegion } = useQuery<RegionVolumeItem[]>({
    queryKey: ['ops-region', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/by-region${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: geoStore, isLoading: loadingGeoStore } = useQuery<GeoStoreRow[]>({
    queryKey: ['ops-geo-store', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/geo-breakdown${geoQsPrefix}tab=store`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: geoState, isLoading: loadingGeoState } = useQuery<GeoStateRow[]>({
    queryKey: ['ops-geo-state', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/geo-breakdown${geoQsPrefix}tab=state`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: geoCity, isLoading: loadingGeoCity } = useQuery<GeoCityRow[]>({
    queryKey: ['ops-geo-city', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/ops/geo-breakdown${geoQsPrefix}tab=city`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });


  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Operations Dashboard" subtitle="Monitor store efficiency across all regions" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <div className="mt-6 mb-6">
            <OperationsKpis data={opsSummary || null} loading={loadingSummary} />
          </div>

          {/* Row 2: Charts Split (approx 65/35) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WeeklyCallVolumeChart data={weeklyVolume || []} loading={loadingWeekly} />
            </div>
            <div className="lg:col-span-1">
              <CallsByRegionChart data={regionVolume || []} loading={loadingRegion} />
            </div>
          </div>

          {/* Row 3: Geographic Breakdown Table */}
          <div className="mb-6">
            <GeographicBreakdown
              storeData={geoStore || []}
              stateData={geoState || []}
              cityData={geoCity || []}
              loading={loadingGeoStore || loadingGeoState || loadingGeoCity}
            />
          </div>

          {/* Row 4: AI Insights */}
          <div>
            <OperationsIntelligence />
          </div>
        </div>
      </div>
    </div>
  );
}
