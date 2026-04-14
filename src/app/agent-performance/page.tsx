'use client';

import { AgentKpiCards } from '@/components/agent-performance/agent-kpi-cards';
import { AgentLeaderboard } from '@/components/agent-performance/agent-leaderboard';
import { AgentCsatFcrChart } from '@/components/agent-performance/agent-csat-fcr-chart';
import { AgentAiInsights } from '@/components/agent-performance/agent-ai-insights';

export default function AgentPerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Agent Performance
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Monitor individual agent metrics and identify coaching opportunities
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── 1. KPI Cards ─────────────────────────────────────────────────── */}
        <AgentKpiCards />

        {/* ── 2. Agent Leaderboard ─────────────────────────────────────────── */}
        <AgentLeaderboard />

        {/* ── 3. CSAT & FCR Comparison Chart ───────────────────────────────── */}
        <AgentCsatFcrChart />

        {/* ── 4. AI Insights & Recommended Actions ─────────────────────────── */}
        <AgentAiInsights />

      </div>
    </div>
  );
}
