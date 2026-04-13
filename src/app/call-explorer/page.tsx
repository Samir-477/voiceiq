'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { ExplorerKpis } from '@/components/call-explorer/explorer-kpis';
import { IntentDistributionChart } from '@/components/call-explorer/intent-distribution-chart';
import { IntentVsSentimentChart } from '@/components/call-explorer/intent-vs-sentiment-chart';
import { CallLogsTable } from '@/components/call-explorer/call-logs-table';
import { IntentIntelligence } from '@/components/call-explorer/intent-intelligence';
import type {
  CallExplorerSummary,
  IntentSentimentItem,
  IntentDistributionResponse,
  CallLogResponse,
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth, fetchRawWithAuth } from '@/lib/api-client';

export default function CallExplorerPage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);
  const callListQs = qs 
    ? `${qs}&page=1&per_page=20` 
    : '?page=1&per_page=20';

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: callSummary, isLoading: loadingSummary } = useQuery<CallExplorerSummary>({
    queryKey: ['call-explorer-summary', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/calls/summary${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: intentSentiment, isLoading: loadingSentiment } = useQuery<IntentSentimentItem[]>({
    queryKey: ['call-intent-sentiment', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/calls/intent-sentiment${qs}`),
  });

  const { data: intentDistData, isLoading: loadingIntent } = useQuery<IntentDistributionResponse>({
    queryKey: ['kpi-intent', filters], // Shared with Overview
    queryFn: () => fetchRawWithAuth(`/api/v1/analytics/kpi/intent-distribution${qs}`),
  });

  const { data: callLogData, isLoading: loadingLogs } = useQuery<CallLogResponse>({
    queryKey: ['call-logs', filters],
    queryFn: () => fetchRawWithAuth(`/api/v1/analytics/calls${callListQs}`),
  });

  const loading = loadingSummary || loadingSentiment || loadingIntent || loadingLogs;

  const intentDist = useMemo(
    () => (Array.isArray(intentDistData?.intents) ? intentDistData.intents : []),
    [intentDistData]
  );
  
  const callLogs = callLogData?.results || [];
  const totalCalls = callLogData?.total ?? callLogs.length;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Call Explorer" subtitle="Browse and filter all call records with customer & voice insights" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <ExplorerKpis data={callSummary || null} loading={loadingSummary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntentDistributionChart data={intentDist}      loading={loadingIntent} />
            <IntentVsSentimentChart  data={intentSentiment || []} loading={loadingSentiment} />
          </div>

          <CallLogsTable data={callLogs} total={totalCalls} loading={loadingLogs} />
          <IntentIntelligence />
        </div>
      </div>
    </div>
  );
}
