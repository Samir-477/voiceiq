'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Star, Users, Phone, Mail, Clock, Calendar, Award, Headphones, Globe, TrendingUp, PhoneCall, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import type { AgentLeaderboardRecord } from '@/types';

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function prng(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seeded(id: string) {
  const seed = id.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  return prng(Math.abs(seed));
}
function rInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// ── Static data ──────────────────────────────────────────────────────────────
const RANK_RATING: Record<number, number> = { 1: 5.0, 2: 4.8, 3: 4.7, 4: 4.9 };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const INDIAN_PREFIXES = ['90044','98204','97736','98335','87654','99001','90909','96321','88001'];
const RECENT_CALLS = [
  { intent: 'Buy sneakers',       sentiment: 'Positive', time: '1h ago', duration: '4m 43s', outcome: 'Converted' },
  { intent: 'Return item',        sentiment: 'Neutral',  time: '2h ago', duration: '4m 12s', outcome: 'Follow-up' },
  { intent: 'Check availability', sentiment: 'Negative', time: '3h ago', duration: '2m 50s', outcome: 'Resolved'  },
  { intent: 'Price inquiry',      sentiment: 'Positive', time: '4h ago', duration: '2m 22s', outcome: 'Converted' },
  { intent: 'Size exchange',      sentiment: 'Neutral',  time: '5h ago', duration: '2m 14s', outcome: 'Follow-up' },
];
const SKILL_SCORES = [
  { label: 'Product Knowledge', pct: 85 },
  { label: 'Communication',     pct: 94 },
  { label: 'Upselling',         pct: 88 },
  { label: 'De-escalation',     pct: 89 },
  { label: 'Response Speed',    pct: 84 },
];
const TRAINING_RECS = [
  'Escalation management: Learn to resolve common issues independently.',
  'Monthly refresher: Latest product catalog and seasonal offerings.',
];
const WEEKLY_VOL = [
  { w: 'W1', calls: 22 }, { w: 'W2', calls: 26 }, { w: 'W3', calls: 29 },
  { w: 'W4', calls: 31 }, { w: 'W5', calls: 33 }, { w: 'W6', calls: 35 },
];
const TREND_DATA = [
  { w: 'W1', conversion: 91, complaint: 93 }, { w: 'W2', conversion: 92, complaint: 94 },
  { w: 'W3', conversion: 93, complaint: 94 }, { w: 'W4', conversion: 93, complaint: 95 },
  { w: 'W5', conversion: 94, complaint: 96 }, { w: 'W6', conversion: 94, complaint: 96 },
];

// ── Per-agent seeded data ────────────────────────────────────────────────────
function buildAgentData(agent: AgentLeaderboardRecord) {
  const rng  = seeded(agent.id);
  const n    = parseInt(agent.id, 10);
  const phone = `+91 ${INDIAN_PREFIXES[n % INDIAN_PREFIXES.length]}${rInt(rng, 10000, 99999)}`;
  const joinYear  = rInt(rng, 2019, 2023);
  const joinMonth = MONTHS[rInt(rng, 0, 11)];
  const totalCalls = rInt(rng, 20, 50);
  const convPct    = rInt(rng, 88, 97);
  const handleMin  = rInt(rng, 2, 4);
  const handleSec  = rInt(rng, 0, 59);
  const customers  = rInt(rng, 300, 500);
  // Call type breakdown (strictly descending)
  const pi  = rInt(rng, 9, 13);
  const inq = rInt(rng, 6, 10);
  const cmp = rInt(rng, 3, 7);
  const jnk = rInt(rng, 2, 5);
  // Performance scores
  const qualScore = rInt(rng, 75, 90);
  const convScore = rInt(rng, 88, 97);
  const complH    = rInt(rng, 90, 99);
  const fcr       = rInt(rng, 88, 96);
  const escRate   = rInt(rng, 10, 20);

  return {
    phone, joinMonth, joinYear, totalCalls, convPct,
    handleTime: `${handleMin}m ${handleSec}s`, customers,
    specialization: n % 2 !== 0 ? 'Returns & Exchanges' : 'Product Recommendation',
    callBreakdown: [
      { type: 'Purchase Intent', count: pi  },
      { type: 'Inquiry',         count: inq },
      { type: 'Complaint',       count: cmp },
      { type: 'Junk',            count: jnk },
    ],
    perfScores: [
      { label: 'Qualified Score',        pct: qualScore, color: '#ef4444' },
      { label: 'Conversion Score',       pct: convScore, color: '#ef4444' },
      { label: 'Complaint Handling',     pct: complH,    color: '#ef4444' },
      { label: 'First Call Resolution',  pct: fcr,       color: '#ef4444' },
      { label: 'Escalation Rate',        pct: escRate,   color: '#f59e0b' },
    ],
  };
}

// ── Star rating renderer ────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  const full  = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < full ? 'text-amber-400 fill-amber-400' : hasHalf && i === full ? 'text-amber-400 fill-amber-200' : 'text-gray-200 fill-gray-200'}
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
        <span className={`text-sm font-bold ${color === '#f59e0b' ? 'text-amber-500' : 'text-emerald-600'}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Sentiment badge ──────────────────────────────────────────────────────────
function SentimentBadge({ s }: { s: string }) {
  const cls = s === 'Positive' ? 'bg-red-500 text-white' :
              s === 'Negative' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{s}</span>;
}

// ── Outcome badge ────────────────────────────────────────────────────────────
function OutcomeBadge({ o }: { o: string }) {
  if (o === 'Converted') return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">{o}</span>;
  return <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 text-gray-600">{o}</span>;
}

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Profile', 'Analytics', 'Recent Calls', 'Skills', 'Trends'] as const;
type Tab = typeof TABS[number];

// ── Main modal ───────────────────────────────────────────────────────────────
interface AgentModalProps {
  agent: AgentLeaderboardRecord;
  onClose: () => void;
}

export function AgentModal({ agent, onClose }: AgentModalProps) {
  const [tab, setTab] = useState<Tab>('Profile');
  const d = buildAgentData(agent);
  const n = parseInt(agent.id, 10);
  const rating = RANK_RATING[agent.rank] ?? 4.5;

  const [isMounted, setIsMounted] = useState(false);

  // Close on Escape
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
                <h2 className="text-xl font-bold text-gray-900">{agent.agentName}</h2>
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
              <StarRating rating={rating} />
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
              {/* Details card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Agent Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agent ID</p>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">AGT-00{n}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">agent.{n}@voiceiq.com</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shift</p>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">Morning (9 AM – 5 PM)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.joinMonth} {d.joinYear}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Certification</p>
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-gray-400" />
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">Intermediate</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-50 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Specialization</p>
                    <div className="flex items-center gap-2">
                      <Headphones size={14} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.specialization}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Languages</p>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400" />
                      {['Hindi','English','Tamil'].map(l => (
                        <span key={l} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-stat row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: PhoneCall, label: 'Total Calls', value: String(d.totalCalls) },
                  { icon: TrendingUp, label: 'Conversion',  value: `${d.convPct}%` },
                  { icon: Clock,      label: 'Avg Handle',  value: d.handleTime },
                  { icon: Users,      label: 'Customers',   value: String(d.customers) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                    <Icon size={18} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[11px] text-gray-500 mb-1">{label}</p>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ═════════════════════════════════════════════════════ */}
          {tab === 'Analytics' && (
            <div className="space-y-4">
              {/* Call Type Breakdown */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Call Type Breakdown</h3>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.callBreakdown} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }}
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                      />
                      <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Scores */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Performance Scores</h3>
                </div>
                {d.perfScores.map(s => (
                  <ProgressBar key={s.label} label={s.label} pct={s.pct} color={s.color} />
                ))}
              </div>
            </div>
          )}

          {/* ══ RECENT CALLS ══════════════════════════════════════════════════ */}
          {tab === 'Recent Calls' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Phone size={18} className="text-red-500" />
                <h3 className="text-sm font-bold text-gray-900">Recent Calls</h3>
              </div>
              <div className="space-y-3">
                {RECENT_CALLS.map((c, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{c.intent}</span>
                        <SentimentBadge s={c.sentiment} />
                      </div>
                      <span className="text-xs text-gray-400">{c.time} • {c.duration}</span>
                    </div>
                    <OutcomeBadge o={c.outcome} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SKILLS ════════════════════════════════════════════════════════ */}
          {tab === 'Skills' && (
            <div className="space-y-4">
              {/* Skill Assessment */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Skill Assessment</h3>
                </div>
                {SKILL_SCORES.map(s => (
                  <ProgressBar key={s.label} label={s.label} pct={s.pct} />
                ))}
              </div>

              {/* Training Recommendations */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Training Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {TRAINING_RECS.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-100">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ TRENDS ════════════════════════════════════════════════════════ */}
          {tab === 'Trends' && (
            <div className="space-y-4">
              {/* Weekly Call Volume */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Weekly Call Volume</h3>
                </div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WEEKLY_VOL} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 40]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      <Bar dataKey="calls" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion & Complaint Trend */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Conversion &amp; Complaint Trend</h3>
                </div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[80, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} />
                      <Line type="monotone" dataKey="complaint"  stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="conversion" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
