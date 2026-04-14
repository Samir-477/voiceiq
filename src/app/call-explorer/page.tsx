'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { calls, intentOptions, CallList, type CallRecord } from '@/components/call-explorer/call-list';
import { CallDetailsPanel } from '@/components/call-explorer/call-details-panel';
import { CallAiInsights } from '@/components/call-explorer/call-ai-insights';
import { CallModal } from '@/components/call-explorer/call-modal';

export default function CallExplorerPage() {
  const [selected, setSelected] = useState<CallRecord>(calls[0]);
  const [search, setSearch]     = useState('');
  const [intent, setIntent]     = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [playingCall, setPlayingCall]   = useState<CallRecord | null>(null);

  const filtered = useMemo(() => {
    return calls.filter((c) => {
      const matchesIntent = intent === 'All' || c.intent === intent;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.caller.toLowerCase().includes(q) ||
        c.intent.toLowerCase().includes(q);
      return matchesIntent && matchesSearch;
    });
  }, [search, intent]);

  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-2">
        <h1 className="text-[22px] font-bold text-gray-900 leading-tight tracking-tight">
          Call Explorer
        </h1>
        <p className="text-[13px] text-gray-500 font-normal mt-0.5">
          Search and analyze individual call recordings and transcripts
        </p>
      </div>

      <div className="px-8 pb-10 space-y-4 mt-3">

        {/* ── Search + Filter bar ──────────────────────────────────────────── */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by caller, ID, or intent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl outline-none focus:border-red-400 transition-colors shadow-sm"
            />
          </div>

          {/* Intent filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-gray-700 bg-white border border-red-300 rounded-xl shadow-sm hover:border-red-400 transition-colors min-w-[140px] justify-between"
            >
              <span className="truncate max-w-[150px]">{intent}</span>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-xl shadow-xl w-64 overflow-hidden">
                {intentOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setIntent(opt); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                      opt === intent
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Two-column: Call List + Details Panel ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          {/* Left: Call cards */}
          <div>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-[13px] text-gray-400">No calls match your search or filter.</p>
              </div>
            ) : (
              <CallList
                selected={selected}
                onSelect={(call) => setSelected(call)}
                onPlay={(call) => setPlayingCall(call)}
                filteredCalls={filtered}
              />
            )}
          </div>

          {/* Right: Details panel */}
          <CallDetailsPanel call={selected} />
        </div>

        {/* ── AI Insights & Recommended Actions ───────────────────────────── */}
        <CallAiInsights />

      </div>

      {/* Modal */}
      {playingCall && (
        <CallModal call={playingCall} onClose={() => setPlayingCall(null)} />
      )}
    </div>
  );
}
