'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import type { RegionPerformanceItem } from '@/types/api';

interface RegionPerformanceTableProps {
  data: RegionPerformanceItem[];
  loading?: boolean;
}

export function RegionPerformanceTable({ data, loading }: RegionPerformanceTableProps) {
  const rows =
    data && data.length > 0
      ? data.map((r) => ({
          region:      r.region,
          totalCalls:  Number(r.total_calls).toLocaleString(),
          qualified:   Number(r.qualified_pct || 0).toFixed(1),
          highIntent:  Number(r.high_intent) || 0,
          // API returns 'conversion_pct' — try all known aliases
          conversion:  Number(r.conversion_pct ?? r.conversion_rate_pct ?? 0).toFixed(1),
          // API returns 'complaint_pct' — try all known aliases
          complaint:   Number(r.complaint_pct ?? r.complaint_rate_pct ?? 0).toFixed(1),
          storeCount:  r.store_count != null ? String(r.store_count) : '—',
          alertUrgent: (Number(r.complaint_pct ?? r.complaint_rate_pct ?? 0)) > 5,
        }))
      : [];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] w-full mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Region-Wise Performance</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-600 text-sm">Region</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Total Calls</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Qualified %</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">High Intent</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Conversion %</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Complaint %</th>
                <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Stores</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.region}
                  className={idx !== rows.length - 1 ? 'border-b border-gray-50' : ''}
                >
                  <td className="py-5 font-bold text-gray-800">{row.region}</td>

                  <td className="py-5 font-semibold text-gray-700 xl:text-center">{row.totalCalls}</td>

                  <td className="py-5 xl:text-center">
                    <div className="flex items-center xl:justify-center gap-3">
                      <div className="h-1.5 w-6 rounded-full bg-red-500" />
                      <span className="font-semibold text-gray-600">{row.qualified}%</span>
                    </div>
                  </td>

                  <td className="py-5 font-bold text-orange-500 xl:text-center">
                    {row.highIntent.toLocaleString()}
                  </td>

                  <td className="py-5 xl:text-center">
                    <span className="inline-block bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                      {row.conversion}%
                    </span>
                  </td>

                  <td className="py-5 xl:text-center">
                    {row.alertUrgent ? (
                      <span className="inline-block bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full">
                        {row.complaint}%
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-500">{row.complaint}%</span>
                    )}
                  </td>

                  <td className="py-5 font-semibold text-gray-600 xl:text-center">
                    {row.storeCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
