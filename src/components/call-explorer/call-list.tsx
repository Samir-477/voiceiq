'use client';

import { MapPin, Clock, User, Play } from 'lucide-react';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export type CallRecord = {
  id: string;
  sentiment: SentimentType;
  quality: number;
  caller: string;
  agent: string;
  intent: string;
  branch: string;
  duration: string;
  summary: string;
};

// ─── Shared Data ──────────────────────────────────────────────────────────────

export const calls: CallRecord[] = [
  {
    id: 'CGL-1001', sentiment: 'Positive', quality: 92, caller: 'Ramesh S.',   agent: 'Priya Sharma',
    intent: 'Loan Enquiry & Eligibility',       branch: 'Chennai - T.Nagar',       duration: '3m 45s',
    summary: 'Customer enquired about gold loan eligibility for 25g gold jewelry. Agent explained schemes and interest rates. Customer agreed to visit branch.',
  },
  {
    id: 'CGL-1002', sentiment: 'Negative', quality: 68, caller: 'Lakshmi V.',  agent: 'Anita Verma',
    intent: 'Auction Alert & Default Distress', branch: 'Coimbatore - RS Puram',    duration: '8m 20s',
    summary: 'Customer distressed about imminent auction. Agent transferred too quickly without fully exploring repayment options. Escalation pending.',
  },
  {
    id: 'CGL-1003', sentiment: 'Neutral',  quality: 95, caller: 'Suresh K.',   agent: 'Rajesh Kumar',
    intent: 'Gold Release & Loan Closure',      branch: 'Mumbai - Andheri',         duration: '5m 10s',
    summary: 'Customer requested gold release post full repayment. Agent confirmed process and appointment was scheduled for branch visit.',
  },
  {
    id: 'CGL-1004', sentiment: 'Negative', quality: 72, caller: 'Meena R.',    agent: 'Vikram Singh',
    intent: 'Interest Rate & Charges',          branch: 'Bangalore - Koramangala',  duration: '6m 30s',
    summary: 'Customer disputed interest rate calculation. Branch had communicated incorrect processing fee. Issue escalated to branch manager.',
  },
  {
    id: 'CGL-1005', sentiment: 'Negative', quality: 75, caller: 'Arjun P.',    agent: 'Kavitha Rajan',
    intent: 'Complaint & Grievance',            branch: 'Hyderabad - Ameerpet',     duration: '7m 15s',
    summary: 'Customer complained about rude staff behaviour during branch visit. Formal grievance logged and 48-hour resolution promised.',
  },
  {
    id: 'CGL-1006', sentiment: 'Positive', quality: 96, caller: 'Divya M.',    agent: 'Deepa Menon',
    intent: 'Loan Renewal & Top-Up',            branch: 'Madurai - Main Branch',    duration: '4m 20s',
    summary: 'Agent proactively identified top-up eligibility, pre-checked documentation, and secured commitment for renewal with top-up.',
  },
  {
    id: 'CGL-1007', sentiment: 'Neutral',  quality: 88, caller: 'Karthik N.',  agent: 'Suresh Nair',
    intent: 'Repayment & EMI Assistance',       branch: 'Delhi - Karol Bagh',       duration: '5m 40s',
    summary: 'Customer requested EMI due date change. Agent guided through self-service app process and confirmed update within 24 hours.',
  },
  {
    id: 'CGL-1008', sentiment: 'Positive', quality: 85, caller: 'Seetha L.',   agent: 'Arun Prasad',
    intent: 'Gold Safety & Insurance',          branch: 'Chennai - Anna Nagar',     duration: '3m 55s',
    summary: 'Customer requested confirmation of gold insurance coverage. Agent shared safety certificate details and policy terms clearly.',
  },
];

export const intentOptions = [
  'All',
  'Loan Enquiry & Eligibility',
  'Auction Alert & Default Distress',
  'Gold Release & Loan Closure',
  'Interest Rate & Charges',
  'Complaint & Grievance',
  'Loan Renewal & Top-Up',
  'Repayment & EMI Assistance',
  'Gold Safety & Insurance',
];

// ─── Components ───────────────────────────────────────────────────────────────

const sentimentStyles: Record<SentimentType, string> = {
  Positive: 'bg-green-50 text-green-700 border border-green-200',
  Neutral:  'bg-amber-50 text-amber-600 border border-amber-200',
  Negative: 'bg-red-50 text-red-500 border border-red-200',
};

function CallCard({
  call,
  selected,
  onClick,
  onPlay,
}: {
  call: CallRecord;
  selected: boolean;
  onClick: () => void;
  onPlay: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-150 hover:shadow-md ${
        selected ? 'border-red-400 shadow-sm' : 'border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-gray-900">{call.id}</span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${sentimentStyles[call.sentiment]}`}>
            {call.sentiment}
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            Q: <span className="text-gray-900">{call.quality}</span>
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onPlay(); }}
          className="p-1 rounded-lg hover:bg-red-50 transition-colors group"
        >
          <Play size={15} className="text-red-400 group-hover:text-red-600" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-1.5">
        <User size={12} className="text-gray-400 shrink-0" />
        <span className="text-[13px] font-medium text-gray-700">{call.caller}</span>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <span className="w-3 h-3 inline-block">◈</span> {call.intent}
        </span>
        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <MapPin size={10} className="shrink-0" /> {call.branch}
        </span>
        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <Clock size={10} className="shrink-0" /> {call.duration}
        </span>
      </div>
    </div>
  );
}

export function CallList({
  selected,
  onSelect,
  onPlay,
  filteredCalls,
}: {
  selected: CallRecord;
  onSelect: (call: CallRecord) => void;
  onPlay: (call: CallRecord) => void;
  filteredCalls: CallRecord[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {filteredCalls.map((call) => (
        <CallCard
          key={call.id}
          call={call}
          selected={selected.id === call.id}
          onClick={() => { onSelect(call); onPlay(call); }}
          onPlay={() => { onSelect(call); onPlay(call); }}
        />
      ))}
    </div>
  );
}
