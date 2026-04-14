'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

type Insight = {
  title: string;
  body: string;
  action: string;
};

const insights: Insight[] = [
  {
    title: 'Lead Conversion Drop',
    body: 'Enquiry-to-disbursal conversion fell from 38% to 34% this week. Top reason: documentation delays at branch level.',
    action: 'Implement pre-visit document verification via WhatsApp to reduce branch turnaround',
  },
  {
    title: 'Auction Risk Escalation',
    body: '47 auction alerts today — 15 more than yesterday. 60% concentrated in Delhi and Hyderabad branches.',
    action: 'Activate emergency retention team for high-risk accounts in these branches',
  },
  {
    title: 'Revenue Recovery',
    body: '₹12.4L revenue at risk from 89 missed follow-ups. Average ticket size ₹1.4L per customer.',
    action: 'Prioritize outbound calls to top 20 high-value accounts by end of day',
  },
  {
    title: 'CSAT Improvement Path',
    body: 'CSAT drops to 2.5 for complaint calls vs 4.4 for enquiries. Quick resolution is the #1 driver.',
    action: 'Set 4-hour SLA for complaint resolution and track compliance daily',
  },
  {
    title: 'Peak Hour Optimization',
    body: '40% of calls come between 10am–1pm. Current staffing covers only 75% of demand during this window.',
    action: 'Shift 3 agents from afternoon slot to morning peak for 2-week trial',
  },
  {
    title: 'Upsell Opportunity',
    body: '116 renewal calls show 78% conversion when agents proactively suggest top-up. Only 40% of agents do this.',
    action: 'Add mandatory top-up check to renewal call script',
  },
];

export function AiInsights() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex">
        {/* Red left accent bar */}
        <div className="w-1 shrink-0 bg-red-500" />

        <div className="flex-1 px-6 py-5">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-red-500" />
            <h2 className="text-[15px] font-bold text-gray-900">
              AI Insights &amp; Recommended Actions
            </h2>
          </div>

          {/* 3×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className="rounded-xl border border-gray-100 p-4 hover:border-red-100 hover:bg-red-50/30 transition-all duration-150"
              >
                <h3 className="text-[13px] font-bold text-gray-900 mb-1.5 leading-snug">
                  {insight.title}
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-3">
                  {insight.body}
                </p>
                <div className="flex items-start gap-1.5">
                  <ArrowRight size={13} className="text-red-500 mt-0.5 shrink-0" />
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
