'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Priya',   fcr: 82, csat: 45 },
  { name: 'Rajesh',  fcr: 75, csat: 42 },
  { name: 'Anita',   fcr: 68, csat: 39 },
  { name: 'Suresh',  fcr: 78, csat: 43 },
  { name: 'Deepa',   fcr: 85, csat: 46 },
  { name: 'Vikram',  fcr: 60, csat: 35 },
  { name: 'Kavitha', fcr: 72, csat: 40 },
  { name: 'Arun',    fcr: 70, csat: 38 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-[12px]">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      <p className="text-red-500 font-semibold">CSAT : {(payload[1]?.value / 10).toFixed(1)}</p>
      <p className="text-gray-700 font-semibold">FCR : {payload[0]?.value}</p>
    </div>
  );
}

export function AgentCsatFcrChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-5">CSAT &amp; FCR Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="fcr"  fill="#1e293b" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="csat" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
