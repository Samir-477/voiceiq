'use client';

import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { mockWeeklyPerformanceTrend } from '@/app/reports/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function WeeklyPerformanceTrendChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px]" />;
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Weekly Performance Trend</h3>
      </div>
      
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockWeeklyPerformanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 500 }}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
            />
            <Tooltip
              cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="metric1" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: 'white', stroke: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="metric2" 
              stroke="#ef4444" 
              strokeWidth={1}
              strokeOpacity={0.6}
              dot={{ fill: 'white', stroke: '#ef4444', strokeWidth: 1, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
