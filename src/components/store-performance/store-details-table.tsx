'use client';

import { Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockStoreDetails } from '@/app/store-performance/mock-data';
import { useStoreModal } from './store-modal';

export function StoreDetailsTable() {
  const { open, modal } = useStoreModal();

  return (
    <>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Store size={20} className="text-red-500 shrink-0" />
          <h3 className="text-base font-bold text-gray-900">Store Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 font-semibold uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 font-bold">Store</th>
                <th className="px-4 py-4 font-bold">Region</th>
                <th className="px-4 py-4 font-bold">State</th>
                <th className="px-4 py-4 font-bold">City</th>
                <th className="px-4 py-4 font-bold text-right">Total Calls</th>
                <th className="px-4 py-4 font-bold text-right">Qualified</th>
                <th className="px-4 py-4 font-bold text-right">Junk</th>
                <th className="px-4 py-4 font-bold text-right">Avg Handle</th>
                <th className="px-4 py-4 font-bold text-right">Conversion</th>
                <th className="px-4 py-4 font-bold text-right">CSAT</th>
                <th className="px-4 py-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockStoreDetails.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 hover:bg-red-50/30 transition-colors cursor-pointer group"
                  onClick={() => open(row)}
                >
                  <td className="px-4 py-4">
                    <span className="font-bold text-red-500 group-hover:underline">{row.name}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 font-medium">{row.region}</td>
                  <td className="px-4 py-4 text-gray-600 font-medium">{row.state}</td>
                  <td className="px-4 py-4 text-gray-600 font-medium">{row.city}</td>
                  <td className="px-4 py-4 text-right font-bold text-gray-700">{row.totalCalls}</td>
                  <td className="px-4 py-4 text-right font-bold text-emerald-500">{row.qualified}</td>
                  <td className="px-4 py-4 text-right font-bold text-gray-500">{row.junk}</td>
                  <td className="px-4 py-4 text-right font-medium text-gray-600">{row.avgHandle}</td>
                  <td className="px-4 py-4 text-right font-bold text-gray-700">{row.conversion}</td>
                  <td className="px-4 py-4 text-right font-bold text-gray-700">{row.csat}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold',
                      row.status === 'Active' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal}
    </>
  );
}
