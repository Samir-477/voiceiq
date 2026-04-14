'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

type SentimentType = 'Positive' | 'Neutral' | 'Negative';

type SampleCall = { id: string; caller: string; outcome: string };

type IntentRow = {
  intent: string;
  calls: number;
  share: string;
  trend: string;
  trendPositive: boolean;
  sentiment: SentimentType;
  avgHandle: string;
  summary: string;
  topQuestions: string[];
  actions: string[];
  sampleCalls: SampleCall[];
};

const intents: IntentRow[] = [
  {
    intent: 'Loan Enquiry & Eligibility',
    calls: 312, share: '24.3%', trend: '+5%', trendPositive: true,
    sentiment: 'Positive', avgHandle: '3m 45s',
    summary: 'Customers enquiring about gold loan eligibility, required documents, and applicable interest rates. Most callers are first-time borrowers.',
    topQuestions: ['What documents are needed for a gold loan?', 'What is the minimum gold purity accepted?', 'How quickly can I get the loan?'],
    actions: ['Send pre-call SMS with eligibility checklist', 'Create a WhatsApp bot for common eligibility queries'],
    sampleCalls: [{ id: 'CGL-1001', caller: 'Ramesh S.', outcome: 'Branch visit scheduled' }, { id: 'CGL-1019', caller: 'Divya M.', outcome: 'Eligibility confirmed' }],
  },
  {
    intent: 'Interest Rate & Charges',
    calls: 198, share: '15.4%', trend: '+2%', trendPositive: true,
    sentiment: 'Neutral', avgHandle: '4m 10s',
    summary: 'Customers comparing Chola rates with competitors. 18% mention rival lenders offering lower rates. Confusion around processing fees is common.',
    topQuestions: ['What is the current interest rate on gold loans?', 'Are there any hidden charges?', 'Why is my rate higher than advertised?'],
    actions: ['Train agents on rate justification scripts', 'Launch limited-time rate-match offer for high-value accounts'],
    sampleCalls: [{ id: 'CGL-1003', caller: 'Suresh K.', outcome: 'Rate sheet shared' }, { id: 'CGL-1044', caller: 'Meena R.', outcome: 'Dispute escalated' }],
  },
  {
    intent: 'Repayment & EMI Assistance',
    calls: 176, share: '13.7%', trend: '-3%', trendPositive: false,
    sentiment: 'Neutral', avgHandle: '5m 20s',
    summary: 'Customers seeking EMI restructuring, payment date changes, and prepayment options. Many prefer bullet repayment.',
    topQuestions: ['Can I change my EMI due date?', 'What happens if I miss an EMI?', 'Is there a prepayment penalty?'],
    actions: ['Enable self-service EMI date change via mobile app', 'Proactively send repayment reminders 5 days before due date'],
    sampleCalls: [{ id: 'CGL-1007', caller: 'Karthik N.', outcome: 'EMI restructured' }, { id: 'CGL-1031', caller: 'Amala V.', outcome: 'Prepayment processed' }],
  },
  {
    intent: 'Gold Release & Loan Closure',
    calls: 142, share: '11.1%', trend: '+8%', trendPositive: true,
    sentiment: 'Positive', avgHandle: '6m 05s',
    summary: 'Customers closing their gold loans and seeking release of pledged gold. Rising trend indicates improving loan repayment capacity.',
    topQuestions: ['What is the process to get my gold back?', 'How long does gold release take after full payment?', 'Can someone else collect the gold on my behalf?'],
    actions: ['Streamline gold release process to under 30 minutes for walk-in closures', 'Send closure confirmation via WhatsApp with gold release appointment'],
    sampleCalls: [{ id: 'CGL-1003', caller: 'Suresh K.', outcome: 'Gold release scheduled' }, { id: 'CGL-1022', caller: 'Priya N.', outcome: 'Closure confirmed' }],
  },
  {
    intent: 'Loan Renewal & Top-Up',
    calls: 118, share: '9.2%', trend: '+12%', trendPositive: true,
    sentiment: 'Positive', avgHandle: '4m 30s',
    summary: 'Existing customers renewing expiring loans or seeking additional top-up amounts. Pre-approved customers convert at 78%.',
    topQuestions: ['Can I get a top-up on my existing gold loan?', 'What are the charges for loan renewal?', 'Is my gold revalued at renewal?'],
    actions: ['Proactively call eligible customers 30 days before renewal', 'Offer exclusive renewal rate for on-time payers'],
    sampleCalls: [{ id: 'CGL-1006', caller: 'Divya M.', outcome: 'Top-up approved' }, { id: 'CGL-1028', caller: 'Ganesh I.', outcome: 'Renewal confirmed' }],
  },
  {
    intent: 'Auction Alert & Default Distress',
    calls: 97, share: '7.6%', trend: '+32%', trendPositive: false,
    sentiment: 'Negative', avgHandle: '8m 15s',
    summary: '32% surge this week. Concentrated in Delhi and Hyderabad branches. Customers distressed about imminent gold auction due to EMI defaults.',
    topQuestions: ['My gold is going to be auctioned — what can I do?', 'Can you stop the auction if I pay part of the dues?', 'I got an auction notice but already paid — please check.'],
    actions: ['Deploy emergency retention team for accounts 60+ days overdue', 'Send SMS reminders 30 days before auction trigger'],
    sampleCalls: [{ id: 'CGL-1002', caller: 'Lakshmi V.', outcome: 'Escalation raised' }, { id: 'CGL-1041', caller: 'Arjun P.', outcome: 'Partial payment arranged' }],
  },
  {
    intent: 'Complaint & Grievance',
    calls: 89, share: '6.9%', trend: '+4%', trendPositive: false,
    sentiment: 'Negative', avgHandle: '7m 40s',
    summary: 'Complaints about branch service quality, incorrect interest deductions, and delay in gold valuation appointments.',
    topQuestions: ['My gold was undervalued — I want a re-evaluation', 'Agent was rude at the branch', 'I was charged extra without notice'],
    actions: ['Set 4-hour SLA for complaint acknowledgement', 'Mandate complaint tracking via CRM with daily escalation report'],
    sampleCalls: [{ id: 'CGL-1005', caller: 'Arjun P.', outcome: 'Grievance logged' }, { id: 'CGL-1038', caller: 'Seetha L.', outcome: 'Re-evaluation booked' }],
  },
  {
    intent: 'Account & KYC Update',
    calls: 67, share: '5.2%', trend: '-1%', trendPositive: false,
    sentiment: 'Neutral', avgHandle: '3m 55s',
    summary: 'Customers updating personal details, bank accounts, and re-submitting KYC documents. Mostly routine with low urgency.',
    topQuestions: ['How do I update my mobile number on the account?', 'I need to re-submit my Aadhaar — where do I go?', 'Can I update bank account details for EMI deduction?'],
    actions: ['Enable KYC update via mobile app to reduce branch footfall', 'Send automated KYC expiry reminders 60 days in advance'],
    sampleCalls: [{ id: 'CGL-1014', caller: 'Meena K.', outcome: 'Mobile updated' }, { id: 'CGL-1033', caller: 'Ravi N.', outcome: 'Aadhaar re-submitted' }],
  },
  {
    intent: 'Branch & Disbursal Status',
    calls: 52, share: '4%', trend: '+6%', trendPositive: true,
    sentiment: 'Neutral', avgHandle: '3m 20s',
    summary: 'Customers checking disbursal status, enquiring about branch timings, and tracking loan application progress.',
    topQuestions: ['When will my loan amount be credited?', 'What are your branch timings?', 'Can I check my application status online?'],
    actions: ['Implement automated disbursal status SMS notifications', 'Add real-time application tracker on the mobile app'],
    sampleCalls: [{ id: 'CGL-1018', caller: 'Vijay K.', outcome: 'Status confirmed via SMS' }, { id: 'CGL-1027', caller: 'Anitha B.', outcome: 'Branch timing shared' }],
  },
  {
    intent: 'Gold Safety & Insurance',
    calls: 33, share: '2.6%', trend: '+1%', trendPositive: true,
    sentiment: 'Positive', avgHandle: '4m 00s',
    summary: 'Customers concerned about the safety of pledged gold and asking about insurance cover during the loan period.',
    topQuestions: ['Is my gold insured while with Chola?', 'What happens if the branch is robbed or catches fire?', 'Can I insure my gold separately?'],
    actions: ['Share gold safety certificate proactively at loan origination', 'Create FAQ page specifically for gold safety queries'],
    sampleCalls: [{ id: 'CGL-1008', caller: 'Seetha L.', outcome: 'Certificate emailed' }, { id: 'CGL-1042', caller: 'Kavitha R.', outcome: 'Policy explained' }],
  },
];

