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
  Cell,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { WeeklyVolumeItem } from '@/types/api';

interface WeeklyCallVolumeChartProps {
  data: WeeklyVolumeItem[];
  loading?: boolean;
}

// Custom Tooltip matching the screenshot style
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        padding: '12px 18px',
        minWidth: 140,
      }}
    >
      <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 8 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 3,
              background: entry.fill,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: '#6b7280' }}>{entry.name}:</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: entry.name === 'Qualified' ? '#10b981' : '#9ca3af',
              marginLeft: 'auto',
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WeeklyCallVolumeChart({ data, loading }: WeeklyCallVolumeChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;

  // Map API data — API returns 'noise' field (not 'junk')
  const chartData =
    data && data.length > 0
      ? data.map((item) => ({
          day:       item.day,
          qualified: Number(item.qualified) || 0,
          noise:     Number(item.noise)     || 0,
          total:     Number(item.total)     || 0,
        }))
      : [];

  const hasData = chartData.length > 0;

  // Max value for Y-axis domain (nice ceiling)
  const maxVal = hasData
    ? Math.max(...chartData.map((d) => d.qualified + d.noise))
    : 120;
  const yMax = Math.ceil(maxVal / 30) * 30;

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex flex-col w-full h-full min-h-[360px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">
          Weekly Call Volume (Qualified vs Junk)
        </h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs font-medium text-gray-500">Qualified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-xs font-medium text-gray-500">Junk</span>
        </div>
      </div>

      {/* Chart or Loading Skeleton */}
      {loading && !hasData ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      ) : (
        <div className="flex-1" style={{ minHeight: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 6, right: 10, left: -20, bottom: 0 }}
              barGap={4}
              barCategoryGap="28%"
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 400 }}
                domain={[0, yMax]}
                tickCount={5}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(243,244,246,0.7)', radius: 6 }}
              />
              <Bar
                dataKey="qualified"
                name="Qualified"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="noise"
                name="Junk"
                fill="#d1d5db"
                radius={[5, 5, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
