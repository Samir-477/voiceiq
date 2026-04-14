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
  { name: 'T.Nagar',      calls: 145, complaints: 8  },
  { name: 'Anna Nagar',   calls: 128, complaints: 12 },
  { name: 'RS Puram',     calls: 98,  complaints: 15 },
  { name: 'Main Branch',  calls: 112, complaints: 6  },
  { name: 'Koramangala',  calls: 134, complaints: 10 },
  { name: 'Ameerpet',     calls: 105, complaints: 18 },
  { name: 'Andheri',      calls: 156, complaints: 7  },
  { name: 'Karol Bagh',   calls: 92,  complaints: 20 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-[12px]">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      <p className="text-gray-700 font-semibold">Calls : {payload[0]?.value}</p>
      <p className="text-red-500 font-semibold">Complaints : {payload[1]?.value}</p>
    </div>
  );
}

export function BranchCallsComplaintsChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-5">Calls vs Complaints by Branch</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="calls"      fill="#1e293b" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="complaints" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
