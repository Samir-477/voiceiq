'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { complaintCategoriesData } from '@/app/customer-experience/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function ComplaintCategoriesChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] flex flex-col w-full">
      <h3 className="text-base font-bold text-gray-900 mb-6">Complaint Categories</h3>
      
      <div style={{ width: '100%', height: 290 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={complaintCategoriesData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} domain={[0, 160]} tickCount={5} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#555', fontWeight: 600 }} 
              width={100} 
              axisLine={true} 
              tickLine={false} 
            />
            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
