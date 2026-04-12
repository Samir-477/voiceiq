import { Target, Lightbulb, ArrowRight } from 'lucide-react';

export function CxIntelligence() {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col relative w-full mb-8">
      {/* Decorative left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
      
      <div className="p-6 pl-8">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-red-500">
            <Target size={20} />
            <h3 className="text-base font-bold text-gray-900">CX Intelligence</h3>
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">AI Powered</span>
        </div>

        <ul className="space-y-4 mb-8">
          <li className="flex gap-3">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Delivery complaints are 3x higher in West region — correlates with new courier partner onboarded 2 weeks ago.
            </p>
          </li>
          <li className="flex gap-3">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Repeat callers have 67% chance of churning if not resolved within 48 hours.
            </p>
          </li>
          <li className="flex gap-3">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Positive sentiment improved 5% after last week's agent training initiative.
            </p>
          </li>
          <li className="flex gap-3">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Brand representation is the weakest voice metric at 76% — impacts customer perception.
            </p>
          </li>
          <li className="flex gap-3">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Office Professionals have the highest conversion rate among all personas.
            </p>
          </li>
        </ul>

        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Suggested Actions</h4>
          <div className="space-y-3">
            
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <ArrowRight size={16} className="text-red-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">Escalate delivery complaints</span> — West region delivery complaints surged 3x — flag for client review
                </p>
              </div>
              <span className="px-4 py-1 rounded-full border border-red-200 text-red-600 text-xs font-bold">high</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <ArrowRight size={16} className="text-red-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">Prioritize repeat callers</span> — 124 repeat callers with 67% churn risk if unresolved in 48 hours
                </p>
              </div>
              <span className="px-4 py-1 rounded-full border border-red-200 text-red-600 text-xs font-bold">high</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-amber-100 hover:bg-amber-50/50 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <ArrowRight size={16} className="text-amber-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">Improve brand representation</span> — Brand representation score at 76% — lowest voice metric
                </p>
              </div>
              <span className="px-4 py-1 rounded-full border border-amber-200 text-amber-600 text-xs font-bold">medium</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
