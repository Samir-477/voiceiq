'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentDistributionItem } from '@/types/api';

const INTENT_COLORS: Record<string, string> = {
  'Purchase Intent':    '#3b82f6',
  'Complaint':          '#ef4444',
  'Inquiry':            '#22c55e',
  'Stock Availability': '#f59e0b',
  'NOISE':              '#d1d5db',
};
const FALLBACK_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#d1d5db'];

interface CallIntentDistributionChartProps {
  data: IntentDistributionItem[];
  loading?: boolean;
}

export function CallIntentDistributionChart({ data, loading }: CallIntentDistributionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-full w-full" />;

  const chartData =
    data && data.length > 0
      ? data.map((item, idx) => ({
          name:    item.intent,
          calls:   Number(item.count) || 0,
          percent: Math.round(Number(item.pct) || 0),
          color:   INTENT_COLORS[item.intent] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
        }))
      : [
          { name: 'Purchase Intent',    calls: 13, percent: 26, color: '#3b82f6' },
          { name: 'Inquiry',            calls: 12, percent: 24, color: '#22c55e' },
          { name: 'Stock Availability', calls: 9,  percent: 18, color: '#f59e0b' },
          { name: 'Complaint',          calls: 8,  percent: 18, color: '#ef4444' },
          { name: 'NOISE',              calls: 8,  percent: 15, color: '#d1d5db' },
        ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Target size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Call Intent Distribution</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div className="flex flex-1 items-center">
          {/* Donut chart */}
          <div className="w-[45%] h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="calls"
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                  formatter={(value: any, name: any, props: any) =>
                    [`${value} calls (${props.payload.percent}%)`, name]
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-[55%] flex flex-col justify-center gap-3 pl-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-gray-800">{item.calls.toLocaleString()}</span>
                  <span className="font-medium text-gray-400 w-8 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
