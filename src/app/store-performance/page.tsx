'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || '';

export default function StorePerformancePage() {
  const { filters } = useFilters();
  const [storeList,           setStoreList]           = useState<StoreListItem[]>([]);
  const [conversionDrivers,   setConversionDrivers]   = useState<ConversionDriverItem[]>([]);
  const [personaBreakdown,    setPersonaBreakdown]    = useState<PersonaBreakdownItem[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<CategoryDemandConversionItem[]>([]);
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

        // Fetch all APIs in parallel
        const [storeListRes, driversRes, personaRes, categoryRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/store/list${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/store/conversion-drivers${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/store/persona-breakdown${qs}`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/revenue/category-demand${qs}`, { headers }),
        ]);

        if (!storeListRes.ok || !driversRes.ok || !personaRes.ok || !categoryRes.ok) {
          throw new Error('Failed to fetch store performance data');
        }

        const storeListData = await storeListRes.json();
        const driversData   = await driversRes.json();
        const personaData   = await personaRes.json();
        const categoryData  = await categoryRes.json();

        setStoreList(Array.isArray(storeListData[0]) ? storeListData[0] : storeListData);
        setConversionDrivers(Array.isArray(driversData[0]) ? driversData[0] : driversData);
        setPersonaBreakdown(Array.isArray(personaData[0]) ? personaData[0] : personaData);
        setCategoryPerformance(Array.isArray(categoryData[0]) ? categoryData[0] : categoryData);

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load store performance data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

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
              data={storeList.length > 0 ? {
                activeStores: { 
                  value: String(storeList.filter(s => s.total_calls > 0).length), 
                  subtitle: 'above zero calls' 
                },
                zeroCallStores: { 
                  value: String(storeList.filter(s => s.total_calls === 0).length), 
                  subtitle: 'need attention',
                  trendUp: false 
                },
                totalCalls: { 
                  value: storeList.reduce((acc, s) => acc + s.total_calls, 0).toLocaleString(), 
                  subtitle: 'across all stores' 
                },
                avgConversion: { 
                  value: `${(storeList.reduce((acc, s) => acc + s.conversion_pct, 0) / (storeList.length || 1)).toFixed(1)}%`, 
                  subtitle: 'average rate',
                  trendUp: true 
                },
                avgHandleTime: { 
                  value: '2m 45s',
                  subtitle: 'per call' 
                }
              } : null} 
              loading={loading} 
            />
          </div>

          {/* Row 1: Persona Breakdown + Product Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: 340 }}>
            <CustomerPersonaBreakdown data={personaBreakdown} loading={loading} />
            <ProductCategoryPerformance data={categoryPerformance} loading={loading} />
          </div>

          {/* Store Details Table */}
          <StoreDetailsTable data={storeList} loading={loading} />

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
