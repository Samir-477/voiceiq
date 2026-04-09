'use client';

import { Users } from 'lucide-react';
import { mockPersonaBreakdown } from '@/app/store-performance/mock-data';

export function CustomerPersonaBreakdown() {
  const maxCalls = Math.max(...mockPersonaBreakdown.map(p => p.calls));

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Customer Persona Breakdown</h3>
      </div>

      <div className="space-y-5">
        {mockPersonaBreakdown.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-800">{item.persona}</span>
              <span className="text-xs font-bold text-gray-500">
                {item.calls} calls · {item.conversions} conv. ·{' '}
                <span className="text-red-500">{item.conversionPct}%</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${(item.calls / maxCalls) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
