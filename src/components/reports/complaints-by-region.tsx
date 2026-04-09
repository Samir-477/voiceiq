'use client';

import { AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { mockComplaintsByRegion } from '@/app/reports/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function ComplaintsByRegionChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px]" />;
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px] flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Complaints by Region</h3>
      </div>
      
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockComplaintsByRegion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={50}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
            <XAxis 
              dataKey="region" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 500 }}
              domain={[0, 320]}
              ticks={[0, 80, 160, 240, 320]}
            />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="complaints" fill="#e53e3e" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
