'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Lead Response Time Critical',
    body: 'LD-010 was lost because no follow-up was done within 24 hours. 15% of leads go cold after 48 hours.',
    action: 'Enforce mandatory 4-hour first response SLA for all new leads',
  },
  {
    title: 'High-Value Lead Alert',
    body: 'LD-009 (Ganesh Iyer, 60g, ₹2.7L) is the highest-value lead this week. Requires VIP treatment.',
    action: 'Assign branch manager for personal handling and offer preferential rate',
  },
  {
    title: 'Conversion Funnel Drop-off',
    body: '40% drop from qualified leads to branch visits. Main reason: inconvenient branch timing.',
    action: 'Offer extended hours (8am–8pm) and weekend appointments for qualified leads',
  },
  {
    title: 'Competitor Win-back',
    body: '3 leads lost to Muthoot this week due to faster disbursal. Average Chola disbursal: 6 hours vs Muthoot 2 hours.',
    action: "Launch '2-Hour Gold Loan' express service for pre-verified customers",
  },
  {
    title: 'Renewal Upsell Opportunity',
    body: 'LD-007 is on 3rd renewal — high LTV customer. Proactive top-up offers for renewal customers convert at 78%.',
    action: 'Auto-identify renewal-eligible customers and trigger outbound campaigns',
  },
  {
    title: 'Lead Source Optimization',
    body: 'Inbound calls generate 65% of leads with 34% conversion. Website generates 10% with only 12% conversion.',
    action: 'Invest in call center capacity and add callback request feature on website',
  },
];

export function LeadAiInsights() {
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
