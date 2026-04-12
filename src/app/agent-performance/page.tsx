'use client';

import { useState, useEffect } from 'react';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { AgentKpiCards } from '@/components/agent-performance/agent-kpi-cards';
import { VoiceQualityRadar } from '@/components/agent-performance/voice-quality-radar';
import { AgentLeaderboard } from '@/components/agent-performance/agent-leaderboard';
import { AgentCoachingInsights } from '@/components/agent-performance/agent-coaching-insights';

export default function AgentPerformancePage() {
  const { filters } = useFilters();
  const [loading, setLoading] = useState(false);
  const [agentData, setAgentData] = useState<any>({
    kpis: null,
    voiceQuality: [],
    leaderboard: [],
    insights: [],
    suggestedActions: []
  });

  useEffect(() => {
    // Placeholder for Agent Performance API integration
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header 
        title="Agent Performance" 
        subtitle="Measure and improve agent-level performance using call & voice analytics" 
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />
          <AgentKpiCards metrics={agentData.kpis} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
            <VoiceQualityRadar data={agentData.voiceQuality} loading={loading} />
            <AgentLeaderboard data={agentData.leaderboard} loading={loading} />
          </div>

          <AgentCoachingInsights 
            insights={agentData.insights} 
            suggestedActions={agentData.suggestedActions} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
