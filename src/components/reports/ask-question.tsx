'use client';

import { Sparkles, Search } from 'lucide-react';
import { mockQuickPrompts } from '@/app/reports/mock-data';

export function AskQuestion() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Ask a Question</h3>
      </div>

      <div className="flex w-full mb-4 items-stretch gap-0 relative">
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-4 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="e.g., Show revenue loss in South region last week" 
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-l-xl text-sm outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all font-medium placeholder:text-gray-400"
          />
        </div>
        <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 rounded-r-xl text-sm font-bold transition-colors">
          Generate
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {mockQuickPrompts.map((prompt, idx) => (
          <button 
            key={idx}
            className="px-4 py-2 bg-white border border-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900 transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
