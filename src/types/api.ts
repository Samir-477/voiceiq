// ============================================================
// VoiceIQ — Backend API Response Types
// These match the actual API shapes returned by the backend.
// ============================================================

export interface FilterOptions {
  regions: {
    stateName: string;
    cityName: string;
    areaName: string;
  }[];
  stores: {
    gmbStoreCode: string;
    businessName: string;
    businessId: number;
    cityName: string;
    stateName: string;
  }[];
  intents: string[];
  categories: string[];
  sentiments: string[];
  issue_types: string[];
}



// --- Revenue Intelligence API Shapes ---

export interface RevenueSummaryResponse {
  missed_demand_calls: number;
  stockout_calls: number;
  top_missed_category: string;
  category_breakdown: Record<string, number>;
}

export interface RevenueByRegionItem {
  region: string;
  missed_demand: number;
  stockout_count: number;
}

export interface CategoryDemandConversionItem {
  category: string;
  total_calls: number;
  conversions: number;
  conversion_pct: number;
}

// --- Store Performance API Shapes ---

/**
 * /api/v1/analytics/store/list
 * /api/v1/analytics/store/leaderboard?top_n=10
 * Both endpoints return the same schema.
 */
export interface StoreListItem {
  store_code: string;
  store_name: string;
  state: string;
  city: string;
  region: string;
  total_calls: number;
  qualified_calls?: number;  // /store/list field name
  qualified?: number;        // /kpi/stores-attention field name
  junk_calls?: number;       // /store/list field name
  junk?: number;             // /kpi/stores-attention field name
  conversion_pct: number;
  csat_pct: number;
  avg_handle_time: string;   // e.g. "2m 45s"
  avg_score: number;
  status: string;            // "Active" | "Needs Attention"
  // Extra fields from /kpi/stores-attention
  complaints?: number;
  conversions?: number;
}

/**
 * /api/v1/analytics/store/conversion-drivers
 * Each scoring_audit dimension with avg score on converted vs non-converted calls and delta.
 */
export interface ConversionDriverItem {
  dimension:              string;  // e.g. "stock_assistance", "tone"
  avg_score_converted:    number;  // actual API field name
  avg_score_not_converted: number; // actual API field name
  // legacy aliases — may not be present
  converted_avg?:    number;
  non_converted_avg?: number;
  delta?:            number;
}

/**
 * /api/v1/analytics/store/persona-breakdown
 * Customer personas with call count and conversion rate.
 */
export interface PersonaBreakdownItem {
  persona:        string;
  total_calls:    number;  // API field (was incorrectly 'calls')
  conversions:    number;
  conversion_pct: number;
}

// --- Customer Experience API Shapes ---

/**
 * /api/v1/analytics/cx/summary
 * CX KPI cards: complaint rate %, resolution rate %, negative sentiment %.
 */
export interface CxSummaryResponse {
  total_calls:              number;
  qualified_calls:          number;
  complaint_calls:          number;
  complaint_rate_pct:       number;
  resolution_rate_pct:      number;
  resolved_complaints:      number;
  negative_sentiment_calls: number;
  negative_sentiment_pct:   number;
  // legacy optional fields
  repeat_complaint_count?:  number;
  repeat_complaint_pct?:    number;
}

/**
 * /api/v1/analytics/cx/sentiment-trend
 * Weekly sentiment breakdown: Positive/Neutral/Negative counts + % per week_start date.
 */
export interface SentimentTrendItem {
  week_start: string;      // e.g. "2026-03-03"
  positive: number;        // API returns lowercase
  neutral: number;         // API returns lowercase
  negative: number;        // API returns lowercase
  positive_pct?: number;
  neutral_pct?: number;
  negative_pct?: number;
}

/**
 * /api/v1/analytics/cx/complaint-categories
 * Complaint sub-categories with count.
 */
export interface ComplaintCategoryItem {
  category: string;  // e.g. "Delivery", "Product Quality", "Staff Behavior"
  count: number;
}

/**
 * /api/v1/analytics/cx/persona-conversion
 * Same shape as /store/persona-breakdown in the CX page context.
 */
export interface PersonaConversionItem {
  persona: string;
  total_calls: number;     // API returns 'total_calls' not 'calls'
  conversions: number;
  conversion_pct: number;
}

// --- Operations API Shapes ---

/**
 * /api/v1/analytics/ops/summary
 * Ops KPI cards: total, qualified, junk %, flagged issues, weekday avg, weekend avg, peak_hour.
 */
export interface OpsSummaryResponse {
  total_calls:   number;
  qualified_calls: number;
  qualified_pct:   number;
  noise_calls:   number;   // API field (not junk_calls)
  noise_pct:     number;   // API field (not junk_pct)
  flagged_issues: number;
  weekday_avg:   number;
  weekend_avg:   number;
  peak_hour:     string;
}

