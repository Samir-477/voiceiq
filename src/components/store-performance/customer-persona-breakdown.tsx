'use client';

import { Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { PersonaBreakdownItem } from '@/types/api';

// Distinct, visually separated colors — matches the site's "Calls by Region" palette style
const COLORS = ['#4f8ef7', '#ef4444', '#10b981', '#9ca3af', '#f59e0b'];

interface CustomerPersonaBreakdownProps {
  data:     PersonaBreakdownItem[];
  loading?: boolean;
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: string; color: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      padding: '8px 12px',
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{d.name}</p>
      <p style={{ fontSize: 12, color: '#6b7280' }}>
        <span style={{ fontWeight: 700, color: '#111827' }}>{d.value}</span> calls &nbsp;·&nbsp;
        <span style={{ fontWeight: 700, color: d.payload.color }}>{d.payload.pct}</span>
      </p>
    </div>
  );
}

export function CustomerPersonaBreakdown({ data, loading }: CustomerPersonaBreakdownProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full" />;

  const total = data.reduce((sum, p) => sum + (Number(p.total_calls) || 0), 0);

  const chartData = data && data.length > 0
    ? data.map((p, i) => ({
        name:  p.persona,
        value: Number(p.total_calls) || 0,
        pct:   total > 0 ? `${((Number(p.total_calls) / total) * 100).toFixed(1)}%` : '0%',
        color: COLORS[i % COLORS.length],
      }))
    : [];

  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Customer Persona Breakdown</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && !hasData ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">No data available</div>
      ) : (
        <>
          {/* Donut */}
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend — 2-column grid, no progress bars */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 ml-3 shrink-0">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
