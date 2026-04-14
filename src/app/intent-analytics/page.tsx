'use client';

import { AlertTriangle } from 'lucide-react';
import { IntentBreakdownTable } from '@/components/intent-analytics/intent-breakdown-table';
import { WeeklyIntentTrends } from '@/components/intent-analytics/weekly-intent-trends';
import { IntentAiInsights } from '@/components/intent-analytics/intent-ai-insights';

export default function IntentAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Intent Analytics
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Deep dive into call intent patterns and trends
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── Alert Banner ─────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <AlertTriangle size={15} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-gray-700 leading-snug">
            <span className="font-semibold text-red-600">Auction Alert calls surged 32%</span>{' '}
            this week — 47 cases need immediate branch follow-up.
          </p>
        </div>

        {/* ── 1. Intent Breakdown Table ─────────────────────────────────────── */}
        <IntentBreakdownTable />

        {/* ── 2. Weekly Intent Trends ───────────────────────────────────────── */}
        <WeeklyIntentTrends />

        {/* ── 3. AI Insights & Recommended Actions ─────────────────────────── */}
        <IntentAiInsights />

      </div>
    </div>
  );
}
