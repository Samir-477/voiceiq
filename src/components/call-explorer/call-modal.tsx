'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Phone, User, MapPin, MessageSquare, ShieldCheck,
  Star, TrendingUp, Package, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CallLog {
  id: string;
  store: string;
  agent: string;
  duration: string;
  type: string;
  persona: string;
  category: string;
  sentiment: string;
  converted: string;
}

// ── Seeded PRNG ───────────────────────────────────────────────────────────────
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
function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Static pools ──────────────────────────────────────────────────────────────
const REGIONS   = ['North', 'South', 'East', 'West'];
const DEMANDS   = ['High', 'Medium', 'Low'] as const;
const STOCKS    = ['In Stock', 'Low Stock', 'Out of Stock'] as const;
const PRODUCTS  = [
  'Running Shoes – Size 9', 'White Sneakers – Size 8', 'Sports Sandals – Size 10',
  'Leather Loafers – Size 10', 'Canvas Shoes – Size 7', 'Formal Oxfords – Size 11',
  'Trail Runners – Size 9', 'Slip-On Sneakers – Size 8', 'Basketball Shoes – Size 10',
];
const PHONE_PFX = ['9170', '9820', '9773', '9833', '8765', '9900', '9601'];

const AI_SUMMARIES: Record<string, string> = {
  'Complaint':        'Customer raised a complaint regarding their recent order. Agent acknowledged the issue and initiated a resolution process.',
  'Purchase Intent':  'Customer enquired about product availability and pricing. Agent assisted with recommendations and completed the purchase.',
  'Inquiry':          'Customer called to check product details and store timings. Agent provided accurate information and noted follow-up required.',
  'Junk':             'Call was flagged as non-business related. Agent politely redirected and ended the call within the policy timeframe.',
};

const TRANSCRIPT_TEMPLATES: Record<string, string[][]> = {
  'Complaint': [
    ['Agent',    "Hello, thank you for calling {store}. How can I help you today?"],
    ['Customer', "Hi, I have a complaint about my recent order. It hasn't arrived."],
    ['Agent',    "I'm sorry to hear that. Can you share your order number so I can look into it?"],
    ['Customer', "Sure, it's ORD-4892. I placed it a week ago."],
    ['Agent',    "I've located your order. It looks like there was a dispatch delay. I'll escalate this immediately."],
    ['Customer', "Thank you, I really need it by the weekend."],
  ],
  'Purchase Intent': [
    ['Agent',    "Hello, thank you for calling {store}. How can I help you today?"],
    ['Customer', "Hi, I'm looking for {intent}."],
    ['Agent',    "Sure, let me check that for you. Can you tell me your preferred size or specifications?"],
    ['Customer', "Yes, I need size 9 in any color available."],
    ['Agent',    "I can see we have a few options available. Let me walk you through them."],
    ['Customer', "That would be great, thanks."],
  ],
  'Inquiry': [
    ['Agent',    "Hello, thank you for calling {store}. How can I help?"],
    ['Customer', "Hi, I wanted to enquire about your store timings and available stock."],
    ['Agent',    "Of course! We're open 10 AM to 9 PM daily. What product were you looking for?"],
    ['Customer', "I'm looking for running shoes, size 9."],
    ['Agent',    "We currently have a good selection. I'd recommend visiting or I can reserve a pair for you."],
    ['Customer', "Please reserve one. I'll come in tomorrow."],
  ],
  'Junk': [
    ['Agent',    "Hello, thank you for calling {store}. How can I assist you?"],
    ['Customer', "Uhh... wrong number I think."],
    ['Agent',    "No problem at all! Is there anything else I can help with?"],
    ['Customer', "No, sorry about that."],
  ],
};

