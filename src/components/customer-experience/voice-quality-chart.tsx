'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { voiceQualityData } from '@/app/customer-experience/mock-data';
import { Mic } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function VoiceQualityChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-2">
        <Mic size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Voice Quality Metrics (Avg)</h3>
      </div>
      
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={voiceQualityData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            barSize={10}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#333', fontWeight: 600 }} 
              width={140} 
              axisLine={false} 
              tickLine={false} 
            />
            
            {/* Background bar to show 100% capacity */}
            <Bar dataKey={() => 100} fill="#f5f5f5" radius={[0, 4, 4, 0]} isAnimationActive={false} />
            
            {/* Actual data bar overlaid entirely */}
            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="value" position="right" formatter={(val: any) => `${val}%`} fill="#f59e0b" fontSize={12} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