/**
 * /api/v1/analytics/ops/weekly-volume
 * Qualified vs NOISE per day-of-week (Mon–Sun).
 * Note: API returns "noise" not "junk" for the second bar.
 */
export interface WeeklyVolumeItem {
  day: string;          // "Mon" | "Tue" | ...
  qualified: number;
  noise: number;        // API field name is 'noise', not 'junk'
  total?: number;
}

/**
 * /api/v1/analytics/ops/by-region
 * Call volume count + % per region (North/South/East/West).
 */
export interface RegionVolumeItem {
  region: string;
  count: number;
  pct?: number;
}

/**
 * /api/v1/analytics/ops/geo-breakdown?tab=state
 */
export interface GeoStateRow {
  name: string;            // state name (API returns 'name' not 'state')
  region: string;
  total_calls: number;
  qualified: number;       // API returns 'qualified' not 'qualified_calls'
  junk: number;            // API returns 'junk' not 'junk_calls'
  complaints: number;      // API returns 'complaints' not 'complaint_calls'
  store_count: number;
}

/**
 * /api/v1/analytics/ops/geo-breakdown?tab=city
 * Note: 'name' has a leading tab character — must .trim().
 * API does NOT return 'state'; returns 'region' instead.
 * Also returns 'complaints' and 'store_count'.
 */
export interface GeoCityRow {
  name: string;        // city name (API returns 'name', has leading \t — trim it)
  region: string;      // API returns 'region' not 'state'
  total_calls: number;
  qualified: number;
  junk: number;
  complaints: number;
  store_count: number;
}

/**
 * /api/v1/analytics/ops/geo-breakdown?tab=store
 * All stores are named "Bata Shoe Store". API returns region/qualified/junk/complaints/store_count.
 * Does NOT return city, state, conversion_pct, csat_pct, or status.
 */
export interface GeoStoreRow {
  name: string;          // always "Bata Shoe Store"
  region: string;        // North | South | East | West
  total_calls: number;
  qualified: number;
  junk: number;
  complaints: number;
  store_count: number;
}

// --- Call Explorer API Shapes ---

/**
 * /api/v1/analytics/calls/summary
 * KPI header cards: total, qualified %, junk %, purchase_intent %, avg AI confidence %.
 */
export interface CallExplorerSummary {
  total_calls: number;
  qualified: number;             // API returns 'qualified' not 'qualified_calls'
  qualified_pct: number;
  junk: number;                  // API returns 'junk' not 'junk_calls'
  junk_pct: number;
  purchase_intent_count: number;
  purchase_intent_pct: number;
  avg_ai_confidence_pct: number; // API returns 'avg_ai_confidence_pct' not 'avg_ai_confidence'
  avg_duration?: string;         // not in API — will show '—'
}

/**
 * /api/v1/analytics/calls/intent-sentiment
 * Positive/Neutral/Negative count per call_intent.
 */
export interface IntentSentimentItem {
  intent: string;        // e.g. "Purchase Intent", "Complaint", "Inquiry"
  positive: number;
  neutral: number;
  negative: number;
}

/**
 * /api/v1/analytics/calls?page=1&per_page=20
 * A single call record in the paginated list.
 */
export interface CallLogItem {
  call_uuid: string;
  store_name: string;      // always "Bata Shoe Store" — use city+state for display
  city: string;            // e.g. "\tKolkata" — must .trim()
  state: string;
  region: string;
  store_code: string;
  agent_name: string | null;
  duration?: string;       // e.g. "2m 41s"
  intent: string;          // "Complaint" | "Purchase Intent" | etc.
  persona?: string;
  product_category?: string;
  sentiment?: string;      // "Positive" | "Neutral" | "Negative"
  is_conversion: boolean;  // API returns boolean not string
  confidence_pct?: number;
  recording_url?: string;
  short_summary?: string;  // real AI-generated summary
  call_status?: string;    // "Connected"
  timestamp?: string;
}

/**
 * Wrapper returned by /api/v1/analytics/calls?page=1
 */
export interface CallLogResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  results: CallLogItem[];
}

/**
 * /api/v1/analytics/calls/{uuid}
 * Full details for a single call record.
 */
export interface CallDetailItem extends CallLogItem {
  transcript: string;
  summary: string;
  call_intent: string;
  score: number;
  full_analysis: FullAnalysis;
}

