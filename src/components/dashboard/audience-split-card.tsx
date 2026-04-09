import React from 'react';
import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Male', value: 44, color: '#3b82f6', calls: 22, conv: 32 },
  { name: 'Female', value: 56, color: '#a855f7', calls: 28, conv: 18 },
];

export function AudienceSplitCard() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] relative flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Users size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Audience Split</h2>
      </div>

      {/* Chart Space */}
      <div className="h-[220px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                const RADIAN = Math.PI / 180;
                // Move the label further out
                const angle = midAngle || 0;
                const radius = Number(outerRadius) + 20; 
                const x = Number(cx) + radius * Math.cos(-angle * RADIAN);
                const y = Number(cy) + radius * Math.sin(-angle * RADIAN);
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill={name === 'Male' ? '#3b82f6' : '#a855f7'}
                    textAnchor={x > Number(cx) ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-sm font-semibold"
                  >
                    {`${name} ${value}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 600 }}
              formatter={(value, name) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Stats */}
      <div className="mt-4 pt-4 flex flex-col gap-3 border-t border-gray-50">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 font-medium">{item.name}</span>
            </div>
            <div className="text-gray-500 font-medium text-sm">
              <span>{item.calls} calls</span>
              <span className="mx-2">·</span>
              <span className="text-red-600 font-bold">{item.conv}% conv.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
