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

const callIntentData = [
  { name: 'Loan Enquiry',    value: 320 },
  { name: 'Interest Rate',   value: 248 },
  { name: 'Repayment/EMI',  value: 210 },
  { name: 'Gold Release',    value: 165 },
  { name: 'Renewal/Top-Up', value: 128 },
  { name: 'Auction Alert',   value: 95 },
  { name: 'Complaint',       value: 88 },
  { name: 'KYC Update',      value: 72 },
  { name: 'Branch Status',   value: 55 },
  { name: 'Gold Safety',     value: 38 },
];

export function CallIntentChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-5">Call Intent Distribution</h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={callIntentData}
          layout="vertical"
          margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={105}
          />
          <Tooltip
            cursor={{ fill: '#fef2f2' }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}
            formatter={(v) => [v, 'Calls']}
          />
          <Bar
            dataKey="value"
            fill="#dc2626"
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
