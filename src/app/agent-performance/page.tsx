'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { AgentKpiCards } from '@/components/agent-performance/agent-kpi-cards';
import { VoiceQualityRadar } from '@/components/agent-performance/voice-quality-radar';
import { AgentLeaderboard } from '@/components/agent-performance/agent-leaderboard';
import { AgentCoachingInsights } from '@/components/agent-performance/agent-coaching-insights';
import { fetchWithAuth } from '@/lib/api-client';
import type {
  AgentKpiSummaryResponse,
  AgentVoiceQualityResponse,
  AgentLeaderboardApiItem,
} from '@/types/api';
import type {
  AgentKpiMetrics,
  VoiceQualityRadarData,
  AgentLeaderboardRecord,
} from '@/types';

export default function AgentPerformancePage() {
  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: kpiRaw, isLoading: loadingKpi } =
    useQuery<AgentKpiSummaryResponse>({
      queryKey: ['agent-kpi-summary'],
      queryFn: () =>
        fetchWithAuth('/api/v2/analytics/agent/kpi-summary').then((d) =>
          Array.isArray(d) ? d[0] : d
        ),
    });

  const { data: voiceRaw, isLoading: loadingVoice } =
    useQuery<AgentVoiceQualityResponse>({
      queryKey: ['agent-voice-quality'],
      queryFn: () =>
        fetchWithAuth('/api/v2/analytics/agent/voice-quality').then((d) =>
          Array.isArray(d) ? d[0] : d
        ),
    });

  const { data: leaderboardRaw, isLoading: loadingLeaderboard } = useQuery<
    AgentLeaderboardApiItem[]
  >({
    queryKey: ['agent-leaderboard'],
    queryFn: () =>
      fetchWithAuth('/api/v2/analytics/agent/leaderboard').then((d) =>
        Array.isArray(d) ? d : d?.leaderboard ?? d?.data ?? []
      ),
  });

  // ── Transform: KPI summary → AgentKpiMetrics ───────────────────────────────
  const kpiMetrics: AgentKpiMetrics | null = kpiRaw
    ? {
        activeAgents:     kpiRaw.active_agents      ?? kpiRaw.activeAgents     ?? 0,
        topScore:         kpiRaw.top_score           ?? kpiRaw.topScore         ?? 0,
        topAgentName:     kpiRaw.top_agent_name      ?? kpiRaw.topAgentName     ?? '—',
        avgConversionPct: kpiRaw.avg_conversion_pct  ?? kpiRaw.avgConversionPct ?? 0,
        avgToneScore:     kpiRaw.avg_tone_score       ?? kpiRaw.avg_tone_score_pct ?? kpiRaw.avgToneScorePct ?? 0,
      }
    : null;

  // ── Transform: voice quality → VoiceQualityRadarData[] ────────────────────
  const voiceQualityData: VoiceQualityRadarData[] = voiceRaw
    ? [
        { subject: 'Tone',             score: Math.round(voiceRaw.tone                 * 100) / 100, fullMark: 100 },
        { subject: 'Efficiency',       score: Math.round(voiceRaw.efficiency           * 100) / 100, fullMark: 100 },
        { subject: 'Problem Solving',  score: Math.round(voiceRaw.problem_solving      * 100) / 100, fullMark: 100 },
        { subject: 'Professionalism',  score: Math.round(voiceRaw.professionalism      * 100) / 100, fullMark: 100 },
        { subject: 'Brand Rep.',       score: Math.round(voiceRaw.brand_representation * 100) / 100, fullMark: 100 },
      ]
    : [];

  // ── Transform: leaderboard → AgentLeaderboardRecord[] ─────────────────────
  const leaderboardData: AgentLeaderboardRecord[] = (leaderboardRaw ?? []).map(
    (agent: AgentLeaderboardApiItem, idx: number) => ({
      id:            agent.agent_num ?? `${idx + 1}`,
      rank:          agent.rank                                                  ?? idx + 1,
      agentNum:      agent.agent_num      ?? '—',
      agentName:     agent.agent_name     ?? agent.agentName                     ?? '—',
      storeName:     agent.store_name     ?? agent.storeName                     ?? '—',
      region:        agent.region                                                ?? '—',
      qaScore:       agent.qa_score                                              ?? 0,
      qualifiedPct:  agent.qualified_pct  ?? agent.qualifiedPct                  ?? 0,
      conversionPct: agent.conversion_pct ?? agent.conversionPct                 ?? 0,
      tonePct:       agent.tone_pct       ?? agent.tonePct                       ?? 0,
      totalCalls:    agent.calls          ?? agent.total_calls  ?? agent.totalCalls ?? 0,
    })
  );

  const loading = loadingKpi || loadingVoice || loadingLeaderboard;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header
        title="Agent Performance"
        subtitle="Measure and improve agent-level performance using call & voice analytics"
      />

      <div className="px-8 pb-8 mt-6">
        <div className="animate-fade-in-up">
          <LocationFilterBar />
          <AgentKpiCards metrics={kpiMetrics} loading={loadingKpi} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
            <VoiceQualityRadar data={voiceQualityData} loading={loadingVoice} />
            <AgentLeaderboard data={leaderboardData} loading={loadingLeaderboard} />
          </div>

          {/* Coaching insights panel — hides itself when both arrays are empty */}
          <AgentCoachingInsights
            insights={[]}
            suggestedActions={[]}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
