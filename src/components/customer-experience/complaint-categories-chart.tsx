'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { ComplaintCategoryItem } from '@/types/api';

interface ComplaintCategoriesChartProps {
  data: ComplaintCategoryItem[];
  loading?: boolean;
}

// ── Custom tooltip — matches site design pattern ───────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '10px 14px',
      minWidth: 150,
    }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#ef4444', flexShrink: 0 }} />
          Complaints
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{value}</span>
      </div>
    </div>
  );
}

export function ComplaintCategoriesChart({ data, loading }: ComplaintCategoriesChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[360px] w-full" />;

  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:  item.category,
        value: Number(item.count) || 0,
      }))
    : [];

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
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(243,244,246,0.5)' }}
              />
              <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
