'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentDistributionItem } from '@/types/api';

// Color map keyed to the exact intent names returned by the API
const INTENT_COLORS: Record<string, string> = {
  'NOISE':                   '#d1d5db',
  'Stock Availability':      '#f59e0b',
  'Location & Directions':   '#3b82f6',
  'Complaint':               '#ef4444',
  'Store Timings':           '#8b5cf6',
  'Exchange/Return':         '#ec4899',
  'Delivery / Online Order': '#14b8a6',
  'Offers & Promotions':     '#f97316',
  'Loyalty & Points':        '#22c55e',
  'Repair / Alteration':     '#6366f1',
  'Unknown':                 '#94a3b8',
};
const FALLBACK_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#94a3b8',
];

interface CallIntentDistributionChartProps {
  data: IntentDistributionItem[];
  loading?: boolean;
}

export function CallIntentDistributionChart({ data, loading }: CallIntentDistributionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-full w-full" />;

  const hasData  = data && data.length > 0;
  const chartData = hasData
    ? data.map((item, idx) => ({
        name:    item.intent,
        calls:   Number(item.count) || 0,
        percent: Number(item.pct)   || 0,
        color:   INTENT_COLORS[item.intent] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Target size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Call Intent Distribution</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && !hasData ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data available</div>
      ) : (
        <div className="flex flex-1 items-center">
          {/* Donut chart */}
          <div className="w-[40%] h-[240px] shrink-0">
            <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={0}
                  dataKey="calls"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: 12,
                  }}
                  formatter={(value, name, props) =>
                    [`${value} calls (${(props as { payload: { percent: number } }).payload.percent}%)`, name as string]
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend — scrollable if many entries */}
          <div className="flex-1 flex flex-col justify-center gap-2 pl-4 overflow-y-auto max-h-[260px]">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0 mr-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-600 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs shrink-0">
                  <span className="font-bold text-gray-800">{item.calls.toLocaleString()}</span>
                  <span className="font-medium text-gray-400 w-10 text-right">{item.percent.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
