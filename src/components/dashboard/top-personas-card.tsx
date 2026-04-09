import React from 'react';
import { Users } from 'lucide-react';

const personas = [
  { name: 'Budget Shoppers', calls: 11, percent: 27 },
  { name: 'Students', calls: 11, percent: 18 },
  { name: 'Sports Enthusiasts', calls: 10, percent: 10 },
  { name: 'Office Professionals', calls: 10, percent: 40 },
  { name: 'Fashion Seekers', calls: 8, percent: 25 },
];

export function TopPersonasCard() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Top Personas</h2>
      </div>

      {/* Personas List */}
      <div className="flex flex-col gap-2.5 mt-auto mb-auto">
        {personas.map((persona) => (
          <div 
            key={persona.name} 
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-100 bg-white"
          >
            <span className="text-sm font-semibold text-gray-800">{persona.name}</span>
            <div className="text-sm font-medium text-gray-400">
              <span>{persona.calls} calls</span>
              <span className="mx-1.5">·</span>
              <span className="text-red-600 font-bold">{persona.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
