'use client';

import { Users, Clock, Phone, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockConversionDrivers, mockPeakConversionTimes, mockCallOutcomes, mockConversionKeyInsights, mockWeeklyTrend } from '@/app/store-performance/mock-data';
import { useIsMounted } from '@/hooks/use-is-mounted';

export function ConversionAttributionAnalysis() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-50 p-2 rounded-xl border border-red-100">
          <Users size={20} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Conversion Attribution Analysis</h3>
          <p className="text-xs font-medium text-gray-400">What drives successful store conversions from calls</p>
        </div>
      </div>

      {/* Top Conversion Drivers */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Top Conversion Drivers</h4>
        <div className="space-y-3">
          {mockConversionDrivers.map((driver, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm font-semibold text-gray-700">{driver.driver}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400">{driver.conversions} conversions</span>
                <span className="text-sm font-bold text-red-500 w-12 text-right">{driver.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Conversion Times */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock size={12} /> Peak Conversion Times
        </h4>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3">
          {mockPeakConversionTimes.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">{item.time}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{item.count}</span>
                <span className="text-sm font-bold text-red-500">{item.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call Outcome Breakdown */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Phone size={12} /> Call Outcome Breakdown
        </h4>
        <div className="space-y-4">
          {mockCallOutcomes.map((outcome, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-1.5">
                <span className="text-sm font-semibold text-gray-700">{outcome.outcome}</span>
                <span className="text-sm font-bold text-gray-600">{outcome.count} ({outcome.pct}%)</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${outcome.barWidth}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-5">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle size={12} className="text-red-500" /> Key Insights
        </h4>
        <div className="space-y-2.5">
          {mockConversionKeyInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-medium">
                <span className="font-bold text-gray-800">{insight.title}</span> {insight.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeeklyPerformanceTrendChart() {
  const mounted = useIsMounted();
  if (!mounted) return <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6 h-[360px]" />;
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-base font-bold text-gray-900">Weekly Performance Trend</h3>
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockWeeklyTrend} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
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
    </div>
  );
}
