'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { SentimentTrendItem } from '@/types/api';

interface SentimentTrendsChartProps {
  data: SentimentTrendItem[];
  loading?: boolean;
}

/** Format week_start date "2026-03-03" → "W1", "W2" label, or short date. */
function weekLabel(item: SentimentTrendItem, idx: number): string {
  // If the API returns a date string, shorten it; otherwise just use W{n}
  if (item.week_start) {
    const d = new Date(item.week_start);
    if (!isNaN(d.getTime())) {
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
  }
  return `W${idx + 1}`;
}

export function SentimentTrendsChart({ data, loading }: SentimentTrendsChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] w-full" />;

  // Map API data to chart-friendly shape; fall back to empty when not available
  const chartData = data && data.length > 0
    ? data.map((item, idx) => ({
        week:     weekLabel(item, idx),
        Positive: Number(item.positive) || 0,   // API returns lowercase
        Neutral:  Number(item.neutral)  || 0,
        Negative: Number(item.negative) || 0,
      }))
    : [];

  interface SentTipEntry { name: string; value: number; color: string; }
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: SentTipEntry[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-black/10 shadow-lg rounded-xl">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm font-bold mb-1" style={{ color: entry.color }}>
              {entry.name} % : <span className="font-black">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] flex flex-col w-full relative">
      <div className="flex items-center mb-6">
        <h3 className="text-base font-bold text-gray-900 pl-2">Sentiment Trends</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} domain={[0, 60]} tickCount={5} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="Positive" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Neutral"  stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