export interface FullAnalysis {
  summary: string;
  short_summary: string;
  translated_text: string;
  call_intent: string;
  overall_score: number;
  confidence_score: number;
  score_explanation: string;
  data_quality: string;
  overview: AnalysisOverview;
  conclusion: AnalysisConclusion;
  call_review?: {
    sentiment: string;
    neutral_percent: number;
    negative_percent: number;
    positive_percent: number;
  };
  scoring_audit: Record<string, { score: number; reason: string }>;
  performance_metrics: Record<string, number>;
  derived_metadata?: {
    word_count: number;
    analysis_date: string;
    sentence_count: number;
    speaking_rate_wpm: number;
    estimated_duration: string;
  };
  extracted_details?: {
    shoe_size: string;
    article_name: string;
    customer_phone: string;
    store_location: string;
    core_issue_or_request: string;
  };
  product_and_audience?: {
    audience: string;
    is_conversion: boolean;
    brand_mentions: string[];
    customer_persona: string;
    product_category: string;
    conversion_product: string | null;
  };
}

export interface AnalysisOverview {
  sentiment: string;
  is_stockout: boolean;
  is_high_intent: boolean;
  purpose_of_call: string;
  product_interest: string;
  automated_insight: string[];
  is_missed_opportunity: boolean;
}

export interface AnalysisConclusion {
  final_verdict: string;
  predicted_csat: string;
}

// --- Executive KPI API Shapes ---

/**
 * /api/v1/analytics/kpi/summary
 * 8 KPI cards: total_calls, qualified, noise, high_intent, conversions,
 * complaints, avg_score, avg_talk_time, sentiment_breakdown.
 */
export interface KpiSummaryResponse {
  total_calls: number;
  // Qualified
  qualified_calls: number;
  qualified_pct: number;
  // Noise / Junk
  noise_calls: number;
  noise_pct: number;
  // High intent
  high_intent_calls: number;
  high_intent_pct: number;
  // Conversions
  converted_calls: number;
  conversion_rate_pct: number;
  // Complaints
  complaint_calls: number;
  complaint_rate_pct: number;
  // Missed / Stockout
  missed_opportunity_calls: number;
  stockout_calls: number;
  stores_attention_count?: number;
  // Quality
  avg_score: number;
  avg_talk_time: string;
  sentiment_breakdown?: {
    Positive: number;
    Neutral: number;
    Negative: number;
  };
  // Optional trend arrays for sparklines
  total_calls_trend?: number[];
  qualified_trend?: number[];
  high_intent_trend?: number[];
  noise_trend?: number[];
}

/**
 * /api/v1/analytics/kpi/audience
 * Audience split (Male/Female/Kids) + top 10 customer personas with conversion %.
 */
export interface AudienceSplitItem {
  audience: string;         // e.g. "Male", "Female", "Kids", "Unknown"
  total_calls: number;      // absolute call count (no pct from API — calculate from total)
  conversions: number;
  conversion_pct: number;
}

export interface AudiencePersonaItem {
  persona: string;
  total_calls: number;      // API uses total_calls, not calls
  conversions: number;
  conversion_pct: number;
}

export interface AudienceResponse {
  audience_split: AudienceSplitItem[];
  top_personas: AudiencePersonaItem[];
}

/**
 * /api/v1/analytics/kpi/voice-quality
 * Average of 5 performance_metrics: tone, efficiency, problem_solving,
 * professionalism, brand_representation.
 */
export interface VoiceQualityResponse {
  tone: number;
  efficiency: number;
  problem_solving: number;
  professionalism: number;
  brand_representation: number;
}

/**
 * /api/v1/analytics/kpi/intent-distribution
 * Count and % for each call_intent. Includes NOISE.
 */
export interface IntentDistributionItem {
  intent: string;
  count:  number;
  pct:    number;
}

/** Wrapper returned by /kpi/intent-distribution: { total, intents: [] } */
export interface IntentDistributionResponse {
  total:   number;
  intents: IntentDistributionItem[];
}

/**
 * /api/v1/analytics/kpi/weekly
 * Qualified vs NOISE per day-of-week (Mon–Sun).
 * Note: uses "noise" instead of "junk" unlike the ops/weekly-volume endpoint.
 */
export interface WeeklyVolumeKpiItem {
  day: string;
  qualified: number;
  noise: number;
  total?: number;
}

/**
 * /api/v1/analytics/kpi/missed-products
 * Top 15 missed articles with demand and stockout count.
 */
export interface MissedProductItem {
  article: string;          // API field is 'article', not 'name'
  missed_count: number;     // API field is 'missed_count', not 'demand_count'
  stockout_count: number;
}

/**
 * /api/v1/analytics/kpi/region
 * North/South/East/West: total, qualified %, conversion %, complaints,
 * missed_opps, store_count.
 */
