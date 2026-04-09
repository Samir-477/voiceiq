'use client';

import { BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { mockTopStoresByConversion, mockCallQualityBreakdown } from '@/app/store-performance/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function TopStoresByConversion() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-[360px]" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Top Stores by Conversion</h3>
      </div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockTopStoresByConversion} margin={{ top: 5, right: 5, left: -30, bottom: 20 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="store"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
              dy={8}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
            />
            <Bar dataKey="conversionRate" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={35} name="CSAT %" />
            <Bar dataKey="avgHandle" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={35} name="Conversion %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CallQualityBreakdownChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-[360px]" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Call Quality Breakdown</h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockCallQualityBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                stroke="none"
                label={({ name, value, cx, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="#374151"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={700}
                  >
                    {name} {value}%
                  </text>
                )}
                labelLine={true}
              >
                {mockCallQualityBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-6 mt-4">
          {mockCallQualityBreakdown.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-semibold text-gray-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
