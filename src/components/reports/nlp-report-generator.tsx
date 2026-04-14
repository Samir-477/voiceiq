'use client';

import { useState } from 'react';
import { Sparkles, Send, Download } from 'lucide-react';

// ─── Mock report data keyed by suggestion text ────────────────────────────────

type ReportTab = 'Key Findings' | 'Root Cause Breakdown' | 'Recommended Actions';

type GeneratedReport = {
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  keyFindings: string;
  rootCauses: string[];
  actions: string[];
};

const mockReports: Record<string, GeneratedReport> = {
  'Top 5 branches with highest complaint rate this week': {
    title: 'Branch Complaint Rate Analysis — Week of Apr 7–11, 2026',
    subtitle:
      'This report identifies the top 5 branches with the highest complaint rates based on voice analytics data from 2,847 calls processed this week.',
    stats: [
      { label: 'Total Complaints',       value: '412' },
      { label: 'Avg Complaint Rate',     value: '8.7%' },
      { label: 'Highest Branch',         value: 'Chennai T. Nagar (14.2%)' },
      { label: 'Top Complaint Category', value: 'Gold Valuation (38%)' },
    ],
    keyFindings:
      'Chennai T. Nagar leads with a 14.2% complaint rate, primarily driven by gold valuation disputes (42%) and delayed disbursal (31%). Coimbatore RS Puram follows at 11.8%, with most complaints related to interest rate miscommunication. Madurai Main branch shows a concerning upward trend — complaint rate increased from 6.1% to 10.5% in two weeks.',
    rootCauses: [
      'Gold valuation disputes: 38% of all complaints',
      'Interest rate miscommunication: 24%',
      'Delayed disbursal: 19%',
      'Rude agent behavior: 11%',
      'Auction process concerns: 8%',
    ],
    actions: [
      'Deploy gold valuation training module at Chennai T. Nagar — target 50% complaint reduction in 2 weeks',
      'Standardize interest rate communication scripts across Coimbatore branches',
      'Investigate disbursal bottleneck at Madurai Main — likely process delay, not agent issue',
      'Schedule quality audits for bottom 3 agents at each flagged branch',
    ],
  },

  'Loan enquiry to disbursal conversion trend for last 30 days': {
    title: 'Loan Enquiry → Disbursal Conversion Trend — Last 30 Days',
    subtitle:
      'Analysis of the full conversion funnel from initial loan enquiry calls to actual loan disbursal, based on 3,124 enquiry calls over the past 30 days.',
    stats: [
      { label: 'Total Enquiries',    value: '3,124' },
      { label: 'Conversion Rate',    value: '34%' },
      { label: 'Best Performer',     value: 'Mumbai Andheri (52%)' },
      { label: 'Avg Disbursal Time', value: '6.2 hrs' },
    ],
    keyFindings:
      'Overall conversion rate is 34%, down from 41% in March. The largest drop-off occurs between qualified lead and branch visit stages — 38% of qualified leads do not show up. Mumbai Andheri maintains the highest conversion at 52%, largely due to proactive agent follow-up within 2 hours of enquiry. Delhi Karol Bagh has the worst conversion at 18%, with 60% of leads going cold after 48 hours without follow-up.',
    rootCauses: [
      'No follow-up within 24 hours: primary reason for 43% of lost leads',
      'Documentation confusion: 27% of leads drop off at document stage',
      'Inconvenient branch timings: 18% cite weekday-only hours as barrier',
      'Competitor rate offers: 9% of leads mention Muthoot/Manappuram',
      'Agent capacity overload: peak-hour leads receive delayed callbacks: 3%',
    ],
    actions: [
      'Enforce mandatory 2-hour callback SLA for all new loan enquiry leads',
      'Send pre-visit document checklist via WhatsApp to all qualified leads',
      'Pilot weekend branch hours at Karol Bagh and Koramangala for 4 weeks',
      'Train agents on competitor rate objection handling with pre-approved rebuttals',
    ],
  },

  'Agent-wise comparison of CSAT scores and call handle time': {
    title: 'Agent CSAT & Handle Time Analysis — Apr 2026',
    subtitle:
      'Comparative analysis of all 8 active agents across CSAT score, average handle time, and first call resolution rate for the current month.',
    stats: [
      { label: 'Team Avg CSAT',   value: '4.1/5' },
      { label: 'Best Agent',      value: 'Deepa Menon (4.6)' },
      { label: 'Needs Coaching',  value: 'Vikram Singh (3.5)' },
      { label: 'Avg Handle Time', value: '4m 33s' },
    ],
    keyFindings:
      'Deepa Menon leads with a CSAT of 4.6 and the lowest handle time of 3m 40s, driven by efficient call structuring and proactive resolution. Vikram Singh has the lowest CSAT (3.5) and highest handle time (6m 15s), concentrated on high-stress auction alert calls — indicating a training gap. A 25-point sentiment gap exists between the top and bottom agent, suggesting inconsistent call quality standards.',
    rootCauses: [
      'Inconsistent call scripts: agents handle same intent types differently',
      'Vikram Singh handles 70% auction alert calls — no specialist training',
      'No real-time supervisor monitoring for calls exceeding 6 minutes',
      'Priya Sharma has high call volume (89) — signs of overload and fatigue',
      'No structured handoff process for escalation calls',
    ],
    actions: [
      'Pair Vikram Singh with Deepa Menon for a 2-week shadowing programme',
      'Redistribute auction alert call routing away from single agents',
      'Implement real-time alert for calls exceeding 5m 30s handle time',
      'Standardize call scripts per intent category across the entire team',
    ],
  },

  'Auction alert calls with pending follow-ups and revenue at risk': {
    title: 'Auction Alert Calls — Pending Follow-Ups & Revenue at Risk',
    subtitle:
      'Identifies all auction-distress calls from the last 14 days with unresolved follow-up actions and estimates revenue exposure from potential gold auctions.',
    stats: [
      { label: 'Auction Alert Calls', value: '97' },
      { label: 'Unresolved',          value: '34 (35%)' },
      { label: 'Revenue at Risk',     value: '₹82L' },
      { label: 'Urgent (≤7 Days)',    value: '12 accounts' },
    ],
    keyFindings:
      '97 auction alert calls were logged this week — a 32% spike. 34 accounts have no follow-up action recorded in the CRM. Of these, 12 are within 7 days of auction trigger. Estimated gold value at auction risk is ₹82 lakhs. Delhi Karol Bagh (10 cases) and Hyderabad Ameerpet (9 cases) account for 56% of all unresolved alerts. No outreach was made to 7 customers who called twice in the same week.',
    rootCauses: [
      'Absence of mandatory CRM update post auction-alert call: 41% of cases',
      'Agent transfers calls to branch without confirming follow-up commitment',
      'No automated escalation when account reaches 60+ DPD threshold',
      'SMS reminders not configured for accounts approaching auction date',
      'Branch managers not looped in on high-risk accounts automatically',
    ],
    actions: [
      'Deploy emergency retention team for all 12 accounts within 7-day auction window',
      'Make CRM follow-up entry mandatory before closing any auction-alert call',
      'Set up automated escalation to branch manager at 60 DPD — no manual trigger',
      'Enable 30-day pre-auction SMS series for all accounts approaching threshold',
    ],
  },

  'Sentiment analysis of gold safety & insurance related calls': {
    title: 'Sentiment Analysis — Gold Safety & Insurance Calls',
    subtitle:
      'Deep-dive into sentiment patterns across 33 gold safety and insurance enquiry calls, identifying customer perception gaps and trust drivers.',
    stats: [
      { label: 'Calls Analysed', value: '33' },
      { label: 'Positive',       value: '70% (23 calls)' },
      { label: 'Neutral',        value: '21% (7 calls)' },
      { label: 'CSAT Score',     value: '4.2/5' },
    ],
    keyFindings:
      'Gold Safety & Insurance calls have one of the highest positive sentiment rates (70%) among all intent categories. Customers who receive proactive safety certificate details during the call show 2.1x higher satisfaction. However, 21% of callers express confusion about insurance coverage limits and exclusions — agents lack a standard explanation template. 3 calls flagged negative sentiment were from customers who had previously filed claims and felt unsupported.',
    rootCauses: [
      'No standard insurance FAQ script — agents improvise coverage explanations',
      'Claim process not explained during loan origination, only at enquiry stage',
      'Policy exclusions communicated reactively rather than proactively',
      'Low awareness: 67% of callers unaware insurance is auto-included',
      'Negative sentiment spikes on calls from previous claimants — no empathy protocol',
    ],
    actions: [
      'Create a gold safety one-pager shared proactively at loan disbursement',
      'Add insurance FAQ to agent call script with plain-language coverage summary',
      'Implement post-claim follow-up call within 48 hours for all claimants',
      'Train agents to proactively mention insurance auto-inclusion on every loan call',
    ],
  },

  'Week-over-week change in repeat caller rate by intent': {
    title: 'Repeat Caller Rate — Week-over-Week by Intent',
    subtitle:
      'Tracks the change in repeat caller frequency across all intent categories, identifying intents with unresolved first-contact issues.',
    stats: [
      { label: 'Total Repeat Callers', value: '127' },
      { label: 'WoW Change',           value: '+18%' },
      { label: 'Highest Repeat Rate',  value: 'Complaint (2.4x)' },
      { label: 'Avg Calls per Issue',  value: '2.1' },
    ],
    keyFindings:
      'Repeat caller rate rose 18% week-over-week, with Complaint & Grievance (2.4 calls per issue) and Auction Alert (2.1 calls per issue) as the worst offenders. Gold Release callers are the fastest-resolving at 1.2 calls per issue, indicating strong first-contact processes. 127 unique customers called more than once — 43 of them called 3+ times on the same issue. Interest Rate callers show a rising repeat trend (+31%) linked to unresolved rate dispute cases.',
    rootCauses: [
      'First-contact resolution failure: agents close calls without confirming resolution',
      'No callback commitment given — customers must re-initiate contact',
      'Complaint cases lack ownership tracking — anyone can pick up re-call',
      'Interest rate disputes require branch approval but no SLA is defined',
      'Auction alert status not updated in real-time — customers call to check',
    ],
    actions: [
      'Implement dedicated resolution desk for any customer calling 2+ times on same issue',
      'Mandate resolution confirmation check at end of every Complaint & Auction Alert call',
      'Set 24-hour SLA for interest rate dispute resolution with branch sign-off',
      'Enable customers to track case status via WhatsApp bot — reduce re-call need',
    ],
  },
};

