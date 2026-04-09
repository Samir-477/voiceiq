'use client';

import { Sparkles } from 'lucide-react';
import { mockReportsAiInsights } from '@/app/reports/mock-data';

export function ReportsAiInsights() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-red-500 shrink-0" />
        <h3 className="text-xl font-bold text-gray-900">AI Insights & Recommendations</h3>
      </div>

      <div className="space-y-4">
        {mockReportsAiInsights.map((insight, idx) => (
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
        ))}
      </div>
    </div>
  );
}
