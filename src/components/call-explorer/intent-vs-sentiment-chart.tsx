'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Activity } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentSentimentItem } from '@/types/api';

interface IntentVsSentimentChartProps {
  data: IntentSentimentItem[];
  loading?: boolean;
}

// ── Legend config ─────────────────────────────────────────────────────────────
const SERIES = [
  { key: 'Positive', color: '#22c55e' },
  { key: 'Neutral',  color: '#d1d5db' },
  { key: 'Negative', color: '#ef4444' },
] as const;

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; fill: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '10px 14px',
      minWidth: 170,
    }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 8 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: p.fill, flexShrink: 0 }} />
            {p.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{p.value}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>Total</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{total}</span>
      </div>
    </div>
  );
}

// ── Y-axis label width: longest label = "Delivery / Online Order" = ~22 chars
// At 12px font ≈ 7px/char → 154px; give 170px to be safe.
const Y_WIDTH = 170;

// ── Bar height + top/bottom padding per category ──────────────────────────────
const BAR_H   = 18;   // px — actual rendered bar height
const ROW_PX  = 64;   // px per intent row — larger = more spacing between bars
const CHART_MARGIN = { top: 12, right: 24, left: 0, bottom: 8 };

export function IntentVsSentimentChart({ data, loading }: IntentVsSentimentChartProps) {
  const mounted = useIsMounted();
  if (!mounted) {
    return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[460px] w-full" />;
  }

  const chartData = data && data.length > 0
    ? data.map(item => ({
        name:     item.intent,
        Positive: Number(item.positive) || 0,
        Neutral:  Number(item.neutral)  || 0,
        Negative: Number(item.negative) || 0,
      }))
    : [];

  // Each row gets ROW_PX; add margins
  const chartH = chartData.length > 0
    ? chartData.length * ROW_PX + CHART_MARGIN.top + CHART_MARGIN.bottom
    : 280;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm flex flex-col w-full">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent vs Sentiment</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-5 mb-8">
        {SERIES.map(({ key, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: color }}
            />
            <span className="text-xs font-medium text-gray-500">{key}</span>
          </div>
        ))}
      </div>

      {/* ── Chart area ── */}
      {loading && chartData.length === 0 ? (
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
          No data available
        </div>
      ) : (
        /*
         * Key layout fix:
         * - Explicit pixel height so no squishing
         * - Y_WIDTH gives full room for long labels
         * - left margin = 0 (YAxis width already reserves that space)
         * - right margin gives room for the end of long stacked bars
         * - barCategoryGap controls the gap between rows (not bar thickness)
         * - barSize is consistent across all stacked segments
         */
        <div style={{ width: '100%', height: chartH }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={CHART_MARGIN}
              barCategoryGap="30%"
              barGap={0}
            >
              <CartesianGrid
                strokeDasharray="0"
                horizontal={false}
                vertical={true}
                stroke="#f3f4f6"
              />

              {/* Value axis — bottom */}
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickCount={6}
              />

              {/* Intent label axis — left */}
              <YAxis
                type="category"
                dataKey="name"
                width={Y_WIDTH}
                tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                // Trim long names gracefully
                tickFormatter={(v: string) => v.length > 24 ? v.slice(0, 22) + '…' : v}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(243,244,246,0.5)' }}
              />

              {/* Stacked bars — Positive | Neutral | Negative */}
              <Bar dataKey="Positive" stackId="s" fill="#22c55e" barSize={BAR_H} radius={[2, 0, 0, 2]} />
              <Bar dataKey="Neutral"  stackId="s" fill="#d1d5db" barSize={BAR_H} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Negative" stackId="s" fill="#ef4444" barSize={BAR_H} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
