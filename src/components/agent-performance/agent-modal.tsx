'use client';

import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

// ─── Shared Types ─────────────────────────────────────────────────────────────

export type AgentStatusType = 'Top Performer' | 'Good' | 'Needs Coaching' | 'Average';

export type AgentRecord = {
  name: string;
  calls: number;
  fcr: string;
  csat: number;
  avgHandle: string;
  sentiment: string;
  status: AgentStatusType;
};

// ─── Extended modal data per agent ───────────────────────────────────────────

type AgentExtra = {
  topIntents: string[];
  strengths: string[];
  improvements: string[];
  feedback: { caller: string; comment: string; rating: number }[];
};

const agentExtras: Record<string, AgentExtra> = {
  'Priya Sharma': {
    topIntents: ['Loan Enquiry (32)', 'Loan Renewal (28)', 'Gold Release (18)'],
    strengths: ['Fastest resolution time in team', 'Excellent upsell conversion on renewals', 'Consistently high customer empathy scores'],
    improvements: ['Occasional rushed closings on complex calls', 'Could improve auction-alert de-escalation technique'],
    feedback: [
      { caller: 'Ramesh S.',  comment: 'Very helpful and patient. Explained everything clearly.', rating: 5 },
      { caller: 'Divya M.',   comment: 'Quick and professional. Best agent I\'ve spoken to.', rating: 5 },
    ],
  },
  'Rajesh Kumar': {
    topIntents: ['Interest Rate (22)', 'Complaint (18)', 'EMI Assistance (14)'],
    strengths: ['Good complaint handling', 'Patient with difficult callers', 'Accurate information sharing'],
    improvements: ['Needs to reduce average handle time', 'Should improve follow-up scheduling'],
    feedback: [
      { caller: 'Arjun P.',   comment: 'Handled my complaint well.', rating: 4 },
      { caller: 'Seetha L.',  comment: 'Very knowledgeable.', rating: 4 },
    ],
  },
  'Anita Verma': {
    topIntents: ['Auction Alert (28)', 'Complaint (22)', 'Repayment (16)'],
    strengths: ['Handles high-volume calls efficiently', 'Strong product knowledge on auction process'],
    improvements: ['FCR below team average — needs structured resolution checklist', 'Customer sentiment scores declining — requires empathy refresher', 'Frequent call transfers without resolution attempt'],
    feedback: [
      { caller: 'Lakshmi V.', comment: 'Call was transferred multiple times. Frustrating.', rating: 2 },
      { caller: 'Ganesh I.',  comment: 'She was polite but couldn\'t resolve my issue.', rating: 3 },
    ],
  },
  'Suresh Nair': {
    topIntents: ['Loan Renewal (30)', 'Gold Release (22)', 'Loan Enquiry (18)'],
    strengths: ['High FCR — resolves most calls in single interaction', 'Strong documentation guidance skills', 'Proactive in offering top-up during renewals'],
    improvements: ['Could be more assertive on upsell opportunities', 'Sentiment score can improve with warmer opening scripts'],
    feedback: [
      { caller: 'Meena K.',   comment: 'Resolved my renewal quickly. Very smooth.', rating: 4 },
      { caller: 'Kavitha R.', comment: 'Friendly and thorough.', rating: 5 },
    ],
  },
  'Deepa Menon': {
    topIntents: ['Loan Enquiry (24)', 'Gold Safety (18)', 'Renewal (14)'],
    strengths: ['Best FCR and CSAT in the team', 'Exceptional clarity in rate and scheme explanations', 'High emotional intelligence during distress calls'],
    improvements: ['Slightly lower call volume — can take on more complex queues'],
    feedback: [
      { caller: 'Suresh K.',   comment: 'Best agent experience I\'ve had. Solved everything.', rating: 5 },
      { caller: 'Seetha L.',   comment: 'Clear, calm and professional. 10/10.', rating: 5 },
    ],
  },
  'Vikram Singh': {
    topIntents: ['Auction Alert (30)', 'Complaint (20)', 'Interest Rate (8)'],
    strengths: ['High call volume — available and responsive', 'Knows process steps well'],
    improvements: ['Lowest CSAT in team — needs immediate coaching intervention', 'Long AHT on auction alerts — not following structured script', 'Customers frequently call back — first-contact resolution failing', 'Lacks empathy on distress calls'],
    feedback: [
      { caller: 'Arjun P.',    comment: 'Didn\'t solve my issue and seemed disinterested.', rating: 2 },
      { caller: 'Meena R.',    comment: 'Had to call back 3 times for the same problem.', rating: 1 },
    ],
  },
  'Kavitha Rajan': {
    topIntents: ['Complaint (25)', 'Loan Enquiry (20)', 'EMI Assistance (18)'],
    strengths: ['Consistent performance across intent categories', 'Good at de-escalating complaint calls', 'Reliable documentation and CRM updating'],
    improvements: ['Could improve upsell pitch on enquiry calls', 'Sentiment scores slightly below Good threshold'],
    feedback: [
      { caller: 'Ramesh S.',  comment: 'She was calm and listened carefully.', rating: 4 },
      { caller: 'Lakshmi V.', comment: 'Helped resolve complaint faster than expected.', rating: 4 },
    ],
  },
  'Arun Prasad': {
    topIntents: ['Gold Safety (20)', 'Loan Enquiry (18)', 'Repayment (16)'],
    strengths: ['Thorough in explaining gold safety and insurance', 'Low complaint rate on handled calls'],
    improvements: ['FCR at 70% — needs checklist adherence improvement', 'Lower sentiment score — tone coaching recommended', 'Reduce average handle time on simple enquiry calls'],
    feedback: [
      { caller: 'Seetha L.',  comment: 'Explained insurance coverage very clearly.', rating: 4 },
      { caller: 'Ganesh I.',  comment: 'Decent, but took longer than expected to resolve.', rating: 3 },
    ],
  },
};

