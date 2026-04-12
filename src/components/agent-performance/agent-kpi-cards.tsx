'use client';

import { Users, Award, TrendingUp, Mic } from 'lucide-react';
import type { AgentKpiMetrics } from '@/types';

interface AgentKpiCardsProps {
  metrics?: AgentKpiMetrics | null;
  loading?: boolean;
}

export function AgentKpiCards({ metrics, loading }: AgentKpiCardsProps) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-32 animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Agents</p>
            <h3 className="text-3xl font-bold text-gray-900">{metrics.activeAgents}</h3>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Users size={20} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Across {metrics.totalStoresCovered} stores</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Top Score</p>
            <h3 className="text-3xl font-bold text-gray-900">{metrics.topScore}</h3>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Award size={20} />
          </div>
        </div>
        <p className="text-sm text-emerald-600 font-medium mt-2">{metrics.topAgentName}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Conversion</p>
            <h3 className="text-3xl font-bold text-gray-900">{metrics.avgConversionPct}%</h3>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-sm text-emerald-600 font-medium mt-2">
          +{metrics.conversionTrend}% this month
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Avg Tone Score</p>
            <h3 className="text-3xl font-bold text-gray-900">{metrics.avgToneScorePct}%</h3>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-red-500">
            <Mic size={20} />
          </div>
        </div>
        <p className="text-sm text-emerald-600 font-medium mt-2">Voice quality metric</p>
      </div>
    </div>
  );
}
