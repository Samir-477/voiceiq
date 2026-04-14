'use client';

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

// ── Sentiment Pie data ────────────────────────────────────────────────────────
const sentimentData = [
  { name: 'Positive', value: 540, color: '#22c55e' },
  { name: 'Neutral',  value: 436, color: '#f59e0b' },
  { name: 'Negative', value: 308, color: '#ef4444' },
];

const labelColors: Record<string, string> = {
  Positive: '#16a34a',
  Neutral:  '#d97706',
  Negative: '#dc2626',
};

function PieLabel({ cx, cy, midAngle, outerRadius, name, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 36;
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
      {`${name}: ${value}`}
    </text>
  );
}

// ── Top Complaints data ───────────────────────────────────────────────────────
const complaints = [
  { label: 'Delay in gold release after closure',      count: 42 },
  { label: 'Interest rate discrepancy',                count: 35 },
  { label: 'Auction notice without prior intimation',  count: 28 },
  { label: 'Branch staff behavior',                    count: 22 },
  { label: 'EMI deduction errors',                     count: 18 },
  { label: 'KYC update not reflecting',                count: 15 },
  { label: 'Loan disbursal delay',                     count: 12 },
];

const MAX = 42;

export function CxSentimentAndComplaints() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── Left: Sentiment pie ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-2">Sentiment Distribution</h2>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="44%"
              outerRadius={105}
              dataKey="value"
              labelLine={false}
              label={PieLabel}
              paddingAngle={2}
            >
              {sentimentData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{value}</span>
              )}
              wrapperStyle={{ paddingTop: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ── Right: Top Complaints ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-5">Top Complaint Categories</h2>
        <div className="space-y-3.5">
          {complaints.map(({ label, count }) => (
            <div key={label} className="flex items-center gap-3">
              <p className="text-[12px] text-gray-700 w-[220px] shrink-0 leading-snug">{label}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${(count / MAX) * 100}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold text-gray-700 w-6 text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