// ── Build per-call seeded data ────────────────────────────────────────────────
function buildCallData(call: CallLog) {
  const rng      = seeded(call.id);
  const phone    = `+91 ${PHONE_PFX[rInt(rng, 0, PHONE_PFX.length - 1)]}${rInt(rng, 100000, 999999)}`;
  const region   = REGIONS[rInt(rng, 0, REGIONS.length - 1)];
  const confidence = rInt(rng, 80, 96);

  // Duration as mm:ss for player display
  const [min, secPart] = call.duration.replace('m ', ':').replace('s', '').split(':');
  const playerDuration = `${min}:${secPart.padStart(2, '0')}`;

  // Quality scores
  const overall    = rInt(rng, 75, 92);
  const politeness = rInt(rng, 85, 99);
  const resolution = rInt(rng, 60, 85);
  const compliance = rInt(rng, 78, 95);

  // Products (2–3)
  const numProducts = rInt(rng, 2, 3);
  const usedIdx = new Set<number>();
  const products: { name: string; demand: typeof DEMANDS[number]; stock: typeof STOCKS[number] }[] = [];
  for (let i = 0; i < numProducts; i++) {
    let idx = rInt(rng, 0, PRODUCTS.length - 1);
    while (usedIdx.has(idx)) idx = (idx + 1) % PRODUCTS.length;
    usedIdx.add(idx);
    products.push({
      name:   PRODUCTS[idx],
      demand: pick(rng, DEMANDS),
      stock:  pick(rng, STOCKS),
    });
  }

  // Transcript
  const template = TRANSCRIPT_TEMPLATES[call.type] ?? TRANSCRIPT_TEMPLATES['Inquiry'];
  let ts = 5;
  const transcript = template.map(([speaker, msg]) => {
    const time = `${Math.floor(ts / 60)}:${String(ts % 60).padStart(2, '0')}`;
    ts += rInt(rng, 6, 10);
    return {
      speaker,
      time,
      text: msg
        .replace('{store}', call.store)
        .replace('{intent}', call.type === 'Purchase Intent' ? 'buy some shoes' : call.type.toLowerCase()),
    };
  });

  return { phone, region, confidence, playerDuration, overall, politeness, resolution, compliance, products, transcript };
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const cls = type === 'Complaint'
    ? 'bg-red-500 text-white'
    : 'bg-white border border-gray-200 text-gray-600';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>{type}</span>;
}

function SentimentBadge({ s }: { s: string }) {
  const cls = s === 'Positive' ? 'border-emerald-500 text-emerald-600'
    : s === 'Negative' ? 'border-red-500 text-red-600'
    : 'border-gray-300 text-gray-600';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cls}`}>{s}</span>;
}

function ProgressBar({ label, pct, icon: Icon }: { label: string; pct: number; icon: React.ElementType }) {
  const isAmber = label === 'Resolution' && pct < 70;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className={`text-sm font-bold ${isAmber ? 'text-amber-500' : 'text-emerald-600'}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ['Summary', 'Transcript', 'Quality', 'Products'] as const;
type Tab = typeof TABS[number];

// ── Modal ─────────────────────────────────────────────────────────────────────
interface CallModalProps {
  call: CallLog;
  onClose: () => void;
}

