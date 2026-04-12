'use client';

import { AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';

interface ComplaintsByRegionChartProps {
  data?: any[];
  loading?: boolean;
}

export function ComplaintsByRegionChart({ data = [], loading }: ComplaintsByRegionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px]" />;

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full h-[320px] flex flex-col relative">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Complaints by Region</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>
      
      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-50 rounded-xl animate-pulse" />
      ) : data.length > 0 ? (
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={50}>
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
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="complaints" fill="#e53e3e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">
          No region complaint data available.
        </div>
      )}
    </div>
  );
}
