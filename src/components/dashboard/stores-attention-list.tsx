'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { StoreListItem } from '@/types/api';

interface StoresAttentionListProps {
  data: StoreListItem[];
  loading?: boolean;
}

export function StoresAttentionList({ data, loading }: StoresAttentionListProps) {
  const stores =
    data && data.length > 0
      ? data.slice(0, 6).map((s) => {
          const city     = (s.city || '').trim();
          const location = [city, s.state, s.region].filter(Boolean).join(' · ');
          // API uses 'junk' in stores-attention endpoint; fall back to junk_calls for store/list
          const junkVal  = s.junk ?? s.junk_calls ?? 0;
          return {
            name:     s.store_name + (s.store_code ? ` #${s.store_code}` : ''),
            location,
            conv:     `${Math.round(Number(s.conversion_pct) || 0)}%`,
            junk:     Number(junkVal) || 0,
            csat:     `${Math.round(Number(s.csat_pct) || 0)}%`,
          };
        })
      : [
          { name: 'Varanasi Cantt',    location: 'Chennai, Tamil Nadu · South',    conv: '19%', junk: 155, csat: '65%' },
          { name: 'Gurgaon Cyber Hub', location: 'Hyderabad, Telangana · South',   conv: '22%', junk: 160, csat: '68%' },
          { name: 'Park Street',       location: 'Lucknow, Uttar Pradesh · North', conv: '25%', junk: 145, csat: '70%' },
          { name: 'Andheri West',      location: 'New Delhi, Delhi NCR · North',   conv: '28%', junk: 140, csat: '72%' },
        ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] h-full w-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Stores Requiring Attention</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      {loading && data.length === 0 ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-auto mb-auto">
          {stores.map((store, idx) => (
            <div
              key={`${store.name}-${idx}`}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-red-100 bg-red-50/50"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-gray-800">{store.name}</span>
                <span className="text-xs font-medium text-gray-400">{store.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Conv: {store.conv}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Junk: {store.junk.toLocaleString()}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  CSAT: {store.csat}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
