'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    title: 'Critical: Delhi - Karol Bagh',
    body: 'Worst performing branch with lowest FCR (58%), highest complaints (20), and only 8 disbursals. Needs immediate intervention.',
    action: 'Deploy branch turnaround team within 48 hours and conduct staff assessment',
  },
  {
    title: 'Auction Alert Cluster',
    body: 'Coimbatore, Hyderabad, and Delhi collectively account for 27 auction alerts — 57% of total network alerts.',
    action: 'Implement centralized default management cell for these 3 branches',
  },
  {
    title: 'Revenue Leader: Mumbai',
    body: 'Mumbai leads with 25 disbursals and 156 calls. Adding 2 more agents could increase disbursals by 30%.',
    action: 'Approve 2 additional agent positions for Mumbai - Andheri branch',
  },
  {
    title: 'Best Practice Transfer',
    body: "Madurai achieves 80% FCR with lowest complaints. Their customer engagement model should be replicated.",
    action: "Document Madurai's SOPs and conduct knowledge transfer workshops",
  },
  {
    title: 'Complaint Pattern',
    body: "Hyderabad's 18 complaints centre around staff behaviour (60%) and processing delays (25%).",
    action: 'Mandatory soft-skills refresher for Hyderabad staff and process audit',
  },
];

export function BranchAiInsights() {
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
