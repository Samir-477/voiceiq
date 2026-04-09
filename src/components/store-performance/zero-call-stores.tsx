'use client';

import { PhoneOff } from 'lucide-react';
import { mockZeroCallStores } from '@/app/store-performance/mock-data';

export function ZeroCallStores() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <PhoneOff size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Zero Call Stores — No Activity Detected</h3>
      </div>
      <p className="text-sm text-emerald-600 font-medium mb-5">
        These stores received zero calls in the selected period. This may indicate phone line issues, incorrect routing, or store closures.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockZeroCallStores.map((store, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:border-red-100 hover:bg-red-50/10 transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-1.5 rounded-lg">
                <PhoneOff size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{store.name}</p>
                <p className="text-xs font-medium text-gray-400">{store.location}</p>
              </div>
            </div>
            <span className="shrink-0 ml-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              0 Calls
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