function CallModal({ call, onClose }: CallModalProps) {
  const [tab, setTab]       = useState<Tab>('Summary');
  const [mounted, setMounted] = useState(false);
  const d = buildCallData(call);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Modal header ── */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 shrink-0">
              <Phone size={22} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Call Analysis: {call.id}</h2>
              <p className="text-sm text-gray-500 mt-0.5">Real-time AI processed call details</p>
            </div>
          </div>

          {/* ── Voice Recording card ── */}
          <div className="mt-5 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Voice Recording</span>
              <span className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-xs font-bold">Active Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors">
                <Play size={16} className="text-white fill-white ml-0.5" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-400 shrink-0">0:00</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full w-0 rounded-full bg-red-500" />
                </div>
                <span className="text-xs text-gray-400 shrink-0">{d.playerDuration}</span>
              </div>
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

        {/* ── Scrollable tab content ── */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* ══ SUMMARY ═════════════════════════════════════════════════════ */}
          {tab === 'Summary' && (
            <div className="space-y-4">
              {/* Caller Info + AI Summary */}
              <div className="grid grid-cols-2 gap-4">
                {/* Caller info */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={15} className="text-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Caller Information</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">Customer</p>
                  <p className="text-sm text-gray-600 mb-3">{d.phone}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-200 bg-red-50">
                    <MapPin size={11} className="text-red-500" />
                    <span className="text-xs font-bold text-red-600">{d.region}</span>
                  </span>
                </div>

                {/* AI summary */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={15} className="text-gray-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Executive Summary</span>
                  </div>
                  <p className="text-sm italic text-gray-700 leading-relaxed">
                    &ldquo;{AI_SUMMARIES[call.type] ?? AI_SUMMARIES['Inquiry']}&rdquo;
                  </p>
                </div>
              </div>

              {/* 4 stat cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-2">Type</p>
                  <TypeBadge type={call.type} />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-2">Sentiment</p>
                  <SentimentBadge s={call.sentiment} />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-1">Confidence</p>
                  <p className="text-base font-bold text-gray-900">{d.confidence}%</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-base font-bold text-gray-900">{d.playerDuration}</p>
                </div>
              </div>

              {/* Details card */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Store</p>
                  <p className="text-sm font-bold text-gray-900">{call.store}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Agent</p>
                  <p className="text-sm font-bold text-gray-900">{call.agent}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Intent</p>
                  <p className="text-sm font-bold text-gray-900">{call.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Timestamp</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ TRANSCRIPT ══════════════════════════════════════════════════ */}
          {tab === 'Transcript' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              {d.transcript.map((msg, i) => {
                const isAgent = msg.speaker === 'Agent';
                return (
                  <div key={i} className={cn('flex items-end gap-3', !isAgent && 'flex-row-reverse')}>
                    {/* Avatar */}
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      isAgent ? 'bg-red-500' : 'bg-gray-100'
                    )}>
                      <User size={16} className={isAgent ? 'text-white' : 'text-gray-400'} />
                    </div>

                    {/* Bubble */}
                    <div className={cn('max-w-[72%]', !isAgent && 'items-end flex flex-col')}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">{msg.speaker}</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                      <div className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm text-gray-800 leading-relaxed',
                        isAgent ? 'bg-red-50 rounded-bl-none' : 'bg-gray-100 rounded-br-none'
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ QUALITY ════════════════════════════════════════════════════ */}
          {tab === 'Quality' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck size={18} className="text-red-500" />
                <h3 className="text-sm font-bold text-gray-900">Quality Scorecard</h3>
              </div>
              <ProgressBar label="Overall Quality" pct={d.overall}    icon={Star} />
              <ProgressBar label="Politeness"      pct={d.politeness} icon={User} />
              <ProgressBar label="Resolution"      pct={d.resolution} icon={TrendingUp} />
              <ProgressBar label="Compliance"      pct={d.compliance} icon={ShieldCheck} />
            </div>
          )}

          {/* ══ PRODUCTS ═══════════════════════════════════════════════════ */}
          {tab === 'Products' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-red-500" />
                <h3 className="text-sm font-bold text-gray-900">Mentioned Products</h3>
              </div>
              <div className="space-y-3">
                {d.products.map((p, i) => {
                  const stockCls = p.stock === 'In Stock'
                    ? 'border border-gray-200 text-gray-600'
                    : 'bg-red-500 text-white';
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Demand: {p.demand}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${stockCls}`}>{p.stock}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Exported wrapper (state lives here) ──────────────────────────────────────
export function useCallModal() {
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const open  = (call: CallLog) => setSelectedCall(call);
  const close = ()              => setSelectedCall(null);
  const modal = selectedCall ? <CallModal call={selectedCall} onClose={close} /> : null;
  return { open, modal };
}
