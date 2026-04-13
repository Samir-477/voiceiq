'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MapPin, Star, Phone, Mail, Clock, Globe, Calendar,
  Store, Users, TrendingUp, Package, AlertTriangle, Tag,
  ShieldCheck, ExternalLink, MessageSquare
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip,
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
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
        <span className={cn("text-sm font-bold", color)}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ['Store Info', 'Performance', 'Recent Activity'] as const;
type Tab = typeof TABS[number];

// ── Modal ─────────────────────────────────────────────────────────────────────
interface StoreModalProps { store: StoreRow; onClose: () => void; }

function StoreModal({ store, onClose }: StoreModalProps) {
  const [tab, setTab] = useState<Tab>('Performance');
  const [mounted, setMounted] = useState(false);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(false);

  // Derived rating from CSAT
  const csatVal = parseInt(store.csat) || 0;
  const stars   = Math.max(1, Math.min(5, (csatVal / 100) * 5));
  const reviews = Math.round(store.totalCalls * 0.15); // Dynamic factor

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.city)}`;
  
  // Handled coordinate mapping defensively
  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(store.name + ' ' + store.city)}&z=15&output=embed`;

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  
  useEffect(() => {
    setMounted(true);
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [handleKey]);

  // Fetch recent calls if tab is selected
  useEffect(() => {
    if (tab === 'Recent Activity' && store.storeCode) {
      async function fetchRecent() {
        setLoadingCalls(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/analytics/calls?store_code=${store.storeCode}&per_page=5`, {
            headers: { 'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY || '' }
          });
          if (res.ok) {
            const data = await res.json();
            setRecentCalls(data.results || data || []);
          }
        } catch (e) {
          console.error('Failed to fetch recent calls for store modal', e);
        } finally {
          setLoadingCalls(false);
        }
      }
      fetchRecent();
    }
  }, [tab, store.storeCode]);

  if (!mounted) return null;

  const conv = parseInt(store.conversion) || 0;
  const junkPct = store.totalCalls > 0 ? Math.round((store.junk / store.totalCalls) * 100) : 0;

  const callBreakdown = [
    { label: 'Qualified', count: store.qualified },
    { label: 'Junk/Noise', count: store.junk },
    { label: 'Incomplete', count: Math.max(0, store.totalCalls - store.qualified - store.junk) },
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
                <StarRating rating={stars} />
                <span className="text-sm font-bold text-gray-700">{stars.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({reviews})</span>
              </div>
            </div>
          </div>

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
            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1 font-medium">
                    <MapPin size={13} className="text-red-500 shrink-0" />
                    <span>Bata Store, {store.city}, {store.state}</span>
                  </div>
                  <a href={mapsUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600">
                    Open in Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Store size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Store Registry</h3>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Store Code" value={store.storeCode} />
                  <DetailRow label="City"       value={store.city} />
                  <DetailRow label="State"      value={store.state} />
                  <DetailRow label="Region"     value={store.region} />
                  <DetailRow label="Operations" value={store.status} />
                  <DetailRow label="CSAT (Internal)" value={store.csat} />
                </div>
              </div>
            </div>
          )}

          {/* ══ PERFORMANCE ══════════════════════════════════════════════════ */}
          {tab === 'Performance' && (
            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Phone,      label: 'Calls',   value: store.totalCalls.toLocaleString() },
                  { icon: ShieldCheck, label: 'Score',   value: store.avgScore && store.avgScore > 0 ? store.avgScore.toFixed(1) : '—' },
                  { icon: Clock,      label: 'Handle',  value: store.avgHandle },
                  { icon: Users,      label: 'CSAT',    value: store.csat },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                    <Icon size={18} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Interaction Breakdown</h3>
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

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-red-500" />
                  <h3 className="text-sm font-bold text-gray-900">Conversion Intelligence</h3>
                </div>
                <PctBar label="Conversion Rate"       pct={conv} />
                <PctBar label="Internal Customer Sat" pct={parseInt(store.csat) || 0} />
                <PctBar label="Call Quality Rank"     pct={Math.min(99, Math.round(store.avgScore || 0))} />
                <PctBar label="Junk Call Ratio"       pct={junkPct} inverse />
                {store.complaints ? (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Total Store Complaints</span>
                    <span className="text-sm font-black text-red-500">{store.complaints}</span>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* ══ RECENT ACTIVITY ════════════════════════════════════════════ */}
          {tab === 'Recent Activity' && (
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-red-500" />
                    <h3 className="text-sm font-bold text-gray-900">Recent Store Calls</h3>
                  </div>
                  {loadingCalls && <div className="h-4 w-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />}
                </div>

                <div className="space-y-3">
                  {recentCalls.length === 0 && !loadingCalls && (
                    <div className="text-center py-10 text-gray-400 italic text-sm border-2 border-dashed border-gray-100 rounded-xl">
                      No recent calls recorded for this store.
                    </div>
                  )}
                  {recentCalls.map((call, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-50 bg-gray-50/30">
                       <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">{call.summary || call.intent || 'Customer Call'}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{call.timestamp || 'Just now'}</p>
                       </div>
                       <div className="text-right ml-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-black uppercase",
                            call.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-600' : 
                            call.sentiment === 'Negative' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                          )}>
                            {call.sentiment || 'Neutral'}
                          </span>
                       </div>
                    </div>
                  ))}
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

function DetailRow({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value || '—'}</p>
    </div>
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
