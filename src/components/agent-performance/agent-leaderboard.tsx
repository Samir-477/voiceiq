'use client';

import { useState } from 'react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AgentLeaderboardRecord } from '@/types';
import { AgentModal } from './agent-modal';

const PAGE_SIZE = 7;

interface AgentLeaderboardProps {
  data?: AgentLeaderboardRecord[];
  loading?: boolean;
}

export function AgentLeaderboard({ data = [], loading }: AgentLeaderboardProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentLeaderboardRecord | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="flex-1 bg-gray-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Award className="text-red-500" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Agent Leaderboard</h3>
          {data.length > 0 && (
            <span className="ml-auto text-xs text-gray-400 font-medium">
              {data.length} agents
            </span>
          )}
        </div>

        {/* Table */}
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
              {pageData.length > 0 ? (
                pageData.map((agent) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400 italic">
                    No agent records found for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer — only shown when there's more than one page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium">
              Page {safePage} of {totalPages}
              <span className="text-gray-300 mx-2">·</span>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, data.length)} of {data.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === '…' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        safePage === item
                          ? 'bg-red-500 text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </>
  );
}
