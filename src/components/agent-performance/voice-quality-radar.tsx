'use client';

import { Mic } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import type { VoiceQualityRadarData } from '@/types';
import { useIsMounted } from '@/hooks/use-is-mounted';

interface VoiceQualityRadarProps {
  data?: VoiceQualityRadarData[];
  loading?: boolean;
}

export function VoiceQualityRadar({ data = [], loading }: VoiceQualityRadarProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[420px]" />;

  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-[420px] flex flex-col">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="flex-1 bg-gray-50 rounded-full animate-pulse mx-auto w-64 h-64" />
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Mic className="text-red-500" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Avg Voice Quality Scores</h3>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#ef4444"
              strokeWidth={3}
              fill="#ef4444"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8">
        {data.map((item) => (
          <div key={item.subject} className="flex justify-between items-center border-b border-gray-50 pb-2">
            <span className="text-sm text-gray-500 font-medium">{item.subject}</span>
            <span className="text-sm font-bold text-orange-500">{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
