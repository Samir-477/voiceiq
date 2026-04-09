import React from 'react';
import { Globe } from 'lucide-react';

const regionData = [
  { region: 'North', totalCalls: '4,200', qualified: 42, purchaseIntent: 5, conversion: 46, revenueRisk: '₹125K', complaint: 17, storesAlert: '2/6', alertUrgent: true },
  { region: 'South', totalCalls: '3,800', qualified: 50, purchaseIntent: 13, conversion: 56, revenueRisk: '₹98K', complaint: 17, storesAlert: '2/9', alertUrgent: true },
  { region: 'East', totalCalls: '3,500', qualified: 33, purchaseIntent: 2, conversion: 65, revenueRisk: '₹115K', complaint: 33, storesAlert: '0/3', alertUrgent: false },
  { region: 'West', totalCalls: '3,200', qualified: 50, purchaseIntent: 5, conversion: 67, revenueRisk: '₹89K', complaint: 43, storesAlert: '0/7', alertUrgent: false },
];

export function RegionPerformanceTable() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)] w-full mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Globe size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Region-Wise Performance</h2>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-4 font-bold text-gray-600 text-sm">Region</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Total Calls</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Qualified %</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Purchase Intent</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Conversion %</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Revenue at Risk</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Complaint %</th>
              <th className="pb-4 font-bold text-gray-600 text-sm xl:text-center">Stores Alert</th>
            </tr>
          </thead>
          <tbody>
            {regionData.map((row, idx) => (
              <tr key={row.region} className={idx !== regionData.length - 1 ? 'border-b border-gray-50' : ''}>
                <td className="py-5 font-bold text-gray-800">{row.region}</td>
                <td className="py-5 font-semibold text-gray-700 xl:text-center">{row.totalCalls}</td>
                
                <td className="py-5 xl:text-center">
                  <div className="flex items-center xl:justify-center gap-3">
                    <div className="h-1.5 w-6 rounded-full bg-red-500"></div>
                    <span className="font-semibold text-gray-600">{row.qualified}%</span>
                  </div>
                </td>

                <td className="py-5 font-bold text-red-500 xl:text-center">{row.purchaseIntent}</td>

                <td className="py-5 xl:text-center">
                  <span className="inline-block bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                    {row.conversion}%
                  </span>
                </td>

                <td className="py-5 font-bold text-red-400 xl:text-center">
                  {row.revenueRisk}
                </td>

                <td className="py-5 xl:text-center">
                  <span className="inline-block bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full">
                    {row.complaint}%
                  </span>
                </td>

                <td className="py-5 xl:text-center">
                  {row.alertUrgent ? (
                    <span className="inline-block bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full">
                      {row.storesAlert}
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-500">{row.storesAlert}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
