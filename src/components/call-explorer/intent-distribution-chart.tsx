'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { intentDistributionData } from '@/app/call-explorer/mock-data';
import { Target } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function IntentDistributionChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] flex flex-col relative w-full">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent Distribution</h3>
      </div>
      
      <div style={{ width: '100%', height: 240, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={intentDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {intentDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold', fontSize: '12px' }}
              itemStyle={{ color: '#000' }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Custom labels matching image */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
           <span className="absolute top-[20%] right-[12%] text-sm font-bold text-[#3b82f6]">Buy sneakers (26%)</span>
           <span className="absolute bottom-[20%] right-[2%] text-sm font-bold text-[#a855f7]">Check availability (16%)</span>
           <span className="absolute bottom-[5%] left-[28%] text-sm font-bold text-[#ef4444]">Complaint about delivery (16%)</span>
           <span className="absolute bottom-[20%] left-[8%] text-sm font-bold text-[#f59e0b]">Return item (18%)</span>
           <span className="absolute top-[30%] left-[8%] text-sm font-bold text-[#22c55e]">Price inquiry (24%)</span>
        </div>
      </div>
    </div>
  );
}
