import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';

const data = [
  { day: 'Mon', qualified: 700, missed: 200, other: 100 },
  { day: 'Tue', qualified: 800, missed: 250, other: 80 },
  { day: 'Wed', qualified: 720, missed: 180, other: 150 },
  { day: 'Thu', qualified: 950, missed: 280, other: 120 },
  { day: 'Fri', qualified: 850, missed: 310, other: 130 },
  { day: 'Sat', qualified: 1050, missed: 350, other: 150 },
  { day: 'Sun', qualified: 450, missed: 130, other: 50 },
];

export function WeeklyCallBreakdownChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-[420px] w-full" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <BarChartIcon size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Weekly Call Breakdown</h2>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
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
              ticks={[0, 300, 600, 900, 1200]}
              domain={[0, 1200]}
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="qualified" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="missed" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="other" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
