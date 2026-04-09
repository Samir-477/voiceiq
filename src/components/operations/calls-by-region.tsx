'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockCallsByRegion } from '@/app/operations/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function CallsByRegionChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col relative w-full">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">Calls by Region</h3>
      </div>
      
      <div className="flex-1 w-full relative flex flex-col items-center justify-center -mt-6">
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockCallsByRegion}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                stroke="none"
              >
                {mockCallsByRegion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4 mt-8 px-4">
          {mockCallsByRegion.map((region) => (
            <div key={region.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                <span className="text-sm font-semibold text-gray-500">{region.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{region.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
