'use client';

import { BarChart2 } from 'lucide-react';

export function ExecutiveSummary() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex">
        {/* Red left accent bar */}
        <div className="w-1 shrink-0 bg-red-500" />

        <div className="flex-1 px-6 py-5">
          {/* Title */}
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={18} className="text-red-500" />
            <h2 className="text-[15px] font-bold text-gray-900">Executive Summary</h2>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Demand Signal
              </p>
              <p className="text-[13px] text-gray-800 leading-snug">
                <span className="text-red-500 font-semibold">312 loan enquiry calls</span>{' '}
                from 1,284 total
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Revenue at Risk
              </p>
              <p className="text-[13px] text-gray-800 leading-snug">
                <span className="text-red-500 font-semibold">₹12.4L</span> from missed
                follow-ups &amp; defaults
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Top Concern
              </p>
              <p className="text-[13px] text-gray-800 leading-snug">
                Auction alerts up{' '}
                <span className="text-red-500 font-semibold">32%</span> this week
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Action Required
              </p>
              <p className="text-[13px] text-gray-800 leading-snug">
                <span className="text-red-500 font-semibold">47 auction cases</span> need
                immediate attention
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
