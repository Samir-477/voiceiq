'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { OperationsKpis } from '@/components/operations/operations-kpis';
import { WeeklyCallVolumeChart } from '@/components/operations/weekly-call-volume';
import { CallsByRegionChart } from '@/components/operations/calls-by-region';
import { GeographicBreakdown } from '@/components/operations/geographic-breakdown';
import { OperationsIntelligence } from '@/components/operations/operations-intelligence';

export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Operations Dashboard" subtitle="Monitor store efficiency across all regions" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />
          
          <div className="mt-6 mb-6">
            <OperationsKpis />
          </div>

          {/* Row 2: Charts Split (approx 65/35) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <WeeklyCallVolumeChart />
            </div>
            <div className="lg:col-span-1">
              <CallsByRegionChart />
            </div>
          </div>

          {/* Row 3: Geographic Breakdown Table */}
          <div className="mb-6">
            <GeographicBreakdown />
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
