'use client';

import { MapPin, Calendar, Search } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ── Static data ──────────────────────────────────────────────────────────────
const REGIONS = ['North', 'South', 'East', 'West'];

const STATES_BY_REGION: Record<string, string[]> = {
  North: ['Uttar Pradesh', 'Punjab', 'Rajasthan'],
  South: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
  West:  ['Maharashtra', 'Gujarat'],
  East:  ['West Bengal', 'Odisha'],
};

const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra:    ['Mumbai', 'Pune', 'Nagpur'],
  Karnataka:      ['Bengaluru', 'Mysuru'],
  'Tamil Nadu':   ['Chennai', 'Coimbatore'],
  'Uttar Pradesh':['Lucknow', 'Kanpur', 'Agra'],
  'West Bengal':  ['Kolkata', 'Darjeeling'],
  Gujarat:        ['Ahmedabad', 'Surat'],
  Kerala:         ['Kochi', 'Thiruvananthapuram'],
  'Andhra Pradesh':['Hyderabad', 'Visakhapatnam'],
  Punjab:         ['Chandigarh', 'Ludhiana'],
  Rajasthan:      ['Jaipur', 'Jodhpur'],
  Odisha:         ['Bhubaneswar', 'Cuttack'],
};

const STORES = ['Store 1', 'Store 12', 'Store 23', 'Store 45', 'Store 89'];

const DATE_OPTIONS = [
  'Today',
  'Yesterday',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Last Month',
];

const TRIGGER_CLS =
  'h-[38px] min-w-[130px] bg-white border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 rounded-lg text-sm font-medium px-3.5';
const TRIGGER_DISABLED_CLS =
  'h-[38px] min-w-[130px] bg-gray-50 border-gray-100 text-gray-400 focus:ring-0 focus:ring-offset-0 rounded-lg text-sm font-medium px-3.5';
const CONTENT_CLS = 'bg-white border-gray-100 shadow-xl rounded-xl';
const ITEM_CLS    = 'text-gray-700 focus:bg-gray-50 text-sm';

// ── Component ────────────────────────────────────────────────────────────────
export function LocationFilterBar() {
  const [region, setRegion] = useState('All Regions');
  const [state,  setState]  = useState('All States');
  const [city,   setCity]   = useState('All Cities');
  const [store,  setStore]  = useState('All Stores');
  const [date,   setDate]   = useState('Today');
  const [search, setSearch] = useState('');

  const availableStates = region === 'All Regions'
    ? Object.values(STATES_BY_REGION).flat()
    : STATES_BY_REGION[region] ?? [];

  const availableCities = state === 'All States'
    ? []
    : CITIES_BY_STATE[state] ?? [];

  const cityDisabled  = state === 'All States';
  const storeDisabled = cityDisabled || city === 'All Cities';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-2 mb-6 flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide">

      {/* ── Left: location cascades ── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 pl-3 pr-1 shrink-0">
          <MapPin size={16} className="text-red-500" />
          <span className="text-sm font-semibold text-gray-600">Filters:</span>
        </div>

        {/* Region */}
        <Select
          value={region}
          onValueChange={(v) => {
            setRegion(v);
            setState('All States');
            setCity('All Cities');
            setStore('All Stores');
          }}
        >
          <SelectTrigger className={TRIGGER_CLS}>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent className={CONTENT_CLS}>
            <SelectItem value="All Regions" className={ITEM_CLS}>All Regions</SelectItem>
            {REGIONS.map(r => (
              <SelectItem key={r} value={r} className={ITEM_CLS}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* State */}
        <Select
          value={state}
          onValueChange={(v) => {
            setState(v);
            setCity('All Cities');
            setStore('All Stores');
          }}
        >
          <SelectTrigger className={TRIGGER_CLS}>
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent className={CONTENT_CLS}>
            <SelectItem value="All States" className={ITEM_CLS}>All States</SelectItem>
            {availableStates.map(s => (
              <SelectItem key={s} value={s} className={ITEM_CLS}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City */}
        <Select
          value={city}
          onValueChange={(v) => {
            setCity(v);
            setStore('All Stores');
          }}
          disabled={cityDisabled}
        >
          <SelectTrigger className={cityDisabled ? TRIGGER_DISABLED_CLS : TRIGGER_CLS}>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent className={CONTENT_CLS}>
            <SelectItem value="All Cities" className={ITEM_CLS}>All Cities</SelectItem>
            {availableCities.map(c => (
              <SelectItem key={c} value={c} className={ITEM_CLS}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Store */}
        <Select
          value={store}
          onValueChange={setStore}
          disabled={storeDisabled}
        >
          <SelectTrigger className={storeDisabled ? TRIGGER_DISABLED_CLS : TRIGGER_CLS}>
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent className={CONTENT_CLS}>
            <SelectItem value="All Stores" className={ITEM_CLS}>All Stores</SelectItem>
            {STORES.map(s => (
              <SelectItem key={s} value={s} className={ITEM_CLS}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Right: date + search ── */}
      <div className="flex items-center gap-3 shrink-0 px-2">
        <Calendar size={16} className="text-red-500 shrink-0" />
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger className={`${TRIGGER_CLS} min-w-[130px]`}>
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent className={CONTENT_CLS}>
            {DATE_OPTIONS.map(d => (
              <SelectItem key={d} value={d} className={ITEM_CLS}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-6 w-[1px] bg-gray-200" />

        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search store..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48 pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all bg-white"
          />
        </div>
      </div>
    </div>
  );
}
