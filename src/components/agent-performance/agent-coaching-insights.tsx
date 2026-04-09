'use client';

import { Brain, Lightbulb, ArrowRight } from 'lucide-react';
import type { CoachingInsight, SuggestedAction } from '@/types';

interface AgentCoachingInsightsProps {
  insights: CoachingInsight[];
  suggestedActions: SuggestedAction[];
}

export function AgentCoachingInsights({ insights, suggestedActions }: AgentCoachingInsightsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden mt-6 flex flex-col">
      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>

      <div className="p-6 pl-8">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
              <Brain size={14} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Agent Coaching Insights</h3>
          </div>
          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            AI Powered
          </span>
        </div>

        <ul className="space-y-3 mb-8">
          {insights.map((insight) => (
            <li key={insight.id} className="flex items-start gap-3">
              <Lightbulb className="text-amber-500 shrink-0 mt-[2px]" size={16} />
              <span className="text-sm text-gray-600 font-medium leading-relaxed">
                {insight.text}
              </span>
            </li>
          ))}
        </ul>

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Suggested Actions
          </p>
          <div className="space-y-3">
            {suggestedActions.map((action) => (
              <div 
                key={action.id} 
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ArrowRight className="text-red-500 group-hover:translate-x-1 transition-transform" size={16} />
                  <div>
                    <span className="text-sm font-bold text-gray-900">{action.title}</span>
                    <span className="text-gray-400 mx-2">—</span>
                    <span className="text-sm text-gray-500 font-medium">{action.description}</span>
                  </div>
                </div>
                
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  action.priority === 'high' 
                    ? 'border-red-200 text-red-500' 
                    : action.priority === 'medium'
                    ? 'border-amber-300 text-amber-500'
                    : 'border-blue-200 text-blue-500'
                }`}>
                  {action.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
