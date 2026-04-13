'use client';

import { FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneratedReportsTableProps {
  data?: { report: string; date: string; type: string; status: 'Ready' | 'In Progress' }[];
  loading?: boolean;
}

export function GeneratedReportsTable({ data = [], loading }: GeneratedReportsTableProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6 relative">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Generated Reports</h3>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-sm text-gray-400 font-semibold uppercase bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 rounded-tl-lg font-bold">Report</th>
              <th className="px-4 py-4 font-bold text-center">Date</th>
              <th className="px-4 py-4 font-bold text-center">Type</th>
              <th className="px-4 py-4 font-bold text-center">Status</th>
              <th className="px-4 py-4 rounded-tr-lg font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && data.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td colSpan={5} className="px-4 py-5 h-12 bg-gray-50/30 animate-pulse" />
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <tr 
                  key={i} 
                  className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">{row.report}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-bold text-gray-600">{row.date}</td>
                  <td className="px-4 py-5 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-600">
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        row.status === 'Ready' ? "bg-emerald-500" : "bg-amber-500"
                      )} />
                      <span className={cn(
                        "font-bold text-sm",
                        row.status === 'Ready' ? "text-emerald-600" : "text-amber-600"
                      )}>{row.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <button className="flex items-center justify-center gap-1.5 mx-auto text-gray-600 hover:text-gray-900 transition-colors">
                      <Download size={14} />
                      <span className="font-bold text-sm">Export</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                   <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400 italic">
                      No reports generated yet.
                   </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
