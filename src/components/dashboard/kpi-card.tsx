'use client';

import type React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  Phone, PhoneIncoming, PhoneMissed, ClipboardCheck, PackageX, Users,
  ShoppingBag, BarChart2, IndianRupee, CheckCircle, AlertTriangle,
  Clock, Repeat, AlertCircle, Store as StoreIcon, PhoneCall, Trophy,
  MessageSquare, Package, Crosshair, XCircle, Ban, ShieldAlert,
} from 'lucide-react';

import type { KpiMetric } from '@/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'phone':           Phone,
  'phone-incoming':  PhoneIncoming,
  'phone-missed':    PhoneMissed,
  'clipboard-check': ClipboardCheck,
  'package-x':       PackageX,
  'users':           Users,
  'shopping-bag':    ShoppingBag,
  'trending-up':     TrendingUp,
  'package':         Package,
  'bar-chart-2':     BarChart2,
  'indian-rupee':    IndianRupee,
  'check-circle':    CheckCircle,
  'alert-triangle':  AlertTriangle,
  'clock':           Clock,
  'repeat':          Repeat,
  'alert-circle':    AlertCircle,
  'store':           StoreIcon,
  'phone-call':      PhoneCall,
  'trophy':          Trophy,
  'message-square':  MessageSquare,
  'crosshair':       Crosshair,
  'x-circle':        XCircle,
  'ban':             Ban,
  'shield-alert':    ShieldAlert,
};

const colorMap: Record<string, { iconBg: string; iconText: string }> = {
  red:    { iconBg: 'bg-red-50',     iconText: 'text-red-500'    },
  green:  { iconBg: 'bg-emerald-50', iconText: 'text-emerald-500' },
  purple: { iconBg: 'bg-violet-50',  iconText: 'text-violet-500' },
  blue:   { iconBg: 'bg-blue-50',    iconText: 'text-blue-500'   },
  orange: { iconBg: 'bg-amber-50',   iconText: 'text-amber-500'  },
  amber:  { iconBg: 'bg-amber-50',   iconText: 'text-amber-500'  },
};

interface KpiCardProps {
  metric: KpiMetric;
  compact?: boolean;
}

export function KpiCard({ metric, compact = false }: KpiCardProps) {
  const Icon   = iconMap[metric.icon] || Phone;
  const colors = colorMap[metric.color] || colorMap.red;

  // Trend label
  const trendPositive = metric.trend > 0;
  const trendNeutral  = metric.trend === 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm overflow-hidden">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500 leading-snug">{metric.label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${colors.iconBg}`}>
          <Icon size={17} className={colors.iconText} />
        </div>
      </div>

      {/* Value */}
      <h3 className={`font-bold text-gray-900 leading-tight mb-2 ${compact ? 'text-xl' : 'text-2xl'}`}>
        {metric.value}
      </h3>

      {/* Trend badge */}
      {!trendNeutral && (
        <div className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
          ${trendPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
          {trendPositive
            ? <TrendingUp size={10} />
            : <TrendingDown size={10} />
          }
          {trendPositive ? '+' : ''}{metric.trend}%
        </div>
      )}
    </div>
  );
}
