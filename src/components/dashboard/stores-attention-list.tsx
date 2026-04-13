'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreListItem } from '@/types/api';

interface StoresAttentionListProps {
  data:     StoreListItem[];
  loading?: boolean;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 60 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
    score >= 35 ? 'bg-amber-50  text-amber-600  border-amber-200'    :
                  'bg-red-50    text-red-600    border-red-200';
  return (
    <span className={cn('text-xs font-extrabold px-2.5 py-0.5 rounded-full border', color)}>
      {score.toFixed(1)}
    </span>
  );
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: 'red' | 'amber' | 'green' | 'default' }) {
  const valClass =
    accent === 'red'    ? 'text-red-500'     :
    accent === 'amber'  ? 'text-amber-500'   :
    accent === 'green'  ? 'text-emerald-600' :
                          'text-gray-800';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{label}</span>
      <span className={cn('text-sm font-bold leading-tight', valClass)}>{value}</span>
    </div>
  );
}

export function StoresAttentionList({ data, loading }: StoresAttentionListProps) {
  const stores = data && data.length > 0
    ? data.map(s => ({
        name:        s.store_name,
        code:        s.store_code || '',
        city:        (s.city || '').trim(),
        state:       s.state || '',
        region:      s.region || '',
        totalCalls:  Number(s.total_calls)    || 0,
        qualified:   Number(s.qualified      ?? s.qualified_calls) || 0,
        junk:        Number(s.junk           ?? s.junk_calls)      || 0,
        complaints:  Number(s.complaints)    || 0,
        conversions: Number(s.conversions)   || 0,
        convPct:     `${Math.round(Number(s.conversion_pct) || 0)}%`,
        csatPct:     `${Math.round(Number(s.csat_pct)       || 0)}%`,
        avgScore:    Number(s.avg_score)     || 0,
        avgHandle:   s.avg_handle_time       || '—',
        status:      s.status                || 'Unknown',
      }))
    : [];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle size={22} className="text-red-500 shrink-0" />
        <h2 className="text-lg font-bold text-gray-900">Stores Requiring Attention</h2>
        {stores.length > 0 && (
          <span className="ml-1 text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
            {stores.length}
          </span>
        )}
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {/* Skeleton */}
      {loading && stores.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          No stores currently flagged for attention.
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[900px] pr-1">
          {stores.map((store, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-red-100 bg-red-50/30 p-4 hover:bg-red-50/60 transition-colors"
            >
              {/* Store header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-gray-900 leading-tight">{store.name}</span>
                    {store.code && (
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        #{store.code}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    {[store.city, store.state, store.region].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {/* Avg Score badge */}
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Avg Score</span>
                  <ScoreBadge score={store.avgScore} />
                </div>
              </div>

              {/* Metrics grid — 4 cols on first row, 4 on second */}
              <div className="grid grid-cols-4 gap-x-3 gap-y-3 bg-white/60 rounded-xl p-3 border border-red-100/60">
                <Metric label="Total Calls"  value={store.totalCalls.toLocaleString()} />
                <Metric label="Qualified"    value={store.qualified.toLocaleString()}  accent="green" />
                <Metric label="Junk"         value={store.junk.toLocaleString()}       accent="amber" />
                <Metric label="Complaints"   value={store.complaints.toLocaleString()} accent="red" />

                <Metric label="Conversions"  value={store.conversions.toLocaleString()} />
                <Metric label="Conv. Rate"   value={store.convPct}    accent={store.convPct === '0%' ? 'red' : 'default'} />
                <Metric label="CSAT"         value={store.csatPct}    accent={Number(store.csatPct) < 40 ? 'red' : 'default'} />
                <Metric label="Avg Handle"   value={store.avgHandle} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
