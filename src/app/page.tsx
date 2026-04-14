'use client';

import { KpiRow, kpiRow1, kpiRow2 } from '@/components/dashboard/kpi-cards';
import { ExecutiveSummary } from '@/components/dashboard/executive-summary';
import { CallIntentChart } from '@/components/dashboard/call-intent-chart';
import { CustomerSentimentChart } from '@/components/dashboard/customer-sentiment-chart';
import { AiInsights } from '@/components/dashboard/ai-insights';

export default function ExecutiveDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Real-time voice analytics for Chola Gold Loan operations
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── KPI Row 1 ───────────────────────────────────────────────────── */}
        <KpiRow items={kpiRow1} />

        {/* ── KPI Row 2 ───────────────────────────────────────────────────── */}
        <KpiRow items={kpiRow2} />

        {/* ── Executive Summary Banner ────────────────────────────────────── */}
        <ExecutiveSummary />

        {/* ── Charts: Call Intent + Customer Sentiment ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
          <CallIntentChart />
          <CustomerSentimentChart />
        </div>

        {/* ── AI Insights & Recommended Actions ───────────────────────────── */}
        <AiInsights />

      </div>
    </div>
  );
}
