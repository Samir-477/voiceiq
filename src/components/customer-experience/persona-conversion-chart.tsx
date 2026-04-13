'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { PersonaConversionItem } from '@/types/api';

interface PersonaConversionChartProps {
  data: PersonaConversionItem[];
  loading?: boolean;
}

// ── Custom tooltip — Total Calls only (converted bar removed) ─────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const calls = payload.find(p => p.name === 'calls')?.value ?? 0;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '10px 14px',
      minWidth: 160,
    }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 8 }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#ef4444', flexShrink: 0 }} />
          Total Calls
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{calls}</span>
      </div>
    </div>
  );
}

export function PersonaConversionChart({ data, loading }: PersonaConversionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;

  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:  item.persona,
        calls: Number(item.total_calls) || 0,
      }))
    : [];

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
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#555', fontWeight: 600 }}
                axisLine={true}
                tickLine={false}
                dy={10}
              />
              <YAxis
                type="number"
                tick={{ fontSize: 12, fill: '#888' }}
                axisLine={false}
                tickLine={false}
                domain={[0, Math.ceil(maxVal / 5) * 5 + 2]}
                tickCount={5}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(243,244,246,0.5)' }}
              />
              <Bar dataKey="calls" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
