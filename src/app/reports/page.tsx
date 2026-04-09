'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { AskQuestion } from '@/components/reports/ask-question';
import { GeneratedReportsTable } from '@/components/reports/generated-reports-table';
import { WeeklyPerformanceTrendChart } from '@/components/reports/weekly-performance-trend';
import { ComplaintsByRegionChart } from '@/components/reports/complaints-by-region';
import { ReportsAiInsights } from '@/components/reports/ai-insights';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Reports" subtitle="Conversational & automated reporting" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />
          
          <div className="mt-6">
            <AskQuestion />
          </div>

          <div>
            <GeneratedReportsTable />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklyPerformanceTrendChart />
            <ComplaintsByRegionChart />
          </div>

          <div>
            <ReportsAiInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
