'use client';

import React from 'react';
import { Users } from 'lucide-react';
import type { AudienceResponse } from '@/types/api';

interface TopPersonasCardProps {
  data: AudienceResponse | null;
  loading?: boolean;
}

export function TopPersonasCard({ data, loading }: TopPersonasCardProps) {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col h-full w-full animate-pulse" />
    );
  }

  const personas =
    data?.top_personas && data.top_personas.length > 0
      ? data.top_personas.slice(0, 5).map((p) => ({
          name:    p.persona,
          calls:   Number(p.total_calls)       || 0,
          percent: Math.round(Number(p.conversion_pct) || 0),
        }))
      : [
          { name: 'Budget Shoppers',      calls: 11, percent: 27 },
          { name: 'Students',             calls: 11, percent: 18 },
          { name: 'Sports Enthusiasts',   calls: 10, percent: 10 },
          { name: 'Office Professionals', calls: 10, percent: 40 },
          { name: 'Fashion Seekers',      calls: 8,  percent: 25 },
        ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col h-full w-full">
      <div className="flex items-center gap-3 mb-6">
        <Users size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Top Personas</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 mt-auto mb-auto">
        {personas.map((persona) => (
          <div
            key={persona.name}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-100 bg-white"
          >
            <span className="text-sm font-semibold text-gray-800">{persona.name}</span>
            <div className="text-sm font-medium text-gray-400">
              <span>{persona.calls.toLocaleString()} calls</span>
              <span className="mx-1.5">·</span>
              <span className="text-red-600 font-bold">{persona.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
