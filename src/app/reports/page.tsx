'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { AskQuestion } from '@/components/reports/ask-question';
import { GeneratedReportsTable } from '@/components/reports/generated-reports-table';
import { WeeklyPerformanceTrendChart } from '@/components/reports/weekly-performance-trend';
import { ComplaintsByRegionChart } from '@/components/reports/complaints-by-region';
import { ReportsAiInsights } from '@/components/reports/ai-insights';
import { fetchWithAuth, postWithAuth } from '@/lib/api-client';
import type {
  NlpDashboardResponse,
  NlpQueryResponse,
  NlpReportItem,
} from '@/types/api';

export default function ReportsPage() {
  // ── Page-load data ─────────────────────────────────────────────────────────
  const { data: dashboard, isLoading: loadingDashboard } =
    useQuery<NlpDashboardResponse>({
      queryKey: ['nlp-dashboard'],
      queryFn: () =>
        fetchWithAuth('/api/v1/chat-with-data/dashboard').then((d) =>
          Array.isArray(d) ? d[0] : d
        ),
    });

  const { data: rawReports, isLoading: loadingReports } = useQuery<
    NlpReportItem[]
  >({
    queryKey: ['nlp-reports'],
    queryFn: () =>
      fetchWithAuth('/api/v1/chat-with-data/reports').then((d) =>
        Array.isArray(d) ? d : d?.reports ?? d?.data ?? []
      ),
  });

  // ── NLP POST Mutation ───────────────────────────────────────────────────────
  const {
    mutate: submitQuestion,
    data: queryResult,
    isPending: isAsking,
    reset: resetAnswer,
  } = useMutation<NlpQueryResponse, Error, string>({
    mutationFn: (question: string) =>
      postWithAuth('/api/v1/chat-with-data/query', {
        question,
        recursion_limit: 50,
      }),
  });

  // ── Normalise reports list to component prop shape ──────────────────────────
  const reportsTableData = (rawReports ?? []).map((r: NlpReportItem) => ({
    report: r.report ?? r.name ?? r.title ?? 'Untitled',
    date:   r.date   ?? r.created_at ?? '—',
    type:   r.type   ?? r.category   ?? 'Auto',
    status: (r.status === 'Ready' || r.status === 'In Progress')
      ? (r.status as 'Ready' | 'In Progress')
      : 'Ready',
  }));

  // ── Normalise insights to component prop shape ──────────────────────────────
  // API returns { insight: string, suggestion: string } per item
  const insightsData = (dashboard?.insights ?? []).map((i) => ({
    title:      i.title      ?? i.insight    ?? '',
    actionText: i.actionText ?? i.suggestion ?? i.action_text ?? i.action ?? '',
  }));

  // ── Extract the query result text (field name unknown until runtime) ─────────
  const answerText =
    queryResult?.report   ??
    queryResult?.result   ??
    queryResult?.answer   ??
    queryResult?.markdown ??
    queryResult?.output   ??
    queryResult?.message  ??
    null;

  const loading = loadingDashboard || loadingReports;

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Reports" subtitle="Conversational & automated reporting" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <div className="mt-6">
            <AskQuestion
              prompts={dashboard?.suggestions ?? []}
              onSubmit={submitQuestion}
              result={answerText}
              loading={isAsking}
              onReset={resetAnswer}
            />
          </div>

          <div>
            <GeneratedReportsTable
              data={reportsTableData}
              loading={loadingReports}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklyPerformanceTrendChart
              data={dashboard?.weekly_trend ?? []}
              loading={loadingDashboard}
            />
            <ComplaintsByRegionChart
              data={(dashboard?.complaints_by_region ?? []).map((r) => ({
                region:     r.region,
                complaints: r.count ?? r.complaints ?? 0,
              }))}
              loading={loadingDashboard}
            />
          </div>

          <div>
            <ReportsAiInsights
              insights={insightsData}
              loading={loadingDashboard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
