'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Phone, MessageSquare, ShieldCheck,
  Star, TrendingUp, Package, Play, Loader2, AlertCircle,
  FileText, Info, BarChart, HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CallLogItem, CallDetailItem } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

// ── UI helpers ────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const cls = type === 'Complaint'
    ? 'bg-red-500 text-white'
    : (type === 'NOISE' || type === 'Junk')
    ? 'bg-gray-100 text-gray-500 border border-gray-200'
    : 'bg-white border border-gray-200 text-gray-600';
  return <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", cls)}>{type || '—'}</span>;
}

function SentimentBadge({ s }: { s: string }) {
  const cls = s === 'Positive'
    ? 'border-emerald-400 text-emerald-600 bg-emerald-50'
    : s === 'Negative'
    ? 'border-red-400 text-red-600 bg-red-50'
    : 'border-gray-200 text-gray-500 bg-white';
  return <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase", cls)}>{s || '—'}</span>;
}

function ProgressBar({ label, pct, icon: Icon, loading, reason }: { label: string; pct: number | null; icon: React.ElementType; loading?: boolean; reason?: string }) {
  const displayPct = pct ?? 0;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        {loading ? (
          <div className="h-4 w-10 bg-gray-100 animate-pulse rounded" />
        ) : (
          <span className="text-sm font-bold text-gray-900">
            {pct !== null ? `${pct}%` : '—'}
          </span>
        )}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        {loading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse" />
        ) : (
          <div className="h-full rounded-full bg-red-500 transition-all duration-500" style={{ width: `${displayPct}%` }} />
        )}
      </div>
      {reason && !loading && (
        <p className="text-[11px] text-gray-500 italic leading-relaxed pl-1">{reason}</p>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="group">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 group-hover:text-red-500 transition-colors">{value || '—'}</p>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ['Analysis', 'Transcript', 'Quality', 'Intelligence'] as const;
type Tab = typeof TABS[number];

// ── Modal ─────────────────────────────────────────────────────────────────────
interface CallModalProps {
  initialCall: CallLogItem;
  displayId:   string;
  onClose:     () => void;
}

function CallModal({ initialCall, displayId, onClose }: CallModalProps) {
  const [tab, setTab]           = useState<Tab>('Analysis');
  const [mounted, setMounted]   = useState(false);
  const [playing, setPlaying]   = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioError, setAudioError]       = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loading, setLoading]   = useState(true);
  const [fullCall, setFullCall] = useState<CallDetailItem | null>(null);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      const uuid = initialCall.call_uuid;
      if (!uuid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/v1/analytics/calls/${uuid}`, {
          headers: { 'X-API-Key': API_KEY }
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setFullCall(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [initialCall.call_uuid]);

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
      audioRef.current?.pause();
    };
  }, [handleKey]);

  if (!mounted) return null;

  // Build audio URL
  const rawUrl = fullCall?.recording_url || initialCall.recording_url || '';
  const audioUrl = rawUrl.startsWith('http')
    ? rawUrl
    : rawUrl ? `${BASE_URL}/recordings/${rawUrl}` : '';

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

  // Data mapping from the rich response
  const fa = fullCall?.full_analysis;
  const analysisOverview = fa?.overview;
  const metrics = fa?.performance_metrics || {};
  const audit   = fa?.scoring_audit || {};
  
  const scoreRaw = fa?.overall_score ?? fullCall?.score ?? 0;
  // If score is > 10, it's already 0-100. If <= 10, multiply by 10.
  const overallScore = scoreRaw > 10 ? Math.round(scoreRaw) : Math.round(scoreRaw * 10);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className="px-8 pt-8 pb-4 shrink-0 bg-gray-50/50 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-200 transition-all active:scale-95"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 shadow-inner shrink-0 rotate-3">
              <Phone size={28} className="text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-2xl font-black text-gray-900 italic tracking-tight">{displayId}</h2>
                 <TypeBadge type={fa?.call_intent || initialCall.intent} />
              </div>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                AI Analysis Date: {fa?.derived_metadata?.analysis_date || 'Live Session'}
              </p>
            </div>

            <div className="shrink-0 ml-4 mr-16">
              <div className="text-3xl font-black text-red-500 leading-none">{overallScore}%</div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Quality Score</p>
            </div>
          </div>

          {/* Audio Player */}
          <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="flex items-center justify-between mb-4">
               <span className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                 <Play size={10} className="fill-gray-400" /> Voice Recording
               </span>
               <div className="flex gap-2">
                 <SentimentBadge s={analysisOverview?.sentiment || initialCall.sentiment || 'Neutral'} />
                 {fa?.conclusion?.final_verdict && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-900 text-white uppercase">{fa.conclusion.final_verdict}</span>
                 )}
               </div>
            </div>

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
               <div className="flex items-center gap-4">
                 <button
                   onClick={togglePlay}
                   className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-90"
                 >
                   {playing
                     ? <div className="flex gap-1"><div className="w-1.5 h-4 bg-white rounded-full animate-bounce" /><div className="w-1.5 h-4 bg-white rounded-full animate-bounce delay-75" /></div>
                     : <Play size={20} className="text-white fill-white ml-1" />
                   }
                 </button>
                 <div className="flex-1 space-y-2">
                   <div className="flex justify-between text-[11px] font-bold text-gray-400 tabular-nums uppercase">
                     <span>{fmt(currentTime)}</span>
                     <span>{audioDuration > 0 ? fmt(audioDuration) : (fullCall?.duration || initialCall.duration)}</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full cursor-pointer relative" onClick={handleSeek}>
                     <div className="h-full rounded-full bg-red-500" style={{ width: `${progressPct}%` }} />
                   </div>
                 </div>
               </div>
            ) : (
              <div className="flex items-center gap-4 opacity-50">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Play size={20} className="text-gray-300 fill-gray-300" />
                </div>
                <div className="flex-1 space-y-2">
                   <div className="flex justify-between text-[11px] font-bold text-gray-300 tabular-nums uppercase">
                     <span>0:00</span>
                     <span>{fullCall?.duration || initialCall.duration}</span>
                   </div>
                   <div className="h-2 bg-gray-100 rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-1 mt-6 p-1 bg-gray-100/50 rounded-xl border border-gray-100">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300',
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto flex-1 px-8 pb-8 pt-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hydrating Analysis Engine...</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mx-4">
               <AlertCircle size={40} className="text-red-400" />
               <p className="text-sm font-bold text-gray-600 max-w-xs text-center">{error}</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              
              {tab === 'Analysis' && (
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare size={16} className="text-red-500" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Executive Briefing</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium italic mb-6">
                      &ldquo;{fa?.summary || fullCall?.summary || initialCall.short_summary}&rdquo;
                    </p>
                    
                    {/* Insights Grid */}
                    {analysisOverview?.automated_insight && analysisOverview.automated_insight.length > 0 && (
                      <div className="space-y-3">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Key Insights</span>
                         <div className="grid grid-cols-1 gap-2">
                           {analysisOverview.automated_insight.map((insight, idx) => (
                             <div key={idx} className="flex gap-3 items-start p-3 bg-red-50/30 rounded-2xl border border-red-50/50">
                               <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                 <Info size={12} className="text-red-600" />
                               </div>
                               <p className="text-[11px] font-semibold text-gray-800 leading-normal">{insight}</p>
                             </div>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Details */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                       <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                          <HardDrive size={14} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Device & Source</span>
                       </div>
                       <div className="grid grid-cols-2 gap-y-4">
                          <DetailRow label="City" value={fullCall?.city?.trim() || initialCall.city?.trim()} />
                          <DetailRow label="Store Code" value={fullCall?.store_code || initialCall.store_code} />
                          <DetailRow label="State" value={fullCall?.state || initialCall.state} />
                          <DetailRow label="Region" value={fullCall?.region || initialCall.region} />
                       </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                       <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-2">
                          <BarChart size={14} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Call Metrics</span>
                       </div>
                       <div className="grid grid-cols-2 gap-y-4">
                          <DetailRow label="Duration" value={fullCall?.duration || initialCall.duration} />
                          <DetailRow label="Status" value={fullCall?.call_status || 'Connected'} />
                          <DetailRow label="Words" value={fa?.derived_metadata?.word_count} />
                          <DetailRow label="Sentences" value={fa?.derived_metadata?.sentence_count} />
                       </div>
                    </div>
                  </div>

                  {/* Derived Metadata Section */}
                  <div className="bg-gray-900 rounded-3xl p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                      <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10 grid grid-cols-3 gap-8">
                       <div>
                         <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Confidence</p>
                         <p className="text-2xl font-black italic">{Math.round((fa?.confidence_score || 0) * 100)}%</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase text-gray-400 mb-2">CSAT Pred.</p>
                         <p className="text-2xl font-black italic text-red-500">{fa?.conclusion?.predicted_csat || '—'}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Verdict</p>
                         <p className="text-2xl font-black italic">{fa?.conclusion?.final_verdict || 'Processed'}</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'Transcript' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-red-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-red-500">Verbatim Log</span>
                      </div>
                      <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                        <span>Rate: {fa?.derived_metadata?.speaking_rate_wpm} WPM</span>
                         <span>Words: {fa?.derived_metadata?.word_count}</span>
                      </div>
                    </div>
                    {fa?.translated_text || fullCall?.transcript ? (
                      <div className="text-sm text-gray-800 leading-[1.8] font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100 selection:bg-red-100 italic">
                        {fa?.translated_text || fullCall?.transcript}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-20 text-gray-300">
                         <FileText size={48} className="mb-4 opacity-20" />
                         <p className="text-xs font-bold uppercase tracking-widest italic">No Transcript available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'Quality' && (
                <div className="space-y-6">
                  {/* Benchmarks */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                     <div className="flex items-center gap-2 mb-8">
                        <ShieldCheck size={20} className="text-red-500" />
                        <h3 className="text-lg font-black text-gray-900 italic tracking-tight uppercase">Agent Scorecard</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        {Object.entries(metrics).map(([key, value]) => (
                          <ProgressBar 
                            key={key} 
                            label={key.replace(/_/g, ' ').toUpperCase()} 
                            pct={Math.round(value as number)} 
                            icon={TrendingUp} 
                            reason={audit[key]?.reason}
                          />
                        ))}
                     </div>
                  </div>

                  {/* Sentiment Breakdown */}
                  {fa?.call_review && (
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 block">Sentiment Distribution</span>
                       <div className="flex h-12 rounded-2xl overflow-hidden shadow-inner">
                          <div className="bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${fa.call_review.positive_percent}%` }}>
                             {fa.call_review.positive_percent > 5 && `${Math.round(fa.call_review.positive_percent)}%`}
                          </div>
                          <div className="bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500" style={{ width: `${fa.call_review.neutral_percent}%` }}>
                             {fa.call_review.neutral_percent > 5 && `${Math.round(fa.call_review.neutral_percent)}%`}
                          </div>
                          <div className="bg-red-500 flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${fa.call_review.negative_percent}%` }}>
                             {fa.call_review.negative_percent > 5 && `${Math.round(fa.call_review.negative_percent)}%`}
                          </div>
                       </div>
                       <div className="flex justify-between mt-3 px-1 font-bold text-[10px] text-gray-400 uppercase">
                          <span className="text-emerald-600">Positive</span>
                          <span>Neutral</span>
                          <span className="text-red-600">Negative</span>
                       </div>
                    </div>
                  )}

                  {/* Explanations */}
                  <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100">
                     <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-2">Analysis Rational</p>
                     <p className="text-sm text-red-900/80 leading-relaxed italic">{fa?.score_explanation}</p>
                  </div>
                </div>
              )}

              {tab === 'Intelligence' && (
                <div className="space-y-6">
                  {/* Extracted Details */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <Package size={18} className="text-red-500" />
                      <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Entity Intelligence</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                      <DetailRow label="Shoe Size" value={fa?.extracted_details?.shoe_size} />
                      <DetailRow label="Article" value={fa?.extracted_details?.article_name} />
                      <DetailRow label="Phone" value={fa?.extracted_details?.customer_phone} />
                      <DetailRow label="Location" value={fa?.extracted_details?.store_location} />
                      <div className="col-span-2">
                        <DetailRow label="Primary Issue" value={fa?.extracted_details?.core_issue_or_request} />
                      </div>
                    </div>
                  </div>

                  {/* Brand & Audience */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <Star size={18} className="text-red-500" />
                      <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">Brand Positioning</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        <DetailRow label="Audience" value={fa?.product_and_audience?.audience} />
                        <DetailRow label="Persona" value={fa?.product_and_audience?.customer_persona} />
                        <DetailRow label="Category" value={fa?.product_and_audience?.product_category} />
                        <DetailRow label="Converted Product" value={fa?.product_and_audience?.conversion_product} />
                        <div className="col-span-2">
                          <DetailRow label="Conversion" value={fa?.product_and_audience?.is_conversion ? 'SUCCESSFUL' : 'NONE'} />
                        </div>
                      </div>

                      {fa?.product_and_audience?.brand_mentions && fa.product_and_audience.brand_mentions.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Detected Brands</p>
                          <div className="flex flex-wrap gap-2">
                            {fa.product_and_audience.brand_mentions.map((brand, bidx) => (
                              <span key={bidx} className="px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-black tracking-widest">{brand}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useCallModal() {
  const [selectedCall, setSelectedCall] = useState<{ call: CallLogItem; id: string } | null>(null);
  const open  = (call: CallLogItem, id: string) => setSelectedCall({ call, id });
  const close = ()              => setSelectedCall(null);
  const modal = selectedCall ? <CallModal initialCall={selectedCall.call} displayId={selectedCall.id} onClose={close} /> : null;
  return { open, modal };
}
