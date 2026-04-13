'use client';

import { Sparkles, Lightbulb } from 'lucide-react';

interface StorePerformanceIntelligenceProps {
  insights?: string[];
  loading?: boolean;
}

export function StorePerformanceIntelligence({ insights = [], loading }: StorePerformanceIntelligenceProps) {
  if (loading && insights.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden relative w-full mb-6 h-[150px] animate-pulse">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-200" />
      </div>
    );
  }

  if (!loading && insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden relative w-full mb-6">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl z-10" />

      <div className="p-6 pl-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-xl text-red-500 border border-red-100">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Store Performance Intelligence</h3>
          </div>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded tracking-wider uppercase">
            AI Powered
          </span>
        </div>

        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-600 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
