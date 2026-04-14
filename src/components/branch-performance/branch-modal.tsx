'use client';

import { useState } from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BranchStatusType = 'Strong' | 'Average' | 'Needs Attention' | 'Critical';

export type BranchRecord = {
  name: string;
  calls: number;
  complaints: number;
  auctionAlerts: number;
  fcr: string;
  csat: number;
  disbursals: number;
  status: BranchStatusType;
};

// ─── Extended modal data per branch ──────────────────────────────────────────

type BranchExtra = {
  topIntents: string[];
  topAgents: { name: string; calls: number; csat: number }[];
  keyIssues: string[];
  opportunities: string[];
};

const branchExtras: Record<string, BranchExtra> = {
  'Chennai - T.Nagar': {
    topIntents: ['Loan Enquiry (48)', 'Loan Renewal (32)', 'Gold Release (25)'],
    topAgents: [
      { name: 'Priya Sharma',  calls: 58, csat: 4.5 },
      { name: 'Deepa Menon',   calls: 49, csat: 4.2 },
    ],
    keyIssues: ['Minor delays in peak hour queue management'],
    opportunities: ['Strong FCR — promote as model branch', 'Upsell top-up to renewal customers'],
  },
  'Chennai - Anna Nagar': {
    topIntents: ['Loan Enquiry (35)', 'Complaint (20)', 'EMI Assistance (18)'],
    topAgents: [
      { name: 'Rajesh Kumar',  calls: 35, csat: 4.2 },
      { name: 'Kavitha Rajan', calls: 32, csat: 4.0 },
    ],
    keyIssues: ['Above-average complaint rate', 'Staff turnover affecting service quality'],
    opportunities: ['Improve complaint handling process', 'Conduct customer feedback survey'],
  },
  'Coimbatore - RS Puram': {
    topIntents: ['Interest Rate (28)', 'Auction Alert (22)', 'Complaint (18)'],
    topAgents: [
      { name: 'Anita Verma',   calls: 30, csat: 3.8 },
      { name: 'Suresh Nair',   calls: 28, csat: 3.5 },
    ],
    keyIssues: ['High auction alert volume — rate miscommunication', 'FCR below 70% threshold'],
    opportunities: ['Standardize interest rate communication scripts', 'Target FCR improvement to 70%+'],
  },
  'Madurai - Main Branch': {
    topIntents: ['Loan Enquiry (40)', 'Gold Release (28)', 'Renewal (22)'],
    topAgents: [
      { name: 'Suresh Nair',   calls: 45, csat: 4.6 },
      { name: 'Arun Prasad',   calls: 38, csat: 4.3 },
    ],
    keyIssues: ['Slight weekend staffing gap observed'],
    opportunities: ['Best FCR in region — share playbook with other branches', 'Expand weekend hours to capture more disbursals'],
  },
  'Bangalore - Koramangala': {
    topIntents: ['Renewal (38)', 'Complaint (25)', 'Auction Alert (20)'],
    topAgents: [
      { name: 'Vikram Singh',  calls: 40, csat: 3.9 },
      { name: 'Deepa Menon',   calls: 35, csat: 3.8 },
    ],
    keyIssues: ['Rising auction alert volume (+22% WoW)', 'CSAT dipping below 4.0'],
    opportunities: ['Deploy auction de-escalation training', 'Run customer satisfaction pulse survey'],
  },
  'Hyderabad - Ameerpet': {
    topIntents: ['Complaint (30)', 'Auction Alert (25)', 'EMI Assistance (18)'],
    topAgents: [
      { name: 'Anita Verma',   calls: 28, csat: 3.5 },
      { name: 'Rajesh Kumar',  calls: 22, csat: 3.4 },
    ],
    keyIssues: ['Highest complaint rate in region', 'Multiple auction notices without prior customer contact', 'Staff behavior complaints logged'],
    opportunities: ['Mandatory customer service refresher within 2 weeks', 'Implement 3-tier pre-auction notification system'],
  },
  'Mumbai - Andheri': {
    topIntents: ['Loan Enquiry (52)', 'Renewal (38)', 'Gold Safety (20)'],
    topAgents: [
      { name: 'Deepa Menon',   calls: 62, csat: 4.6 },
      { name: 'Priya Sharma',  calls: 50, csat: 4.3 },
    ],
    keyIssues: ['Occasional long wait times during weekday mornings'],
    opportunities: ['Highest disbursal volume — study and replicate process', 'Cross-sell insurance on all gold release calls'],
  },
  'Delhi - Karol Bagh': {
    topIntents: ['Complaint (35)', 'Auction Alert (28)', 'Interest Rate (18)'],
    topAgents: [
      { name: 'Kavitha Rajan', calls: 25, csat: 3.3 },
      { name: 'Anita Verma',   calls: 20, csat: 3.1 },
    ],
    keyIssues: ['Critical — lowest FCR and CSAT in region', 'Highest complaint count (20)', 'No follow-up SLA being observed'],
    opportunities: ['Immediate branch manager intervention required', 'Assign regional coach for 4-week intensive programme', 'Review and reset all open complaint tickets'],
  },
};

// ─── Modal Component ──────────────────────────────────────────────────────────

type Tab = 'Overview' | 'Top Agents' | 'Key Issues' | 'Opportunities';

export function BranchModal({ branch, onClose }: { branch: BranchRecord; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const tabs: Tab[] = ['Overview', 'Top Agents', 'Key Issues', 'Opportunities'];
  const extra = branchExtras[branch.name];

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
          <h3 className="text-[15px] font-bold text-gray-900">{branch.name}</h3>
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
              {/* 4-stat strip */}
              <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
                {[
                  { label: 'Calls',      value: branch.calls },
                  { label: 'FCR',        value: branch.fcr },
                  { label: 'CSAT',       value: branch.csat },
                  { label: 'Disbursals', value: branch.disbursals },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">{label}</p>
                    <p className="text-[18px] font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* Top Intent Categories */}
              <p className="text-[12px] font-bold text-gray-700 mb-2">Top Intent Categories</p>
              <div className="space-y-1">
                {extra.topIntents.map((intent) => (
                  <p key={intent} className="text-[13px] text-gray-600 py-1 px-2 rounded-lg hover:bg-gray-50">
                    {intent}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Top Agents */}
          {activeTab === 'Top Agents' && (
            <div className="space-y-1">
              {extra.topAgents.map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-[11px] text-gray-400">{agent.calls} calls handled</p>
                  </div>
                  <span className="text-[14px] font-bold text-red-500">
                    ★ {agent.csat}/5
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Key Issues */}
          {activeTab === 'Key Issues' && (
            <div className="space-y-2">
              {extra.keyIssues.map((issue) => (
                <div
                  key={issue}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-red-50/60 border border-red-100"
                >
                  <AlertTriangle size={13} className="text-orange-500 shrink-0" />
                  <p className="text-[13px] text-gray-700">{issue}</p>
                </div>
              ))}
            </div>
          )}

          {/* Opportunities */}
          {activeTab === 'Opportunities' && (
            <div className="space-y-2">
              {extra.opportunities.map((opp) => (
                <div
                  key={opp}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-green-50/60 border border-green-100"
                >
                  <ArrowRight size={13} className="text-green-600 shrink-0" />
                  <p className="text-[13px] text-gray-700">{opp}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
