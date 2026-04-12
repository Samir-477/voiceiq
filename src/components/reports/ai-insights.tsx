'use client';

import { Sparkles } from 'lucide-react';

interface ReportsAiInsightsProps {
  insights?: { title: string; actionText: string }[];
  loading?: boolean;
}

export function ReportsAiInsights({ insights = [], loading }: ReportsAiInsightsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6 relative">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-red-500 shrink-0" />
        <h3 className="text-xl font-bold text-gray-900">AI Insights & Recommendations</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Analyzing…</span>
        )}
      </div>

      <div className="space-y-4">
        {loading && insights.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))
        ) : insights.length > 0 ? (
          insights.map((insight, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-gray-900 mb-1">{insight.title}</p>
                  <p className="text-sm font-medium text-gray-400">{insight.actionText}</p>
                </div>
              </div>
              <button className="shrink-0 ml-4 px-6 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Act
              </button>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 italic py-4">No insights available for this selection.</div>
        )}
      </div>
    </div>
  );
}
