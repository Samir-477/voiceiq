import React from 'react';
import { TrendingUp, TrendingDown, Store, AlertTriangle } from 'lucide-react';

export function ExecutiveSummaryBanner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-red-50/90 via-red-50/30 to-white border-l-4 border-l-red-500 rounded-2xl p-6 mb-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Header & Snapshot Label */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <TrendingUp size={22} className="text-red-500" />
          <h2 className="text-sm font-bold text-gray-900">Executive Summary</h2>
        </div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white px-3 py-1.5 rounded-md border border-gray-100 shadow-sm">
          Today's Snapshot
        </span>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Col 1: Demand Signal */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10 first:border-0 first:pl-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider h-5 flex items-center">
            Demand Signal
          </p>
          <p className="text-sm text-gray-700 font-medium leading-snug">
            <span className="text-red-600 font-bold text-base mr-1">25</span>
            purchase-intent calls from 50 total
          </p>
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
          <div className="flex flex-wrap gap-2 mt-0.5">
            <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">Running Shoes</span>
            <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">White Sneakers</span>
            <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm">Sports Sandals</span>
          </div>
        </div>

        {/* Col 4: Action Required */}
        <div className="flex flex-col gap-2 border-l-2 border-transparent lg:border-black/5 lg:pl-10">
          <p className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider h-5">
            <AlertTriangle size={14} className="text-red-500" />
            Action Required
          </p>
          <p className="text-sm text-gray-700 font-medium leading-tight">
            <span className="text-red-600 font-bold text-base mr-1">4</span>
            stores need attention · <span className="text-red-600 font-bold text-base mx-1">5</span> zero-call stores · 26% complaint rate
          </p>
        </div>

      </div>
    </div>
  );
}
