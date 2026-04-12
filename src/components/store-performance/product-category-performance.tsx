'use client';

import { ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { CategoryDemandConversionItem } from '@/types/api';

interface ProductCategoryPerformanceProps {
  data: CategoryDemandConversionItem[];
  loading?: boolean;
}

export function ProductCategoryPerformance({ data, loading }: ProductCategoryPerformanceProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-[360px]" />;

  // Map API data to chart shape; fall back to empty when available
  const chartData = data && data.length > 0
    ? data.map(item => ({
        category:    item.category,
        calls:       Number(item.total_calls) || 0,
        conversions: Number(item.conversions) || 0,
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full flex flex-col relative w-full">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Product Category Performance</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div className="flex-1 min-h-0" style={{ width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 55 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }}
                dy={8}
                interval={0}
                angle={-35}
                textAnchor="end"
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 13 }}
              />
              <Bar dataKey="calls"       fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} name="Calls" />
              <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
