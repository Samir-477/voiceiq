// ============================================================
// VoiceIQ Call Analytics Dashboard — Type Definitions
// ============================================================

// --- Shared KPI card ---
export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  trend: number; // percentage change, positive = up, negative = down
  icon: string;  // lucide icon name key
  color: 'red' | 'green' | 'purple' | 'blue' | 'orange' | 'amber';
}

// --- Call Record (Call Explorer) ---
export interface CallRecord {
  id: string;
  dateTime: string;
  storeName: string;
  storeLocation: string;
  summary: string;
  callerType: 'New' | 'Returning';
  intent: string;
  outcome: 'Answered' | 'Missed';
  duration: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  recording_url?: string | null;
  transcript_url?: string;
}

export interface SentimentTrendPoint {
  day: string;
  positive: number;
  neutral: number;
  negative: number;
}

// --- Store Performance ---
export interface StoreRecord {
  code: string;
  storeName: string;
  location: string;
  brand: string;
  totalCalls: number;
  answered: number;
  answeredPct: number;
  missed: number;
  missedPct: number;
  highIntent: number;
  highIntentPct: number;
  stockout: number;
  stockoutPct: number;
  avgPerDay: number;
  score: number;
}

export interface StorePerformanceData {
  kpis: KpiMetric[];
  stores: StoreRecord[];
  totalStores: number;
}

// --- Agent Performance ---
export interface AgentKpiMetrics {
  activeAgents: number;
  totalStoresCovered: number;
  topScore: number;
  topAgentName: string;
  avgConversionPct: number;
  conversionTrend: number;
  avgToneScorePct: number;
}

export interface VoiceQualityRadarData {
  subject: string;
  score: number;
  fullMark: number;
}

export interface AgentLeaderboardRecord {
  id: string;
  rank: number;
  agentName: string;
  storeName: string;
  region: string;
  qualifiedPct: number;
  conversionPct: number;
  tonePct: number;
  totalCalls: number;
}

export interface CoachingInsight {
  id: string;
  text: string;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AgentPerformanceData {
  kpis: AgentKpiMetrics;
  voiceQuality: VoiceQualityRadarData[];
  leaderboard: AgentLeaderboardRecord[];
  insights: CoachingInsight[];
  suggestedActions: SuggestedAction[];
}

// --- Revenue Intelligence ---
export interface RevenueKpiMetrics {
  estRevenueLoss: string;
  estRevenueLossSubLabel: string;
  missedDemand: number;
  missedDemandTrend: string;
  topCategory: string;
  topCategorySubLabel: string;
  altSuggestions: number;
  altSuggestionsSubLabel: string;
}

export interface RegionRevenueLoss {
  region: string;
  amount: number;
}

export interface DemandedProduct {
  id: string;
  name: string;
  requests: number;
  fulfillmentPct: number;
}

export interface RevenueIntelligenceData {
  kpis: RevenueKpiMetrics;
  regionLoss: RegionRevenueLoss[];
  topProducts: DemandedProduct[];
}
