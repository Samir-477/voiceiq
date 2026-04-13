'use client';

import { useState } from 'react';
import { PhoneCall, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallModal } from './call-modal';
import { cn } from '@/lib/utils';
import type { CallLogItem } from '@/types/api';

const PAGE_SIZE = 10;

interface CallLogsTableProps {
  data:     CallLogItem[];
  total?:   number;
  loading?: boolean;
}

/** Sentiment badge colours */
const sentimentCls = (s: string) =>
  s === 'Positive' ? 'border-emerald-400 text-emerald-600 bg-emerald-50'
  : s === 'Negative' ? 'border-red-400 text-red-600 bg-red-50'
  : 'border-gray-200 text-gray-500 bg-white';

/** Intent / Type badge colours */
const intentCls = (t: string) =>
  t === 'Complaint'            ? 'bg-red-500 text-white'
  : t === 'NOISE'              ? 'bg-gray-100 text-gray-500 border border-gray-200'
  : t === 'Stock Availability' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  : 'bg-white border border-gray-200 text-gray-600';

/** Map raw API item → table row shape */
function toRow(item: CallLogItem, idx: number) {
  const displayId = item.call_uuid
    ? `CALL-${item.call_uuid.replace(/-/g, '').slice(0, 8).toUpperCase()}`
    : `CALL-${String(idx + 1).padStart(5, '0')}`;

  const city  = (item.city  || '').trim();
  const state = (item.state || '').trim();

  return {
    id:            displayId,
    _uuid:         item.call_uuid || `row-${idx}`,
    location:      city && state ? `${city}, ${state}` : city || state || '—',
    storeCode:     item.store_code   || '—',
    region:        item.region       || '—',
    duration:      item.duration     || '—',
    intent:        item.intent       || '—',
    sentiment:     item.sentiment    || '—',
    persona:       item.persona      || '—',
    category:      item.product_category || '—',
    converted:     Boolean(item.is_conversion),
    timestamp:     item.timestamp    || '—',
    agent:         item.agent_name   || '—',
    summary:       item.short_summary || '',
    recording_url: item.recording_url,
  };
}

const TH = 'py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap';
const TD = 'py-3 px-4 text-sm whitespace-nowrap';

export function CallLogsTable({ data, total, loading }: CallLogsTableProps) {
  const { open, modal } = useCallModal();
  const [page, setPage] = useState(1);

  const rows = data && data.length > 0
    ? data.map((item, idx) => ({ ...toRow(item, idx), _raw: item }))
    : [];

  const totalPages  = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const start       = (safePage - 1) * PAGE_SIZE;
  const pageRows    = rows.slice(start, start + PAGE_SIZE);
  const showingFrom = rows.length === 0 ? 0 : start + 1;
  const showingTo   = Math.min(start + PAGE_SIZE, rows.length);
  const displayTotal = total ?? rows.length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm mt-6">

        {/* Header */}
        <div className="flex items-center gap-2 p-5 border-b border-black/5">
          <PhoneCall size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-bold text-gray-900">Call Logs</h3>
          {rows.length > 0 && (
            <span className="ml-2 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {displayTotal.toLocaleString()} calls
            </span>
          )}
          {loading && (
            <span className="ml-auto text-xs text-gray-400 animate-pulse">Fetching live data…</span>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && data.length === 0 ? (
          <div className="p-6 space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100">
                  <th className={TH}>Call ID</th>
                  <th className={TH}>Location</th>
                  <th className={TH}>Store Code</th>
                  <th className={TH}>Region</th>
                  <th className={TH}>Duration</th>
                  <th className={TH}>Intent</th>
                  <th className={cn(TH, 'text-center')}>Sentiment</th>
                  <th className={TH}>Persona</th>
                  <th className={TH}>Category</th>
                  <th className={cn(TH, 'text-center')}>Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-sm text-gray-400">
                      No call records found
                    </td>
                  </tr>
                ) : pageRows.map((call, idx) => (
                  <tr
                    key={call._uuid || `row-${idx}`}
                    onClick={() => {
                      open(call._raw, call.id);
                    }}
                    className="hover:bg-red-50/20 transition-colors cursor-pointer group"
                  >
                    <td className={cn(TD, 'font-semibold text-red-500 group-hover:underline')}>
                      {call.id}
                    </td>
                    <td className={cn(TD, 'font-semibold text-gray-800')}>
                      {call.location}
                    </td>
                    <td className={cn(TD, 'text-gray-500 font-medium')}>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">
                        {call.storeCode}
                      </span>
                    </td>
                    <td className={cn(TD, 'font-medium text-gray-500')}>
                      {call.region}
                    </td>
                    <td className={cn(TD, 'text-gray-600')}>
                      {call.duration}
                    </td>
                    <td className={TD}>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold', intentCls(call.intent))}>
                        {call.intent}
                      </span>
                    </td>
                    <td className={cn(TD, 'text-center')}>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold border', sentimentCls(call.sentiment))}>
                        {call.sentiment}
                      </span>
                    </td>
                    <td className={cn(TD, 'text-gray-500')}>
                      {call.persona}
                    </td>
                    <td className={cn(TD, 'text-gray-600 font-medium')}>
                      {call.category}
                    </td>
                    <td className={cn(TD, 'text-center')}>
                      {call.converted ? (
                        <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">Yes</span>
                      ) : (
                        <span className="text-gray-300 font-bold text-base">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer — pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
          <p className="text-xs font-medium text-gray-400">
            {rows.length === 0
              ? 'No results'
              : <>Showing <span className="font-bold text-gray-600">{showingFrom}–{showingTo}</span> of <span className="font-bold text-gray-600">{displayTotal.toLocaleString()}</span> calls</>
            }
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page numbers — show at most 7 with ellipsis */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-xs font-bold transition-colors',
                        p === safePage
                          ? 'bg-red-500 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-gray-100'
                      )}
                    >
                      {p}
                    </button>
                  )
                )
              }

              {/* Next */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {modal}
    </>
  );
}
