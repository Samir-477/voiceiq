'use client';

import React from 'react';
import { PackageX } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { MissedProductItem } from '@/types/api';

interface TopMissedProductsChartProps {
  data: MissedProductItem[];
  loading?: boolean;
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '10px 14px',
      minWidth: 160,
    }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 8 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
            {p.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TopMissedProductsChart({ data, loading }: TopMissedProductsChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-[420px] w-full" />;

  const hasData   = data && data.length > 0;
  // Show all items from API (up to 15)
  const chartData = hasData
    ? data.map((item) => ({
        name:     item.article,
        demand:   Number(item.missed_count)   || 0,
        stockout: Number(item.stockout_count) || 0,
      }))
    : [];

  // Compute max value for clean x-axis ticks
  const maxVal = Math.max(...chartData.flatMap(d => [d.demand, d.stockout]), 1);
  const tickMax = Math.ceil(maxVal / 1) * 1 + 1;

  // Dynamic row height: 62px per row for comfortable spacing
  const chartHeight = Math.max(400, chartData.length * 62);

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <PackageX size={22} className="text-orange-400" />
        <h2 className="text-lg font-bold text-gray-900">Top Missed Products</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#0ea5e9]" />
          <span className="text-sm font-semibold text-gray-600">Missed Demand</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
          <span className="text-sm font-semibold text-gray-600">Stockout Count</span>
        </div>
      </div>

      {loading && !hasData ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data available</div>
      ) : (
        <div className="overflow-y-auto flex-1">
          <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 28, left: 8, bottom: 8 }}
                barGap={5}
                barCategoryGap="48%"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f3f4f6" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                  allowDecimals={false}
                  domain={[0, tickMax]}
                  tickCount={tickMax + 1}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                  width={140}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="demand"   name="Missed Demand"  fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="stockout" name="Stockout Count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
