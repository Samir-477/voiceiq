import { BrainCircuit, Lightbulb, ArrowRight } from 'lucide-react';

export function IntentIntelligence() {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col relative">
      {/* Decorative left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
      
      <div className="p-6 pl-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-red-500">
            <BrainCircuit size={20} />
            <h3 className="text-base font-bold text-gray-900">Intent Intelligence</h3>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Powered</span>
        </div>

        <ul className="space-y-4 mb-6">
          <li className="flex gap-2">
            <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              <span className="text-gray-900 font-bold">"Buy sneakers"</span> is the most common intent at 26% — strong purchase signal across stores.
            </p>
          </li>
          <li className="flex gap-2">
            <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Purchase intents have 78% positive sentiment — highest among all categories, signaling conversion readiness.
            </p>
          </li>
          <li className="flex gap-2">
            <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Return intent calls spike 35% on Mondays — weekend purchases are driving post-weekend returns.
            </p>
          </li>
          <li className="flex gap-2">
            <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              22% of calls are availability checks — a direct demand signal for product and store planning.
            </p>
          </li>
        </ul>

        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Suggested Actions</h4>
          <div className="space-y-3">
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50/30 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <ArrowRight size={16} className="text-red-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">High-intent call report</span> — Purchase intent calls have strong conversion potential — share findings with client
                </p>
              </div>
              <span className="px-3 py-1 rounded-full border border-red-200 text-red-600 text-xs font-bold">high</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-100 hover:bg-amber-50/30 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <ArrowRight size={16} className="text-amber-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">Return intent patterns</span> — 18% of calls are return/exchange related — sizing issues dominate
                </p>
              </div>
              <span className="px-3 py-1 rounded-full border border-amber-200 text-amber-600 text-xs font-bold pb-0.5">medium</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-100 hover:bg-amber-50/30 transition-colors group cursor-pointer">
              <div className="flex items-center gap-2">
                <ArrowRight size={16} className="text-amber-500 transition-transform group-hover:translate-x-1" />
                <p className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">Availability demand signal</span> — 22% of calls are stock checks — direct demand signal for inventory planning
                </p>
              </div>
              <span className="px-3 py-1 rounded-full border border-amber-200 text-amber-600 text-xs font-bold pb-0.5">medium</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
