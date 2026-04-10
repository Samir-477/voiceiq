'use client';

import { IndianRupee, TrendingDown, Package, Lightbulb } from 'lucide-react';
import type { RevenueSummaryResponse } from '@/types/api';

interface RevenueKpiCardsProps {
  metrics: RevenueSummaryResponse | null;
  loading?: boolean;
}

export function RevenueKpiCards({ metrics, loading }: RevenueKpiCardsProps) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-3">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-8 w-8 bg-gray-50 rounded" />
            </div>
            <div className="h-8 w-32 bg-gray-100 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Calculate estimated revenue loss (Proxy: 2000 per missed call)
  const estRevenueLoss = metrics.missed_demand_calls * 2000;
  const formattedLoss = estRevenueLoss >= 100000 
    ? `₹${(estRevenueLoss / 100000).toFixed(2)}L` 
    : `₹${(estRevenueLoss / 1000).toFixed(1)}K`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Est. Revenue Loss */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Est. Revenue Loss</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <IndianRupee size={18} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{formattedLoss}</h3>
        <p className="text-sm text-red-500 font-medium">Estimated from missed calls</p>
      </div>

      {/* Missed Demand */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Missed Demand</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <TrendingDown size={18} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.missed_demand_calls}</h3>
        <p className="text-sm text-emerald-600 font-medium">Missed Inquiries</p>
      </div>

      {/* Top Category */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Top Category</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Package size={18} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{metrics.top_missed_category}</h3>
        <p className="text-sm text-red-500 font-medium">Highest unmet demand</p>
      </div>

      {/* Stockout Count */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Stockout Alerts</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Lightbulb size={18} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.stockout_calls}</h3>
        <p className="text-sm text-emerald-600 font-medium">Critical Stockouts</p>
      </div>
    </div>
  );
}
