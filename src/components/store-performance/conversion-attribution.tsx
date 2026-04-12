'use client';

import { Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip, ReferenceLine, Cell,
  LineChart, Line, Legend,
} from 'recharts';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { ConversionDriverItem } from '@/types/api';

interface ConversionAttributionAnalysisProps {
  data: ConversionDriverItem[];
  loading?: boolean;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number; payload: { converted: string; nonConverted: string; deltaNum: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isPos = d.deltaNum >= 0;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '10px 14px',
      minWidth: 180,
    }}>
      <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 6 }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <p style={{ fontSize: 12, color: '#6b7280' }}>
          Converted avg: <strong style={{ color: '#111827' }}>{d.converted}</strong>
        </p>
        <p style={{ fontSize: 12, color: '#6b7280' }}>
          Non-conv avg: <strong style={{ color: '#111827' }}>{d.nonConverted}</strong>
        </p>
        <p style={{ fontSize: 12, color: isPos ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          Δ {d.deltaNum > 0 ? '+' : ''}{d.deltaNum.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export function ConversionAttributionAnalysis({ data, loading }: ConversionAttributionAnalysisProps) {
  const mounted = useIsMounted();

  const chartData = data && data.length > 0
    ? data
      .map(d => {
        const converted = Number(d.avg_score_converted ?? d.converted_avg) || 0;
        const nonConverted = Number(d.avg_score_not_converted ?? d.non_converted_avg) || 0;
        const deltaNum = Number(d.delta) || (converted - nonConverted);
        return {
          name: d.dimension.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          deltaNum,
          converted: converted.toFixed(1),
          nonConverted: nonConverted.toFixed(1),
        };
      })
      .filter(d => d.deltaNum !== 0)
      .sort((a, b) => b.deltaNum - a.deltaNum)   // largest positive → most negative
    : [];

  const hasData = chartData.length > 0;
  const chartHeight = Math.max(340, chartData.length * 34);
  const minDelta = Math.min(...chartData.map(d => d.deltaNum), 0);
  const maxDelta = Math.max(...chartData.map(d => d.deltaNum), 0);
  const padding = 4;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-50 p-2 rounded-xl border border-red-100">
          <Users size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Conversion Attribution Analysis</h3>

        </div>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Fetching live data…</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-xs font-semibold text-gray-500">Positive driver (converted score higher)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-400" />
          <span className="text-xs font-semibold text-gray-500">Gap to close (non-conv score higher)</span>
        </div>
      </div>

      {loading && !hasData ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !hasData ? (
        <div className="text-sm text-gray-400 italic py-4">No driver data available.</div>
      ) : (
        <div style={{ width: '100%', height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
              barSize={7}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f3f4f6" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                domain={[minDelta - padding, maxDelta + padding]}
                tickFormatter={v => v > 0 ? `+${v}` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 13, fontWeight: 400 }}
                width={200}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1.5} />
              <Bar dataKey="deltaNum" name="Delta" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.deltaNum >= 0 ? '#10b981' : '#ef4444'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}


export function WeeklyPerformanceTrendChart({ data = [], loading }: { data?: any[], loading?: boolean }) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6 h-[360px]" />;

  if (data.length === 0 && !loading) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6 relative">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-base font-bold text-gray-900">Weekly Performance Trend</h3>
        {loading && <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>}
      </div>

      {loading ? (
        <div className="h-[280px] bg-gray-50 rounded-xl animate-pulse" />
      ) : (
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
              />
              <Legend
                formatter={(value) => value === 'avgConversion' ? 'Avg Conversion %' : 'Avg CSAT %'}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              />
              <Line
                type="monotone"
                dataKey="avgConversion"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: 'white', stroke: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="avgConversion"
              />
              <Line
                type="monotone"
                dataKey="avgCsat"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: 'white', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="avgCsat"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
