'use client';

import {
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Target,
  TrendingDown,
  BarChart2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type KpiCardData = {
  id: string;
  label: string;
  value: string;
  sub: string;
  subPositive: boolean;
  icon: React.ElementType;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

export const kpiRow1: KpiCardData[] = [
  {
    id: 'total_calls',
    label: 'Total Calls',
    value: '1,284',
    sub: '+8% vs yesterday',
    subPositive: true,
    icon: Phone,
  },
  {
    id: 'resolved_first',
    label: 'Resolved on First Call',
    value: '72%',
    sub: 'Above target 70%',
    subPositive: true,
    icon: CheckCircle2,
  },
  {
    id: 'avg_handle',
    label: 'Avg Handle Time',
    value: '4m 32s',
    sub: '-12s vs last week',
    subPositive: true,
    icon: Clock,
  },
  {
    id: 'complaint_rate',
    label: 'Complaint Rate',
    value: '18%',
    sub: 'Needs attention',
    subPositive: false,
    icon: AlertTriangle,
  },
];

export const kpiRow2: KpiCardData[] = [
  {
    id: 'auction_alerts',
    label: 'Auction Alerts',
    value: '47',
    sub: '↑15 from yesterday',
    subPositive: false,
    icon: ShieldAlert,
  },
  {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    value: '34%',
    sub: '436 converted',
    subPositive: true,
    icon: Target,
  },
  {
    id: 'revenue_risk',
    label: 'Revenue at Risk',
    value: '₹12.4L',
    sub: 'Action needed',
    subPositive: false,
    icon: TrendingDown,
  },
  {
    id: 'csat',
    label: 'CSAT Score',
    value: '4.1/5',
    sub: 'Stable',
    subPositive: true,
    icon: BarChart2,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KpiCardData }) {
  const Icon = kpi.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[12px] font-medium text-gray-500 leading-tight">{kpi.label}</span>
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <Icon size={15} className="text-red-400" />
        </div>
      </div>
      <p className="text-[22px] font-bold text-gray-900 leading-none tracking-tight mb-1.5">
        {kpi.value}
      </p>
      <p className="text-[11px] font-medium text-red-500">{kpi.sub}</p>
    </div>
  );
}

export function KpiRow({ items }: { items: KpiCardData[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
