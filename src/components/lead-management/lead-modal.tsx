'use client';

import { useState } from 'react';
import { X, Clock } from 'lucide-react';

// ─── Extended modal data (keyed by lead ID) ───────────────────────────────────

type LeadExtra = {
  phone: string;
  source: string;
  intent: string;
  date: string;
  callHistory: { date: string; note: string; detail: string }[];
  notes: string;
  followUps: { action: string; date: string }[];
};

const leadExtras: Record<string, LeadExtra> = {
  'LD-001': {
    phone: '98XXX-XX123', source: 'Inbound Call', intent: 'Loan Enquiry & Eligibility', date: '2026-04-10',
    callHistory: [{ date: '2026-04-10', note: 'Eligibility confirmed', detail: 'Customer has 25g 22K gold. Eligible for ₹1.1L at current LTV. Agreed to visit branch tomorrow.' }],
    notes: 'First-time borrower. Needs simplified documentation guidance at branch.',
    followUps: [{ action: 'Branch visit confirmation call', date: '2026-04-11' }],
  },
  'LD-002': {
    phone: '87XXX-XX456', source: 'Inbound Call', intent: 'Loan Renewal & Top-Up', date: '2026-04-10',
    callHistory: [{ date: '2026-04-10', note: 'Top-up eligibility checked', detail: 'Current loan ₹1.8L, gold revalued to ₹2.2L. Top-up of ₹40K approved pending documentation.' }],
    notes: 'Returning customer — 2nd renewal. High LTV, prioritise fast processing.',
    followUps: [{ action: 'Document collection follow-up', date: '2026-04-11' }],
  },
  'LD-003': {
    phone: '96XXX-XX456', source: 'Inbound Call', intent: 'Interest Rate', date: '2026-04-10',
    callHistory: [{ date: '2026-04-10', note: 'Chola rate sheet shared', detail: 'Comparing rates across lenders. Currently with Manappuram at 14%.' }],
    notes: 'Price-sensitive customer. If we match 12.5%, likely to convert.',
    followUps: [{ action: 'Follow-up call with special rate offer', date: '2026-04-11' }],
  },
  'LD-004': {
    phone: '76XXX-XX789', source: 'Branch Walk-in', intent: 'Loan Enquiry & Eligibility', date: '2026-04-09',
    callHistory: [{ date: '2026-04-09', note: 'Callback scheduled', detail: 'Customer prefers morning callbacks. Gold weight 15g — eligible for ₹67K. Waiting for branch manager callback.' }],
    notes: 'Senior citizen — needs assisted documentation. Assign patient agent.',
    followUps: [{ action: 'Morning callback by branch manager', date: '2026-04-12' }],
  },
  'LD-005': {
    phone: '91XXX-XX234', source: 'Referral', intent: 'Loan Enquiry & Eligibility', date: '2026-04-10',
    callHistory: [{ date: '2026-04-10', note: 'Walk-in confirmed for today', detail: 'Referred by existing customer. 40g gold ready. Branch visit same-day. High urgency — needs immediate disbursal.' }],
    notes: 'Referred by Suresh Nair\'s existing customer. Handle with priority.',
    followUps: [{ action: 'Post-visit disbursal confirmation', date: '2026-04-10' }],
  },
  'LD-006': {
    phone: '82XXX-XX567', source: 'Inbound Call', intent: 'Complaint & Grievance', date: '2026-04-08',
    callHistory: [
      { date: '2026-04-08', note: 'First contact — no resolution', detail: 'Customer called about rate dispute. Agent transferred, no callback given.' },
      { date: '2026-04-09', note: 'Second call — escalated', detail: 'Customer called again. Still unresolved. Marked cold in CRM.' },
    ],
    notes: 'Two unsuccessful follow-up attempts. Risk of losing to competitor. Needs escalation.',
    followUps: [{ action: 'Senior agent escalation call', date: '2026-04-14' }],
  },
  'LD-007': {
    phone: '94XXX-XX890', source: 'Inbound Call', intent: 'Loan Renewal & Top-Up', date: '2026-04-09',
    callHistory: [{ date: '2026-04-09', note: 'Top-up processing initiated', detail: '3rd renewal from this customer. High LTV. Top-up approved at ₹1.55L. Documentation complete.' }],
    notes: 'High LTV repeat customer — offer loyalty rate discount at next renewal.',
    followUps: [{ action: 'Disbursal status update call', date: '2026-04-11' }],
  },
  'LD-008': {
    phone: '79XXX-XX123', source: 'Website', intent: 'Loan Enquiry & Eligibility', date: '2026-04-10',
    callHistory: [
      { date: '2026-04-09', note: 'First callback — no answer', detail: 'Customer did not pick up. Left voicemail.' },
      { date: '2026-04-10', note: 'Second callback — connected', detail: 'Customer confirmed interest. 45g gold, eligible for ₹2.0L. Appointment booked.' },
    ],
    notes: 'Website lead — digital-first customer. Prefers WhatsApp updates over calls.',
    followUps: [{ action: 'WhatsApp appointment reminder', date: '2026-04-11' }],
  },
  'LD-009': {
    phone: '85XXX-XX678', source: 'Branch Walk-in', intent: 'Loan Enquiry & Eligibility', date: '2026-04-10',
    callHistory: [{ date: '2026-04-10', note: 'Manager callback arranged', detail: '60g gold — highest value lead this week. Eligible for ₹2.7L. Branch manager personally handling.' }],
    notes: 'VIP lead — ₹2.7L pipeline. Assign branch manager and offer preferential rate.',
    followUps: [{ action: 'Branch manager personal call + preferential rate offer', date: '2026-04-11' }],
  },
  'LD-010': {
    phone: '73XXX-XX345', source: 'Referral', intent: 'Gold Release & Loan Closure', date: '2026-04-07',
    callHistory: [{ date: '2026-04-07', note: 'No follow-up within 24 hours', detail: 'Lead went cold. Customer mentioned going to competitor (Muthoot) for faster processing.' }],
    notes: 'Lost lead — went to competitor. Post-mortem: no follow-up within 24-hour window.',
    followUps: [{ action: 'Win-back call with express 2-hour disbursal offer', date: '2026-04-14' }],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = 'Hot' | 'Warm' | 'Cold';

export type Lead = {
  id: string;
  customer: string;
  branch: string;
  gold: string;
  value: string;
  status: LeadStatus;
  nextAction: string;
  agent: string;
};

type Tab = 'Overview' | 'Call History' | 'Notes' | 'Follow-ups';

const statusStyles: Record<LeadStatus, string> = {
  Hot:  'text-red-500',
  Warm: 'text-amber-500',
  Cold: 'text-gray-400',
};

// ─── Modal Component ──────────────────────────────────────────────────────────

export function LeadModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const tabs: Tab[] = ['Overview', 'Call History', 'Notes', 'Follow-ups'];
  const extra = leadExtras[lead.id];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h3 className="text-[15px] font-bold text-gray-900">
            {lead.customer} — {lead.id}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-1 px-6 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="px-6 py-5">

          {/* Overview */}
          {activeTab === 'Overview' && (
            <div>
              {/* 3-stat strip */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Gold Weight</p>
                  <p className="text-[20px] font-bold text-gray-900">{lead.gold}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Est. Value</p>
                  <p className="text-[20px] font-bold text-red-500">{lead.value}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Status</p>
                  <p className={`text-[20px] font-bold ${statusStyles[lead.status]}`}>{lead.status}</p>
                </div>
              </div>

              {/* Detail rows */}
              <div className="space-y-2.5">
                {[
                  { label: 'Phone',  value: extra.phone },
                  { label: 'Branch', value: lead.branch },
                  { label: 'Agent',  value: lead.agent },
                  { label: 'Source', value: extra.source },
                  { label: 'Intent', value: extra.intent },
                  { label: 'Date',   value: extra.date },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[12px] text-gray-400">{label}:</span>
                    <span className="text-[12px] font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call History */}
          {activeTab === 'Call History' && (
            <div className="space-y-4">
              {extra.callHistory.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={12} className="text-red-400 shrink-0" />
                    <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                      {c.date}
                    </span>
                    <span className="text-[12px] font-semibold text-gray-900">{c.note}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed pl-5">{c.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {activeTab === 'Notes' && (
            <p className="text-[13px] text-gray-600 leading-relaxed">{extra.notes}</p>
          )}

          {/* Follow-ups */}
          {activeTab === 'Follow-ups' && (
            <div className="space-y-3">
              {extra.followUps.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-[13px] text-gray-700">{f.action}</p>
                  <span className="text-[12px] font-semibold text-red-500 shrink-0 ml-4">{f.date}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
