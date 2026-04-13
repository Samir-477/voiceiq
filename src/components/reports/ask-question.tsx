'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { Sparkles, Search, RotateCcw, Loader2, AlertCircle, Zap } from 'lucide-react';

// ── Inline markdown renderer (bold, italic) ───────────────────────────────────
function renderInline(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**'))
      return <strong key={i} className="font-semibold text-gray-900">{seg.slice(2, -2)}</strong>;
    if (seg.startsWith('*') && seg.endsWith('*'))
      return <em key={i} className="italic">{seg.slice(1, -1)}</em>;
    return <Fragment key={i}>{seg}</Fragment>;
  });
}

function isTableLine(line: string) {
  return line.trim().startsWith('|') && line.trim().endsWith('|');
}

function parseTable(lines: string[], start: number) {
  const rows: string[][] = [];
  let i = start;
  while (i < lines.length && isTableLine(lines[i])) {
    const cols = lines[i].split('|').slice(1, -1).map(c => c.trim());
    if (!cols.every(c => /^[-:]+$/.test(c))) rows.push(cols);
    i++;
  }
  return { rows, end: i };
}

// ── Block-level markdown renderer ────────────────────────────────────────────
function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  const listBuf: React.ReactNode[] = [];
  let listOrdered = false;

  function flushList() {
    if (!listBuf.length) return;
    const Tag = listOrdered ? 'ol' : 'ul';
    out.push(
      <Tag key={`lst-${out.length}`} className={`${listOrdered ? 'list-decimal' : 'list-disc'} ml-5 space-y-1 my-2`}>
        {listBuf.splice(0)}
      </Tag>
    );
  }

  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();

    if (t.startsWith('# ')) {
      flushList();
      out.push(
        <h2 key={i} className="text-[17px] font-bold text-gray-900 mt-5 mb-3 pb-2 border-b border-gray-100 first:mt-0">
          {renderInline(t.slice(2))}
        </h2>
      );
    } else if (t.startsWith('## ')) {
      flushList();
      out.push(
        <h3 key={i} className="flex items-center gap-2 text-sm font-bold text-gray-800 mt-5 mb-2">
          <span className="inline-block w-1 h-4 rounded-sm bg-red-500 shrink-0" />
          {renderInline(t.slice(3))}
        </h3>
      );
    } else if (t.startsWith('### ')) {
      flushList();
      out.push(
        <h4 key={i} className="text-sm font-semibold text-gray-700 mt-4 mb-1.5">
          {renderInline(t.slice(4))}
        </h4>
      );
    } else if (t === '---' || t === '***') {
      flushList();
      out.push(<hr key={i} className="border-gray-100 my-4" />);
    } else if (isTableLine(t)) {
      flushList();
      const { rows, end } = parseTable(lines, i);
      if (rows.length > 0) {
        out.push(
          <div key={i} className="my-4 overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {rows[0].map((h, ci) => (
                    <th key={ci} className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-gray-700">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      i = end;
      continue;
    } else if (t.startsWith('- ') || t.startsWith('* ')) {
      listOrdered = false;
      listBuf.push(
        <li key={i} className="text-sm text-gray-700 leading-relaxed">
          {renderInline(t.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(t)) {
      if (listBuf.length && !listOrdered) flushList();
      listOrdered = true;
      listBuf.push(
        <li key={i} className="text-sm text-gray-700 leading-relaxed">
          {renderInline(t.replace(/^\d+\.\s/, ''))}
        </li>
      );
    } else if (t === '') {
      flushList();
      if (out.length > 0) out.push(<div key={`gap-${i}`} className="h-1" />);
    } else {
      flushList();
      out.push(
        <p key={i} className="text-sm text-gray-700 leading-relaxed">
          {renderInline(t)}
        </p>
      );
    }
    i++;
  }
  flushList();
  return <div className="space-y-1.5">{out}</div>;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface AskQuestionProps {
  prompts?:   string[];
  onSubmit?:  (question: string) => void;
  result?:    string | null;
  loading?:   boolean;
  onReset?:   () => void;
  error?:     string | null;
  queryMeta?: { table?: string; client?: string; sqlTrace?: unknown[] } | null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function AskQuestion({
  prompts  = [],
  onSubmit,
  result   = null,
  loading  = false,
  onReset,
  error    = null,
}: AskQuestionProps) {
  const [question, setQuestion]     = useState('');
  const [submitted, setSubmitted]   = useState('');
  const [hasQueried, setHasQueried] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((result || error) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result, error]);

  const handleSubmit = () => {
    const q = question.trim();
    if (!q || !onSubmit) return;
    setSubmitted(q);
    setHasQueried(true);
    onSubmit(q);
  };

  const handleReset = () => {
    setQuestion('');
    setSubmitted('');
    setHasQueried(false);
    onReset?.();
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm w-full mb-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-red-500 shrink-0" />
        <h3 className="text-base font-bold text-gray-900">Ask a Question</h3>
        {(result || error) && !loading && (
          <button
            onClick={handleReset}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <RotateCcw size={13} />
            New question
          </button>
        )}
      </div>

      {/* ── Input ── */}
      <div className="flex w-full mb-4 items-stretch">
        <div className="relative flex-1 flex items-center">
          <Search size={16} className="absolute left-4 text-gray-400" />
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
          className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-r-xl text-sm font-bold transition-colors flex items-center gap-2 shrink-0"
        >
          {loading ? <><Loader2 size={15} className="animate-spin" />Generating…</> : 'Generate'}
        </button>
      </div>

      {/* ── Suggestion chips ── */}
      {prompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(p)}
              disabled={loading}
              className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200 transition-all shadow-sm disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={14} className="text-red-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-400">Analysing your data…</span>
          </div>
          {[85, 100, 65, 100, 75, 50].map((w, i) => (
            <div
              key={i}
              className="h-3.5 bg-gray-100 rounded-full skeleton-shimmer"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div ref={resultRef} className="mt-5 flex items-start gap-3 p-4 rounded-xl border border-red-100 bg-red-50">
          <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 mb-0.5">Request failed</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* ── Empty response ── */}
      {!loading && !error && hasQueried && result === null && (
        <div ref={resultRef} className="mt-5 p-4 rounded-xl border border-amber-100 bg-amber-50">
          <p className="text-sm font-semibold text-amber-700 mb-0.5">No report returned</p>
          <p className="text-sm text-amber-600">
            The backend may still be warming up — try again in a few seconds.
          </p>
        </div>
      )}

      {/* ── Q & A result ── */}
      {!loading && !error && result && (
        <div ref={resultRef} className="mt-6">



          {/* Answer card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden">
            {/* Small AI label */}
            <div className="flex items-center gap-1.5 px-5 pt-4 pb-0">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0">
                <Zap size={11} className="text-white" />
              </div>
              <span className="text-xs font-bold text-gray-500">VoiceIQ AI</span>
            </div>

            {/* Rendered report */}
            <div className="max-h-[580px] overflow-y-auto px-5 pb-5 pt-3 modern-scroll">
              <MarkdownBlock text={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
