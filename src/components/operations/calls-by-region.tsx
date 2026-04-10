'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockCallsByRegion } from '@/app/operations/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { RegionVolumeItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const mockCallsByRegion = [
//   { name: 'North', value: 4200, color: '#ef4444' },
//   { name: 'South', value: 3800, color: '#3b82f6' },
//   { name: 'East',  value: 3500, color: '#d1d5db' },
//   { name: 'West',  value: 3200, color: '#e5e7eb' },
// ];

const REGION_COLORS: Record<string, string> = {
  North: '#ef4444',
  South: '#3b82f6',
  East:  '#d1d5db',
  West:  '#e5e7eb',
};
// Fallback palette for any extra regions the API may return
const FALLBACK_COLORS = ['#f97316', '#a855f7', '#14b8a6', '#eab308'];

interface CallsByRegionChartProps {
  data: RegionVolumeItem[];
  loading?: boolean;
}

export function CallsByRegionChart({ data, loading }: CallsByRegionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;

  // Map API data to chart shape; fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map((item, idx) => ({
        name:  item.region,
        value: Number(item.count) || 0,
        color: REGION_COLORS[item.region] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      }))
    : mockCallsByRegion;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col relative w-full">
      <div className="mb-4 flex items-center">
        <h3 className="text-base font-bold text-gray-900">Calls by Region</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <div className="flex-1 w-full relative flex flex-col items-center justify-center -mt-6">
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4 mt-8 px-4">
            {chartData.map((region) => (
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
      )}
    </div>
  );
}
