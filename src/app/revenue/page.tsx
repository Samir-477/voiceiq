'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY || '';

export default function RevenueIntelligencePage() {
  const [summary, setSummary] = useState<RevenueSummaryResponse | null>(null);
  const [regionData, setRegionData] = useState<RevenueByRegionItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDemandConversionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        };

        // Fetch all 3 APIs in parallel
        const [summaryRes, regionRes, categoryRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/revenue/summary`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/revenue/by-region`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/revenue/category-demand`, { headers })
        ]);

        if (!summaryRes.ok || !regionRes.ok || !categoryRes.ok) {
          throw new Error('Failed to fetch revenue analytics data');
        }

        const summaryData = await summaryRes.json();
        const regionListData = await regionRes.json();
        const categoryListData = await categoryRes.json();

        // API responses are often wrapped in arrays or have specific structures
        setSummary(Array.isArray(summaryData) ? summaryData[0] : summaryData);
        setRegionData(Array.isArray(regionListData[0]) ? regionListData[0] : regionListData);
        setCategoryData(Array.isArray(categoryListData[0]) ? categoryListData[0] : categoryListData);
        
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Transform category data for TopDemandedProducts component using summary.category_breakdown
  const topProducts = useMemo(() => {
    if (!summary?.category_breakdown) return [];

    // Map over the entries in the category_breakdown dictionary
    return Object.entries(summary.category_breakdown)
      .map(([name, count]) => {
        // Find matching entry in categoryData to get conversion_pct
        const matchingEntry = categoryData.find(c => 
          c.category.toLowerCase() === name.toLowerCase()
        );

        return {
          id: name,
          name: name,
          requests: count,
          fulfillmentPct: matchingEntry ? Math.round(matchingEntry.conversion_pct) : 0
        };
      })
      .sort((a, b) => b.requests - a.requests) // Sort by most requests
      .slice(0, 5); // Take top 5
  }, [summary, categoryData]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header
        title="Revenue Intelligence"
        subtitle="Track missed sales & product demand from call data"
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />

          <RevenueKpiCards metrics={summary} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
            <RevenueLossChart data={regionData} loading={loading} />
            <TopDemandedProducts data={topProducts} loading={loading} />
          </div>

          <div className="mt-6">
            <ProductCategoryDemand data={categoryData} loading={loading} />
          </div>

          <div className="mt-6">
            <RevenueRecoveryInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
