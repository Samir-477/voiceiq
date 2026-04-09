'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { sentimentTrendsData } from '@/app/customer-experience/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function SentimentTrendsChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] w-full" />;
  // Custom tooltip to mimic the exact styling in the image showing W3 Positive % : 42 etc
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-black/10 shadow-lg rounded-xl">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
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
      <h3 className="text-base font-bold text-gray-900 mb-6 pl-2">Sentiment Trends</h3>
      
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sentimentTrendsData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} />
            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} domain={[0, 60]} tickCount={5} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }} />
            
            <Line type="monotone" dataKey="Positive" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Neutral" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
