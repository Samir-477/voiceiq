import { cxKpis } from '@/app/customer-experience/mock-data';
import { AlertTriangle, Heart, RefreshCcw, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  'alert-triangle': AlertTriangle,
  'heart': Heart,
  'refresh-ccw': RefreshCcw,
  'trending-down': TrendingDown,
};

export function CxKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
      {cxKpis.map((kpi) => {
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
