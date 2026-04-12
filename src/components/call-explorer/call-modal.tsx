'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Phone, User, MapPin, MessageSquare, ShieldCheck,
  Star, TrendingUp, Package, Play, Clock, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CallLog {
  id:            string;
  _uuid?:        string;
  // Location
  store:         string;      // "City, State" display string
  location?:     string;      // same as store
  storeCode?:    string;      // e.g. "9423"
  region?:       string;      // North / South / East / West
  // Agent
  agent:         string;
  // Call details
  duration:      string;
  type:          string;      // intent
  persona?:      string;
  category?:     string;
  sentiment:     string;
  converted:     boolean | string;
  timestamp?:    string;
  // API summary & media
  summary?:      string;      // short_summary from API
  recording_url?: string;
  transcript?:   undefined;
}

// ── Seeded PRNG (for Quality + Products tabs which have no API data) ──────────
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
  const safeId = id || 'default-seed';
  const seed = safeId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  return prng(Math.abs(seed));
}
function rInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Static pools ──────────────────────────────────────────────────────────────
const DEMANDS  = ['High', 'Medium', 'Low'] as const;
const STOCKS   = ['In Stock', 'Low Stock', 'Out of Stock'] as const;
const PRODUCTS = [
  'Running Shoes – Size 9', 'White Sneakers – Size 8', 'Sports Sandals – Size 10',
  'Leather Loafers – Size 10', 'Canvas Shoes – Size 7', 'Formal Oxfords – Size 11',
  'Trail Runners – Size 9', 'Slip-On Sneakers – Size 8', 'Basketball Shoes – Size 10',
];
const PHONE_PFX = ['9170', '9820', '9773', '9833', '8765', '9900', '9601'];

// ── Transcript templates keyed by intent type ─────────────────────────────────
const TRANSCRIPT_TEMPLATES: Record<string, string[][]> = {
  'Complaint': [
    ['Agent',    "Hello, thank you for calling {store}. How can I help you today?"],
    ['Customer', "Hi, I have a complaint about my recent order. It hasn't arrived."],
    ['Agent',    "I'm sorry to hear that. Can you share your order number so I can look into it?"],
    ['Customer', "Sure, it's ORD-4892. I placed it a week ago."],
    ['Agent',    "I've located your order. It looks like there was a dispatch delay. I'll escalate this immediately."],
    ['Customer', "Thank you, I really need it by the weekend."],
  ],
  'Stock Availability': [
    ['Agent',    "Hello, thank you for calling Bata. How can I help you today?"],
    ['Customer', "Hi, I wanted to check if you have a specific shoe in stock."],
    ['Agent',    "Of course! Could you tell me the model and size you're looking for?"],
    ['Customer', "I need Running Shoes in size 9, preferably in black."],
    ['Agent',    "Let me check that for you right now."],
    ['Customer', "Great, thank you."],
  ],
  'Exchange/Return': [
    ['Agent',    "Hello, thank you for calling {store}. How can I assist you?"],
    ['Customer', "Hi, I bought a pair of shoes last week and I'd like to return them."],
    ['Agent',    "I can help with that. Could you share your purchase receipt or order number?"],
    ['Customer', "Sure, it's RCP-7821."],
    ['Agent',    "I've found your purchase. The shoes are within our 30-day return window. Would you like a refund or exchange?"],
    ['Customer', "An exchange would be great, same model in size 8."],
  ],
  'Store Timings': [
    ['Agent',    "Hello, thank you for calling Bata. How can I help?"],
    ['Customer', "Hi, what are your store timings today?"],
    ['Agent',    "We're open from 10 AM to 9 PM today. Is there anything else I can assist with?"],
    ['Customer', "Perfect, I'll come by in the evening. Do you have parking available?"],
    ['Agent',    "Yes, there's parking available right at the mall entrance. We look forward to seeing you!"],
  ],
  'Delivery / Online Order': [
    ['Agent',    "Hello, thank you for calling Bata customer care. How can I help?"],
    ['Customer', "Hi, I placed an online order 5 days ago and haven't received a tracking update."],
    ['Agent',    "I apologise for the inconvenience. Let me pull up your order with your order ID."],
    ['Customer', "It's ORD-29381."],
    ['Agent',    "Your order is currently at the dispatch hub and should arrive within 2 business days. I'll send you an SMS update."],
    ['Customer', "Thank you, I appreciate it."],
  ],
  'Offers & Promotions': [
    ['Agent',    "Hello, thank you for calling Bata. How can I help you today?"],
    ['Customer', "Hi, I heard there's a sale going on. Can you tell me more?"],
    ['Agent',    "Yes! We currently have a Buy 1 Get 1 at 50% off on selected styles. Valid till end of month."],
    ['Customer', "That's great! Do formal shoes fall under this offer?"],
    ['Agent',    "Yes, most formal and casual styles are included. We also have exclusive app discounts available."],
    ['Customer', "Perfect, I'll check the app. Thank you!"],
  ],
  'NOISE': [
    ['Agent',    "Hello, thank you for calling Bata. How can I assist you?"],
    ['Customer', "..."],
    ['Agent',    "Hello? Is there anything I can help you with today?"],
    ['Customer', "Wrong number, sorry."],
  ],
  'default': [
    ['Agent',    "Hello, thank you for calling {store}. How can I help you today?"],
    ['Customer', "Hi, I had a general enquiry about your products."],
    ['Agent',    "Of course! I'd be happy to help. What would you like to know?"],
    ['Customer', "I'm looking for {intent}."],
    ['Agent',    "Let me look into that for you."],
    ['Customer', "Thank you so much."],
  ],
};

