import { AgentPerformanceData } from '@/types';

export const mockAgentPerformanceData: AgentPerformanceData = {
  kpis: {
    activeAgents: 156,
    totalStoresCovered: 1300,
    topScore: 96,
    topAgentName: 'Agent 3',
    avgConversionPct: 72,
    conversionTrend: 5,
    avgToneScorePct: 77,
  },
  voiceQuality: [
    { subject: 'Tone', score: 77, fullMark: 100 },
    { subject: 'Efficiency', score: 77, fullMark: 100 },
    { subject: 'Problem Solving', score: 77, fullMark: 100 },
    { subject: 'Professionalism', score: 79, fullMark: 100 },
    { subject: 'Brand Rep.', score: 76, fullMark: 100 },
  ],
  leaderboard: [
    { id: '4', rank: 4, agentName: 'Agent 4', storeName: 'Andheri West', region: 'North', qualifiedPct: 99, conversionPct: 93, tonePct: 89, totalCalls: 61 },
    { id: '1', rank: 1, agentName: 'Agent 1', storeName: 'Koramangala Flagship', region: 'West', qualifiedPct: 95, conversionPct: 56, tonePct: 85, totalCalls: 30 },
    { id: '2', rank: 2, agentName: 'Agent 2', storeName: 'Indiranagar Hub', region: 'South', qualifiedPct: 90, conversionPct: 52, tonePct: 88, totalCalls: 20 },
    { id: '7', rank: 7, agentName: 'Agent 7', storeName: 'Gurgaon Cyber Hub', region: 'South', qualifiedPct: 85, conversionPct: 64, tonePct: 80, totalCalls: 47 },
    { id: '9', rank: 9, agentName: 'Agent 9', storeName: 'Jubilee Hills', region: 'West', qualifiedPct: 82, conversionPct: 70, tonePct: 85, totalCalls: 73 },
    { id: '5', rank: 5, agentName: 'Agent 5', storeName: 'Bandra Link', region: 'North', qualifiedPct: 80, conversionPct: 95, tonePct: 81, totalCalls: 95 },
    { id: '6', rank: 6, agentName: 'Agent 6', storeName: 'Connaught Place', region: 'East', qualifiedPct: 78, conversionPct: 85, tonePct: 83, totalCalls: 55 },
  ],
  insights: [
    { id: '1', text: 'Agent 7 has the highest complaint escalation rate (28%) — tone score is 62%, below team average.' },
    { id: '2', text: 'Top 3 agents share a common pattern: they confirm product availability within 30 seconds and score 85%+ on professionalism.' },
    { id: '3', text: 'Agents in East region have 15% lower conversion — problem-solving scores are 12% below average.' },
    { id: '4', text: 'Brand representation score averages 76% — lowest among all voice metrics, improvement opportunity.' },
  ],
  suggestedActions: [
    { id: '1', title: 'Flag for coaching', description: '4 agents show high complaint escalation patterns in call data', priority: 'high' },
    { id: '2', title: 'Share best practices', description: 'Top agents confirm product availability within 30 seconds — replicable pattern', priority: 'medium' },
    { id: '3', title: 'East region gap analysis', description: 'East region shows 15% lower conversion — product query resolution takes longer', priority: 'medium' },
  ],
};
