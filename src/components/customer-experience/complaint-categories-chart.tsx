'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { complaintCategoriesData } from '@/app/customer-experience/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { ComplaintCategoryItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const complaintCategoriesData = [
//   { name: 'Delivery', value: 145 },
//   { name: 'Product Quality', value: 98 },
//   { name: 'Staff Behavior', value: 65 },
//   { name: 'Wrong Item', value: 58 },
//   { name: 'Refund', value: 42 },
// ];

interface ComplaintCategoriesChartProps {
  data: ComplaintCategoryItem[];
  loading?: boolean;
}

export function ComplaintCategoriesChart({ data, loading }: ComplaintCategoriesChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] w-full" />;

  // Map API data to chart shape { name, value }; fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:  item.category,
        value: Number(item.count) || 0,
      }))
    : complaintCategoriesData;

  // Compute domain max from data for a cleaner axis
  const maxVal = Math.max(...chartData.map(d => d.value), 10);
  const axisDomain = Math.ceil(maxVal / 50) * 50;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] flex flex-col w-full">
      <div className="flex items-center mb-6">
        <h3 className="text-base font-bold text-gray-900">Complaint Categories</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 290 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
              barSize={24}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#888' }} axisLine={true} tickLine={true} domain={[0, axisDomain]} tickCount={5} />
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
      )}
    </div>
  );
}
