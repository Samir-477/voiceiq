'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Coaching Priority: Vikram Singh',
    body: 'Lowest FCR (60%) and highest AHT (6m 15s). Handles mostly high-stress auction calls without adequate training.',
    action: 'Schedule 1-on-1 coaching session focusing on de-escalation and faster resolution',
  },
  {
    title: 'Best Practice Sharing',
    body: "Deepa Menon's FCR of 85% is 12 points above team average. Her call scripts and techniques should be documented.",
    action: "Record Deepa's top calls and create a training module for the team",
  },
  {
    title: 'Workload Imbalance',
    body: "Priya handles 89 calls vs Vikram's 58. Uneven distribution may cause burnout and impact quality.",
    action: 'Redistribute call routing to balance load within ±10% across agents',
  },
  {
    title: 'Sentiment Gap',
    body: '25-point sentiment gap between best (Deepa: 80%) and worst (Vikram: 55%) performers.',
    action: 'Implement weekly sentiment review and targeted soft-skills training',
  },
  {
    title: 'Upsell Opportunity',
    body: 'Suresh Nair shows strong renewal conversion. Pairing him with enquiry calls could boost lead conversion.',
    action: 'Route 30% of loan enquiry calls to Suresh for a 2-week pilot',
  },
];

export function AgentAiInsights() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex">
        <div className="w-1 shrink-0 bg-red-500" />
        <div className="flex-1 px-6 py-5">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={17} className="text-red-500" />
            <h2 className="text-[15px] font-bold text-gray-900">
              AI Insights &amp; Recommended Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className="rounded-xl border border-gray-100 p-4 hover:border-red-100 hover:bg-red-50/30 transition-all duration-150"
              >
                <h3 className="text-[13px] font-bold text-gray-900 mb-1.5">{insight.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{insight.body}</p>
                <div className="flex items-start gap-1.5">
                  <ArrowRight size={12} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] font-medium text-red-500 leading-snug">
                    {insight.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
