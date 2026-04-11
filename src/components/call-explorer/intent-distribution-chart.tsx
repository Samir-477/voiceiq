'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { intentDistributionData } from '@/app/call-explorer/mock-data';
import { Target } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-is-mounted';
import type { IntentSentimentItem } from '@/types/api';

const INTENT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#f97316', '#14b8a6'];

interface IntentDistributionChartProps {
  data: IntentSentimentItem[];
  loading?: boolean;
}

export function IntentDistributionChart({ data, loading }: IntentDistributionChartProps) {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] w-full" />;

  // Build distribution from intent-sentiment data (use total per intent as the slice size)
  // Fall back to mock when empty
  const chartData = data && data.length > 0
    ? data.map((item, idx) => {
        const total = (Number(item.positive) || 0) + (Number(item.neutral) || 0) + (Number(item.negative) || 0);
        return {
          name:  item.intent,
          value: total,
          fill:  INTENT_COLORS[idx % INTENT_COLORS.length],
        };
      })
    : intentDistributionData;

  // Compute percentage labels
  const grandTotal = chartData.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm h-[320px] flex flex-col relative w-full">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Intent Distribution</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : (
        <div style={{ width: '100%', height: 240, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold', fontSize: '12px' }}
                formatter={(value, name) => [`${value} (${Math.round((Number(value) / grandTotal) * 100)}%)`, name as string]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Dynamic legend overlay — only show top 5 for readability */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-x-4 gap-y-1 justify-center pointer-events-none">
            {chartData.slice(0, 5).map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="text-xs font-semibold text-gray-500 truncate max-w-[100px]">
                  {item.name} ({Math.round((item.value / grandTotal) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
