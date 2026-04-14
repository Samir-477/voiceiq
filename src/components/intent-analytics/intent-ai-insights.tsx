'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Auction Alert Spike',
    body: '32% surge in auction-related calls indicates a potential systemic issue with customer communication about payment deadlines.',
    action: 'Review SMS/email alert triggers for accounts nearing auction threshold',
  },
  {
    title: 'Loan Enquiry Conversion Gap',
    body: 'Only 34% of loan enquiry calls convert to disbursals. Top drop-off reason: documentation confusion.',
    action: 'Implement a post-call document checklist SMS for all enquiry calls',
  },
  {
    title: 'Competitor Rate Comparison',
    body: '18% of interest rate calls mention competitor rates. Customers perceive Chola rates as 0.5% higher.',
    action: 'Launch a limited-time rate-match campaign for high-value customers',
  },
  {
    title: 'Peak Hour Staffing',
    body: 'Call volume peaks between 10am–1pm with 40% longer wait times. Agent utilization exceeds 95%.',
    action: 'Add 3 temporary agents during peak hours to reduce wait time by 30%',
  },
  {
    title: 'Repeat Caller Pattern',
    body: '127 customers called 3+ times this week, mostly for complaint & gold release tracking.',
    action: 'Implement proactive callback system for unresolved cases within 24 hours',
  },
  {
    title: 'Top-Up Revenue Opportunity',
    body: '118 renewal/top-up calls show strong demand. Pre-approved customers convert at 78%.',
    action: 'Launch proactive outbound campaign for 500+ eligible renewal accounts',
  },
];

export function IntentAiInsights() {
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
