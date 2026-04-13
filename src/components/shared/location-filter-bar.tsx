'use client';

import { MapPin, Calendar, Search, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';

// ── Date Options Helper ──────────────────────────────────────────────────────
const DATE_OPTIONS = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Last Month',
];

function getDateRange(option: string) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  
  switch (option) {
    case 'Today':
      return { start: today, end: today };
    case 'Yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const d = yesterday.toISOString().slice(0, 10);
      return { start: d, end: d };
    }
    case 'Last 7 Days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      return { start: start.toISOString().slice(0, 10), end: today };
    }
    case 'Last 30 Days': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return { start: start.toISOString().slice(0, 10), end: today };
    }
    case 'This Month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: start.toISOString().slice(0, 10), end: today };
    }
    case 'Last Month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
    }
    default:
      return { start: today, end: today };
  }
}

const TRIGGER_CLS =
  'h-[38px] min-w-[140px] bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 rounded-lg text-sm font-medium px-3.5';
const TRIGGER_DISABLED_CLS =
  'h-[38px] min-w-[140px] bg-gray-50 border-gray-100 text-gray-400 focus:ring-0 focus:ring-offset-0 rounded-lg text-sm font-medium px-3.5 transition-colors';
const CONTENT_CLS = 'bg-white border-gray-100 shadow-xl rounded-xl max-h-[300px] overflow-y-auto';
const ITEM_CLS    = 'text-gray-700 focus:bg-gray-50 text-sm py-2 px-3 cursor-pointer';

// ── Component ────────────────────────────────────────────────────────────────
export function LocationFilterBar() {
  const { filters, filterOptions, setFilters, resetFilters } = useFilters();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // ── Scroll Indicator Logic ──
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftFade(scrollLeft > 20);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      
      // Also check on a slight delay to ensure content is rendered
      const timer = setTimeout(checkScroll, 100);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
        clearTimeout(timer);
      };
    }
  }, [filterOptions, filters]); // Re-check when options or filter state changes

  // ── Derived Options ──
  const states = useMemo(() => {
    if (!filterOptions?.regions) return [];
    return Array.from(new Set(filterOptions.regions.map(r => r.stateName))).sort();
  }, [filterOptions]);

  const cities = useMemo(() => {
    if (!filterOptions?.regions || !filters.stateName || filters.stateName === 'All States') return [];
    return Array.from(new Set(
      filterOptions.regions
        .filter(r => r.stateName === filters.stateName)
        .map(r => r.cityName)
    )).sort();
  }, [filterOptions, filters.stateName]);

  const stores = useMemo(() => {
    if (!filterOptions?.stores) return [];
    return filterOptions.stores;
  }, [filterOptions]);

  const handleDateChange = (val: string) => {
    const { start, end } = getDateRange(val);
    setFilters({ start_date: start, end_date: end });
  };

  const getValue = (val: string | undefined, defaultValue: string) => val || defaultValue;

  return (
    <div className="relative group mb-6">
      {/* ── Scroll Indicators ── */}
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent transition-opacity duration-300 flex items-center pl-1">
          <ChevronLeft className="text-red-500/40 animate-pulse" size={20} />
        </div>
      )}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent transition-opacity duration-300 flex items-center justify-end pr-1">
          <ChevronRight className="text-red-500/40 animate-pulse" size={20} />
        </div>
      )}

      <div 
        ref={scrollRef}
        className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-2 flex items-center justify-between gap-3 overflow-x-auto modern-scroll relative"
      >
        {/* ── Left: Main Filters ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 pl-3 pr-1 shrink-0">
            <MapPin size={16} className="text-red-500" />
            <span className="text-sm font-semibold text-gray-600">Location:</span>
          </div>

          <Select
            value={getValue(filters.stateName, 'All States')}
            onValueChange={(v) => setFilters({ stateName: v, cityName: 'All Cities', gmbStoreCode: 'All Stores' })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All States" className={ITEM_CLS}>All States</SelectItem>
              {states.map(s => <SelectItem key={s} value={s} className={ITEM_CLS}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={getValue(filters.cityName, 'All Cities')}
            onValueChange={(v) => setFilters({ cityName: v, gmbStoreCode: 'All Stores' })}
            disabled={!filters.stateName || filters.stateName === 'All States'}
          >
            <SelectTrigger className={(!filters.stateName || filters.stateName === 'All States') ? TRIGGER_DISABLED_CLS : TRIGGER_CLS}>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Cities" className={ITEM_CLS}>All Cities</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c} className={ITEM_CLS}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={getValue(filters.gmbStoreCode, 'All Stores')}
            onValueChange={(v) => setFilters({ gmbStoreCode: v })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All Stores" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Stores" className={ITEM_CLS}>All Stores</SelectItem>
              {stores.map(s => (
                <SelectItem key={s.gmbStoreCode} value={s.gmbStoreCode} className={ITEM_CLS}>
                  {s.businessName} ({s.gmbStoreCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-[1px] bg-gray-100 mx-1" />

          <div className="flex items-center gap-2 px-1 shrink-0">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Analysis:</span>
          </div>

          <Select
            value={getValue(filters.intent, 'All Intents')}
            onValueChange={(v) => setFilters({ intent: v })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All Intents" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Intents" className={ITEM_CLS}>All Intents</SelectItem>
              {filterOptions?.intents.map(i => <SelectItem key={i} value={i} className={ITEM_CLS}>{i}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={getValue(filters.sentiment, 'All Sentiments')}
            onValueChange={(v) => setFilters({ sentiment: v })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All Sentiments" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Sentiments" className={ITEM_CLS}>All Sentiments</SelectItem>
              {filterOptions?.sentiments.map(s => <SelectItem key={s} value={s} className={ITEM_CLS}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={getValue(filters.category, 'All Categories')}
            onValueChange={(v) => setFilters({ category: v })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Categories" className={ITEM_CLS}>All Categories</SelectItem>
              {filterOptions?.categories.map(c => <SelectItem key={c} value={c} className={ITEM_CLS}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={getValue(filters.issue_type, 'All Issues')}
            onValueChange={(v) => setFilters({ issue_type: v })}
          >
            <SelectTrigger className={TRIGGER_CLS}>
              <SelectValue placeholder="All Issues" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              <SelectItem value="All Issues" className={ITEM_CLS}>All Issues</SelectItem>
              {filterOptions?.issue_types.map(i => <SelectItem key={i} value={i} className={ITEM_CLS}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* ── Right: Date & Search ── */}
        <div className="flex items-center gap-3 shrink-0 px-2 ml-auto">
          <div className="flex items-center gap-2 px-1">
            <Calendar size={16} className="text-red-500 shrink-0" />
            <span className="text-sm font-semibold text-gray-600">Period:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">From</span>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => setFilters({ start_date: e.target.value })}
              className="h-[38px] px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100/50 focus:border-red-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">To</span>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => setFilters({ end_date: e.target.value })}
              className="h-[38px] px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100/50 focus:border-red-200"
            />
          </div>

          <Select onValueChange={handleDateChange}>
            <SelectTrigger className="h-[38px] min-w-[110px] bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 focus:ring-0 rounded-lg text-xs font-bold px-3 transition-colors">
              <SelectValue placeholder="Presets" />
            </SelectTrigger>
            <SelectContent className={CONTENT_CLS}>
              {DATE_OPTIONS.map(d => (
                <SelectItem key={d} value={d} className={ITEM_CLS}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-[1px] bg-gray-100" />

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={filters.search || ''}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-40 pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 bg-white"
            />
          </div>
          
          <button 
            onClick={resetFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 bg-red-50/50 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
