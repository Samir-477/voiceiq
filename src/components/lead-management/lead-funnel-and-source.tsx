'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ── Funnel data ───────────────────────────────────────────────────────────────
const funnelData = [
  { name: 'Total Enquiries',      value: 312 },
  { name: 'Qualified Leads',      value: 186 },
  { name: 'Branch Visits',        value: 142 },
  { name: 'Documents Submitted',  value: 98  },
  { name: 'Disbursed',            value: 106 },
];

// ── Source pie data ───────────────────────────────────────────────────────────
const sourceData = [
  { name: 'Inbound Calls',  value: 65, color: '#dc2626' },
  { name: 'Branch Walk-in', value: 20, color: '#1e293b' },
  { name: 'Website',        value: 10, color: '#f59e0b' },
  { name: 'Referral',       value: 5,  color: '#22c55e' },
];

const labelColors: Record<string, string> = {
  'Inbound Calls':  '#dc2626',
  'Branch Walk-in': '#1e293b',
  'Website':        '#d97706',
  'Referral':       '#16a34a',
};

function PieLabel({ cx, cy, midAngle, outerRadius, name, value }: any) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 38;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x} y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11} fontWeight={600}
      fill={labelColors[name] ?? '#6b7280'}
    >
      {`${name}: ${value}%`}
    </text>
  );
}

export function LeadFunnelAndSource() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── Left: Conversion Funnel ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-5">Lead Conversion Funnel</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={funnelData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={130} />
            <Tooltip
              cursor={{ fill: '#fef2f2' }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
              formatter={(v) => [v, 'Leads']}
            />
            <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Right: Source Pie ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-2">Lead Source Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="44%"
              outerRadius={100}
              dataKey="value"
              labelLine={false}
              label={PieLabel}
              paddingAngle={2}
            >
              {sourceData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{value}</span>
              )}
              wrapperStyle={{ paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
