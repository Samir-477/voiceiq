import React from 'react';
import { AlertTriangle } from 'lucide-react';

const storesData = [
  { name: 'Varanasi Cantt', location: 'Chennai, Tamil Nadu - South', conv: '19%', junk: 155, csat: '65%' },
  { name: 'Gurgaon Cyber Hub', location: 'Hyderabad, Telangana - South', conv: '22%', junk: 160, csat: '68%' },
  { name: 'Park Street', location: 'Lucknow, Uttar Pradesh - North', conv: '25%', junk: 145, csat: '70%' },
  { name: 'Andheri West', location: 'New Delhi, Delhi NCR - North', conv: '28%', junk: 140, csat: '72%' },
];

export function StoresAttentionList() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Stores Requiring Attention</h2>
      </div>

      <div className="flex flex-col gap-4 mt-auto mb-auto">
        {storesData.map((store) => (
          <div 
            key={store.name} 
            className="flex items-center justify-between w-full p-4 rounded-xl border border-red-100 bg-red-50/50"
          >
            {/* Left side: Store Info */}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-800">{store.name}</span>
              <span className="text-xs font-medium text-gray-400">{store.location}</span>
            </div>

            {/* Right side: Metrics Badges */}
            <div className="flex items-center gap-3">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Conv: {store.conv}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Junk: {store.junk}
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                CSAT: {store.csat}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
