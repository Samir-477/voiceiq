'use client';

import { Heart, ThumbsDown, TrendingUp, MessageCircle } from 'lucide-react';

const kpis = [
  { label: 'Avg CSAT',        value: '4.1/5', sub: 'Across all intents',  icon: Heart },
  { label: 'Negative Calls',  value: '308',   sub: '24% of total',        icon: ThumbsDown },
  { label: 'Escalations',     value: '45',    sub: 'Needs follow-up',     icon: TrendingUp },
  { label: 'Repeat Callers',  value: '127',   sub: 'Unresolved issues',   icon: MessageCircle },
];

export function CxKpiCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map(({ label, value, sub, icon: Icon }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
        >
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-gray-400 leading-tight mb-0.5">{label}</p>
            <p className="text-[20px] font-bold text-gray-900 leading-none">{value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
