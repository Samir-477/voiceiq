import type React from 'react';
import { explorerKpis } from '@/app/call-explorer/mock-data';
import { Phone, CheckCircle, XCircle, Clock, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CallExplorerSummary } from '@/types/api';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'phone':         Phone,
  'check-circle':  CheckCircle,
  'x-circle':      XCircle,
  'clock':         Clock,
  'shopping-cart': ShoppingCart,
};

interface ExplorerKpisProps {
  data: CallExplorerSummary | null;
  loading?: boolean;
}

export function ExplorerKpis({ data, loading }: ExplorerKpisProps) {
  // Skeleton while loading
  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-black/5 shadow-sm h-[90px] animate-pulse" />
        ))}
      </div>
    );
  }

  // Build cards from real API data when available
  const cards = data
    ? [
        {
          id: 'total-calls',
          label: 'Total Calls',
          value: Number(data.total_calls).toLocaleString(),
          subLabel: 'Filtered results',
          icon: 'phone',
          iconColor: 'bg-red-50 text-red-500',
        },
        {
          id: 'qualified',
          label: 'Qualified',
          value: Number(data.qualified).toLocaleString(),
          subLabel: `${(Number(data.qualified_pct) || 0).toFixed(1)}%`,
          subLabelColor: 'text-emerald-500',
          icon: 'check-circle',
          iconColor: 'bg-red-50 text-red-500',
        },
        {
          id: 'junk',
          label: 'Junk',
          value: Number(data.junk).toLocaleString(),
          subLabel: `${(Number(data.junk_pct) || 0).toFixed(1)}%`,
          subLabelColor: 'text-red-500',
          icon: 'x-circle',
          iconColor: 'bg-red-50 text-red-500',
        },
        {
          id: 'avg-duration',
          label: 'Avg Duration',
          value: data.avg_duration || '—',
          subLabel: 'Per call',
          icon: 'clock',
          iconColor: 'bg-red-50 text-red-500',
        },
        {
          id: 'purchase-intent',
          label: 'Purchase Intent',
          value: `${(Number(data.purchase_intent_pct) || 0).toFixed(1)}%`,
          subLabel: `${Number(data.purchase_intent_count) || 0} calls`,
          subLabelColor: 'text-emerald-500',
          icon: 'shopping-cart',
          iconColor: 'bg-red-50 text-red-500',
        },
        {
          id: 'avg-ai-confidence',
          label: 'Avg AI Confidence',
          value: `${(Number(data.avg_ai_confidence_pct) || 0).toFixed(1)}%`,
          subLabel: 'Classification',
          subLabelColor: 'text-emerald-500',
          icon: 'check-circle',
          iconColor: 'bg-red-50 text-red-500',
        },
      ]
    : explorerKpis;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-6">
      {cards.map((kpi) => {
        const Icon = iconMap[kpi.icon] || Phone;
        return (
          <div key={kpi.id} className="bg-white rounded-xl p-4 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">{kpi.label}</span>
              <div className={cn('p-1.5 rounded-lg flex items-center justify-center', kpi.iconColor)}>
                <Icon size={14} strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{kpi.value}</p>
              <p className={cn('text-xs font-bold mt-1.5', (kpi as { subLabelColor?: string }).subLabelColor || 'text-gray-400')}>
                {kpi.subLabel}
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
