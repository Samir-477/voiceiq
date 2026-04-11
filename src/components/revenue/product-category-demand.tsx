'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { CategoryDemandConversionItem } from '@/types/api';

interface ProductCategoryDemandProps {
  data: CategoryDemandConversionItem[];
  loading?: boolean;
}

interface TooltipEntry { name: string; value: number; color: string; }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string; }

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProductCategoryDemand({ data, loading }: ProductCategoryDemandProps) {
  const mounted = useIsMounted();
  
  if (!mounted || loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[380px] animate-pulse flex flex-col">
        <div className="h-6 w-48 bg-gray-100 rounded mb-6" />
        <div className="flex-1 bg-gray-50 rounded-lg" />
      </div>
    );
  }

  // Map API data to chart data
  const chartData = (data || []).map(item => ({
    category: item.category,
    demand: item.total_calls,
    fulfilled: item.conversions
  })).slice(0, 8); // Top 8 for better visibility

  const maxDemand = Math.max(...chartData.map(d => d.demand), 10);
  const yAxisTicks = [0, Math.ceil(maxDemand / 4), Math.ceil(maxDemand / 2), Math.ceil(3 * maxDemand / 4), maxDemand];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-bold text-gray-900 mb-6">Product Category Demand (from Calls)</h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 12, left: -8, bottom: 4 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#4b5563', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              tickFormatter={(val) => val.length > 12 ? `${val.substring(0, 10)}...` : val}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[0, maxDemand]}
              ticks={yAxisTicks}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f2', radius: 4 }} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ paddingTop: 0, paddingBottom: 20, fontSize: '11px', fontWeight: 600 }}
            />
            <Bar dataKey="demand" name="Total Inquiries" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="fulfilled" name="Conversions" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
