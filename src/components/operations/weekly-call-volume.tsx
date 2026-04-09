'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockWeeklyCallVolume } from '@/app/operations/mock-data';
import { BarChart2 } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function WeeklyCallVolumeChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Weekly Call Volume (Qualified vs Junk)</h3>
      </div>
      
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockWeeklyCallVolume}
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
            <Bar dataKey="junk" fill="#d1d5db" radius={[4, 4, 0, 0]} maxBarSize={40} name="Junk" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
