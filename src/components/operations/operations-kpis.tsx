'use client';

import { mockOperationsKpis } from '@/app/operations/mock-data';
import { Phone, CheckCircle, XCircle, Clock, TrendingDown, AlertTriangle, Calendar, Sun, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OpsSummaryResponse } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const mockOperationsKpis = {
//   totalCalls:     { value: '14,700', trend: '+8.2% vs yesterday', trendUp: true },
//   qualifiedCalls: { value: '5,490',  subtitle: '37.3% of total',  trendUp: true },
//   junkCalls:      { value: '1,695',  subtitle: '11.5% of total',  trendUp: false },
//   avgDuration:    { value: '3m 42s', trend: '-12s vs last week',  trendUp: true },
//   disconnectRate: { value: '4.2%',   trend: '+0.3%',              trendUp: false },
//   flaggedIssues:  { value: '12',     subtitle: '5 high priority', trendUp: false },
//   weekdayCalls:   { value: '2,140',  subtitle: 'Mon-Fri average' },
//   weekendCalls:   { value: '2,000',  subtitle: 'Sat 2,800 • Sun 1,200' },
//   peakHour:       { value: '11 AM - 1 PM', subtitle: '38% of daily volume' },
//   repeatCallers:  { value: '1,240',  subtitle: '8.4% of total calls' },
// };

interface KpiProps {
  label: string;
  value: string;
  subLabel: string;
  icon: any;
  trendUp?: boolean;
}

function KpiCard({ label, value, subLabel, icon: Icon, trendUp }: KpiProps) {
  let subLabelClass = 'text-gray-400';
  if (trendUp === true)  subLabelClass = 'text-emerald-500';
  else if (trendUp === false) subLabelClass = 'text-red-500';
  else subLabelClass = 'text-gray-500';

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
  data: OpsSummaryResponse | null;
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

  // Use real data when available, otherwise fall back to mock
  if (data) {
    const total     = Number(data.total_calls)     || 0;
    const qualified = Number(data.qualified_calls) || 0;
    const qualPct   = Number(data.qualified_pct)   || 0;
    const junk      = Number(data.junk_calls)       || 0;
    const junkPct   = Number(data.junk_pct)         || 0;
    const flagged   = Number(data.flagged_issues)   || 0;
    const weekday   = Number(data.weekday_avg)      || 0;
    const weekend   = Number(data.weekend_avg)      || 0;
    const repeat    = Number(data.repeat_callers)   || 0;
    const repeatPct = Number(data.repeat_callers_pct) || 0;
    const discRate  = Number(data.disconnect_rate)  || 0;

    return (
      <div className="space-y-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <KpiCard label="Total Calls"     value={total.toLocaleString()}      subLabel="all time period"         trendUp={true}  icon={Phone} />
          <KpiCard label="Qualified Calls" value={qualified.toLocaleString()}  subLabel={`${qualPct.toFixed(1)}% of total`} trendUp={true}  icon={CheckCircle} />
          <KpiCard label="Junk Calls"      value={junk.toLocaleString()}       subLabel={`${junkPct.toFixed(1)}% of total`} trendUp={false} icon={XCircle} />
          <KpiCard label="Avg Duration"    value={data.avg_duration || '—'}    subLabel="per call"                          icon={Clock} />
          <KpiCard label="Disconnect Rate" value={`${discRate.toFixed(1)}%`}  subLabel={discRate > 5 ? 'above threshold' : 'normal'} trendUp={discRate <= 5} icon={TrendingDown} />
          <KpiCard label="Flagged Issues"  value={String(flagged)}             subLabel="need review"             trendUp={false} icon={AlertTriangle} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Weekday Calls (Avg)" value={weekday.toLocaleString()}  subLabel="Mon-Fri average"               icon={Calendar} />
          <KpiCard label="Weekend Calls (Avg)" value={weekend.toLocaleString()}  subLabel="Sat-Sun average"               icon={Sun} />
          <KpiCard label="Peak Hour"           value={data.peak_hour || '—'}     subLabel="highest call volume"           trendUp={true}  icon={Clock} />
          <KpiCard label="Repeat Callers"      value={repeat.toLocaleString()}   subLabel={`${repeatPct.toFixed(1)}% of total`} icon={RefreshCw} />
        </div>
      </div>
    );
  }

  // Mock fallback
  const { totalCalls, qualifiedCalls, junkCalls, avgDuration, disconnectRate, flaggedIssues,
          weekdayCalls, weekendCalls, peakHour, repeatCallers } = mockOperationsKpis;
  return (
    <div className="space-y-4 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard label="Total Calls Today"  value={totalCalls.value}     subLabel={totalCalls.trend}        trendUp={totalCalls.trendUp}     icon={Phone} />
        <KpiCard label="Qualified Calls"    value={qualifiedCalls.value} subLabel={qualifiedCalls.subtitle} trendUp={qualifiedCalls.trendUp} icon={CheckCircle} />
        <KpiCard label="Junk Calls"         value={junkCalls.value}      subLabel={junkCalls.subtitle}      trendUp={junkCalls.trendUp}      icon={XCircle} />
        <KpiCard label="Avg Duration"       value={avgDuration.value}    subLabel={avgDuration.trend}       trendUp={avgDuration.trendUp}    icon={Clock} />
        <KpiCard label="Disconnect Rate"    value={disconnectRate.value} subLabel={disconnectRate.trend}    trendUp={disconnectRate.trendUp} icon={TrendingDown} />
        <KpiCard label="Flagged Issues"     value={flaggedIssues.value}  subLabel={flaggedIssues.subtitle}  trendUp={flaggedIssues.trendUp}  icon={AlertTriangle} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Weekday Calls (Avg)" value={weekdayCalls.value}  subLabel={weekdayCalls.subtitle}  icon={Calendar} />
        <KpiCard label="Weekend Calls (Avg)" value={weekendCalls.value}  subLabel={weekendCalls.subtitle}  icon={Sun} />
        <KpiCard label="Peak Hour"           value={peakHour.value}      subLabel={peakHour.subtitle}      trendUp={true} icon={Clock} />
        <KpiCard label="Repeat Callers"      value={repeatCallers.value} subLabel={repeatCallers.subtitle} icon={RefreshCw} />
      </div>
    </div>
  );
}
