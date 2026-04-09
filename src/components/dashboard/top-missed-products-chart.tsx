import React from 'react';
import { PackageX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';

const data = [
  { name: 'Running Shoes - Size 9', demand: 250, stockout: 65 },
  { name: 'White Sneakers - Size 8', demand: 190, stockout: 50 },
  { name: 'Sports Sandals - Size 10', demand: 150, stockout: 40 },
  { name: 'Canvas Shoes - Size 7', demand: 120, stockout: 35 },
  { name: 'Formal Shoes - Size 9', demand: 100, stockout: 25 },
];

export function TopMissedProductsChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm h-[420px] w-full" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <PackageX size={22} className="text-orange-400" />
        <h2 className="text-lg font-bold text-gray-900">Top Missed Products (Demand vs Stockout)</h2>
      </div>
      
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f3f4f6" />
            <XAxis 
              type="number" 
              axisLine={true} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              ticks={[0, 65, 130, 195, 260]}
              domain={[0, 260]}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }}
              width={140}
            />
            <Tooltip 
              cursor={{ fill: '#f9fafb' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="demand" name="Demand" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="stockout" name="Stockout" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
