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
} from 'recharts';
import type { RegionRevenueLoss } from '@/types';
import { useIsMounted } from '@/hooks/use-is-mounted';

interface RevenueLossChartProps {
  data: RegionRevenueLoss[];
}

const formatAmount = (value: number) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">{label} Region</p>
        <p className="text-base font-bold text-gray-900">{formatAmount(payload[0].value)}</p>
        <p className="text-xs text-red-500 font-medium">Revenue Loss</p>
      </div>
    );
  }
  return null;
};

export function RevenueLossChart({ data }: RevenueLossChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[340px]" />;
  const maxVal = Math.max(...data.map((d) => d.amount));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <h3 className="text-base font-bold text-gray-900 mb-6">Revenue Loss by Region</h3>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
            barCategoryGap="30%"
          >
            <CartesianGrid horizontal={false} stroke="#f1f5f9" strokeDasharray="0" />
            <XAxis
              type="number"
              domain={[0, Math.ceil(maxVal / 35000) * 35000]}
              tickFormatter={formatAmount}
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 35000, 70000, 105000, 140000]}
            />
            <YAxis
              type="category"
              dataKey="region"
              tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={46}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f2', radius: 6 }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#dc2626" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
