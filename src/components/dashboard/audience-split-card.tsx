'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { AudienceResponse } from '@/types/api';

const COLOR_MAP: Record<string, string> = {
  Male:    '#3b82f6',
  Female:  '#a855f7',
  Kids:    '#f97316',
  Unknown: '#94a3b8',
};
const FALLBACK_COLORS = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

interface AudienceSplitCardProps {
  data: AudienceResponse | null;
  loading?: boolean;
}

export function AudienceSplitCard({ data, loading }: AudienceSplitCardProps) {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative flex flex-col h-[380px] animate-pulse" />
    );
  }

  // Calculate % from total_calls since API doesn't return a pct field
  const grandTotal = data?.audience_split?.reduce(
    (sum, item) => sum + (Number(item.total_calls) || 0),
    0
  ) ?? 0;

  const chartData =
    data?.audience_split && data.audience_split.length > 0
      ? data.audience_split.map((item, idx) => {
          const calls = Number(item.total_calls) || 0;
          const pct   = grandTotal > 0 ? Math.round((calls / grandTotal) * 100) : 0;
          return {
            name:  item.audience,
            value: pct,
            color: COLOR_MAP[item.audience] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
            calls,
            conv:  Math.round(Number(item.conversion_pct) || 0),
          };
        })
      : [
          { name: 'Male',   value: 44, color: '#3b82f6', calls: 22, conv: 32 },
          { name: 'Female', value: 56, color: '#a855f7', calls: 28, conv: 18 },
        ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Users size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Audience Split</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      <div className="h-[220px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              label={({ cx, cy, midAngle, outerRadius, value, name: labelName }) => {
                const RADIAN = Math.PI / 180;
                const n      = String(labelName ?? '');
                const radius = Number(outerRadius) + 20;
                const x = Number(cx) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                const y = Number(cy) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill={COLOR_MAP[n] || '#6b7280'}
                    textAnchor={x > Number(cx) ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-sm font-semibold"
                  >
                    {`${n} ${value}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 600 }}
              formatter={(value, name) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 flex flex-col gap-3 border-t border-gray-50">
        {chartData.map((item, idx) => (
          <div key={`${item.name}-${idx}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <div className="text-gray-500 font-medium text-sm">
              {item.calls > 0 && (
                <>
                  <span>{item.calls.toLocaleString()} calls</span>
                  <span className="mx-2">·</span>
                </>
              )}
              <span className="text-red-600 font-bold">{item.conv}% conv.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
