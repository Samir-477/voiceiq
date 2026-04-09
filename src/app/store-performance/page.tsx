'use client';

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

export default function StorePerformancePage() {
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
            <CustomerPersonaBreakdown />
            <ProductCategoryPerformance />
          </div>

          {/* Store Details Table */}
          <StoreDetailsTable />

          {/* Row 2: Top Stores by Conversion + Call Quality Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" style={{ minHeight: 360 }}>
            <TopStoresByConversion />
            <CallQualityBreakdownChart />
          </div>

          {/* Zero Call Stores */}
          <ZeroCallStores />

          {/* Conversion Attribution Analysis */}
          <ConversionAttributionAnalysis />

          {/* Weekly Performance Trend */}
          <WeeklyPerformanceTrendChart />

          {/* Store Intelligence */}
          <StorePerformanceIntelligence />
        </div>
      </div>
    </div>
  );
}
