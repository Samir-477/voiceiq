'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentDistributionItem } from '@/types/api';

// Colour palette — carefully ordered to match NOISE (gray first) then semantic hues
const INTENT_COLORS: Record<string, string> = {
  'NOISE': '#d1d5db', // gray-300
  'Stock Availability': '#10b981', // emerald-500
  'Location & Directions': '#3b82f6', // blue-500
  'Complaint': '#ef4444', // red-500
  'Store Timings': '#f59e0b', // amber-500
  'Exchange/Return': '#8b5cf6', // violet-500
  'Delivery / Online Order': '#06b6d4', // cyan-500
  'Offers & Promotions': '#f97316', // orange-500
  'Loyalty & Points': '#14b8a6', // teal-500
  'Repair / Alteration': '#ec4899', // pink-500
  'Unknown': '#94a3b8', // slate-400
};
const FALLBACK_COLORS = ['#6366f1', '#84cc16', '#a78bfa', '#fb923c'];

interface IntentDistributionChartProps {
  data: IntentDistributionItem[];
  loading?: boolean;
}

// Custom tooltip — matches the site's card aesthetic
function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number; fill: string } }[];
}) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: pl } = payload[0];
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8ecf1',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '8px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: pl.fill, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{name}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginLeft: 4 }}>{value.toLocaleString()}</span>
      <span style={{ fontSize: 12, color: '#9ca3af' }}>{pl.pct.toFixed(1)}%</span>
    </div>
  );
}

export function IntentDistributionChart({ data, loading }: IntentDistributionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) {
    return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[400px] w-full" />;
  }

  const chartData = data && data.length > 0
    ? data.map((item, idx) => ({
      name: item.intent,
      value: Number(item.count) || 0,
      pct: Number(item.pct) || 0,
      fill: INTENT_COLORS[item.intent] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }))
    : [];

  const grandTotal = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex flex-col w-full">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-5">
        <Target size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent Distribution</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && chartData.length === 0 ? (
        <div className="flex flex-col items-center gap-6">
          <div className="w-40 h-40 rounded-full bg-gray-100 animate-pulse" />
          <div className="w-full space-y-2.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${75 - i * 8}%` }} />
            ))}
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-gray-400">
          No data available
        </div>
      ) : (
        <>
          {/* ── Donut ── */}
          <div className="w-full" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ── Legend list ── */}
          <div className="mt-4 space-y-2.5">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5">
                {/* colour dot — same size/style as calls-by-region */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                {/* label */}
                <span className="flex-1 text-sm font-semibold text-gray-500 truncate">
                  {item.name}
                </span>
                {/* count */}
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {item.value.toLocaleString()}
                </span>
                {/* pct pill */}
                <span className="text-xs font-semibold text-gray-400 tabular-nums w-10 text-right">
                  {item.pct.toFixed(1)}%
                </span>
              </div>
            ))}

            {/* Total row */}
            <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-100 mt-1">
              <div className="w-2.5 h-2.5 shrink-0" />
              <span className="flex-1 text-sm font-bold text-gray-600">Total</span>
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {grandTotal.toLocaleString()}
              </span>
              <span className="w-10 text-right text-xs font-semibold text-gray-400">100%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
