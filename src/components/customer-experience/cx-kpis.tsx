import type React from 'react';
import {
  Phone, ShieldCheck, AlertTriangle, Heart, TrendingDown,
} from 'lucide-react';
import type { CxSummaryResponse } from '@/types/api';

interface CxKpisProps {
  data: CxSummaryResponse | null;
  loading?: boolean;
}

interface KpiCard {
  id:         string;
  label:      string;
  primary:    string;   // large headline number
  secondary:  string;   // smaller data point shown below primary
  Icon:       React.ComponentType<{ size?: number; className?: string }>;
}

function buildCards(d: CxSummaryResponse): KpiCard[] {
  const totalCalls = Number(d.total_calls)              || 0;
  const qualCalls  = Number(d.qualified_calls)          || 0;
  const complCalls = Number(d.complaint_calls)          || 0;
  const complPct   = Number(d.complaint_rate_pct)       || 0;
  const resPct     = Number(d.resolution_rate_pct)      || 0;
  const resCount   = Number(d.resolved_complaints)      || 0;
  const negCalls   = Number(d.negative_sentiment_calls) || 0;
  const negPct     = Number(d.negative_sentiment_pct)   || 0;

  const qualPct = totalCalls > 0
    ? ((qualCalls / totalCalls) * 100).toFixed(1)
    : '0.0';

  return [
    {
      id:        'total-calls',
      label:     'Total Calls',
      primary:   totalCalls.toLocaleString(),
      secondary: `${qualCalls.toLocaleString()} qualified`,
      Icon:      Phone,
    },
    {
      id:        'qualified-calls',
      label:     'Qualified Calls',
      primary:   qualCalls.toLocaleString(),
      secondary: `${qualPct}% of total calls`,
      Icon:      ShieldCheck,
    },
    {
      id:        'complaint-rate',
      label:     'Complaint Rate',
      primary:   `${complPct.toFixed(1)}%`,
      secondary: `${complCalls} complaint calls`,
      Icon:      AlertTriangle,
    },
    {
      id:        'resolution-rate',
      label:     'Resolution Rate',
      primary:   `${resPct.toFixed(1)}%`,
      secondary: `${resCount} complaints resolved`,
      Icon:      Heart,
    },
    {
      id:        'negative-sentiment',
      label:     'Negative Sentiment',
      primary:   `${negPct.toFixed(1)}%`,
      secondary: `${negCalls} negative calls`,
      Icon:      TrendingDown,
    },
  ];
}

export function CxKpis({ data, loading }: CxKpisProps) {
  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm h-[120px] animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = data ? buildCards(data) : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
        >
          {/* Label + icon */}
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-gray-500 leading-tight">{card.label}</span>
            <div className="p-1.5 rounded-lg bg-red-50 border border-red-100 shrink-0 ml-2">
              <card.Icon size={14} className="text-red-500" />
            </div>
          </div>

          {/* Primary headline */}
          <p className="text-2xl font-bold text-gray-900 leading-none">{card.primary}</p>

          {/* Secondary — real calculated data, no hardcoding */}
          <p className="text-xs font-semibold text-gray-400 leading-tight">{card.secondary}</p>
        </div>
      ))}
    </div>
  );
}
