'use client';

import { Users } from 'lucide-react';
import { mockPersonaBreakdown } from '@/app/store-performance/mock-data';
import type { PersonaBreakdownItem } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const mockPersonaBreakdown = [
//   { persona: 'Office Professionals', calls: 14, conversions: 1, conversionPct: 7 },
//   { persona: 'Fashion Seekers', calls: 11, conversions: 1, conversionPct: 9 },
//   { persona: 'Sports Enthusiasts', calls: 11, conversions: 2, conversionPct: 18 },
//   { persona: 'Students', calls: 9, conversions: 1, conversionPct: 11 },
//   { persona: 'Budget Shoppers', calls: 5, conversions: 0, conversionPct: 0 },
// ];

interface CustomerPersonaBreakdownProps {
  data: PersonaBreakdownItem[];
  loading?: boolean;
}

export function CustomerPersonaBreakdown({ data, loading }: CustomerPersonaBreakdownProps) {
  // Normalise API shape to match component display; fall back to mock when empty
  const items = data && data.length > 0
    ? data.map(p => ({
        persona:       p.persona,
        calls:         p.calls,
        conversions:   p.conversions,
        conversionPct: Math.round(p.conversion_pct),
      }))
    : mockPersonaBreakdown;

  const maxCalls = Math.max(...items.map(p => p.calls), 1);

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Users size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Customer Persona Breakdown</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="space-y-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, idx) => (
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
      )}
    </div>
  );
}
