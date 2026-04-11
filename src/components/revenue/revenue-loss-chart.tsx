'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import type { RevenueByRegionItem } from '@/types/api';
import { useIsMounted } from '@/hooks/use-is-mounted';

interface RevenueLossChartProps {
  data: RevenueByRegionItem[];
  loading?: boolean;
}

interface TooltipEntry { name: string; value: number; color: string; }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string; }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-sm font-bold text-gray-900 mb-2">{label} Region</p>
        <div className="space-y-1.5">
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-gray-500">{entry.name}:</span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueLossChart({ data, loading }: RevenueLossChartProps) {
  const mounted = useIsMounted();
  
  if (!mounted || loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[340px] animate-pulse flex flex-col">
        <div className="h-6 w-48 bg-gray-100 rounded mb-6" />
        <div className="flex-1 bg-gray-50 rounded-lg" />
      </div>
    );
  }

  // Map API data
  const chartData = (data || []).map(item => ({
    region: item.region,
    demand: item.missed_demand,
    stockouts: item.stockout_count
  }));

  const maxVal = Math.max(...chartData.map((d) => Math.max(d.demand, d.stockouts)), 50);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Regional Demand & Stockouts</h3>
          <p className="text-xs text-gray-500 mt-0.5">Distribution of missed sales opportunities</p>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Live Data</span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 32, left: 8, bottom: 4 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="0" />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maxVal / 25) * 25]}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="region"
              tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f2', radius: 4 }} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ paddingTop: 0, paddingBottom: 15, fontSize: '11px', fontWeight: 600 }}
            />
            <Bar dataKey="demand" name="Missed Demand" fill="#dc2626" radius={[0, 4, 4, 0]} maxBarSize={16} />
            <Bar dataKey="stockouts" name="Stockout Count" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
