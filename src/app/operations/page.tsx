'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

export default function OperationsPage() {
  const { filters } = useFilters();
  const [opsSummary,    setOpsSummary]    = useState<OpsSummaryResponse | null>(null);
  const [weeklyVolume,  setWeeklyVolume]  = useState<WeeklyVolumeItem[]>([]);
  const [regionVolume,  setRegionVolume]  = useState<RegionVolumeItem[]>([]);
  const [geoStore,      setGeoStore]      = useState<GeoStoreRow[]>([]);
  const [geoState,      setGeoState]      = useState<GeoStateRow[]>([]);
  const [geoCity,       setGeoCity]       = useState<GeoCityRow[]>([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        const qs = buildQueryString(filters);

        // Fetch all 6 Ops APIs in parallel
        const [summaryRes, weeklyRes, regionRes, geoStoreRes, geoStateRes, geoCityRes] =
          await Promise.all([
            fetch(`${BASE_URL}/api/v1/analytics/ops/summary${qs}`,                    { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/weekly-volume${qs}`,              { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/by-region${qs}`,                 { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown${qs}${qs ? '&' : '?'}tab=store`,   { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown${qs}${qs ? '&' : '?'}tab=state`,   { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown${qs}${qs ? '&' : '?'}tab=city`,    { headers }),
          ]);

        if (
          !summaryRes.ok || !weeklyRes.ok || !regionRes.ok ||
          !geoStoreRes.ok || !geoStateRes.ok || !geoCityRes.ok
        ) {
          throw new Error('Failed to fetch operations data');
        }

        const summaryData  = await summaryRes.json();
        const weeklyData   = await weeklyRes.json();
        const regionData   = await regionRes.json();
        const geoStoreData = await geoStoreRes.json();
        const geoStateData = await geoStateRes.json();
        const geoCityData  = await geoCityRes.json();

        // API responses may be wrapped in an array — handle both cases
        setOpsSummary(Array.isArray(summaryData) ? summaryData[0] : summaryData);
        setWeeklyVolume(Array.isArray(weeklyData[0]) ? weeklyData[0] : weeklyData);
        setRegionVolume(Array.isArray(regionData[0]) ? regionData[0] : regionData);
        setGeoStore(Array.isArray(geoStoreData[0]) ? geoStoreData[0] : geoStoreData);
        setGeoState(Array.isArray(geoStateData[0]) ? geoStateData[0] : geoStateData);
        setGeoCity(Array.isArray(geoCityData[0]) ? geoCityData[0] : geoCityData);

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load operations data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Operations Dashboard" subtitle="Monitor store efficiency across all regions" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <div className="mt-6 mb-6">
            <OperationsKpis data={opsSummary} loading={loading} />
          </div>

          {/* Row 2: Charts Split (approx 65/35) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WeeklyCallVolumeChart data={weeklyVolume} loading={loading} />
            </div>
            <div className="lg:col-span-1">
              <CallsByRegionChart data={regionVolume} loading={loading} />
            </div>
          </div>

          {/* Row 3: Geographic Breakdown Table */}
          <div className="mb-6">
            <GeographicBreakdown
              storeData={geoStore}
              stateData={geoState}
              cityData={geoCity}
              loading={loading}
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
