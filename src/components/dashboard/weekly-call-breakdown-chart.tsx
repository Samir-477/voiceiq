'use client';

import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { WeeklyVolumeKpiItem } from '@/types/api';

interface WeeklyCallBreakdownChartProps {
  data: WeeklyVolumeKpiItem[];
  loading?: boolean;
}

export function WeeklyCallBreakdownChart({ data, loading }: WeeklyCallBreakdownChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-[420px] w-full" />;

  const chartData =
    data && data.length > 0
      ? data.map((item) => ({
          day:       item.day,
          qualified: Number(item.qualified) || 0,
          noise:     Number(item.noise)     || 0,
          total:     Number(item.total)     || 0,
        }))
      : [
          { day: 'Mon', qualified: 700,  noise: 200, total: 900  },
          { day: 'Tue', qualified: 800,  noise: 250, total: 1050 },
          { day: 'Wed', qualified: 720,  noise: 180, total: 900  },
          { day: 'Thu', qualified: 950,  noise: 280, total: 1230 },
          { day: 'Fri', qualified: 850,  noise: 310, total: 1160 },
          { day: 'Sat', qualified: 1050, noise: 350, total: 1400 },
          { day: 'Sun', qualified: 450,  noise: 130, total: 580  },
        ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <BarChartIcon size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Weekly Call Breakdown</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                axisLine={true}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="qualified" name="Qualified" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="noise"     name="Noise"     fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
