'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

const data = [
  { name: 'New Callers',      value: 42, color: '#ef4444' },
  { name: 'Repeat Callers',   value: 35, color: '#3b82f6' },
  { name: 'Loyal Customers',  value: 23, color: '#10b981' },
];

export function AudienceSplitChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[340px] w-full" />;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[340px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Audience Split</h3>
      </div>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
              formatter={(value) => [`${value}%`, ''] as [string, string]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
