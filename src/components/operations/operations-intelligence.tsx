'use client';

import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { mockOperationsInsights, mockOperationsActions } from '@/app/operations/mock-data';
import { cn } from '@/lib/utils';

export function OperationsIntelligence() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden relative w-full mb-6 relative">
      {/* Red accent bar on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-2xl z-10" />

      <div className="p-6 pl-8 relative z-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-xl text-red-500 border border-red-100">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Operations Intelligence</h3>
          </div>
          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded tracking-wider uppercase">
            AI Powered
          </span>
        </div>

        <div className="space-y-3 mb-8">
          {mockOperationsInsights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-600 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">
            Suggested Actions
          </h4>
          <div className="space-y-3">
            {mockOperationsActions.map((action, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-red-100 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-3">
                  <ArrowRight size={16} className="text-red-400 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                  <p className="text-sm font-semibold text-gray-700">
                    <span className="text-gray-900 font-bold">{action.title}</span> <span className="text-gray-400 font-medium">—</span> {action.description}
                  </p>
                </div>
                <div className="shrink-0 ml-4">
                  <span className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full border",
                    action.priority === "high" 
                      ? "bg-red-50 text-red-600 border-red-200" 
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  )}>
                    {action.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
