'use client';

import { Users, Award, TrendingUp, Mic, UserCheck } from 'lucide-react';
import type { AgentKpiMetrics } from '@/types';

interface AgentKpiCardsProps {
  metrics?: AgentKpiMetrics | null;
  loading?: boolean;
}

export function AgentKpiCards({ metrics, loading }: AgentKpiCardsProps) {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label:   'Active Agents',
      value:   metrics.activeAgents.toLocaleString(),
      sub:     null,
      icon:    Users,
    },
    {
      label:   'Top Agent',
      value:   metrics.topAgentName,
      sub:     null,
      icon:    UserCheck,
    },
    {
      label:   'Top Score',
      value:   metrics.topScore,
      sub:     null,
      icon:    Award,
    },
    {
      label:   'Avg Conversion',
      value:   `${metrics.avgConversionPct}%`,
      sub:     null,
      icon:    TrendingUp,
    },
    {
      label:   'Avg Tone Score',
      value:   `${metrics.avgToneScore}%`,
      sub:     null,
      icon:    Mic,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0 flex-1 mr-3">
                <p className="text-sm font-medium text-gray-500 mb-1 truncate">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 truncate">{card.value}</h3>
              </div>
              <div className="shrink-0 bg-red-50 p-2 rounded-lg text-red-500">
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