// ─── Modal ────────────────────────────────────────────────────────────────────

type Tab = 'Summary' | 'Top Questions' | 'Actions' | 'Sample Calls';

function IntentModal({
  row,
  onClose,
}: {
  row: IntentRow;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('Summary');
  const tabs: Tab[] = ['Summary', 'Top Questions', 'Actions', 'Sample Calls'];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug pr-4">{row.intent}</h3>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 pb-0 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-gray-900 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6">
          {activeTab === 'Summary' && (
            <div>
              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-4 p-4 border border-red-100 rounded-xl bg-red-50/40 mb-4">
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Calls</p>
                  <p className="text-[20px] font-bold text-gray-900">{row.calls}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Trend</p>
                  <p
                    className={`text-[20px] font-bold ${
                      row.trendPositive ? 'text-red-500' : 'text-red-500'
                    }`}
                  >
                    {row.trend}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Avg Time</p>
                  <p className="text-[20px] font-bold text-gray-900">{row.avgHandle}</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 leading-relaxed">{row.summary}</p>
            </div>
          )}

          {activeTab === 'Top Questions' && (
            <ul className="space-y-3">
              {row.topQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[13px] text-gray-700 leading-snug">{q}</p>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Actions' && (
            <ul className="space-y-3">
              {row.actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-red-500 text-[13px] font-bold shrink-0 mt-0.5">→</span>
                  <p className="text-[13px] font-medium text-red-500 leading-snug">{action}</p>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Sample Calls' && (
            <div className="space-y-1">
              {row.sampleCalls.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 mb-0.5">{c.id}</p>
                    <p className="text-[11px] text-gray-400">{c.caller}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-red-500 shrink-0 ml-4">{c.outcome}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

const sentimentStyle: Record<SentimentType, string> = {
  Positive: 'text-green-600',
  Neutral: 'text-amber-500',
  Negative: 'text-red-500',
};

export function IntentBreakdownTable() {
  const [selected, setSelected] = useState<IntentRow | null>(null);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-gray-900">Intent Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Intent
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Calls
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  % Share
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="text-right px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Avg Handle Time
                </th>
              </tr>
            </thead>
            <tbody>
              {intents.map((row, i) => (
                <tr
                  key={row.intent}
                  onClick={() => setSelected(row)}
                  className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50/60 ${
                    i === intents.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-6 py-3.5 text-[13px] font-semibold text-gray-900">
                    {row.intent}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700">{row.calls}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-700">{row.share}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[13px] font-semibold ${
                        row.trendPositive ? 'text-red-500' : 'text-red-400'
                      }`}
                    >
                      {row.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[13px] font-semibold ${sentimentStyle[row.sentiment]}`}
                    >
                      {row.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-[13px] text-gray-700 text-right">
                    {row.avgHandle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <IntentModal row={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
