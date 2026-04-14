'use client';

import { LeadKpiCards } from '@/components/lead-management/lead-kpi-cards';
import { LeadFunnelAndSource } from '@/components/lead-management/lead-funnel-and-source';
import { LeadPipelineTable } from '@/components/lead-management/lead-pipeline-table';
import { LeadAiInsights } from '@/components/lead-management/lead-ai-insights';

export default function LeadManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Lead Management
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Track and convert gold loan enquiries into disbursals
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── 1. KPI Cards ─────────────────────────────────────────────────── */}
        <LeadKpiCards />

        {/* ── 2. Lead Conversion Funnel + Source Distribution ──────────────── */}
        <LeadFunnelAndSource />

        {/* ── 3. Lead Pipeline Table (with Hot/Warm/Cold filter) ───────────── */}
        <LeadPipelineTable />

        {/* ── 4. AI Insights & Recommended Actions ─────────────────────────── */}
        <LeadAiInsights />

      </div>
    </div>
  );
}
