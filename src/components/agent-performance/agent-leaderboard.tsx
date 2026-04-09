'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import type { AgentLeaderboardRecord } from '@/types';
import { AgentModal } from './agent-modal';

interface AgentLeaderboardProps {
  data: AgentLeaderboardRecord[];
}

export function AgentLeaderboard({ data }: AgentLeaderboardProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentLeaderboardRecord | null>(null);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Award className="text-red-500" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Agent Leaderboard</h3>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50 uppercase border-b border-gray-100">
              <tr>
                <th scope="col" className="px-4 py-4 font-semibold text-center w-16">#</th>
                <th scope="col" className="px-4 py-4 font-semibold">Agent</th>
                <th scope="col" className="px-4 py-4 font-semibold">Store</th>
                <th scope="col" className="px-4 py-4 font-semibold">Region</th>
                <th scope="col" className="px-4 py-4 font-semibold text-center">Qualified</th>
                <th scope="col" className="px-4 py-4 font-semibold text-center">Conversion</th>
                <th scope="col" className="px-4 py-4 font-semibold text-center">Tone</th>
                <th scope="col" className="px-4 py-4 font-semibold text-center">Calls</th>
              </tr>
            </thead>
            <tbody>
              {data.map((agent) => (
                <tr
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="border-b border-gray-50 hover:bg-red-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      agent.rank <= 3 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {agent.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {agent.agentName}
                  </td>
                  <td className="px-4 py-4 text-gray-600">{agent.storeName}</td>
                  <td className="px-4 py-4 text-gray-600">{agent.region}</td>
                  <td className="px-4 py-4 text-center font-medium text-gray-900">{agent.qualifiedPct}</td>
                  <td className="px-4 py-4 text-center font-medium text-gray-900">{agent.conversionPct}%</td>
                  <td className="px-4 py-4 text-center font-medium text-emerald-500">{agent.tonePct}%</td>
                  <td className="px-4 py-4 text-center font-medium text-gray-900">{agent.totalCalls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </>
  );
}