export interface RegionPerformanceItem {
  region:               string;
  total_calls:          number;
  qualified_calls:      number;
  qualified_pct:        number;
  high_intent:          number;
  conversions?:         number;
  conversion_pct?:      number;  // actual API field
  conversion_rate_pct?: number;  // legacy alias
  complaint_count?:     number;  // actual API field (count)
  complaint_pct?:       number;  // actual API field (%)
  complaint_calls?:     number;  // legacy alias
  complaint_rate_pct?:  number;  // legacy alias
  missed_opportunities?: number;
  missed_opps?:         number;
  noise_calls?:         number;
  store_count?:         number;
}

/**
 * /api/v1/analytics/kpi/stores-attention
 * Stores where conversion < 30% OR CSAT < 75%.
 * Returns same schema as /store/list (StoreListItem).
 */
export type StoresAttentionItem = StoreListItem;

// ─── NLP Reports (Chat-With-Data) API Shapes ────────────────────────────────

/**
 * GET /api/v2/chat-with-data/dashboard
 * All page-load data: suggestion chips, weekly trend, complaints by region, AI insights.
 */
export interface NlpDashboardResponse {
  suggestions: string[];
  weekly_trend: {
    week: string;
    qualified: number;
    noise: number;
    total?: number;
  }[];
  complaints_by_region: {
    region: string;
    count?: number;        // actual API field name
    complaints?: number;   // fallback alias
  }[];
  insights: {
    title?: string;
    insight?: string;      // actual API field: the insight text
    suggestion?: string;   // actual API field: the recommended action
    actionText?: string;
    action_text?: string;
    action?: string;
  }[];
}

/**
 * POST /api/v2/chat-with-data/query
 * Accepts { question, recursion_limit } and returns a markdown report.
 * Field name is normalised defensively since the API response shape is undocumented.
 */
export interface NlpQueryResponse {
  // Actual API field (confirmed from network response)
  report_markdown?: string;
  // Legacy / alternative field names (defensive fallbacks)
  report?:          string;
  result?:          string;
  answer?:          string;
  markdown?:        string;
  output?:          string;
  message?:         string;
  // Metadata fields returned alongside the report
  client?:          string;
  question?:        string;
  table?:           string;
  sql_trace?:       Array<{ tool: string; input?: string; output?: string; [key: string]: unknown }>;
}

/**
 * GET /api/v2/chat-with-data/reports
 * Each row of the Generated Reports table.
 * Defensive optional fields to handle case/naming variation.
 */
export interface NlpReportItem {
  report?:      string;
  name?:        string;
  title?:       string;
  date?:        string;
  created_at?:  string;
  type?:        string;
  category?:    string;
  status?:      string;
}

// ─── Agent Performance v2 API Shapes ────────────────────────────────────────

/**
 * GET /api/v2/analytics/agent/kpi-summary
 * Actual API fields (confirmed from network): active_agents, top_score,
 * top_agent_name, avg_conversion_pct, avg_tone_score
 */
export interface AgentKpiSummaryResponse {
  active_agents?:        number;
  activeAgents?:         number;
  top_score?:            number;
  topScore?:             number;
  top_agent_name?:       string;
  topAgentName?:         string;
  avg_conversion_pct?:   number;
  avgConversionPct?:     number;
  avg_tone_score?:       number;   // actual API field (not avg_tone_score_pct)
  avg_tone_score_pct?:   number;   // camelCase / alias variant
  avgToneScorePct?:      number;
}

/**
 * GET /api/v2/analytics/agent/voice-quality
 * Returns average performance metric scores. Reuses the same field names as
 * the v1 kpi/voice-quality endpoint (tone, efficiency, problem_solving,
 * professionalism, brand_representation).
 */
export interface AgentVoiceQualityResponse {
  tone:                 number;
  efficiency:           number;
  problem_solving:      number;
  professionalism:      number;
  brand_representation: number;
}

/**
 * GET /api/v2/analytics/agent/leaderboard
 * A single row in the agent leaderboard table. Fields are declared with
 * snake_case / camelCase variants so the transformation is non-breaking.
 */
export interface AgentLeaderboardApiItem {
  rank?:           number;
  // Actual API fields (confirmed from network)
  agent_num?:      string;   // phone number used as agent ID e.g. "9926122040"
  qa_score?:       number;   // QA score 0-100
  calls?:          number;   // total calls handled
  // Alternative field names (defensive)
  agent_name?:     string;
  agentName?:      string;
  store_name?:     string;
  storeName?:      string;
  region?:         string;
  qualified_pct?:  number;
  qualifiedPct?:   number;
  conversion_pct?: number;
  conversionPct?:  number;
  tone_pct?:       number;
  tonePct?:        number;
  total_calls?:    number;
  totalCalls?:     number;
}

