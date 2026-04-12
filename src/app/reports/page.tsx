'use client';

import { useState, useEffect } from 'react';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { AskQuestion } from '@/components/reports/ask-question';
import { GeneratedReportsTable } from '@/components/reports/generated-reports-table';
import { WeeklyPerformanceTrendChart } from '@/components/reports/weekly-performance-trend';
import { ComplaintsByRegionChart } from '@/components/reports/complaints-by-region';
import { ReportsAiInsights } from '@/components/reports/ai-insights';

export default function ReportsPage() {
  const { filters } = useFilters();
  const [loading, setLoading] = useState(false);
  
  // placeholder data until Reports APIs are implemented
  const [reportsData] = useState({
    prompts: [
      "Show revenue loss in South region last week",
      "Top stores by conversion in Mumbai",
      "Analysis of missed calls this month",
      "Customer sentiment trend for Q1"
    ],
    generated: [],
    trend: [],
    complaints: [],
    insights: []
  });

  useEffect(() => {
    // Placeholder effect to show "Loading" state when filters change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Reports" subtitle="Conversational & automated reporting" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />
          
          <div className="mt-6">
            <AskQuestion prompts={reportsData.prompts} />
          </div>

          <div>
            <GeneratedReportsTable data={reportsData.generated} loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklyPerformanceTrendChart data={reportsData.trend} loading={loading} />
            <ComplaintsByRegionChart data={reportsData.complaints} loading={loading} />
          </div>

          <div>
            <ReportsAiInsights insights={reportsData.insights} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
