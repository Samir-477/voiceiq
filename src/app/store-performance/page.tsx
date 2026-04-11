'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { StoreKpis } from '@/components/store-performance/store-kpis';
import { CustomerPersonaBreakdown } from '@/components/store-performance/customer-persona-breakdown';
import { ProductCategoryPerformance } from '@/components/store-performance/product-category-performance';
import { StoreDetailsTable } from '@/components/store-performance/store-details-table';
import { TopStoresByConversion, CallQualityBreakdownChart } from '@/components/store-performance/store-charts';
import { ZeroCallStores } from '@/components/store-performance/zero-call-stores';
import { ConversionAttributionAnalysis, WeeklyPerformanceTrendChart } from '@/components/store-performance/conversion-attribution';
import { StorePerformanceIntelligence } from '@/components/store-performance/store-intelligence';
import type {
  StoreListItem,
  ConversionDriverItem,
  PersonaBreakdownItem,
} from '@/types/api';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || '';

export default function StorePerformancePage() {
  const [storeList, setStoreList] = useState<StoreListItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<StoreListItem[]>([]);
  const [conversionDrivers, setConversionDrivers] = useState<ConversionDriverItem[]>([]);
  const [personaBreakdown, setPersonaBreakdown] = useState<PersonaBreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        // Fetch all 4 Store Performance APIs in parallel
        const [storeListRes, leaderboardRes, driversRes, personaRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/store/list`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/store/leaderboard?top_n=10`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/store/conversion-drivers`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/store/persona-breakdown`, { headers }),
        ]);

        if (!storeListRes.ok || !leaderboardRes.ok || !driversRes.ok || !personaRes.ok) {
          throw new Error('Failed to fetch store performance data');
        }

        const storeListData = await storeListRes.json();
        const leaderboardData = await leaderboardRes.json();
        const driversData = await driversRes.json();
        const personaData = await personaRes.json();

        // API responses may be wrapped in an array — handle both cases
        setStoreList(Array.isArray(storeListData[0]) ? storeListData[0] : storeListData);
        setLeaderboard(Array.isArray(leaderboardData[0]) ? leaderboardData[0] : leaderboardData);
        setConversionDrivers(Array.isArray(driversData[0]) ? driversData[0] : driversData);
        setPersonaBreakdown(Array.isArray(personaData[0]) ? personaData[0] : personaData);

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load store performance data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            <StoreKpis />
          </div>

          {/* Row 1: Persona Breakdown + Product Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: 340 }}>
            <CustomerPersonaBreakdown data={personaBreakdown} loading={loading} />
            <ProductCategoryPerformance />
          </div>

          {/* Store Details Table */}
          <StoreDetailsTable data={storeList} loading={loading} />

          {/* Row 2: Top Stores by Conversion + Call Quality Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: 360 }}>
            <TopStoresByConversion data={leaderboard} loading={loading} />
            <CallQualityBreakdownChart />
          </div>

          {/* Zero Call Stores */}
          <ZeroCallStores />

          {/* Conversion Attribution Analysis */}
          <ConversionAttributionAnalysis data={conversionDrivers} loading={loading} />

          {/* Weekly Performance Trend */}
          <WeeklyPerformanceTrendChart />

          {/* Store Intelligence */}
          <StorePerformanceIntelligence />
        </div>
      </div>
    </div>
  );
}
