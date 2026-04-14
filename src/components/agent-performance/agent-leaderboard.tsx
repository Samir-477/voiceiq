'use client';

import { useState } from 'react';
import { AgentModal, type AgentRecord, type AgentStatusType } from './agent-modal';

const agents: AgentRecord[] = [
  { name: 'Priya Sharma',  calls: 89, fcr: '82%', csat: 4.5, avgHandle: '3m 50s', sentiment: '78%', status: 'Top Performer' },
  { name: 'Rajesh Kumar',  calls: 76, fcr: '75%', csat: 4.2, avgHandle: '4m 10s', sentiment: '72%', status: 'Good' },
  { name: 'Anita Verma',   calls: 82, fcr: '68%', csat: 3.9, avgHandle: '5m 20s', sentiment: '65%', status: 'Needs Coaching' },
  { name: 'Suresh Nair',   calls: 71, fcr: '78%', csat: 4.3, avgHandle: '4m 00s', sentiment: '74%', status: 'Good' },
  { name: 'Deepa Menon',   calls: 65, fcr: '85%', csat: 4.6, avgHandle: '3m 40s', sentiment: '80%', status: 'Top Performer' },
  { name: 'Vikram Singh',  calls: 58, fcr: '60%', csat: 3.5, avgHandle: '6m 15s', sentiment: '55%', status: 'Needs Coaching' },
  { name: 'Kavitha Rajan', calls: 73, fcr: '72%', csat: 4.0, avgHandle: '4m 30s', sentiment: '68%', status: 'Good' },
  { name: 'Arun Prasad',   calls: 68, fcr: '70%', csat: 3.8, avgHandle: '5m 00s', sentiment: '62%', status: 'Average' },
];

const statusStyles: Record<AgentStatusType, string> = {
  'Top Performer':  'bg-green-50 text-green-700 border border-green-200',
  'Good':           'bg-blue-50 text-blue-600 border border-blue-200',
  'Needs Coaching': 'bg-red-50 text-red-600 border border-red-200',
  'Average':        'bg-gray-100 text-gray-500 border border-gray-200',
};

export function AgentLeaderboard() {
  const [selected, setSelected] = useState<AgentRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-gray-900">Agent Leaderboard</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Agent', 'Calls', 'FCR %', 'CSAT', 'Avg Handle Time', 'Sentiment %', 'Status'].map((h) => (
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
              {agents.map((agent, i) => (
                <tr
                  key={agent.name}
                  onClick={() => setSelected(agent)}
                  className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50/60 transition-colors ${
                    i === agents.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 text-[13px] font-semibold text-gray-900">{agent.name}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{agent.calls}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{agent.fcr}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{agent.csat}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{agent.avgHandle}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{agent.sentiment}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[agent.status]}`}>
                      {agent.status}
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
        <AgentModal agent={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
