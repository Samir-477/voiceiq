'use client';

import { mockOperationsKpis } from '@/app/operations/mock-data';
import { Phone, CheckCircle, XCircle, Clock, TrendingDown, AlertTriangle, Calendar, Sun, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiProps {
  label: string;
  value: string;
  subLabel: string;
  icon: any;
  trendUp?: boolean;
}

function KpiCard({ label, value, subLabel, icon: Icon, trendUp }: KpiProps) {
  // Determine sublabel color based on trendUp, if undefined use gray
  let subLabelClass = "text-gray-400";
  if (trendUp === true) subLabelClass = "text-emerald-500";
  else if (trendUp === false) subLabelClass = "text-red-500";
  else subLabelClass = "text-gray-500"; // fallback

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
      <p className={cn("text-sm font-medium mt-2", subLabelClass)}>
        {subLabel}
      </p>
    </div>
  );
}

export function OperationsKpis() {
  const {
    totalCalls, qualifiedCalls, junkCalls, avgDuration, disconnectRate, flaggedIssues,
    weekdayCalls, weekendCalls, peakHour, repeatCallers
  } = mockOperationsKpis;

  return (
    <div className="space-y-4 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard label="Total Calls Today" value={totalCalls.value} subLabel={totalCalls.trend} trendUp={totalCalls.trendUp} icon={Phone} />
        <KpiCard label="Qualified Calls" value={qualifiedCalls.value} subLabel={qualifiedCalls.subtitle} trendUp={qualifiedCalls.trendUp} icon={CheckCircle} />
        <KpiCard label="Junk Calls" value={junkCalls.value} subLabel={junkCalls.subtitle} trendUp={junkCalls.trendUp} icon={XCircle} />
        <KpiCard label="Avg Duration" value={avgDuration.value} subLabel={avgDuration.trend} trendUp={avgDuration.trendUp} icon={Clock} />
        <KpiCard label="Disconnect Rate" value={disconnectRate.value} subLabel={disconnectRate.trend} trendUp={disconnectRate.trendUp} icon={TrendingDown} />
        <KpiCard label="Flagged Issues" value={flaggedIssues.value} subLabel={flaggedIssues.subtitle} trendUp={flaggedIssues.trendUp} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Weekday Calls (Avg)" value={weekdayCalls.value} subLabel={weekdayCalls.subtitle} icon={Calendar} />
        <KpiCard label="Weekend Calls (Avg)" value={weekendCalls.value} subLabel={weekendCalls.subtitle} icon={Sun} />
        <KpiCard label="Peak Hour" value={peakHour.value} subLabel={peakHour.subtitle} trendUp={true} icon={Clock} />
        <KpiCard label="Repeat Callers" value={repeatCallers.value} subLabel={repeatCallers.subtitle} icon={RefreshCw} />
      </div>
    </div>
  );
}
