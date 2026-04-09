'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { ExplorerKpis } from '@/components/call-explorer/explorer-kpis';
import { IntentDistributionChart } from '@/components/call-explorer/intent-distribution-chart';
import { IntentVsSentimentChart } from '@/components/call-explorer/intent-vs-sentiment-chart';
import { CallLogsTable } from '@/components/call-explorer/call-logs-table';
import { IntentIntelligence } from '@/components/call-explorer/intent-intelligence';

export default function CallExplorerPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Call Explorer" subtitle="Browse and filter all call records with customer & voice insights" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />
          <ExplorerKpis />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntentDistributionChart />
            <IntentVsSentimentChart />
          </div>

          <CallLogsTable />
          <IntentIntelligence />
        </div>
      </div>
    </div>
  );
}
