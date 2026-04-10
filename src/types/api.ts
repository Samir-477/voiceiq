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

export interface KPIOverview {
  total_calls: number;
  answered_calls: number;
  missed_calls: number;
  missing_calls_percent: number;
  high_intent_inquiries: number;
  stockout_calls: number;
  new_callers_percent: number;
  ivr_drop_offs: number;
  ivr_drop_offs_percent: number;
  total_calls_trend: number[];
  answered_calls_trend: number[];
  missed_calls_trend: number[];
  high_intent_trend: number[];
  sentiment_trend: {
    Total: number[];
    Positive: number[];
    Neutral: number[];
    Negative: number[];
  };
  ai_insights: string[];
  purpose_of_call_distribution: Record<string, number>;
  product_interest_distribution: Record<string, number>;
  customer_type_distribution: Record<string, number>;
}

export interface KPIStorePerformance {
  active_stores: number;
  avg_calls_per_day_per_store: number;
  top_performers: number;
  zero_call_stores: number;
  active_stores_trend: number[];
  top_performers_trend: number[];
  avg_calls_trend: number[];
  zero_call_stores_trend: number[];
  zero_call_store_list: {
    store_name: string;
    last_call_date: string;
    days_since_last_call: number;
  }[];
  regional_breakdown: {
    region: string;
    count: number;
    percentage: number;
  }[];
  potential_revenue_loss: string;
  recommendations: string[];
}

export interface KPIIssues {
  total_issue_calls: number;
  resolution_rate: number;
  avg_resolution_time: string;
  repeat_issue_rate: number;
  total_issue_calls_trend: number[];
  resolution_rate_trend: number[];
  avg_resolution_time_trend: number[];
  repeat_issue_rate_trend: number[];
}

export interface StoreLeaderboardItem {
  code: string;
  store_name: string;
  brand: string;
  total_calls: number;
  answered_calls: number;
  answered_calls_pct: number;
  missed_calls: number;
  missed_calls_pct: number;
  high_intent_calls: number;
  high_intent_calls_pct: number;
  stockout_calls: number;
  stockout_calls_pct: number;
  avg_per_day: number;
  score: number;
}

export interface RegionalDistributionItem {
  stateName: string;
  cityName: string;
  total_calls: number;
  missed_calls: number;
}

export interface TrendItem {
  date: string;
  total_calls: number;
  missed_calls: number;
}

export interface RecentCallItem {
  call_uuid: string;
  timestamp: string;
  store_name: string;
  summary: string;
  caller_type: string;
  intent: string;
  outcome: string;
  duration: string;
  sentiment: string;
  recording_url: string | null;
  transcript_url: string;
}

export interface CallReviewResponse {
  total: number;
  page: number;
  size: number;
  items: RecentCallItem[];
  total_calls: number;
  missed_calls: number;
}

export interface DashboardFilters {
  stateName?: string;
  cityName?: string;
  gmbStoreCode?: string;
  intent?: string;
  start_date?: string;
  end_date?: string;
  page?: string;
  limit?: string;
  size?: string;
  outcome?: string;
  sentiment?: string;
  search?: string;
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
  dimension: string; // e.g. "greeting", "empathy", "accuracy", "sales_proactiveness"
  converted_avg: number;
  non_converted_avg: number;
  delta: number;
}

/**
 * /api/v1/analytics/store/persona-breakdown
 * Customer personas with call count and conversion rate.
 */
export interface PersonaBreakdownItem {
  persona: string;
  calls: number;
  conversions: number;
  conversion_pct: number;
}

// --- Customer Experience API Shapes ---

/**
 * /api/v1/analytics/cx/summary
 * CX KPI cards: complaint rate %, resolution rate %, negative sentiment %.
 */
export interface CxSummaryResponse {
  complaint_rate_pct: number;
  resolution_rate_pct: number;
  negative_sentiment_pct: number;
  repeat_complaint_count?: number;
  repeat_complaint_pct?: number;
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
  total_calls: number;
  qualified_calls: number;
  qualified_pct: number;
  junk_calls: number;
  junk_pct: number;
  flagged_issues: number;
  weekday_avg: number;
  weekend_avg: number;
  peak_hour: string;
  repeat_callers?: number;
  repeat_callers_pct?: number;
  avg_duration?: string;
  disconnect_rate?: number;
}

/**
 * /api/v1/analytics/ops/weekly-volume
 * Qualified vs NOISE per day-of-week (Mon–Sun).
 */
export interface WeeklyVolumeItem {
  day: string;          // "Mon" | "Tue" | ...
  qualified: number;
  junk: number;
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
 */
export interface GeoCityRow {
  name: string;        // city name (API returns 'name')
  state: string;
  total_calls: number;
  qualified: number;   // API returns 'qualified'
  junk: number;        // API returns 'junk'
  top_demand?: string;
}

/**
 * /api/v1/analytics/ops/geo-breakdown?tab=store
 */
export interface GeoStoreRow {
  name: string;          // store name (API returns 'name')
  city: string;
  state: string;
  total_calls: number;
  qualified: number;     // API returns 'qualified'
  junk: number;          // API returns 'junk'
  conversion_pct: number;
  csat_pct: number;
  status: string;
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
  count: number;
  pct: number;
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
  region: string;
  total_calls: number;
  qualified_calls: number;
  qualified_pct: number;
  high_intent: number;             // high-intent / purchase-intent calls
  conversion_rate_pct?: number;    // same naming pattern as kpi/summary
  conversion_pct?: number;         // fallback if API uses different name
  complaint_calls?: number;        // complaints count
  complaint_rate_pct?: number;     // complaint rate
  noise_calls?: number;
  missed_opps?: number;
  store_count?: number;
}

/**
 * /api/v1/analytics/kpi/stores-attention
 * Stores where conversion < 30% OR CSAT < 75%.
 * Returns same schema as /store/list (StoreListItem).
 */
export type StoresAttentionItem = StoreListItem;

