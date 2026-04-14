'use client';

import { BranchKpiCards } from '@/components/branch-performance/branch-kpi-cards';
import { BranchLeaderboard } from '@/components/branch-performance/branch-leaderboard';
import { BranchCallsComplaintsChart } from '@/components/branch-performance/branch-calls-complaints-chart';
import { BranchAiInsights } from '@/components/branch-performance/branch-ai-insights';

export default function BranchPerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Branch Performance
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Monitor branch-level call metrics and identify underperformers
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── 1. KPI Cards ─────────────────────────────────────────────────── */}
        <BranchKpiCards />

        {/* ── 2. Branch Leaderboard ────────────────────────────────────────── */}
        <BranchLeaderboard />

        {/* ── 3. Calls vs Complaints Chart ─────────────────────────────────── */}
        <BranchCallsComplaintsChart />

        {/* ── 4. AI Insights & Recommended Actions ─────────────────────────── */}
        <BranchAiInsights />

      </div>
    </div>
  );
}