// ── Build seeded data (only things NOT available from API) ────────────────────
function buildCallData(call: CallLog) {
  const seedStr = call._uuid || call.id || 'default-seed';
  const rng     = seeded(seedStr);
  const phone   = `+91 ${PHONE_PFX[rInt(rng, 0, PHONE_PFX.length - 1)]}${rInt(rng, 100000, 999999)}`;

  // Duration as mm:ss — guard against '—' or missing
  let playerDuration = '0:00';
  try {
    const raw = (call.duration || '0m 0s').replace('m ', ':').replace('s', '');
    const [min, secPart] = raw.split(':');
    playerDuration = `${min}:${(secPart ?? '0').padStart(2, '0')}`;
  } catch { playerDuration = '0:00'; }

  // Quality scores — seeded mock (no API equivalent)
  const overall    = rInt(rng, 75, 92);
  const politeness = rInt(rng, 85, 99);
  const resolution = rInt(rng, 60, 85);
  const compliance = rInt(rng, 78, 95);

  // Products — seeded mock (no API equivalent)
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

  // Transcript — pick template by intent, guard missing type
  const intentKey = call.type || 'default';
  const template  = TRANSCRIPT_TEMPLATES[intentKey] ?? TRANSCRIPT_TEMPLATES['default'];
  let ts = 5;
  const transcript = template.map(([speaker, msg]) => {
    const time = `${Math.floor(ts / 60)}:${String(ts % 60).padStart(2, '0')}`;
    ts += rInt(rng, 6, 10);
    // Safe replace — guard against null/undefined
    const safeStore  = call.store || 'Bata';
    const safeIntent = (call.type || 'the product').toLowerCase();
    return {
      speaker,
      time,
      text: msg
        .replace('{store}',  safeStore)
        .replace('{intent}', safeIntent),
    };
  });

  return { phone, playerDuration, overall, politeness, resolution, compliance, products, transcript };
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const cls = type === 'Complaint'
    ? 'bg-red-500 text-white'
    : type === 'NOISE'
    ? 'bg-gray-100 text-gray-500 border border-gray-200'
    : 'bg-white border border-gray-200 text-gray-600';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>{type || '—'}</span>;
}

