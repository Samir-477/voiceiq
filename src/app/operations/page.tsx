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
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

export default function OperationsPage() {
  const [opsSummary,    setOpsSummary]    = useState<OpsSummaryResponse | null>(null);
  const [weeklyVolume,  setWeeklyVolume]  = useState<WeeklyVolumeItem[]>([]);
  const [regionVolume,  setRegionVolume]  = useState<RegionVolumeItem[]>([]);
  const [geoStore,      setGeoStore]      = useState<GeoStoreRow[]>([]);
  const [geoState,      setGeoState]      = useState<GeoStateRow[]>([]);
  const [geoCity,       setGeoCity]       = useState<GeoCityRow[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        // Fetch all 6 Ops APIs in parallel
        const [summaryRes, weeklyRes, regionRes, geoStoreRes, geoStateRes, geoCityRes] =
          await Promise.all([
            fetch(`${BASE_URL}/api/v1/analytics/ops/summary`,                    { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/weekly-volume`,              { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/by-region`,                 { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown?tab=store`,   { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown?tab=state`,   { headers }),
            fetch(`${BASE_URL}/api/v1/analytics/ops/geo-breakdown?tab=city`,    { headers }),
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

      } catch (err: any) {
        console.error('Operations API Error:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error('Failed to load operations data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
