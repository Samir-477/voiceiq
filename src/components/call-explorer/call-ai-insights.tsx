'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Quality Score Distribution',
    body: '3 out of 8 calls scored below 80. Common issue: incomplete resolution and lack of empathy in distress calls.',
    action: 'Implement quality coaching for agents scoring below 80 on any call',
  },
  {
    title: 'Auction Call Handling',
    body: 'CGL-1002 shows inadequate de-escalation. Agent transferred too quickly without exploring all options.',
    action: 'Create an auction-specific call script with 5-step resolution framework',
  },
  {
    title: 'Top-Up Conversion Success',
    body: 'CGL-1006 demonstrates ideal upselling — pre-check eligibility, offer options, and create urgency.',
    action: 'Use this call as a training example for the entire team',
  },
  {
    title: 'Fee Transparency Issue',
    body: 'CGL-1004 reveals branch-level miscommunication about fees. This is a recurring pattern.',
    action: 'Audit all branch-level fee disclosures and standardize communication',
  },
  {
    title: 'Lead Capture Rate',
    body: 'Only 2 of 8 calls resulted in lead creation. Enquiry calls should always generate a CRM lead.',
    action: 'Make CRM lead creation mandatory for all Loan Enquiry intent calls',
  },
];

export function CallAiInsights() {
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
