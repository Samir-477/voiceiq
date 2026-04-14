'use client';

import { FileText, Download, Calendar } from 'lucide-react';

type Frequency = 'Daily' | 'Weekly' | 'Monthly';

type Report = {
  title: string;
  description: string;
  frequency: Frequency;
  lastGenerated: string;
};

const reports: Report[] = [
  {
    title: 'Daily Call Summary',
    description: 'Overview of all calls with intent classification and sentiment',
    frequency: 'Daily',
    lastGenerated: '2026-04-10',
  },
  {
    title: 'Weekly Intent Trends',
    description: 'Week-over-week comparison of call intent distribution',
    frequency: 'Weekly',
    lastGenerated: '2026-04-07',
  },
  {
    title: 'Agent Performance Report',
    description: 'Individual agent metrics including CSAT, FCR, and handle time',
    frequency: 'Weekly',
    lastGenerated: '2026-04-07',
  },
  {
    title: 'Branch Performance Report',
    description: 'Branch-level analysis with complaint rates and disbursal metrics',
    frequency: 'Weekly',
    lastGenerated: '2026-04-07',
  },
  {
    title: 'Auction Alert Report',
    description: 'List of all auction-related calls with customer details and follow-up status',
    frequency: 'Daily',
    lastGenerated: '2026-04-10',
  },
  {
    title: 'Complaint Analysis Report',
    description: 'Top complaint categories with root cause analysis and resolution rates',
    frequency: 'Monthly',
    lastGenerated: '2026-04-01',
  },
  {
    title: 'Customer Sentiment Report',
    description: 'Sentiment trends across intents and branches',
    frequency: 'Weekly',
    lastGenerated: '2026-04-07',
  },
  {
    title: 'Revenue at Risk Report',
    description: 'Estimated revenue impact from missed follow-ups and defaults',
    frequency: 'Daily',
    lastGenerated: '2026-04-10',
  },
];

const freqStyles: Record<Frequency, string> = {
  Daily:   'text-red-500',
  Weekly:  'text-red-500',
  Monthly: 'text-red-500',
};

export function ScheduledReports() {
  return (
    <div>
      <h2 className="text-[15px] font-bold text-gray-900 mb-3">Scheduled Reports</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {reports.map((report) => (
          <div
            key={report.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
          >
            {/* Icon */}
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={16} className="text-red-400" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 mb-0.5">{report.title}</p>
              <p className="text-[11px] text-gray-400 leading-snug mb-2">{report.description}</p>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-medium flex items-center gap-1 ${freqStyles[report.frequency]}`}>
                  ▽ {report.frequency}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Calendar size={10} /> {report.lastGenerated}
                </span>
              </div>
            </div>

            {/* Download */}
            <button className="shrink-0 p-1.5 hover:bg-red-50 rounded-lg transition-colors group">
              <Download size={15} className="text-gray-300 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
