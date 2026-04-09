'use client';

import { ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { mockProductCategoryPerformance } from '@/app/store-performance/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function ProductCategoryPerformance() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-[360px]" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Product Category Performance</h3>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockProductCategoryPerformance} margin={{ top: 5, right: 5, left: -30, bottom: 30 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }}
              dy={10}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
            />
            <Bar dataKey="calls" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={30} name="Calls" />
            <Bar dataKey="conversions" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={30} name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
