'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MapPin, Star, Phone, Mail, Clock, Globe, Calendar,
  Store, Users, TrendingUp, Package, AlertTriangle, Tag,
  ShieldCheck, ExternalLink
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface StoreRow {
  name:       string;
  storeCode?: string;
  region:     string;
  state:      string;
  city:       string;
  totalCalls: number;
  qualified:  number;
  junk:       number;
  avgHandle:  string;
  conversion: string;
  csat:       string;
  status:     string;
  avgScore?:  number;    // API: avg_score (0–100)
  complaints?: number;   // API: complaints count
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

// ── Static data ───────────────────────────────────────────────────────────────
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Mumbai':    { lat: 19.0760, lng: 72.8777 },
  'Mysore':    { lat: 12.2958, lng: 76.6394 },
  'Chennai':   { lat: 13.0827, lng: 80.2707 },
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  'Lucknow':   { lat: 26.8467, lng: 80.9462 },
  'Howrah':    { lat: 22.5958, lng: 88.2636 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Surat':     { lat: 21.1702, lng: 72.8311 },
  'Nagpur':    { lat: 21.1458, lng: 79.0882 },
  'Noida':     { lat: 28.5355, lng: 77.3910 },
};
const PHONE_PFX = ['70037', '98204', '97736', '90044', '87654'];

const PRODUCTS_STATIC = [
  { name: 'Running Shoes – Size 9',  badge: 'High Demand',   badgeCls: 'bg-red-500 text-white' },
  { name: 'White Sneakers – Size 8', badge: 'In Stock',      badgeCls: 'border border-gray-200 text-gray-600 bg-white' },
  { name: 'Sports Sandals – Size 10',badge: 'Low Stock',     badgeCls: 'border border-gray-200 text-gray-600 bg-white' },
  { name: 'Canvas Shoes – Size 7',   badge: 'In Stock',      badgeCls: 'border border-gray-200 text-gray-600 bg-white' },
  { name: 'Formal Shoes – Size 9',   badge: 'Out of Stock',  badgeCls: 'bg-red-500 text-white' },
];

const GOOGLE_REVIEWS = [
  { initial: 'R', name: 'Rahul S.',  ago: '2 weeks ago',  stars: 5, text: 'Great selection of running shoes. Staff was very helpful!' },
  { initial: 'P', name: 'Priya M.', ago: '1 month ago',  stars: 4, text: 'Good variety but waiting time can be long during weekends.' },
  { initial: 'A', name: 'Amit K.',  ago: '3 weeks ago',  stars: 3, text: 'Average experience. Limited stock on popular sizes.' },
];

// ── CSAT → star rating + review count ────────────────────────────────────────
function csatToRating(csatStr: string): { stars: number; reviews: number } {
  const pct = parseInt(csatStr);
  const stars   = parseFloat((1 + (pct - 50) / 50 * 4).toFixed(1)).valueOf();
  const clamped = Math.min(5, Math.max(1, stars));
  const reviews = Math.round((pct / 100) * 130 + 10);
  return { stars: parseFloat(clamped.toFixed(1)), reviews };
}

// ── Build per-store seeded data ──────────────────────────────────────────────
function buildStoreData(store: StoreRow) {
  const rng   = seeded(store.name);
  const pfx   = PHONE_PFX[rInt(rng, 0, PHONE_PFX.length - 1)];
  const phone = `+91 ${pfx}${rInt(rng, 10000, 99999)}`;
  const slug  = store.name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
  const email = `${slug}@voiceiq.com`;
  const since = rInt(rng, 2015, 2022);
  const area  = rInt(rng, 600, 1200);
  const { stars, reviews } = csatToRating(store.csat);

  // product requests (seeded, descending)
  const reqs = [110, 80, 60, 45, 35].map(base => rInt(rng, base - 10, base + 15));

  // agent call splits
  const total = store.totalCalls;
  const a1 = Math.round(total * 0.35);
  const a2 = Math.round(total * 0.35);
  const a3 = total - a1 - a2;
  const agents = [
    { rank: 1, name: 'Agent A', calls: a1, conv: rInt(rng, 45, 60), csat: rInt(rng, 90, 99) },
    { rank: 2, name: 'Agent B', calls: a2, conv: rInt(rng, 38, 52), csat: rInt(rng, 85, 95) },
    { rank: 3, name: 'Agent C', calls: a3, conv: rInt(rng, 35, 48), csat: rInt(rng, 78, 92) },
  ];

  // weekly call volume — total/4 base, ascending to W6
  const base = Math.round(total / 6);
  const weeklyVol = ['W1','W2','W3','W4','W5','W6'].map((w, i) => ({
    w,
    calls: Math.max(10, base + rInt(rng, -base * 0.15, base * 0.05) + i * Math.round(base * 0.08)),
  }));
  weeklyVol[5].calls = Math.max(weeklyVol[5].calls, weeklyVol[4].calls + 10); // guarantee peak at W6

  // conversion & CSAT trend
  const conv0  = parseInt(store.conversion);
  const csat0  = parseInt(store.csat);
  const trendData = ['W1','W2','W3','W4','W5','W6'].map((w, i) => ({
    w,
    conversion: conv0 + rInt(rng, -3, 3) + (i === 5 ? 2 : 0),
    satisfaction: csat0 + rInt(rng, -2, 2) + (i === 5 ? 1 : 0),
  }));

  // quality score — use real API avg_score if available, otherwise seeded
  const callQuality = store.avgScore && store.avgScore > 0
    ? Math.round(store.avgScore)
    : parseInt(store.conversion) + rInt(rng, -5, 5);
  const junkPct = store.totalCalls > 0
    ? Math.round((store.junk / store.totalCalls) * 100)
    : 0;

  return { phone, email, since, area, stars, reviews, reqs, agents, weeklyVol, trendData, callQuality, junkPct };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  const full  = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size}
          className={i < full ? 'text-amber-400 fill-amber-400'
            : hasHalf && i === full ? 'text-amber-400 fill-amber-200'
            : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function PctBar({ label, pct, inverse = false }: { label: string; pct: number; inverse?: boolean }) {
  const color = inverse
    ? (pct <= 15 ? 'text-emerald-600' : pct <= 30 ? 'text-amber-500' : 'text-red-500')
    : (pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-500' : 'text-red-500');
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ['Store Info', 'Analytics', 'Agents', 'Products', 'Trends'] as const;
type Tab = typeof TABS[number];

// ── Modal ─────────────────────────────────────────────────────────────────────
interface StoreModalProps { store: StoreRow; onClose: () => void; }

function StoreModal({ store, onClose }: StoreModalProps) {
  const [tab, setTab] = useState<Tab>('Store Info');
  const [mounted, setMounted] = useState(false);
  const d = buildStoreData(store);
  const coords = CITY_COORDS[store.city] ?? { lat: 20.5937, lng: 78.9629 };
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.city)}`;
  const iframeSrc = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`;

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    setMounted(true);
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  if (!mounted) return null;

  const conv  = parseInt(store.conversion);
  const csat  = parseInt(store.csat);
  const other = store.totalCalls - store.qualified - store.junk;
  const callBreakdown = [
    { label: 'Qualified', count: store.qualified },
    { label: 'Junk',      count: store.junk },
    { label: 'Other',     count: Math.max(0, other) },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Modal header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <button onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>

          <div className="flex items-start justify-between pr-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 shrink-0">
                <Store size={22} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {store.city}, {store.state} • {store.region} Region
                    {store.storeCode && <span className="ml-1 text-gray-400">(#{store.storeCode})</span>}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={cn(
                'inline-block px-3 py-1 rounded-full text-xs font-bold mb-1.5',
                store.status === 'Active' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
              )}>{store.status}</span>
              <div className="flex items-center gap-1.5 justify-end">
                <StarRating rating={d.stars} />
                <span className="text-sm font-bold text-gray-700">{d.stars.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({d.reviews})</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-5 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                  tab === t ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700')}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">

          {/* ══ STORE INFO ═════════════════════════════════════════════════ */}
          {tab === 'Store Info' && (
            <div className="space-y-4 pt-4">
              {/* Map */}
              <div className="border border-red-200 rounded-xl overflow-hidden">
                <iframe
                  src={iframeSrc}
                  width="100%" height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${store.name}`}
                />
                <div className="px-4 py-3 bg-white">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <TrendingUp size={13} className="text-red-500 rotate-45 shrink-0" />
                    <span>21, {store.name} Road, {store.city}, {store.state} – {400000 + (d.area * 167) % 100000}</span>
                  </div>
                  <a href={mapsUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600">
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Store size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Business Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.phone}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800 truncate max-w-[170px]">{d.email}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hours</p>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">10:00 AM – 9:00 PM</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Website</p>
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-gray-400" />
                      <a href="#" className="text-sm font-bold text-red-500 hover:text-red-600">Visit site</a>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Open Since</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.since}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Area</p>
                    <div className="flex items-center gap-2">
                      <Store size={13} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-800">{d.area} sq ft</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 flex-wrap">
                  <Tag size={13} className="text-gray-400" />
                  {['Footwear Retail', 'Sports & Athletic Wear', 'Shoe Store'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-600">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Google Reviews */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-red-500 fill-red-500" />
                    <h3 className="text-sm font-bold text-gray-900">Google Reviews</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{d.stars.toFixed(1)}</span>
                    <StarRating rating={d.stars} size={13} />
                    <span className="text-xs text-gray-400">({d.reviews} reviews)</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {GOOGLE_REVIEWS.map((r, i) => (
                    <div key={i} className="px-4 py-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold shrink-0">
                          {r.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">{r.name}</span>
                            <span className="text-xs text-gray-400">{r.ago}</span>
                          </div>
                          <StarRating rating={r.stars} size={11} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ══════════════════════════════════════════════════ */}
          {tab === 'Analytics' && (
            <div className="space-y-4 pt-4">
              {/* 4 stat cards */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Phone,      label: 'Total Calls', value: store.totalCalls.toLocaleString() },
                  { icon: ShieldCheck, label: 'Avg Score',  value: store.avgScore != null && store.avgScore > 0 ? store.avgScore.toFixed(1) : '—' },
                  { icon: Clock,      label: 'Avg Handle',  value: store.avgHandle },
                  { icon: Users,      label: 'CSAT',        value: store.csat },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                    <Icon size={18} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* Call Breakdown chart */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Call Breakdown</h3>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={callBreakdown} barSize={48}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Scores — using real API data where available */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Performance Scores</h3>
                </div>
                <PctBar label="Conversion Rate"       pct={conv} />
                <PctBar label="Customer Satisfaction" pct={csat} />
                <PctBar label="Call Quality Score"    pct={Math.min(99, d.callQuality)} />
                <PctBar label="Junk Call Ratio"       pct={d.junkPct} inverse />
                {(store.complaints ?? 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Complaints</span>
                    <span className="text-sm font-bold text-red-500">{store.complaints}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ AGENTS ═════════════════════════════════════════════════════ */}
          {tab === 'Agents' && (
            <div className="pt-4">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Store Agents</h3>
                </div>
                <div className="space-y-3">
                  {d.agents.map(agent => (
                    <div key={agent.rank} className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-500 text-xs font-bold shrink-0">
                          {agent.rank}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-400">{agent.calls.toLocaleString()} calls handled</p>
                        </div>
                      </div>
                      <div className="flex gap-6 text-right">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Conversion</p>
                          <p className="text-sm font-bold text-emerald-600">{agent.conv}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">CSAT</p>
                          <p className="text-sm font-bold text-emerald-600">{agent.csat}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ PRODUCTS ═══════════════════════════════════════════════════ */}
          {tab === 'Products' && (
            <div className="pt-4">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Top Demanded Products</h3>
                </div>
                <div className="space-y-3">
                  {PRODUCTS_STATIC.map((p, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{d.reqs[i]} requests</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.badgeCls}`}>{p.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ TRENDS ═════════════════════════════════════════════════════ */}
          {tab === 'Trends' && (
            <div className="space-y-4 pt-4">
              {/* Weekly Call Volume */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Weekly Call Volume</h3>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.weeklyVol} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                      <Bar dataKey="calls" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion & Satisfaction Trend */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Conversion &amp; Satisfaction Trend</h3>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={d.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 12 }} />
                      <Line type="monotone" dataKey="satisfaction" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="conversion"   stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
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

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useStoreModal() {
  const [selected, setSelected] = useState<StoreRow | null>(null);
  const open  = (s: StoreRow) => setSelected(s);
  const close = ()             => setSelected(null);
  const modal = selected ? <StoreModal store={selected} onClose={close} /> : null;
  return { open, modal };
}
