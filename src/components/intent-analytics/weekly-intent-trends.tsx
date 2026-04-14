'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', loanEnquiry: 45, auctionAlert: 15, complaint: 12 },
  { day: 'Tue', loanEnquiry: 47, auctionAlert: 14, complaint: 14 },
  { day: 'Wed', loanEnquiry: 46, auctionAlert: 16, complaint: 14 },
  { day: 'Thu', loanEnquiry: 43, auctionAlert: 15, complaint: 10 },
  { day: 'Fri', loanEnquiry: 60, auctionAlert: 18, complaint: 13 },
  { day: 'Sat', loanEnquiry: 35, auctionAlert: 12, complaint: 8 },
  { day: 'Sun', loanEnquiry: 12, auctionAlert: 11, complaint: 5 },
];

export function WeeklyIntentTrends() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[15px] font-bold text-gray-900 mb-5">Weekly Intent Trends</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={weeklyData} margin={{ top: 4, right: 20, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
                {value === 'loanEnquiry'
                  ? 'Loan Enquiry'
                  : value === 'auctionAlert'
                  ? 'Auction Alert'
                  : 'Complaint'}
              </span>
            )}
            wrapperStyle={{ paddingTop: 16 }}
          />
          <Line
            type="monotone"
            dataKey="loanEnquiry"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="auctionAlert"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="complaint"
            stroke="#1e293b"
            strokeWidth={2}
            dot={{ r: 4, fill: '#1e293b', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
