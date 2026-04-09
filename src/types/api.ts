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
