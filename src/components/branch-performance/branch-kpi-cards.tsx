'use client';

import { Building2, AlertTriangle, TrendingUp, Phone } from 'lucide-react';

const kpis = [
  { label: 'Total Branches',   value: '8',    icon: Building2 },
  { label: 'Branches at Risk', value: '2',    icon: AlertTriangle },
  { label: 'Best Branch FCR',  value: '80%',  icon: TrendingUp },
  { label: 'Total Calls',      value: '970',  icon: Phone },
];

export function BranchKpiCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map(({ label, value, icon: Icon }) => (
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
          </div>
        </div>
      ))}
    </div>
  );
}