function SentimentBadge({ s }: { s: string }) {
  const cls = s === 'Positive'
    ? 'border-emerald-400 text-emerald-600 bg-emerald-50'
    : s === 'Negative'
    ? 'border-red-400 text-red-600 bg-red-50'
    : 'border-gray-200 text-gray-500 bg-white';
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cls}`}>{s || '—'}</span>;
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value || '—'}</p>
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
  const [tab, setTab]           = useState<Tab>('Summary');
  const [mounted, setMounted]   = useState(false);
  const [playing, setPlaying]   = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioError, setAudioError]       = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const d = buildCallData(call);

  // Build full audio URL — API returns bare filename, need to prepend base URL
  const rawUrl = call.recording_url || '';
  const audioUrl = rawUrl.startsWith('http')
    ? rawUrl
    : rawUrl ? `${BASE_URL}/recordings/${rawUrl}` : '';

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
      // pause audio when modal closes
      audioRef.current?.pause();
    };
  }, [handleKey]);

  if (!mounted) return null;

  // ── Audio helpers ──
  const hasAudio = Boolean(audioUrl) && !audioError;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play(); setPlaying(true); }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audioDuration;
  };

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  // ── Derived values from real API data ──
  const isConverted = call.converted === true || call.converted === 'Yes';

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
              <p className="text-sm text-gray-500 mt-0.5">AI-processed call details</p>
            </div>
          </div>

            {/* ── Voice Recording card ── */}
            <div className="mt-5 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Voice Recording</span>
                {audioUrl && !audioError && (
                  <span className="px-3 py-1 rounded-full border border-red-500 text-red-500 text-xs font-bold">Live Audio</span>
                )}
                {audioError && (
                  <span className="px-3 py-1 rounded-full border border-amber-300 text-amber-500 text-xs font-semibold">Unavailable</span>
                )}
                {!audioUrl && (
                  <span className="px-3 py-1 rounded-full border border-gray-200 text-gray-400 text-xs font-semibold">No Recording</span>
                )}
              </div>

              {/* Real audio element — hidden, controlled via state */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration ?? 0)}
                  onEnded={() => setPlaying(false)}
                  onError={() => { setAudioError(true); setPlaying(false); }}
                  preload="metadata"
                />
              )}

              {hasAudio ? (
                /* ── Playable state ── */
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    {playing
                      ? <span className="flex gap-0.5"><span className="w-1 h-4 bg-white rounded-full" /><span className="w-1 h-4 bg-white rounded-full" /></span>
                      : <Play size={16} className="text-white fill-white ml-0.5" />
                    }
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-gray-400 shrink-0 tabular-nums">{fmt(currentTime)}</span>
                    <div
                      className="flex-1 h-1.5 bg-gray-100 rounded-full cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full rounded-full bg-red-500 transition-all duration-100"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                      {audioDuration > 0 ? fmt(audioDuration) : d.playerDuration}
                    </span>
                  </div>
                </div>
              ) : audioError ? (
                /* ── Error / auth-blocked state ── */
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
                    <Play size={16} className="text-amber-300 fill-amber-300 ml-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Recording unavailable in browser</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">File: {call.recording_url}</p>
                  </div>
                </div>
              ) : (
                /* ── No URL state ── */
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Play size={16} className="text-gray-300 fill-gray-300 ml-0.5" />
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-gray-300 shrink-0">0:00</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full" />
                    <span className="text-xs text-gray-300 shrink-0">{d.playerDuration}</span>
                  </div>
                </div>
              )}
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

          {/* ══ SUMMARY ════════════════════════════════════════════════════════ */}
          {tab === 'Summary' && (
            <div className="space-y-4">

              {/* AI Summary — real data from short_summary API field */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={15} className="text-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">AI Call Summary</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  &ldquo;{call.summary || 'No summary available for this call.'}&rdquo;
                </p>
              </div>

              {/* 4 stat cards — real API data */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-2">Intent</p>
                  <TypeBadge type={call.type} />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-2">Sentiment</p>
                  <SentimentBadge s={call.sentiment} />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-base font-bold text-gray-900">{call.duration || '—'}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 mb-2">Converted</p>
                  {isConverted ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">Yes</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-bold">No</span>
                  )}
                </div>
              </div>

              {/* Details grid — real API data */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Location"   value={call.store} />
                  <DetailRow label="Region"     value={call.region || '—'} />
                  <DetailRow label="Store Code" value={call.storeCode || '—'} />
                  <DetailRow label="Persona"    value={call.persona || '—'} />
                  <DetailRow label="Category"   value={call.category || '—'} />
                  <DetailRow label="Caller Phone" value={d.phone} />
                  <div className="col-span-2">
                    <DetailRow label="Timestamp" value={call.timestamp || '—'} />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ══ TRANSCRIPT ═══════════════════════════════════════════════════════ */}
          {tab === 'Transcript' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={15} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Simulated Transcript</span>
                <span className="ml-auto text-[10px] text-gray-300 font-medium">Generated · not verbatim</span>
              </div>
              {d.transcript.map((msg, i) => {
                const isAgent = msg.speaker === 'Agent';
                return (
                  <div key={i} className={cn('flex items-end gap-3', !isAgent && 'flex-row-reverse')}>
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      isAgent ? 'bg-red-500' : 'bg-gray-100'
                    )}>
                      <User size={16} className={isAgent ? 'text-white' : 'text-gray-400'} />
                    </div>
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

          {/* ══ QUALITY ══════════════════════════════════════════════════════════ */}
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

          {/* ══ PRODUCTS ═════════════════════════════════════════════════════════ */}
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
                    : p.stock === 'Low Stock'
                    ? 'bg-amber-50 border border-amber-200 text-amber-700'
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

// ── Exported wrapper ──────────────────────────────────────────────────────────
export function useCallModal() {
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const open  = (call: CallLog) => setSelectedCall(call);
  const close = ()              => setSelectedCall(null);
  const modal = selectedCall ? <CallModal call={selectedCall} onClose={close} /> : null;
  return { open, modal };
}
