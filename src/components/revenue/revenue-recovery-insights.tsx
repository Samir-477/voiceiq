'use client';

import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

const insights = [
  'Running Shoes Size 9 has the highest unmet demand across 12 stores — consistent signal from call data.',
  'Customers asking for White Sneakers accept Black alternatives at 43% rate — alternative suggestion scripts are effective.',
  "Men's Formal category shows highest call volume but lowest conversion — likely availability issue.",
  'North region contributes 29% of total revenue loss — highest among all regions.',
];

const suggestedActions = [
  {
    id: '1',
    title: "Prioritize Men's Formal restocking",
    description: 'Highest demand category with low conversion — indicates missed revenue',
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Review regional pricing gaps',
    description: 'North region shows highest revenue loss — needs pricing and availability review',
    priority: 'high' as const,
  },
  {
    id: '3',
    title: 'Promote alternative products',
    description: 'When top SKUs are unavailable, suggest alternatives via agent scripts',
    priority: 'medium' as const,
  },
];

const priorityStyles = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export function RevenueRecoveryInsights() {
  return (
    <div className="bg-white rounded-xl border-l-4 border-l-red-500 border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-50 p-1.5 rounded-lg">
            <Lightbulb size={18} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Revenue Recovery Insights</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
          <Sparkles size={12} className="text-gray-500" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">AI Powered</span>
        </div>
      </div>

      {/* Insights bullets */}
      <div className="space-y-3 mb-6">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-amber-500 mt-0.5 shrink-0">💡</span>
            <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>

      {/* Suggested Actions */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Suggested Actions</p>
        <div className="space-y-3">
          {suggestedActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between py-3 border-t border-gray-50 group"
            >
              <div className="flex items-start gap-2.5">
                <ArrowRight size={14} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {action.title}
                  </span>
                  <span className="text-sm text-gray-500"> — {action.description}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border shrink-0 ml-4 ${priorityStyles[action.priority]}`}
              >
                {action.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
