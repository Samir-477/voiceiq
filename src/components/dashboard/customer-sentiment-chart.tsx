'use client';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const sentimentData = [
  { name: 'Positive', value: 42, color: '#22c55e' },
  { name: 'Neutral',  value: 34, color: '#f59e0b' },
  { name: 'Negative', value: 24, color: '#ef4444' },
];

const labelColors: Record<string, string> = {
  Positive: '#16a34a',
  Neutral:  '#d97706',
  Negative: '#dc2626',
};

function PieLabel({ cx, cy, midAngle, outerRadius, name, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 34;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
      fill={labelColors[name] ?? '#6b7280'}
    >
      {`${name} ${value}%`}
    </text>
  );
}

export function CustomerSentimentChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Customer Sentiment</h2>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={sentimentData}
            cx="50%"
            cy="45%"
            outerRadius={110}
            innerRadius={0}
            dataKey="value"
            labelLine={false}
            label={PieLabel}
            paddingAngle={2}
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                {value}
              </span>
            )}
            wrapperStyle={{ paddingTop: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
