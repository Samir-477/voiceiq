'use client';

import { useState } from 'react';
import { MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GeoStateRow, GeoCityRow, GeoStoreRow } from '@/types/api';

type TabType = 'State Wise' | 'City Wise' | 'Store Details';

const PAGE_SIZE = 10;

const TH = 'px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-center';
const TD = 'px-4 py-3.5 text-sm text-gray-700 text-center';

interface GeographicBreakdownProps {
  storeData: GeoStoreRow[];
  stateData: GeoStateRow[];
  cityData:  GeoCityRow[];
  loading?:  boolean;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[...Array(PAGE_SIZE)].map((_, i) => (
        <tr key={i} className="border-b border-gray-50">
          {[...Array(cols)].map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div className="h-4 bg-gray-100 rounded animate-pulse mx-auto" style={{ width: j === 0 ? '70%' : '50%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={99} className="py-12 text-center text-sm text-gray-400">No data available</td>
    </tr>
  );
}

function PaginationBar({
  page, totalPages, total, label,
  onPrev, onNext, onPageClick,
  showingFrom, showingTo,
}: {
  page: number; totalPages: number; total: number; label: string;
  onPrev: () => void; onNext: () => void; onPageClick: (p: number) => void;
  showingFrom: number; showingTo: number;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | '...')[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
      <p className="text-xs font-medium text-gray-400">
        {total === 0
          ? `0 ${label}`
          : <>Showing <span className="font-bold text-gray-600">{showingFrom}–{showingTo}</span> of <span className="font-bold text-gray-600">{total}</span> {label}</>
        }
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button onClick={onPrev} disabled={page === 1}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft size={15} />
          </button>
          {pages.map((p, i) =>
            p === '...'
              ? <span key={`e${i}`} className="px-1 text-gray-400 text-xs">…</span>
              : <button key={p} onClick={() => onPageClick(p as number)}
                  className={cn('w-7 h-7 rounded-lg text-xs font-bold transition-colors',
                    p === page ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100')}>
                  {p}
                </button>
          )}
          <button onClick={onNext} disabled={page === totalPages}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export function GeographicBreakdown({ storeData, stateData, cityData, loading }: GeographicBreakdownProps) {
  const [activeTab,  setActiveTab]  = useState<TabType>('State Wise');
  const [statePage,  setStatePage]  = useState(1);
  const [cityPage,   setCityPage]   = useState(1);
  const [storePage,  setStorePage]  = useState(1);

  // ── State rows ──────────────────────────────────────────────────────────────
  const stateRows = (stateData ?? []).map(r => ({
    state:      r.name,
    region:     r.region,
    totalCalls: Number(r.total_calls),
    qualified:  Number(r.qualified),
    junk:       Number(r.junk),
    complaints: Number(r.complaints),
    stores:     Number(r.store_count),
  }));

  // ── City rows ───────────────────────────────────────────────────────────────
  const cityRows = (cityData ?? []).map(r => ({
    city:       r.name.trim(),
    region:     r.region,
    totalCalls: Number(r.total_calls),
    qualified:  Number(r.qualified),
    junk:       Number(r.junk),
    complaints: Number(r.complaints),
    stores:     Number(r.store_count),
  }));

  // ── Store Details: aggregate by region ──────────────────────────────────────
  type RegionStat = { region: string; totalCalls: number; qualified: number; junk: number; complaints: number; storeCount: number; };
  const regionMap = new Map<string, RegionStat>();
  for (const r of (storeData ?? [])) {
    const prev = regionMap.get(r.region) ?? { region: r.region, totalCalls: 0, qualified: 0, junk: 0, complaints: 0, storeCount: 0 };
    regionMap.set(r.region, {
      region:     r.region,
      totalCalls: prev.totalCalls + Number(r.total_calls),
      qualified:  prev.qualified  + Number(r.qualified),
      junk:       prev.junk       + Number(r.junk),
      complaints: prev.complaints + Number(r.complaints),
      storeCount: prev.storeCount + Number(r.store_count),
    });
  }
  const regionRows = [...regionMap.values()].sort((a, b) => b.totalCalls - a.totalCalls);

  // ── Paginated slices ─────────────────────────────────────────────────────────
  const safePage = (p: number, total: number) => Math.min(p, Math.max(1, Math.ceil(total / PAGE_SIZE)));

  const safeState  = safePage(statePage,  stateRows.length);
  const safeCity   = safePage(cityPage,   cityRows.length);
  const safeStore  = safePage(storePage,  regionRows.length);

  const slice = <T,>(arr: T[], page: number) => arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statePageRows  = slice(stateRows,  safeState);
  const cityPageRows   = slice(cityRows,   safeCity);
  const regionPageRows = slice(regionRows, safeStore);

  const pageCount = (len: number) => Math.max(1, Math.ceil(len / PAGE_SIZE));
  const from = (page: number, total: number) => total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to   = (page: number, total: number) => Math.min(page * PAGE_SIZE, total);

  const tabs: TabType[] = ['State Wise', 'City Wise', 'Store Details'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-5">
        <MapPin size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Geographic Breakdown</h3>
        {loading && <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>}
      </div>

      {/* Tab Bar */}
      <div className="px-6 pb-4">
        <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150',
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tables */}
      <div className="overflow-x-auto">

        {/* ── STATE WISE ───────────────────────────────────────────────────────── */}
        {activeTab === 'State Wise' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className={cn(TH, 'text-left')}>State</th>
                <th className={TH}>Region</th>
                <th className={TH}>Total Calls</th>
                <th className={TH}>Qualified</th>
                <th className={TH}>Junk</th>
                <th className={TH}>Complaints</th>
                <th className={TH}>Stores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && stateRows.length === 0
                ? <SkeletonRows cols={7} />
                : statePageRows.length === 0
                  ? <EmptyState />
                  : statePageRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className={cn(TD, 'text-left font-semibold text-gray-900')}>{row.state}</td>
                      <td className={TD}>
                        <span className="inline-block bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-600">{row.region}</span>
                      </td>
                      <td className={cn(TD, 'font-bold text-gray-700')}>{row.totalCalls.toLocaleString()}</td>
                      <td className={cn(TD, 'font-semibold text-emerald-500')}>{row.qualified.toLocaleString()}</td>
                      <td className={cn(TD, 'font-medium text-gray-400')}>{row.junk.toLocaleString()}</td>
                      <td className={cn(TD, row.complaints > 0 ? 'font-bold text-red-500' : 'text-gray-300')}>
                        {row.complaints > 0 ? row.complaints : '—'}
                      </td>
                      <td className={TD}>
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold">
                          <Building2 size={12} className="text-gray-400" />{row.stores}
                        </span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        )}

        {/* ── CITY WISE ────────────────────────────────────────────────────────── */}
        {activeTab === 'City Wise' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className={cn(TH, 'text-left')}>City</th>
                <th className={TH}>Region</th>
                <th className={TH}>Total Calls</th>
                <th className={TH}>Qualified</th>
                <th className={TH}>Junk</th>
                <th className={TH}>Complaints</th>
                <th className={TH}>Stores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && cityRows.length === 0
                ? <SkeletonRows cols={7} />
                : cityPageRows.length === 0
                  ? <EmptyState />
                  : cityPageRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className={cn(TD, 'text-left font-semibold text-gray-900')}>{row.city}</td>
                      <td className={TD}>
                        <span className="inline-block bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-600">{row.region}</span>
                      </td>
                      <td className={cn(TD, 'font-bold text-gray-700')}>{row.totalCalls.toLocaleString()}</td>
                      <td className={cn(TD, 'font-semibold text-emerald-500')}>{row.qualified.toLocaleString()}</td>
                      <td className={cn(TD, 'font-medium text-gray-400')}>{row.junk.toLocaleString()}</td>
                      <td className={cn(TD, row.complaints > 0 ? 'font-bold text-red-500' : 'text-gray-300')}>
                        {row.complaints > 0 ? row.complaints : '—'}
                      </td>
                      <td className={TD}>
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold">
                          <Building2 size={12} className="text-gray-400" />{row.stores}
                        </span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        )}

        {/* ── STORE DETAILS ────────────────────────────────────────────────────── */}
        {activeTab === 'Store Details' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y border-gray-100">
              <tr>
                <th className={cn(TH, 'text-left')}>Region</th>
                <th className={TH}>Total Calls</th>
                <th className={TH}>Qualified</th>
                <th className={TH}>Junk</th>
                <th className={TH}>Complaints</th>
                <th className={TH}>Stores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && regionRows.length === 0
                ? <SkeletonRows cols={6} />
                : regionPageRows.length === 0
                  ? <EmptyState />
                  : regionPageRows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className={cn(TD, 'text-left font-semibold text-gray-900')}>{row.region}</td>
                      <td className={cn(TD, 'font-bold text-gray-700')}>{row.totalCalls.toLocaleString()}</td>
                      <td className={cn(TD, 'font-semibold text-emerald-500')}>{row.qualified.toLocaleString()}</td>
                      <td className={cn(TD, 'font-medium text-gray-400')}>{row.junk.toLocaleString()}</td>
                      <td className={cn(TD, row.complaints > 0 ? 'font-bold text-red-500' : 'text-gray-300')}>
                        {row.complaints > 0 ? row.complaints : '—'}
                      </td>
                      <td className={TD}>
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold">
                          <Building2 size={12} className="text-gray-400" />{row.storeCount}
                        </span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
            {/* Grand total row — always visible, uses full data not just page */}
            {regionRows.length > 0 && (
              <tfoot className="border-t-2 border-gray-100 bg-gray-50/60">
                <tr>
                  <td className={cn(TD, 'text-left font-bold text-gray-700')}>Total</td>
                  <td className={cn(TD, 'font-bold text-gray-900')}>{regionRows.reduce((s, r) => s + r.totalCalls, 0).toLocaleString()}</td>
                  <td className={cn(TD, 'font-bold text-emerald-500')}>{regionRows.reduce((s, r) => s + r.qualified, 0).toLocaleString()}</td>
                  <td className={cn(TD, 'font-bold text-gray-400')}>{regionRows.reduce((s, r) => s + r.junk, 0).toLocaleString()}</td>
                  <td className={cn(TD, 'font-bold text-red-500')}>{regionRows.reduce((s, r) => s + r.complaints, 0).toLocaleString()}</td>
                  <td className={cn(TD, 'font-bold text-gray-600')}>{regionRows.reduce((s, r) => s + r.storeCount, 0).toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      {/* Pagination footer — per tab */}
      {activeTab === 'State Wise' && (
        <PaginationBar
          page={safeState} totalPages={pageCount(stateRows.length)}
          total={stateRows.length} label="states"
          showingFrom={from(safeState, stateRows.length)}
          showingTo={to(safeState, stateRows.length)}
          onPrev={() => setStatePage(p => Math.max(1, p - 1))}
          onNext={() => setStatePage(p => Math.min(pageCount(stateRows.length), p + 1))}
          onPageClick={setStatePage}
        />
      )}
      {activeTab === 'City Wise' && (
        <PaginationBar
          page={safeCity} totalPages={pageCount(cityRows.length)}
          total={cityRows.length} label="cities"
          showingFrom={from(safeCity, cityRows.length)}
          showingTo={to(safeCity, cityRows.length)}
          onPrev={() => setCityPage(p => Math.max(1, p - 1))}
          onNext={() => setCityPage(p => Math.min(pageCount(cityRows.length), p + 1))}
          onPageClick={setCityPage}
        />
      )}
      {activeTab === 'Store Details' && (
        <PaginationBar
          page={safeStore} totalPages={pageCount(regionRows.length)}
          total={regionRows.length} label="regions"
          showingFrom={from(safeStore, regionRows.length)}
          showingTo={to(safeStore, regionRows.length)}
          onPrev={() => setStorePage(p => Math.max(1, p - 1))}
          onNext={() => setStorePage(p => Math.min(pageCount(regionRows.length), p + 1))}
          onPageClick={setStorePage}
        />
      )}
    </div>
  );
}
