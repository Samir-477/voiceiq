'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockWeeklyCallVolume } from '@/app/operations/mock-data';
import { BarChart2 } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { WeeklyVolumeItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const mockWeeklyCallVolume = [
//   { day: 'Mon', qualified: 700, junk: 300, total: 1000 },
//   { day: 'Tue', qualified: 800, junk: 250, total: 1050 },
//   { day: 'Wed', qualified: 750, junk: 200, total: 950  },
//   { day: 'Thu', qualified: 880, junk: 350, total: 1230 },
//   { day: 'Fri', qualified: 980, junk: 400, total: 1380 },
//   { day: 'Sat', qualified: 1100, junk: 250, total: 1350 },
//   { day: 'Sun', qualified: 450, junk: 100, total: 550  },
// ];

interface WeeklyCallVolumeChartProps {
  data: WeeklyVolumeItem[];
  loading?: boolean;
}

export function WeeklyCallVolumeChart({ data, loading }: WeeklyCallVolumeChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;

  // Map API data to chart shape; fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map(item => ({
        day:       item.day,
        qualified: Number(item.qualified) || 0,
        junk:      Number(item.junk)      || 0,
        total:     Number(item.total)     || 0,
      }))
    : mockWeeklyCallVolume;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Weekly Call Volume (Qualified vs Junk)</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
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
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="qualified" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} name="Qualified" />
              <Bar dataKey="junk"      fill="#d1d5db" radius={[4, 4, 0, 0]} maxBarSize={40} name="Junk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
