'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { LeadModal, type Lead } from './lead-modal';

const leads: Lead[] = [
  { id: 'LD-001', customer: 'Ramesh Sundar',    branch: 'Chennai - T.Nagar',       gold: '25g',  value: '₹1.1L',  status: 'Hot',  nextAction: 'Branch visit tomorrow',         agent: 'Priya Sharma' },
  { id: 'LD-002', customer: 'Kavitha Raman',    branch: 'Mumbai - Andheri',        gold: '50g',  value: '₹2.2L',  status: 'Hot',  nextAction: 'Documentation pending',         agent: 'Deepa Menon' },
  { id: 'LD-003', customer: 'Suresh Pillai',    branch: 'Coimbatore - RS Puram',   gold: '30g',  value: '₹1.35L', status: 'Warm', nextAction: 'Rate comparison to be shared',  agent: 'Rajesh Kumar' },
  { id: 'LD-004', customer: 'Meena Krishnan',   branch: 'Madurai - Main Branch',   gold: '15g',  value: '₹67K',   status: 'Warm', nextAction: 'Callback scheduled',            agent: 'Suresh Nair' },
  { id: 'LD-005', customer: 'Arjun Mehta',      branch: 'Delhi - Karol Bagh',      gold: '40g',  value: '₹1.8L',  status: 'Hot',  nextAction: 'Same-day branch visit',         agent: 'Kavitha Rajan' },
  { id: 'LD-006', customer: 'Lakshmi Devi',     branch: 'Hyderabad - Ameerpet',    gold: '20g',  value: '₹90K',   status: 'Cold', nextAction: 'No response to follow-up',      agent: 'Anita Verma' },
  { id: 'LD-007', customer: 'Vijay Kumar',      branch: 'Bangalore - Koramangala', gold: '35g',  value: '₹1.55L', status: 'Hot',  nextAction: 'Top-up processing',             agent: 'Suresh Nair' },
  { id: 'LD-008', customer: 'Priya Natarajan',  branch: 'Chennai - Anna Nagar',    gold: '45g',  value: '₹2.0L',  status: 'Warm', nextAction: 'Second callback today',         agent: 'Priya Sharma' },
  { id: 'LD-009', customer: 'Ganesh Iyer',      branch: 'Mumbai - Andheri',        gold: '60g',  value: '₹2.7L',  status: 'Warm', nextAction: 'Manager callback arranged',     agent: 'Deepa Menon' },
  { id: 'LD-010', customer: 'Anitha Balaji',    branch: 'Madurai - Main Branch',   gold: '10g',  value: '₹45K',   status: 'Cold', nextAction: 'Lost — went to competitor',     agent: 'Arun Prasad' },
];

const statusStyles: Record<Lead['status'], string> = {
  Hot:  'bg-red-50 text-red-600 border border-red-200',
  Warm: 'bg-amber-50 text-amber-600 border border-amber-200',
  Cold: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const filterOptions = ['All Status', 'Hot', 'Warm', 'Cold'];

export function LeadPipelineTable() {
  const [filter, setFilter]             = useState('All Status');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = useMemo(() =>
    filter === 'All Status' ? leads : leads.filter((l) => l.status === filter),
    [filter]
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-gray-900">Lead Pipeline</h2>

          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-gray-700 bg-white border border-red-300 rounded-lg hover:border-red-400 transition-colors"
            >
              {filter}
              <ChevronDown size={13} className="text-gray-400" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-xl shadow-xl w-36 overflow-hidden">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setFilter(opt); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[12px] transition-colors ${
                      opt === filter
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Lead ID', 'Customer', 'Branch', 'Gold (g)', 'Est. Value', 'Status', 'Next Action', 'Agent'].map((h) => (
                  <th key={h} className="py-3 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50/60 transition-colors ${
                    i === filtered.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="py-3.5 px-5 text-[13px] font-semibold text-red-500">{lead.id}</td>
                  <td className="py-3.5 px-5 text-[13px] font-semibold text-gray-900">{lead.customer}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{lead.branch}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{lead.gold}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{lead.value}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-[12px] text-gray-500 max-w-[180px]">{lead.nextAction}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-700">{lead.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </>
  );
}
