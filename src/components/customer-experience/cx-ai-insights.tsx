'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Gold Release SLA Breach',
    body: '42 complaints about gold release delays. Average release time is 72 hours vs 24-hour promise.',
    action: 'Implement same-day gold release for payments received before 2pm',
  },
  {
    title: 'Auction Communication Gap',
    body: '28 customers received auction notice without prior warning. This violates RBI guidelines on fair practices.',
    action: 'Mandate 3-tier notification: SMS at 30 days, call at 15 days, final notice at 7 days',
  },
  {
    title: 'Staff Behavior Training',
    body: '22 complaints about branch staff. 80% from 3 branches: Hyderabad, Delhi, and Coimbatore.',
    action: 'Mandatory customer service refresher training for identified branches within 1 week',
  },
  {
    title: 'Repeat Caller Resolution',
    body: '127 repeat callers indicate systemic first-contact resolution failures. Average 2.4 calls per issue.',
    action: 'Implement a dedicated resolution desk for repeat callers with senior agent assignment',
  },
  {
    title: 'NPS Improvement Path',
    body: 'Moving complaint CSAT from 2.5 to 3.5 could improve overall NPS by 15 points.',
    action: 'Launch a complaint fast-track program with 4-hour resolution SLA',
  },
];

export function CxAiInsights() {
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
