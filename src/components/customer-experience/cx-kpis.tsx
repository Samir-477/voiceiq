import { cxKpis } from '@/app/customer-experience/mock-data';
import { AlertTriangle, Heart, RefreshCcw, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CxSummaryResponse } from '@/types/api';

// --- MOCK DATA (remove after API verified) ---
// const cxKpis = [
//   { id: 'complaint-rate', label: 'Complaint Rate', value: '8.2%', ... },
//   { id: 'resolution-rate', label: 'Resolution Rate', value: '91%', ... },
//   { id: 'repeat-complaints', label: 'Repeat Complaints', value: '124', ... },
//   { id: 'negative-sentiment', label: 'Negative Sentiment', value: '18%', ... },
// ];

const iconMap: Record<string, any> = {
  'alert-triangle': AlertTriangle,
  'heart': Heart,
  'refresh-ccw': RefreshCcw,
  'trending-down': TrendingDown,
};

interface CxKpisProps {
  data: CxSummaryResponse | null;
  loading?: boolean;
}

/** Normalise real API response into the display shape the cards expect. */
function buildKpiCards(data: CxSummaryResponse) {
  const complaintRate   = Number(data.complaint_rate_pct)   || 0;
  const resolutionRate  = Number(data.resolution_rate_pct)  || 0;
  const negativeSentiment = Number(data.negative_sentiment_pct) || 0;
  const repeatCount     = Number(data.repeat_complaint_count) || 0;
  const repeatPct       = Number(data.repeat_complaint_pct)  || 0;

  return [
    {
      id: 'complaint-rate',
      label: 'Complaint Rate',
      value: `${complaintRate.toFixed(1)}%`,
      subLabel: 'from total calls',
      subLabelColor: complaintRate < 10 ? 'text-emerald-500' : 'text-red-500',
      icon: 'alert-triangle',
      iconColor: 'bg-red-50 text-red-500',
      iconStroke: 'text-red-500',
    },
    {
      id: 'resolution-rate',
      label: 'Resolution Rate',
      value: `${resolutionRate.toFixed(1)}%`,
      subLabel: 'calls resolved',
      subLabelColor: resolutionRate >= 80 ? 'text-emerald-500' : 'text-amber-500',
      icon: 'heart',
      iconColor: 'bg-red-50 text-red-500',
      iconStroke: 'text-red-500',
    },
    {
      id: 'repeat-complaints',
      label: 'Repeat Complaints',
      value: repeatCount > 0 ? String(repeatCount) : `${repeatPct.toFixed(0)}%`,
      subLabel: repeatCount > 0 ? `${repeatPct.toFixed(0)}% of total` : 'of total complaints',
      subLabelColor: 'text-red-500',
      icon: 'refresh-ccw',
      iconColor: 'bg-red-50 text-red-500',
      iconStroke: 'text-red-500',
    },
    {
      id: 'negative-sentiment',
      label: 'Negative Sentiment',
      value: `${negativeSentiment.toFixed(1)}%`,
      subLabel: negativeSentiment < 20 ? '↓ improving' : '↑ needs attention',
      subLabelColor: negativeSentiment < 20 ? 'text-emerald-500' : 'text-red-500',
      icon: 'trending-down',
      iconColor: 'bg-red-50 text-red-500',
      iconStroke: 'text-red-500',
    },
  ];
}

export function CxKpis({ data, loading }: CxKpisProps) {
  // Use real API data when available, otherwise fall back to mock
  const cards = data ? buildKpiCards(data) : cxKpis;

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-black/5 shadow-sm h-[100px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
      {cards.map((kpi) => {
        const Icon = iconMap[kpi.icon] || Heart;
        return (
          <div key={kpi.id} className="bg-white rounded-xl p-5 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">{kpi.label}</span>
              <div className={cn("p-1.5 rounded-lg flex items-center justify-center border border-red-100", kpi.iconColor)}>
                <Icon size={16} strokeWidth={2} className={kpi.iconStroke} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1.5">{kpi.value}</p>
              <p className={cn("text-xs font-bold mt-2", kpi.subLabelColor || "text-gray-400")}>
                {kpi.subLabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
