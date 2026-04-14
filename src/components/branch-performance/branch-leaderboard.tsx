'use client';

import { useState } from 'react';
import { BranchModal, type BranchRecord, type BranchStatusType } from './branch-modal';

const branches: BranchRecord[] = [
  { name: 'Chennai - T.Nagar',       calls: 145, complaints: 8,  auctionAlerts: 3,  fcr: '78%', csat: 4.3, disbursals: 23, status: 'Strong' },
  { name: 'Chennai - Anna Nagar',    calls: 128, complaints: 12, auctionAlerts: 5,  fcr: '72%', csat: 4.0, disbursals: 18, status: 'Average' },
  { name: 'Coimbatore - RS Puram',   calls: 98,  complaints: 15, auctionAlerts: 8,  fcr: '65%', csat: 3.6, disbursals: 12, status: 'Needs Attention' },
  { name: 'Madurai - Main Branch',   calls: 112, complaints: 6,  auctionAlerts: 2,  fcr: '80%', csat: 4.4, disbursals: 20, status: 'Strong' },
  { name: 'Bangalore - Koramangala', calls: 134, complaints: 10, auctionAlerts: 6,  fcr: '70%', csat: 3.8, disbursals: 16, status: 'Average' },
  { name: 'Hyderabad - Ameerpet',    calls: 105, complaints: 18, auctionAlerts: 9,  fcr: '62%', csat: 3.4, disbursals: 10, status: 'Needs Attention' },
  { name: 'Mumbai - Andheri',        calls: 156, complaints: 7,  auctionAlerts: 4,  fcr: '76%', csat: 4.2, disbursals: 25, status: 'Strong' },
  { name: 'Delhi - Karol Bagh',      calls: 92,  complaints: 20, auctionAlerts: 10, fcr: '58%', csat: 3.2, disbursals: 8,  status: 'Critical' },
];

const statusStyles: Record<BranchStatusType, string> = {
  'Strong':          'bg-green-50 text-green-700 border border-green-200',
  'Average':         'bg-amber-50 text-amber-600 border border-amber-200',
  'Needs Attention': 'bg-orange-50 text-orange-600 border border-orange-200',
  'Critical':        'bg-red-50 text-red-600 border border-red-200',
};

const highlightAlert = (val: number) =>
  val >= 9 ? 'text-red-500 font-semibold' : 'text-gray-700';

export function BranchLeaderboard() {
  const [selected, setSelected] = useState<BranchRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-gray-900">Branch Leaderboard</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Branch', 'Calls', 'Complaints', 'Auction Alerts', 'FCR %', 'CSAT', 'Disbursals', 'Status'].map((h) => (
                  <th
                    key={h}
                    className={`py-3 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider ${
                      h === 'Status' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {branches.map((b, i) => (
                <tr
                  key={b.name}
                  onClick={() => setSelected(b)}
                  className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50/60 transition-colors ${
                    i === branches.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 text-[13px] font-semibold text-gray-900">{b.name}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{b.calls}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{b.complaints}</td>
                  <td className={`py-3.5 px-5 text-[13px] ${highlightAlert(b.auctionAlerts)}`}>{b.auctionAlerts}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{b.fcr}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{b.csat}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{b.disbursals}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <BranchModal branch={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
