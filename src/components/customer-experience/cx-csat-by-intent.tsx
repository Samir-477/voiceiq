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
  { name: 'Loan\nEnquiry',   csat: 4.5 },
  { name: 'Interest\nRate',  csat: 4.1 },
  { name: 'Repayment/EMI',   csat: 3.8 },
  { name: 'Gold\nRelease',   csat: 3.6 },
  { name: 'Renewal',         csat: 4.4 },
  { name: 'Auction\nAlert',  csat: 2.5 },
  { name: 'Complaint',       csat: 2.5 },
  { name: 'KYC Update',      csat: 4.2 },
  { name: 'Branch\nStatus',  csat: 4.3 },
  { name: 'Gold Safety',     csat: 4.2 },
];

export function CxCsatByIntent() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-5">CSAT by Intent Category</h2>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 10, bottom: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            domain={[0, 5]}
            tickCount={6}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            cursor={{ fill: '#fef2f2' }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}
            formatter={(v) => [v, 'CSAT']}
          />
          <Bar
            dataKey="csat"
            fill="#dc2626"
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
