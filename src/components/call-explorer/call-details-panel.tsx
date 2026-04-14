'use client';

import type { CallRecord } from './call-list';

export function CallDetailsPanel({ call }: { call: CallRecord }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
      <h2 className="text-[15px] font-bold text-gray-900 mb-4">Call Details</h2>

      <div className="space-y-2.5 mb-5">
        {[
          { label: 'ID',      value: call.id },
          { label: 'Caller',  value: call.caller,  bold: true },
          { label: 'Agent',   value: call.agent,   bold: true },
          { label: 'Branch',  value: call.branch,  bold: true },
          { label: 'Intent',  value: call.intent,  bold: true },
          { label: 'Quality', value: `${call.quality}/100` },
        ].map(({ label, value, bold }) => (
          <div key={label} className="flex gap-2">
            <span className="text-[12px] text-gray-400 w-16 shrink-0">{label}:</span>
            <span className={`text-[12px] ${bold ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[12px] font-bold text-gray-900 mb-1.5">AI Summary</p>
        <p className="text-[12px] text-gray-500 leading-relaxed">{call.summary}</p>
      </div>
    </div>
  );
}
