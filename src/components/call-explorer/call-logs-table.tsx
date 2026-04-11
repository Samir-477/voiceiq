'use client';

import { PhoneCall } from 'lucide-react';
import { callLogsData } from '@/app/call-explorer/mock-data';
import { useCallModal } from './call-modal';
import type { CallLogItem } from '@/types/api';

interface CallLogsTableProps {
  data: CallLogItem[];
  total?: number;
  loading?: boolean;
}

/** Map a real CallLogItem to the shape the call-modal useCallModal hook expects. */
function toModalRow(item: CallLogItem, idx: number) {
  const safeId    = item.call_uuid || `row-${idx}`;
  const displayId = item.call_uuid
    ? `CALL-${item.call_uuid.replace(/-/g, '').slice(0, 8).toUpperCase()}`
    : `CALL-${String(idx + 1).padStart(5, '0')}`;

  // city has a leading tab character in the API ("\tKolkata") — trim it
  const city  = (item.city  || '').trim();
  const state = (item.state || '').trim();
  // store_name is always "Bata Shoe Store"; show "City, State" as the store identifier
  const storeDisplay = city && state ? `${city}, ${state}` : city || item.store_name;

  return {
    id:        displayId,
    _uuid:     safeId,
    store:     storeDisplay,
    agent:     item.agent_name || '—',
    duration:  item.duration   || '—',
    type:      item.intent     || '—',
    persona:   item.persona    || '—',
    category:  item.product_category || '—',
    sentiment: item.sentiment  || '—',
    converted: item.is_conversion ? 'Yes' : '-',
    recording_url: item.recording_url,
    summary:       item.short_summary,   // real AI summary
    transcript:    undefined,            // not in list API — per-call detail has it
  };
}

export function CallLogsTable({ data, total, loading }: CallLogsTableProps) {
  const { open, modal } = useCallModal();

  // Use real API data when available; fall back to mock
  const rows = data && data.length > 0
    ? data.map((item, idx) => toModalRow(item, idx))
    : callLogsData;

  const displayTotal = total ?? rows.length;

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm mt-6">
        <div className="flex items-center gap-2 p-5 border-b border-black/5">
          <PhoneCall size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-bold text-gray-900">Call Logs</h3>
          {loading && (
            <span className="ml-auto text-xs text-gray-400 animate-pulse">Fetching live data…</span>
          )}
        </div>

        {loading && data.length === 0 ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Call ID</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Store</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Agent</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Duration</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Persona</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Sentiment</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((call, idx) => (
                  <tr
                    key={call.id || `row-${idx}`}
                    onClick={() => open(call)}
                    className="hover:bg-red-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-5 text-sm font-semibold text-red-500 whitespace-nowrap group-hover:underline">
                      {call.id}
                    </td>
                    <td className="py-3 px-5 text-sm font-bold text-gray-800 whitespace-nowrap">{call.store}</td>
                    <td className="py-3 px-5 text-sm text-gray-600 whitespace-nowrap">{call.agent}</td>
                    <td className="py-3 px-5 text-sm text-gray-600 whitespace-nowrap">{call.duration}</td>
                    <td className="py-3 px-5 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                        ${call.type === 'Complaint'
                          ? 'bg-red-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-600'}`}>
                        {call.type}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-sm text-gray-500 whitespace-nowrap">{call.persona}</td>
                    <td className="py-3 px-5 text-sm font-bold text-gray-800 whitespace-nowrap">{call.category}</td>
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border
                        ${call.sentiment === 'Positive' ? 'border-emerald-500 text-emerald-600'
                          : call.sentiment === 'Negative' ? 'border-red-500 text-red-600'
                          : 'border-gray-300 text-gray-600'}`}>
                        {call.sentiment}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center whitespace-nowrap">
                      {call.converted === 'Yes' ? (
                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">Yes</span>
                      ) : (
                        <span className="text-gray-400 font-bold text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-black/5 text-sm font-semibold text-gray-500">
          Showing {rows.length} of {displayTotal} results
        </div>
      </div>

      {modal}
    </>
  );
}
