'use client';

import { useState, useEffect } from 'react';
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
  IntentDistributionItem,
  CallLogItem,
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

export default function CallExplorerPage() {
  const { filters } = useFilters();
  const [callSummary,     setCallSummary]     = useState<CallExplorerSummary | null>(null);
  const [intentSentiment, setIntentSentiment] = useState<IntentSentimentItem[]>([]);
  const [intentDist,      setIntentDist]      = useState<IntentDistributionItem[]>([]);
  const [callLogs,        setCallLogs]        = useState<CallLogItem[]>([]);
  const [totalCalls,      setTotalCalls]      = useState(0);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        const qs = buildQueryString(filters);
        // For the call list, we need to merge with existing query params (page/per_page)
        const callListQs = qs 
          ? `${qs}&page=1&per_page=20` 
          : '?page=1&per_page=20';

        // Fetch all 4 Call Explorer APIs in parallel
        const [summaryRes, intentSentimentRes, intentDistRes, callListRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/calls/summary${qs}`,            { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/calls/intent-sentiment${qs}`,   { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/kpi/intent-distribution${qs}`,  { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/calls${callListQs}`,            { headers }),
        ]);

        if (!summaryRes.ok || !intentSentimentRes.ok || !intentDistRes.ok || !callListRes.ok) {
          throw new Error('Failed to fetch call explorer data');
        }

        const summaryData         = await summaryRes.json();
        const intentSentimentData  = await intentSentimentRes.json();
        const intentDistData       = await intentDistRes.json();
        const callListData         = await callListRes.json();

        // summary is a single object
        setCallSummary(Array.isArray(summaryData) ? summaryData[0] : summaryData);

        // intent-sentiment is an array
        const intentArr = Array.isArray(intentSentimentData[0])
          ? intentSentimentData[0]
          : intentSentimentData;
        setIntentSentiment(intentArr);

        // intent-distribution: API returns { total, intents: [...] }
        const distRaw = Array.isArray(intentDistData) ? intentDistData[0] : intentDistData;
        setIntentDist(Array.isArray(distRaw?.intents) ? distRaw.intents : []);

        // call list may return { results: [...], total: N } or a bare array
        if (callListData && Array.isArray(callListData.results)) {
          setCallLogs(callListData.results);
          setTotalCalls(callListData.total ?? callListData.results.length);
        } else {
          const arr = Array.isArray(callListData[0]) ? callListData[0] : callListData;
          setCallLogs(arr);
          setTotalCalls(arr.length);
        }

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(msg || 'Failed to load call explorer data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Call Explorer" subtitle="Browse and filter all call records with customer & voice insights" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <ExplorerKpis data={callSummary} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntentDistributionChart data={intentDist}      loading={loading} />
            <IntentVsSentimentChart  data={intentSentiment} loading={loading} />
          </div>

          <CallLogsTable data={callLogs} total={totalCalls} loading={loading} />
          <IntentIntelligence />
        </div>
      </div>
    </div>
  );
}
