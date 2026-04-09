import { explorerKpis } from '@/app/call-explorer/mock-data';
import { Phone, CheckCircle, XCircle, Clock, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  'phone': Phone,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'clock': Clock,
  'shopping-cart': ShoppingCart,
};

export function ExplorerKpis() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-6">
      {explorerKpis.map((kpi) => {
        const Icon = iconMap[kpi.icon] || Phone;
        return (
          <div key={kpi.id} className="bg-white rounded-xl p-4 border border-black/5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">{kpi.label}</span>
              <div className={cn("p-1.5 rounded-lg flex items-center justify-center", kpi.iconColor)}>
                <Icon size={14} strokeWidth={2.5} />
              </div>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{kpi.value}</p>
              <p className={cn("text-xs font-bold mt-1.5", kpi.subLabelColor || "text-gray-400")}>
                {kpi.subLabel}
              </p>
            </div>
            {/* Soft decorative border top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
