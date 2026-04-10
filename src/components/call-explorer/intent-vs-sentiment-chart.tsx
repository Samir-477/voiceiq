'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { intentVsSentimentData } from '@/app/call-explorer/mock-data';
import { Activity } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentSentimentItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const intentVsSentimentData = [
//   { name: 'Buy sneakers',               positive: 18, neutral: 5,  negative: 3  },
//   { name: 'Price inquiry',              positive: 15, neutral: 6,  negative: 3  },
//   { name: 'Return item',                positive: 4,  neutral: 2,  negative: 12 },
//   { name: 'Complaint about delivery',   positive: 0,  neutral: 2,  negative: 14 },
//   { name: 'Check availability',         positive: 10, neutral: 4,  negative: 2  },
// ];

interface IntentVsSentimentChartProps {
  data: IntentSentimentItem[];
  loading?: boolean;
}

export function IntentVsSentimentChart({ data, loading }: IntentVsSentimentChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] w-full" />;

  // Map API data to chart shape; fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:     item.intent,
        positive: Number(item.positive) || 0,
        neutral:  Number(item.neutral)  || 0,
        negative: Number(item.negative) || 0,
      }))
    : intentVsSentimentData;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent vs Sentiment</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 13, fill: '#555', fontWeight: 600 }}
                width={150}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold', fontSize: '12px' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" radius={[0, 0, 0, 0]} barSize={24} />
              <Bar dataKey="neutral"  stackId="a" fill="#3b82f6" name="Neutral"  radius={[0, 0, 0, 0]} />
              <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
