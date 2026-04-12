'use client';

import type React from 'react';
import { Store, PhoneOff, Phone, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiProps {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number }>;
  trendUp?: boolean;
}

function KpiCard({ label, value, subtitle, icon: Icon, trendUp }: KpiProps) {
  let subClass = 'text-gray-400';
  if (trendUp === true) subClass = 'text-emerald-500';
  if (trendUp === false) subClass = 'text-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-red-500">
          <Icon size={20} />
        </div>
      </div>
      <p className={cn('text-sm font-medium mt-2', subClass)}>{subtitle}</p>
    </div>
  );
}

interface StoreKpisProps {
  data: {
    activeStores: { value: string; subtitle: string; trendUp?: boolean };
    zeroCallStores: { value: string; subtitle: string; trendUp?: boolean };
    totalCalls: { value: string; subtitle: string; trendUp?: boolean };
    avgConversion: { value: string; subtitle: string; trendUp?: boolean };
    avgHandleTime: { value: string; subtitle: string; trendUp?: boolean };
  } | null;
  loading?: boolean;
}

export function StoreKpis({ data, loading }: StoreKpisProps) {
  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-[100px] animate-pulse" />
        ))}
      </div>
    );
  }

  const kpis = data || {
    activeStores:   { value: '—', subtitle: 'fetching data...' },
    zeroCallStores: { value: '—', subtitle: 'fetching data...' },
    totalCalls:     { value: '—', subtitle: 'fetching data...' },
    avgConversion:  { value: '—', subtitle: 'fetching data...' },
    avgHandleTime:  { value: '—', subtitle: 'fetching data...' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <KpiCard label="Active Stores"     value={kpis.activeStores.value}     subtitle={kpis.activeStores.subtitle}   trendUp={kpis.activeStores.trendUp}   icon={Store} />
      <KpiCard label="Zero Call Stores" value={kpis.zeroCallStores.value}   subtitle={kpis.zeroCallStores.subtitle} trendUp={kpis.zeroCallStores.trendUp} icon={PhoneOff} />
      <KpiCard label="Total Calls"       value={kpis.totalCalls.value}       subtitle={kpis.totalCalls.subtitle}     trendUp={kpis.totalCalls.trendUp}     icon={Phone} />
      <KpiCard label="Avg Conversion"    value={kpis.avgConversion.value}    subtitle={kpis.avgConversion.subtitle}  trendUp={kpis.avgConversion.trendUp}  icon={TrendingUp} />
      <KpiCard label="Avg Handle Time"   value={kpis.avgHandleTime.value}    subtitle={kpis.avgHandleTime.subtitle}  trendUp={kpis.avgHandleTime.trendUp}  icon={Clock} />
    </div>
  );
}
