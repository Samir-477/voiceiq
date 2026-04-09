'use client';

import { IndianRupee, TrendingDown, Package, Lightbulb } from 'lucide-react';
import type { RevenueKpiMetrics } from '@/types';

interface RevenueKpiCardsProps {
  metrics: RevenueKpiMetrics;
}

export function RevenueKpiCards({ metrics }: RevenueKpiCardsProps) {
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
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.estRevenueLoss}</h3>
        <p className="text-sm text-red-500 font-medium">{metrics.estRevenueLossSubLabel}</p>
      </div>

      {/* Missed Demand */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Missed Demand</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <TrendingDown size={18} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.missedDemand}</h3>
        <p className="text-sm text-emerald-600 font-medium">{metrics.missedDemandTrend}</p>
      </div>

      {/* Top Category */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Top Category</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Package size={18} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{metrics.topCategory}</h3>
        <p className="text-sm text-red-500 font-medium">{metrics.topCategorySubLabel}</p>
      </div>

      {/* Alt. Suggestions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm font-medium text-gray-500">Alt. Suggestions</p>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Lightbulb size={18} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.altSuggestions}%</h3>
        <p className="text-sm text-emerald-600 font-medium">{metrics.altSuggestionsSubLabel}</p>
      </div>
    </div>
  );
}
