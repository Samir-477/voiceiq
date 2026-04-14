'use client';

import { Users, Target, TrendingUp, IndianRupee } from 'lucide-react';

const kpis = [
  { label: 'Total Leads',       value: '312',     sub: 'This week',             icon: Users },
  { label: 'Hot Leads',         value: '86',      sub: 'Ready to convert',      icon: Target },
  { label: 'Conversion Rate',   value: '34%',     sub: 'Enquiry → Disbursal',   icon: TrendingUp },
  { label: 'Est. Revenue',      value: '₹1.2Cr',  sub: 'Pipeline value',        icon: IndianRupee },
];

export function LeadKpiCards() {
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
