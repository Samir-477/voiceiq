'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Report Automation',
    body: '3 daily reports are generated manually. Automating these could save 2 hours/day for the analytics team.',
    action: 'Set up scheduled auto-generation and email delivery for daily reports',
  },
  {
    title: 'Missing Report: Lead Funnel',
    body: 'No report tracks enquiry-to-disbursal conversion funnel. This is critical for revenue optimization.',
    action: 'Create a Lead Conversion Funnel report with daily frequency',
  },
  {
    title: 'Data Freshness',
    body: 'Monthly complaint report is 10 days old. Stale data leads to delayed action on emerging issues.',
    action: 'Increase complaint report frequency to weekly with real-time alerts',
  },
];

export function ReportsAiInsights() {
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
                  <p className="text-[12px] font-medium text-red-500 leading-snug">{insight.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
