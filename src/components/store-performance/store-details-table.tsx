'use client';

import { useState } from 'react';
import { Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreModal, type StoreRow } from './store-modal';
import type { StoreListItem } from '@/types/api';

const PAGE_SIZE = 10;

interface StoreDetailsTableProps {
  data: StoreListItem[];
  loading?: boolean;
}

/** Maps a real API StoreListItem into the StoreRow shape the modal expects. */
function toStoreRow(item: StoreListItem): StoreRow {
  return {
    name: item.store_name,
    storeCode: item.store_code,
    region: item.region,
    state: item.state,
    city: item.city?.trim(),
    totalCalls: item.total_calls,
    qualified: item.qualified ?? item.qualified_calls ?? 0,
    junk: item.junk ?? item.junk_calls ?? 0,
    avgHandle: item.avg_handle_time ?? '—',
    conversion: `${Math.round(item.conversion_pct ?? 0)}%`,
    csat: `${Math.round(item.csat_pct ?? 0)}%`,
    status: item.status,
    avgScore: item.avg_score ?? 0,
    complaints: item.complaints ?? 0,
  };
}

export function StoreDetailsTable({ data, loading }: StoreDetailsTableProps) {
  const { open, modal } = useStoreModal();
  const [page, setPage] = useState(1);

  const rows: StoreRow[] = data && data.length > 0 ? data.map(toStoreRow) : [];

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);
  const showingFrom = rows.length === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PAGE_SIZE, rows.length);

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Store size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-bold text-gray-900">Store Details</h3>
          {rows.length > 0 && (
            <span className="ml-2 text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {rows.length} stores
            </span>
          )}
          {loading && (
            <span className="ml-auto text-xs text-gray-400 animate-pulse">Fetching live data…</span>
          )}
        </div>

        {/* Skeleton */}
        {loading && data.length === 0 ? (
          <div className="space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 font-semibold uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-4 font-bold">Store</th>
                    <th className="px-4 py-4 font-bold">Region</th>
                    <th className="px-4 py-4 font-bold">State</th>
                    <th className="px-4 py-4 font-bold">City</th>
                    <th className="px-4 py-4 font-bold text-right">Total Calls</th>
                    <th className="px-4 py-4 font-bold text-right">Qualified</th>
                    <th className="px-4 py-4 font-bold text-right">Junk</th>
                    <th className="px-4 py-4 font-bold text-right">Avg Handle</th>
                    <th className="px-4 py-4 font-bold text-right">Conversion</th>
                    <th className="px-4 py-4 font-bold text-right">CSAT</th>
                    <th className="px-4 py-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-red-50/30 transition-colors cursor-pointer group"
                      onClick={() => open(row)}
                    >
                      <td className="px-4 py-4">
                        <span className="font-bold text-red-500 group-hover:underline block leading-tight">{row.name}</span>
                        {row.storeCode && (
                          <span className="text-[11px] font-semibold text-gray-400 mt-0.5 block">#{row.storeCode}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-600 font-medium">{row.region}</td>
                      <td className="px-4 py-4 text-gray-600 font-medium">{row.state}</td>
                      <td className="px-4 py-4 text-gray-600 font-medium">{row.city}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-700">{row.totalCalls}</td>
                      <td className="px-4 py-4 text-right font-bold text-emerald-500">{row.qualified}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-500">{row.junk}</td>
                      <td className="px-4 py-4 text-right font-medium text-gray-600">{row.avgHandle}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-700">{row.conversion}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-700">{row.csat}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-bold',
                          row.status === 'Active' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400">
                  Showing <span className="font-bold text-gray-600">{showingFrom}–{showingTo}</span> of{' '}
                  <span className="font-bold text-gray-600">{rows.length}</span> stores
                </p>

                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-8 h-8 rounded-lg text-xs font-bold transition-colors',
                        p === safePage
                          ? 'bg-red-500 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-gray-100'
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal}
    </>
  );
}
