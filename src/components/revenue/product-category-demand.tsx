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

const data = [
  { category: "Men's Formal", demand: 12, fulfilled: 3 },
  { category: "Women's Casual", demand: 10, fulfilled: 7 },
  { category: 'Sports Shoes', demand: 10, fulfilled: 1 },
  { category: 'Sandals', demand: 8, fulfilled: 1 },
  { category: "Men's Casual", demand: 7, fulfilled: 2 },
  { category: 'Kids Shoes', demand: 3, fulfilled: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProductCategoryDemand() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[380px]" />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-bold text-gray-900 mb-6">Product Category Demand (from Calls)</h3>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 12, left: -8, bottom: 4 }}
            barCategoryGap="25%"
            barGap={4}
          >
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 12]}
              ticks={[0, 3, 6, 9, 12]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fef2f2', radius: 4 }} />
            <Bar dataKey="demand" name="Demand" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="fulfilled" name="Fulfilled" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
