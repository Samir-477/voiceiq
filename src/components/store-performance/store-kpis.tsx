'use client';

import { mockStoreKpis } from '@/app/store-performance/mock-data';
import { Store, PhoneOff, Phone, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiProps {
  label: string;
  value: string;
  subtitle: string;
  icon: any;
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

export function StoreKpis() {
  const { activeStores, zeroCallStores, totalCalls, avgConversion, avgHandleTime } = mockStoreKpis;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <KpiCard label="Active Stores" value={activeStores.value} subtitle={activeStores.subtitle} trendUp={activeStores.trendUp} icon={Store} />
      <KpiCard label="Zero Call Stores" value={zeroCallStores.value} subtitle={zeroCallStores.subtitle} trendUp={zeroCallStores.trendUp} icon={PhoneOff} />
      <KpiCard label="Total Calls" value={totalCalls.value} subtitle={totalCalls.subtitle} trendUp={totalCalls.trendUp} icon={Phone} />
      <KpiCard label="Avg Conversion" value={avgConversion.value} subtitle={avgConversion.subtitle} trendUp={avgConversion.trendUp} icon={TrendingUp} />
      <KpiCard label="Avg Handle Time" value={avgHandleTime.value} subtitle={avgHandleTime.subtitle} trendUp={avgHandleTime.trendUp} icon={Clock} />
    </div>
  );
}
