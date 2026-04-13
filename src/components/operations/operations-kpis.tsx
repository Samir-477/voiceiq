'use client';

import type React from 'react';
import { Phone, CheckCircle, XCircle, AlertTriangle, Calendar, Sun, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OpsSummaryResponse } from '@/types/api';

interface KpiProps {
  label:    string;
  value:    string;
  subLabel: string;
  icon: React.ComponentType<{ size?: number }>;
  trendUp?: boolean;
}

function KpiCard({ label, value, subLabel, icon: Icon, trendUp }: KpiProps) {
  const subLabelClass =
    trendUp === true  ? 'text-emerald-500' :
    trendUp === false ? 'text-red-500'     : 'text-gray-500';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-hidden group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-red-500">
          <Icon size={20} />
        </div>
      </div>
      <p className={cn('text-sm font-medium mt-2', subLabelClass)}>{subLabel}</p>
    </div>
  );
}

interface OperationsKpisProps {
  data:     OpsSummaryResponse | null;
  loading?: boolean;
}

export function OperationsKpis({ data, loading }: OperationsKpisProps) {
  // Skeleton while loading
  if (loading && !data) {
    return (
      <div className="space-y-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[100px] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[100px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data) {
    const total     = Number(data.total_calls)     || 0;
    const qualified = Number(data.qualified_calls) || 0;
    const qualPct   = Number(data.qualified_pct)   || 0;
    const noise     = Number(data.noise_calls)     || 0;   // API: noise_calls
    const noisePct  = Number(data.noise_pct)       || 0;   // API: noise_pct
    const flagged   = Number(data.flagged_issues)  || 0;
    const weekday   = Number(data.weekday_avg)     || 0;
    const weekend   = Number(data.weekend_avg)     || 0;

    return (
      <div className="space-y-4 pb-6">
        {/* Row 1: 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <KpiCard
            label="Total Calls"
            value={total.toLocaleString()}
            subLabel="all time period"
            trendUp={true}
            icon={Phone}
          />
          <KpiCard
            label="Qualified Calls"
            value={qualified.toLocaleString()}
            subLabel={`${qualPct.toFixed(1)}% of total`}
            trendUp={true}
            icon={CheckCircle}
          />
          <KpiCard
            label="Noise / Junk"
            value={noise.toLocaleString()}
            subLabel={`${noisePct.toFixed(1)}% of total`}
            trendUp={false}
            icon={XCircle}
          />
          <KpiCard
            label="Noise Rate"
            value={`${noisePct.toFixed(1)}%`}
            subLabel={noisePct > 40 ? 'above threshold' : 'within range'}
            trendUp={noisePct <= 40}
            icon={Target}
          />
          <KpiCard
            label="Flagged Issues"
            value={String(flagged)}
            subLabel="need review"
            trendUp={false}
            icon={AlertTriangle}
          />
          <KpiCard
            label="Avg Call Score"
            value={`${qualPct.toFixed(0)}%`}
            subLabel="qualified call rate"
            trendUp={qualPct >= 60}
            icon={CheckCircle}
          />
        </div>

        {/* Row 2: 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Weekday Calls (Avg)"
            value={weekday.toLocaleString()}
            subLabel="Mon-Fri average"
            icon={Calendar}
          />
          <KpiCard
            label="Weekend Calls (Avg)"
            value={weekend.toLocaleString()}
            subLabel="Sat-Sun average"
            icon={Sun}
          />
          <KpiCard
            label="Peak Hour"
            value={data.peak_hour || '—'}
            subLabel="highest call volume"
            trendUp={true}
            icon={Clock}
          />
          <KpiCard
            label="High Intent Calls"
            value={`${(total > 0 ? ((qualified / total) * 100) : 0).toFixed(1)}%`}
            subLabel={`${qualified.toLocaleString()} of ${total.toLocaleString()} calls`}
            trendUp={qualPct >= 60}
            icon={Target}
          />
        </div>
      </div>
    );
  }

  // No data — empty state placeholders
  return (
    <div className="space-y-4 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[100px] flex items-center justify-center text-gray-300">—</div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[100px] flex items-center justify-center text-gray-300">—</div>
        ))}
      </div>
    </div>
  );
}
