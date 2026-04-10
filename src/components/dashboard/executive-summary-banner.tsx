'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Store, AlertTriangle } from 'lucide-react';
import type { KpiSummaryResponse, MissedProductItem } from '@/types/api';

interface ExecutiveSummaryBannerProps {
  kpiSummary?: KpiSummaryResponse | null;
  missedProducts?: MissedProductItem[];
  storesAttentionCount?: number;
  loading?: boolean;
}

export function ExecutiveSummaryBanner({
  kpiSummary,
  missedProducts = [],
  storesAttentionCount = 0,
  loading,
}: ExecutiveSummaryBannerProps) {
  // Derive display values from real API data; fall back to static copy if null
  const highIntent  = kpiSummary ? Number(kpiSummary.high_intent_calls) || 0 : 25;
  const totalCalls  = kpiSummary ? Number(kpiSummary.total_calls)        || 0 : 50;
  const complaint   = kpiSummary ? `${(Number(kpiSummary.complaint_rate_pct) || 0).toFixed(0)}%` : '26%';
  const storeAlert  = kpiSummary ? storesAttentionCount : 4;

  const topProducts = missedProducts.length > 0
    ? missedProducts.slice(0, 3).map((p) => p.article)
    : ['Running Shoes', 'White Sneakers', 'Sports Sandals'];

  return (
    <div className="relative w-full bg-gradient-to-r from-red-50/90 via-red-50/30 to-white border-l-4 border-l-red-500 rounded-2xl p-6 mb-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header & Snapshot Label */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <TrendingUp size={22} className="text-red-500" />
          <h2 className="text-sm font-bold text-gray-900">Executive Summary</h2>
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
          {loading ? 'Fetching…' : "Today's Snapshot"}
        </span>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

        {/* Col 1: Demand Signal */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10 first:border-0 first:pl-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider h-5 flex items-center">
            Demand Signal
          </p>
          {loading && !kpiSummary ? (
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-sm text-gray-700 font-medium leading-snug">
              <span className="text-red-600 font-bold text-base mr-1">{highIntent.toLocaleString()}</span>
              purchase-intent calls from {totalCalls.toLocaleString()} total
            </p>
          )}
        </div>

        {/* Col 2: Revenue at Risk */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10">
          <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider h-5">
            <TrendingDown size={14} className="text-red-400" />
            Revenue at Risk
          </p>
          <p className="text-sm text-gray-700 font-medium leading-snug">
            <span className="text-red-600 font-bold text-base mr-1">₹4.3L</span>
            lost due to stockouts &amp; missed follow-ups
          </p>
        </div>

        {/* Col 3: Top Missed Products */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10">
          <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider h-5">
            <Store size={14} className="text-orange-400" />
            Top Missed Products
          </p>
          {loading && missedProducts.length === 0 ? (
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <div className="flex flex-wrap gap-2 mt-0.5">
              {topProducts.map((name, idx) => (
                <span
                  key={`${name}-${idx}`}
                  className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Col 4: Action Required */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10">
          <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider h-5">
            <AlertTriangle size={14} className="text-red-500" />
            Action Required
          </p>
          {loading && !kpiSummary ? (
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-sm text-gray-700 font-medium leading-tight">
              <span className="text-red-600 font-bold text-base mr-1">{storeAlert}</span>
              stores need attention ·{' '}
              <span className="text-red-600 font-bold text-base mx-1">{complaint}</span>
              complaint rate
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
