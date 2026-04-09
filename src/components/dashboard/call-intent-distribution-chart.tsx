import React from 'react';
import { Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Buy sneakers', calls: 13, percent: 26, color: '#3b82f6' },
  { name: 'Price inquiry', calls: 12, percent: 24, color: '#22c55e' },
  { name: 'Return item', calls: 9, percent: 18, color: '#f59e0b' },
  { name: 'Complaint about delivery', calls: 8, percent: 18, color: '#ef4444' },
  { name: 'Check availability', calls: 8, percent: 15, color: '#8b5cf6' },
];

export function CallIntentDistributionChart() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Target size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Call Intent Distribution</h2>
      </div>

      <div className="flex flex-1 items-center">
        {/* Chart */}
        <div className="w-[45%] h-[240px]">
          <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={0}
                dataKey="calls"
                stroke="#ffffff"
                strokeWidth={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                formatter={(value: any, name: any, props: any) => [`${value} calls (${props.payload.percent}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-[55%] flex flex-col justify-center gap-3 pl-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-gray-800">{item.calls}</span>
                <span className="font-medium text-gray-400 w-8 text-right">{item.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