// ─── Modal ────────────────────────────────────────────────────────────────────

type Tab = 'Overview' | 'Strengths' | 'Improvements' | 'Feedback';

export function AgentModal({ agent, onClose }: { agent: AgentRecord; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const tabs: Tab[] = ['Overview', 'Strengths', 'Improvements', 'Feedback'];
  const extra = agentExtras[agent.name];

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
          <h3 className="text-[15px] font-bold text-gray-900">{agent.name}</h3>
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
              className={`px-3 py-2 text-[12px] font-medium rounded-t-lg transition-colors whitespace-nowrap ${
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
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
                {[
                  { label: 'CSAT', value: `${agent.csat}/5` },
                  { label: 'FCR',  value: agent.fcr },
                  { label: 'AHT',  value: agent.avgHandle },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">{label}</p>
                    <p className="text-[18px] font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <p className="text-[12px] font-bold text-gray-700 mb-2">Top Intents Handled</p>
              <div className="space-y-1">
                {extra.topIntents.map((intent) => (
                  <p key={intent} className="text-[13px] text-gray-600 py-1 px-2 rounded-lg hover:bg-gray-50">
                    {intent}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {activeTab === 'Strengths' && (
            <div className="space-y-2">
              {extra.strengths.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-green-50/60 border border-green-100"
                >
                  <Check size={13} className="text-green-600 shrink-0" />
                  <p className="text-[13px] text-gray-700">{s}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improvements */}
          {activeTab === 'Improvements' && (
            <div className="space-y-2">
              {extra.improvements.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50/60 border border-amber-100"
                >
                  <AlertCircle size={13} className="text-amber-500 shrink-0" />
                  <p className="text-[13px] text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          )}

          {/* Feedback */}
          {activeTab === 'Feedback' && (
            <div className="space-y-1">
              {extra.feedback.map((fb) => (
                <div
                  key={fb.caller}
                  className="flex items-start justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 mb-0.5">{fb.caller}</p>
                    <p className="text-[12px] text-gray-500">{fb.comment}</p>
                  </div>
                  <span className="text-[14px] font-bold text-red-500 shrink-0 ml-4">
                    ★ {fb.rating}/5
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
