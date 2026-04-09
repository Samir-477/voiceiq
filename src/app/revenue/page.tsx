'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { RevenueKpiCards } from '@/components/revenue/revenue-kpi-cards';
import { RevenueLossChart } from '@/components/revenue/revenue-loss-chart';
import { TopDemandedProducts } from '@/components/revenue/top-demanded-products';
import { ProductCategoryDemand } from '@/components/revenue/product-category-demand';
import { RevenueRecoveryInsights } from '@/components/revenue/revenue-recovery-insights';
import { mockRevenueData } from './mock-data';

export default function RevenueIntelligencePage() {
  const { kpis, regionLoss, topProducts } = mockRevenueData;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header
        title="Revenue Intelligence"
        subtitle="Track missed sales & product demand from call data"
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />

          <RevenueKpiCards metrics={kpis} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-stretch">
            <RevenueLossChart data={regionLoss} />
            <TopDemandedProducts data={topProducts} />
          </div>

          <div className="mt-6">
            <ProductCategoryDemand />
          </div>

          <div className="mt-6">
            <RevenueRecoveryInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
