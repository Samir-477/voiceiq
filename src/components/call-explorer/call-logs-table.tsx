'use client';

import { PhoneCall } from 'lucide-react';
import { callLogsData } from '@/app/call-explorer/mock-data';
import { useCallModal } from './call-modal';

export function CallLogsTable() {
  const { open, modal } = useCallModal();

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm mt-6">
        <div className="flex items-center gap-2 p-5 border-b border-black/5">
          <PhoneCall size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-bold text-gray-900">Call Logs</h3>
        </div>

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
              {callLogsData.map((call) => (
                <tr
                  key={call.id}
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

        <div className="p-4 border-t border-black/5 text-sm font-semibold text-gray-500">
          Showing {callLogsData.length} of 50 results
        </div>
      </div>

      {modal}
    </>
  );
}
