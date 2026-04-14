'use client';

import { NlpReportGenerator } from '@/components/reports/nlp-report-generator';
import { ScheduledReports } from '@/components/reports/scheduled-reports';
import { ReportsAiInsights } from '@/components/reports/reports-ai-insights';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Reports
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Generate and download analytical reports
        </p>
      </div>

      <div className="px-8 pb-10 space-y-6 mt-3">

        {/* ── 1. NLP Report Generator ───────────────────────────────────────── */}
        <NlpReportGenerator />

        {/* ── 2. Scheduled Reports (8 cards, 2-col grid) ───────────────────── */}
        <ScheduledReports />

        {/* ── 3. AI Insights & Recommended Actions ─────────────────────────── */}
        <ReportsAiInsights />

      </div>
    </div>
  );
}
