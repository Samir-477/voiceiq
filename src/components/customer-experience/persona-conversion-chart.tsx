'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { personaConversionData } from '@/app/customer-experience/mock-data';
import { Users } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { PersonaConversionItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const personaConversionData = [
//   { name: 'Budget Shoppers',      calls: 11, converted: 3 },
//   { name: 'Students',             calls: 11, converted: 2 },
//   { name: 'Sports Enthusiasts',   calls: 10, converted: 1 },
//   { name: 'Office Professionals', calls: 10, converted: 4 },
//   { name: 'Fashion Seekers',      calls: 8,  converted: 2 },
// ];

interface PersonaConversionChartProps {
  data: PersonaConversionItem[];
  loading?: boolean;
}

export function PersonaConversionChart({ data, loading }: PersonaConversionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;

  // Map API data to chart shape; fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:      item.persona,
        calls:     Number(item.total_calls)  || 0,   // API returns 'total_calls'
        converted: Number(item.conversions)  || 0,
      }))
    : personaConversionData;

  const maxVal = Math.max(...chartData.map(d => d.calls), 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] flex flex-col w-full">
      <div className="flex items-center gap-2 mb-6 text-red-500">
        <Users size={20} strokeWidth={2} />
        <h3 className="text-base font-bold text-gray-900">Persona-wise Conversion Performance</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
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
                domain={[0, Math.ceil(maxVal / 5) * 5 + 2]}
                tickCount={5}
              />
              <Bar dataKey="calls"     fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="converted" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
