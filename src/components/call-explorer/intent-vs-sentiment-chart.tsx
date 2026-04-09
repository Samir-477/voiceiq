'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { intentVsSentimentData } from '@/app/call-explorer/mock-data';
import { Activity } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function IntentVsSentimentChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent vs Sentiment</h3>
      </div>
      
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={intentVsSentimentData}
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
              cursor={{fill: 'transparent'}}
            />
            <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" radius={[0, 0, 0, 0]} barSize={24} />
            <Bar dataKey="neutral" stackId="a" fill="#3b82f6" name="Neutral" radius={[0, 0, 0, 0]} />
            <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
