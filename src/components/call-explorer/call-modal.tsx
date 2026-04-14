'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { CallRecord, SentimentType } from './call-list';

// ─── Extended mock data per call ──────────────────────────────────────────────

type Line = { speaker: 'Agent' | 'Caller'; text: string };

type CallExtra = {
  transcript: Line[];
  keywords: string[];
  actionsTaken: string[];
};

const callExtras: Record<string, CallExtra> = {
  'CGL-1001': {
    transcript: [
      { speaker: 'Agent',  text: 'Welcome to Chola Gold Loan. How may I help you today?' },
      { speaker: 'Caller', text: 'I want to know if I can get a gold loan for my 25g jewelry.' },
      { speaker: 'Agent',  text: 'Of course! 22K gold at current LTV gives you up to ₹1.1 lakh. May I know the purity?' },
      { speaker: 'Caller', text: 'It\'s 22K gold. What documents do I need?' },
      { speaker: 'Agent',  text: 'Just your Aadhaar, PAN, and the original gold. You can visit any branch today.' },
      { speaker: 'Caller', text: 'Great, I\'ll visit Chennai T. Nagar tomorrow morning.' },
      { speaker: 'Agent',  text: 'Perfect! I\'ll note that. You\'ll be assisted by our senior loan officer.' },
    ],
    keywords: ['gold loan', 'eligibility', '22K', 'disbursal', 'branch visit'],
    actionsTaken: [
      'Eligibility confirmed for ₹1.1L',
      'Branch visit appointment noted for tomorrow',
      'Document checklist shared via SMS',
    ],
  },
  'CGL-1002': {
    transcript: [
      { speaker: 'Agent',  text: 'Welcome to Chola Gold Loan. How can I assist you?' },
      { speaker: 'Caller', text: 'I got a notice saying my gold will be auctioned! What\'s happening?' },
      { speaker: 'Agent',  text: 'I\'m sorry to hear that. Let me pull up your account details.' },
      { speaker: 'Caller', text: 'I\'ve been trying to pay but the branch keeps asking me to come in person!' },
      { speaker: 'Agent',  text: 'I understand your frustration. Let me transfer you to our resolution desk.' },
      { speaker: 'Caller', text: 'Please don\'t transfer me, nobody helps! I need this resolved now!' },
      { speaker: 'Agent',  text: 'I\'ll escalate this right now and ensure a callback within 2 hours.' },
    ],
    keywords: ['auction alert', 'default', 'escalation', 'repayment', 'distress'],
    actionsTaken: [
      'Escalation ticket raised (Priority: High)',
      'Callback committed within 2 hours',
      'Branch manager notified via email',
    ],
  },
  'CGL-1003': {
    transcript: [
      { speaker: 'Agent',  text: 'Welcome to Chola Gold Loan. How may I help?' },
      { speaker: 'Caller', text: 'I\'ve paid my full loan amount. When can I collect my gold?' },
      { speaker: 'Agent',  text: 'Let me verify... Yes sir, payment of ₹2,45,000 received. Your gold can be released tomorrow.' },
      { speaker: 'Caller', text: 'What documents do I need?' },
      { speaker: 'Agent',  text: 'Please bring your loan agreement, ID proof, and the original receipt.' },
      { speaker: 'Caller', text: 'Can my son collect it?' },
      { speaker: 'Agent',  text: 'Yes, with an authorization letter and his ID proof.' },
    ],
    keywords: ['gold release', 'loan closure', 'payment confirmed', 'collection'],
    actionsTaken: [
      'Gold release scheduled',
      'Document checklist shared via SMS',
      'Closure confirmation generated',
    ],
  },
  'CGL-1004': {
    transcript: [
      { speaker: 'Agent',  text: 'Thank you for calling Chola. How can I help?' },
      { speaker: 'Caller', text: 'I was charged a different interest rate than what the branch told me!' },
      { speaker: 'Agent',  text: 'I apologize for the confusion. Can you share your loan account number?' },
      { speaker: 'Caller', text: 'It\'s GL-2024-4892. They said 12% but I\'m being charged 14.5%.' },
      { speaker: 'Agent',  text: 'I see the discrepancy. This is a branch communication error. I\'ll log a dispute.' },
      { speaker: 'Caller', text: 'How long will this take to resolve?' },
      { speaker: 'Agent',  text: 'Our team will review and respond within 3 business days.' },
    ],
    keywords: ['interest rate', 'dispute', 'fee discrepancy', 'branch error', 'complaint'],
    actionsTaken: [
      'Rate dispute ticket created',
      'Branch manager notified of discrepancy',
      'Customer refund review initiated',
    ],
  },
  'CGL-1005': {
    transcript: [
      { speaker: 'Agent',  text: 'Welcome to Chola Gold Loan. How may I assist?' },
      { speaker: 'Caller', text: 'I want to file a complaint against your Hyderabad branch staff.' },
      { speaker: 'Agent',  text: 'I\'m really sorry to hear this. Please share what happened.' },
      { speaker: 'Caller', text: 'The manager was extremely rude when I came to renew my loan. He made me wait 2 hours.' },
      { speaker: 'Agent',  text: 'This is unacceptable. I\'m logging a formal grievance and escalating to the regional head.' },
      { speaker: 'Caller', text: 'Will anyone follow up with me?' },
      { speaker: 'Agent',  text: 'Yes, our grievance team will call you within 48 hours with a resolution.' },
    ],
    keywords: ['complaint', 'grievance', 'rude behavior', 'branch escalation', 'formal complaint'],
    actionsTaken: [
      'Formal grievance ticket logged',
      'Regional head notified',
      '48-hour resolution commitment given',
    ],
  },
  'CGL-1006': {
    transcript: [
      { speaker: 'Agent',  text: 'Hi, this is Deepa from Chola. You\'re eligible for a loan renewal!' },
      { speaker: 'Caller', text: 'Really? My current loan is up for renewal next month.' },
      { speaker: 'Agent',  text: 'Yes! And based on current gold rates, you also qualify for a ₹40K top-up.' },
      { speaker: 'Caller', text: 'That\'s great news. What\'s the process?' },
      { speaker: 'Agent',  text: 'I\'ll pre-check your eligibility now — just 2 documents needed at the branch.' },
      { speaker: 'Caller', text: 'Can I come to Madurai main branch this Saturday?' },
      { speaker: 'Agent',  text: 'Absolutely! I\'ll book your appointment and send a confirmation SMS.' },
    ],
    keywords: ['renewal', 'top-up', 'upsell', 'appointment', 'eligibility'],
    actionsTaken: [
      'Top-up eligibility pre-confirmed',
      'Saturday branch appointment booked',
      'Renewal reminder SMS scheduled',
    ],
  },
  'CGL-1007': {
    transcript: [
      { speaker: 'Agent',  text: 'Good afternoon, Chola Gold Loan. How can I assist?' },
      { speaker: 'Caller', text: 'I want to change my EMI due date from 5th to 15th of every month.' },
      { speaker: 'Agent',  text: 'I can help with that. May I have your loan account number?' },
      { speaker: 'Caller', text: 'GL-2024-7731.' },
      { speaker: 'Agent',  text: 'Got it. You can update this via the Chola app under Loan Management > EMI Settings.' },
      { speaker: 'Caller', text: 'I don\'t have the app. Can you do it for me?' },
      { speaker: 'Agent',  text: 'Of course! I\'ve updated it. The change will reflect from next billing cycle.' },
    ],
    keywords: ['EMI', 'repayment', 'date change', 'loan management', 'billing'],
    actionsTaken: [
      'EMI date updated to 15th',
      'Confirmation SMS sent to registered number',
      'App download link shared via SMS',
    ],
  },
  'CGL-1008': {
    transcript: [
      { speaker: 'Agent',  text: 'Hello, thank you for calling Chola Gold Loan.' },
      { speaker: 'Caller', text: 'I wanted to confirm — is my gold actually insured while it\'s with you?' },
      { speaker: 'Agent',  text: 'Yes, absolutely. Your gold is covered under our comprehensive insurance policy.' },
      { speaker: 'Caller', text: 'What does the insurance cover exactly?' },
      { speaker: 'Agent',  text: 'It covers theft, fire, and natural disasters at our vault facility.' },
      { speaker: 'Caller', text: 'That\'s reassuring. What about the safety certificate?' },
      { speaker: 'Agent',  text: 'I\'m sending your gold safety certificate and vault receipt to your email right now.' },
    ],
    keywords: ['gold safety', 'insurance', 'vault', 'certificate', 'coverage'],
    actionsTaken: [
      'Safety certificate shared via email',
      'Insurance coverage details confirmed',
      'Vault receipt copy sent',
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'Summary' | 'Transcript' | 'Keywords' | 'Actions Taken';

const sentimentColor: Record<SentimentType, string> = {
  Positive: 'text-green-600',
  Neutral:  'text-amber-500',
  Negative: 'text-red-500',
};

// ─── Modal Component ──────────────────────────────────────────────────────────

export function CallModal({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('Summary');
  const tabs: Tab[] = ['Summary', 'Transcript', 'Keywords', 'Actions Taken'];
  const extra = callExtras[call.id];

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
            Call {call.id} — {call.caller}
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

          {/* Summary */}
          {activeTab === 'Summary' && (
            <div>
              {/* 3-stat strip */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Duration</p>
                  <p className="text-[20px] font-bold text-gray-900">{call.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Quality</p>
                  <p className="text-[20px] font-bold text-red-500">{call.quality}/100</p>
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">Sentiment</p>
                  <p className={`text-[20px] font-bold ${sentimentColor[call.sentiment]}`}>{call.sentiment}</p>
                </div>
              </div>

              <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{call.summary}</p>

              <div className="space-y-1.5">
                <p className="text-[12px] text-gray-500">
                  Agent: <span className="font-semibold text-gray-900">{call.agent}</span>
                </p>
                <p className="text-[12px] text-gray-500">
                  Branch: <span className="font-semibold text-gray-900">{call.branch}</span>
                </p>
              </div>
            </div>
          )}

          {/* Transcript */}
          {activeTab === 'Transcript' && (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {extra.transcript.map((line, i) => (
                <p key={i} className="text-[13px] text-gray-700 leading-relaxed">
                  <span className="font-semibold text-gray-900">{line.speaker}: </span>
                  {line.text}
                </p>
              ))}
            </div>
          )}

          {/* Keywords */}
          {activeTab === 'Keywords' && (
            <div className="flex flex-wrap gap-2">
              {extra.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 text-[12px] font-medium text-red-500 bg-red-50 rounded-full border border-red-200"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Actions Taken */}
          {activeTab === 'Actions Taken' && (
            <div className="space-y-3">
              {extra.actionsTaken.map((action, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Check size={14} className="text-green-500 shrink-0" />
                  <p className="text-[13px] text-gray-700">{action}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