// ─── Suggestion chips ─────────────────────────────────────────────────────────

const suggestions = [
  { icon: '⬆', text: 'Top 5 branches with highest complaint rate this week' },
  { icon: '→', text: 'Loan enquiry to disbursal conversion trend for last 30 days' },
  { icon: '⬆', text: 'Agent-wise comparison of CSAT scores and call handle time' },
  { icon: '⚠', text: 'Auction alert calls with pending follow-ups and revenue at risk' },
  { icon: '💬', text: 'Sentiment analysis of gold safety & insurance related calls' },
  { icon: '→', text: 'Week-over-week change in repeat caller rate by intent' },
];

// ─── Generated Report Card ────────────────────────────────────────────────────

const TABS: ReportTab[] = ['Key Findings', 'Root Cause Breakdown', 'Recommended Actions'];

function GeneratedReportCard({ report }: { report: GeneratedReport }) {
  const [activeTab, setActiveTab] = useState<ReportTab>('Key Findings');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-5 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-50 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-1">{report.title}</h3>
          <p className="text-[12px] text-gray-400 leading-snug max-w-2xl">{report.subtitle}</p>
        </div>
        <button className="shrink-0 ml-4 p-1.5 hover:bg-red-50 rounded-lg transition-colors group">
          <Download size={15} className="text-gray-300 group-hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-50 border-b border-gray-50">
        {report.stats.map(({ label, value }) => (
          <div key={label} className="px-6 py-4">
            <p className="text-[11px] text-gray-400 font-medium mb-1">{label}</p>
            <p className="text-[17px] font-bold text-gray-900 leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 pb-0 border-b border-gray-50">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-[12px] font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-6 py-5">
        {activeTab === 'Key Findings' && (
          <p className="text-[13px] text-gray-600 leading-relaxed">{report.keyFindings}</p>
        )}

        {activeTab === 'Root Cause Breakdown' && (
          <ul className="space-y-2.5">
            {report.rootCauses.map((cause, i) => (
              <li key={i} className="text-[13px] text-gray-600 leading-snug flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0 mt-px">•</span>
                {cause}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'Recommended Actions' && (
          <ol className="space-y-3">
            {report.actions.map((action, i) => (
              <li key={i} className="text-[13px] text-red-500 font-medium leading-snug flex items-start gap-2">
                <span className="shrink-0 text-red-300 font-bold">{i + 1}.</span>
                {action}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NlpReportGenerator() {
  const [query, setQuery]           = useState('');
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);

  const handleGenerate = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setActiveQuery(query.trim());
      setLoading(false);
    }, 900);
  };

  const report = activeQuery ? mockReports[activeQuery] ?? null : null;

  return (
    <div>
      {/* ── Generator box ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex">
          <div className="w-1 shrink-0 bg-red-500" />
          <div className="flex-1 px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={17} className="text-red-500" />
              <h2 className="text-[15px] font-bold text-gray-900">NLP Report Generator</h2>
            </div>
            <p className="text-[12px] text-gray-400 mb-4">
              Describe the report you need in plain English and our AI will{' '}
              <span className="text-red-400 font-medium">generate</span> it from call data
            </p>

            {/* Input row */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., Show me branches with rising complaint trends in the last 2 weeks..."
                className="flex-1 px-4 py-2.5 text-[13px] border border-gray-200 rounded-xl outline-none focus:border-red-400 transition-colors text-gray-700 placeholder:text-gray-300"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl transition-colors shrink-0"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={13} />
                )}
                Generate
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map(({ icon, text }) => (
                <button
                  key={text}
                  onClick={() => setQuery(text)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] border rounded-lg transition-all ${
                    query === text
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50/40'
                  }`}
                >
                  <span className="text-[10px]">{icon}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Generated report (shown below after clicking Generate) ─────────── */}
      {report && <GeneratedReportCard report={report} />}
    </div>
  );
}
