'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Star, Users, Phone, Award, Globe, TrendingUp, PhoneCall, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import type { AgentLeaderboardRecord } from '@/types';

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const full     = Math.floor(rating);
  const hasHalf  = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={
            i < full
              ? 'text-amber-400 fill-amber-400'
              : hasHalf && i === full
              ? 'text-amber-400 fill-amber-200'
              : 'text-gray-200 fill-gray-200'
          }
        />
      ))}
      <span className="ml-1.5 text-sm font-bold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ label, pct, color = '#ef4444' }: { label: string; pct: number; color?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-emerald-600">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = ['Profile', 'Analytics'] as const;
type Tab = typeof TABS[number];

// ── Main modal ────────────────────────────────────────────────────────────────
interface AgentModalProps {
  agent:   AgentLeaderboardRecord;
  onClose: () => void;
}

export function AgentModal({ agent, onClose }: AgentModalProps) {
  const [tab, setTab] = useState<Tab>('Profile');

  // QA score → 3.5–5.0 star range for UX (75 = 3.5★, 100 = 5.0★)
  const ratingDisplay = parseFloat(
    Math.min(5, Math.max(1, 3.5 + (agent.qaScore - 75) / 50)).toFixed(1)
  );

  const [isMounted, setIsMounted] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    setIsMounted(true);
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start justify-between pr-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <Users size={22} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-mono">{agent.agentNum}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{agent.storeName} • {agent.region} Region</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full mb-1.5">
                Rank #{agent.rank}
              </span>
              <StarRating rating={ratingDisplay} />
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 mt-5 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content (scrollable) ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* ══ PROFILE ══════════════════════════════════════════════════════ */}
          {tab === 'Profile' && (
            <div className="space-y-4">

              {/* Agent Details — real API data */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Users size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Agent Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agent Number</p>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800 font-mono">{agent.agentNum}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Store</p>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{agent.storeName}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Region</p>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{agent.region}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rank</p>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-gray-400" />
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-xs font-bold text-red-600">
                        #{agent.rank}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-stat row — 100% real API values */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: PhoneCall,  label: 'Total Calls', value: String(agent.totalCalls)    },
                  { icon: TrendingUp, label: 'Conversion',  value: `${agent.conversionPct}%`   },
                  { icon: Target,     label: 'QA Score',    value: `${agent.qaScore}%`          },
                  { icon: Award,      label: 'Tone',        value: `${agent.tonePct}%`          },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                    <Icon size={18} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[11px] text-gray-500 mb-1">{label}</p>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* Score progress bars */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Performance Scores</h3>
                </div>
                <ProgressBar label="QA Score"        pct={agent.qaScore}       color="#ef4444" />
                <ProgressBar label="Conversion Rate" pct={agent.conversionPct} color="#ef4444" />
                <ProgressBar label="Tone Score"      pct={agent.tonePct}       color="#10b981" />
              </div>

            </div>
          )}

          {/* ══ ANALYTICS ═══════════════════════════════════════════════════ */}
          {tab === 'Analytics' && (
            <div className="space-y-4">

              {/* Bar chart — real scores */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Performance Breakdown</h3>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { label: 'QA Score',   value: agent.qaScore       },
                        { label: 'Conversion', value: agent.conversionPct },
                        { label: 'Tone',       value: agent.tonePct       },
                        { label: 'Calls',      value: agent.totalCalls    },
                      ]}
                      barSize={48}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }}
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                        formatter={(v) => [v, '']}
                      />
                      <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed score bars */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Score Details</h3>
                </div>
                <ProgressBar label="QA Score"        pct={agent.qaScore}       color="#ef4444" />
                <ProgressBar label="Conversion Rate" pct={agent.conversionPct} color="#ef4444" />
                <ProgressBar label="Tone Score"      pct={agent.tonePct}       color="#10b981" />
              </div>

            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
