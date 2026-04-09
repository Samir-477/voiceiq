'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { mockAgentPerformanceData } from './mock-data';
import { AgentKpiCards } from '@/components/agent-performance/agent-kpi-cards';
import { VoiceQualityRadar } from '@/components/agent-performance/voice-quality-radar';
import { AgentLeaderboard } from '@/components/agent-performance/agent-leaderboard';
import { AgentCoachingInsights } from '@/components/agent-performance/agent-coaching-insights';

export default function AgentPerformancePage() {
  const { kpis, voiceQuality, leaderboard, insights, suggestedActions } = mockAgentPerformanceData;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header 
        title="Agent Performance" 
        subtitle="Measure and improve agent-level performance using call & voice analytics" 
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />
          <AgentKpiCards metrics={kpis} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
            <VoiceQualityRadar data={voiceQuality} />
            <AgentLeaderboard data={leaderboard} />
          </div>

          <AgentCoachingInsights insights={insights} suggestedActions={suggestedActions} />
        </div>
      </div>
    </div>
  );
}
