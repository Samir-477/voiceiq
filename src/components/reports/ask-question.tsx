'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Search, RotateCcw, Loader2 } from 'lucide-react';

interface AskQuestionProps {
  prompts?:   string[];
  onSubmit?:  (question: string) => void;
  result?:    string | null;
  loading?:   boolean;
  onReset?:   () => void;
}

export function AskQuestion({
  prompts  = [],
  onSubmit,
  result   = null,
  loading  = false,
  onReset,
}: AskQuestionProps) {
  const [question, setQuestion] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll result panel into view as soon as it appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const handleSubmit = () => {
    const q = question.trim();
    if (!q || !onSubmit) return;
    onSubmit(q);
  };

  const handleReset = () => {
    setQuestion('');
    onReset?.();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Ask a Question</h3>
        {result && !loading && (
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Input row */}
      <div className="flex w-full mb-4 items-stretch gap-0 relative">
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-4 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g., Show revenue loss in South region last week"
            disabled={loading}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-l-xl text-sm outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100 transition-all font-medium placeholder:text-gray-400 disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-r-xl text-sm font-bold transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Generating…
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {/* Quick-fill chips */}
      {prompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(prompt)}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-100 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-900 transition-all shadow-sm disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton while waiting for response */}
      {loading && (
        <div className="mt-5 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{ width: i % 2 === 0 ? '100%' : '75%' }}
            />
          ))}
        </div>
      )}

      {/* Result panel */}
      {!loading && result && (
        <div
          ref={resultRef}
          className="mt-5 max-h-[480px] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60 p-5"
        >
          <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
