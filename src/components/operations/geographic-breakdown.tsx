'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import {
  mockGeographicBreakdown,
  mockCityWiseBreakdown,
  mockStoreDetails,
} from '@/app/operations/mock-data';
import { cn } from '@/lib/utils';
import type { GeoStateRow, GeoCityRow, GeoStoreRow } from '@/types/api';

type TabType = 'State Wise' | 'City Wise' | 'Store Details';

const TH = 'px-4 py-3 font-bold text-xs text-gray-400 uppercase tracking-wider';
const TD = 'px-4 py-4';

interface GeographicBreakdownProps {
  storeData: GeoStoreRow[];
  stateData: GeoStateRow[];
  cityData:  GeoCityRow[];
  loading?:  boolean;
}

export function GeographicBreakdown({ storeData, stateData, cityData, loading }: GeographicBreakdownProps) {
  const [activeTab, setActiveTab] = useState<TabType>('State Wise');

  // ── Normalise API data → display rows; fall back to mock when empty ──────────

  const stateRows = stateData && stateData.length > 0
    ? stateData.map(r => ({
        state:      r.name,                                        // API uses 'name' not 'state'
        region:     r.region,
        totalCalls: Number(r.total_calls).toLocaleString(),
        qualified:  Number(r.qualified).toLocaleString(),          // API uses 'qualified'
        junk:       Number(r.junk).toLocaleString(),               // API uses 'junk'
        complaints: Number(r.complaints).toLocaleString(),         // API uses 'complaints'
        stores:     String(r.store_count),
      }))
    : mockGeographicBreakdown;

  const cityRows = cityData && cityData.length > 0
    ? cityData.map(r => ({
        city:       r.name,                                      // API uses 'name' not 'city'
        state:      r.state,
        totalCalls: Number(r.total_calls).toLocaleString(),
        qualified:  Number(r.qualified).toLocaleString(),        // API uses 'qualified'
        junk:       Number(r.junk).toLocaleString(),             // API uses 'junk'
        topDemand:  r.top_demand || '—',
      }))
    : mockCityWiseBreakdown;

  const storeRows = storeData && storeData.length > 0
    ? storeData.map(r => ({
        store:     r.name,                                       // API uses 'name' not 'store_name'
        city:      r.city,
        state:     r.state,
        total:     Number(r.total_calls),
        qualified: Number(r.qualified),                          // API uses 'qualified'
        junk:      Number(r.junk),                              // API uses 'junk'
        conv:      `${Math.round(Number(r.conversion_pct) || 0)}%`,
        csat:      `${Math.round(Number(r.csat_pct) || 0)}%`,
        status:    r.status,
      }))
    : mockStoreDetails;

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MapPin size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Geographic Breakdown</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Fetching live data…</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-50/50 p-1 rounded-xl w-fit border border-gray-100">
        {(['State Wise', 'City Wise', 'Store Details'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && stateData.length === 0 ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* ── State Wise ──────────────────────────────────── */}
          {activeTab === 'State Wise' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className={TH}>State</th>
                  <th className={cn(TH, 'text-center')}>Region</th>
                  <th className={cn(TH, 'text-right')}>Total Calls</th>
                  <th className={cn(TH, 'text-right')}>Qualified</th>
                  <th className={cn(TH, 'text-right')}>Junk</th>
                  <th className={cn(TH, 'text-right')}>Complaints</th>
                  <th className={cn(TH, 'text-right')}>Stores</th>
                </tr>
              </thead>
              <tbody>
                {stateRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className={cn(TD, 'font-bold text-gray-900')}>{row.state}</td>
                    <td className={cn(TD, 'text-center')}>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">{row.region}</span>
                    </td>
                    <td className={cn(TD, 'text-right font-bold text-gray-600')}>{row.totalCalls}</td>
                    <td className={cn(TD, 'text-right font-bold text-emerald-500')}>{row.qualified}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-500')}>{row.junk}</td>
                    <td className={cn(TD, 'text-right font-bold text-red-500')}>{row.complaints}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-700')}>{row.stores}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── City Wise ──────────────────────────────────── */}
          {activeTab === 'City Wise' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className={TH}>City</th>
                  <th className={TH}>State</th>
                  <th className={cn(TH, 'text-right')}>Total Calls</th>
                  <th className={cn(TH, 'text-right')}>Qualified</th>
                  <th className={cn(TH, 'text-right')}>Junk</th>
                  <th className={TH}>Top Demand</th>
                </tr>
              </thead>
              <tbody>
                {cityRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className={cn(TD, 'font-bold text-gray-900')}>{row.city}</td>
                    <td className={cn(TD, 'font-semibold text-emerald-600')}>{row.state}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-600')}>{row.totalCalls}</td>
                    <td className={cn(TD, 'text-right font-bold text-emerald-500')}>{row.qualified}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-500')}>{row.junk}</td>
                    <td className={TD}>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 whitespace-nowrap">
                        {row.topDemand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── Store Details ──────────────────────────────── */}
          {activeTab === 'Store Details' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className={TH}>Store</th>
                  <th className={TH}>City</th>
                  <th className={TH}>State</th>
                  <th className={cn(TH, 'text-right')}>Total</th>
                  <th className={cn(TH, 'text-right')}>Qualified</th>
                  <th className={cn(TH, 'text-right')}>Junk</th>
                  <th className={cn(TH, 'text-right')}>Conv. %</th>
                  <th className={cn(TH, 'text-right')}>CSAT</th>
                  <th className={cn(TH, 'text-center')}>Status</th>
                </tr>
              </thead>
              <tbody>
                {storeRows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className={cn(TD, 'font-bold text-gray-900 whitespace-nowrap')}>{row.store}</td>
                    <td className={cn(TD, 'font-semibold text-blue-500')}>{row.city}</td>
                    <td className={cn(TD, 'font-semibold text-gray-500 italic')}>{row.state}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-700')}>{row.total.toLocaleString()}</td>
                    <td className={cn(TD, 'text-right font-bold text-emerald-500')}>{row.qualified.toLocaleString()}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-500')}>{row.junk.toLocaleString()}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-700')}>{row.conv}</td>
                    <td className={cn(TD, 'text-right font-bold text-gray-700')}>{row.csat}</td>
                    <td className={cn(TD, 'text-center')}>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap',
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-500 text-white'
                      )}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
