'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { personaConversionData } from '@/app/customer-experience/mock-data';
import { Users } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function PersonaConversionChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6 text-red-500">
        <Users size={20} strokeWidth={2} />
        <h3 className="text-base font-bold text-gray-900">Persona-wise Conversion Performance</h3>
      </div>
      
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={personaConversionData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#555', fontWeight: 600 }} 
              axisLine={true} 
              tickLine={true}
              dy={10} 
            />
            <YAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#888' }} 
              axisLine={true} 
              tickLine={true} 
              domain={[0, 12]} 
              tickCount={5} 
            />
            
            <Bar dataKey="calls" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="converted" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
