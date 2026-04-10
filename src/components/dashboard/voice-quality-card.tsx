'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import type { VoiceQualityResponse } from '@/types/api';

interface VoiceQualityCardProps {
  data: VoiceQualityResponse | null;
  loading?: boolean;
}

export function VoiceQualityCard({ data, loading }: VoiceQualityCardProps) {
  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col h-full w-full animate-pulse" />
    );
  }

  const qualityMetrics = data
    ? [
        { label: 'Tone',            score: Math.round(Number(data.tone)                || 0) },
        { label: 'Efficiency',      score: Math.round(Number(data.efficiency)          || 0) },
        { label: 'Problem Solving', score: Math.round(Number(data.problem_solving)     || 0) },
        { label: 'Professionalism', score: Math.round(Number(data.professionalism)     || 0) },
        { label: 'Brand Rep.',      score: Math.round(Number(data.brand_representation)|| 0) },
      ]
    : [
        { label: 'Tone',            score: 77 },
        { label: 'Efficiency',      score: 77 },
        { label: 'Problem Solving', score: 77 },
        { label: 'Professionalism', score: 79 },
        { label: 'Brand Rep.',      score: 76 },
      ];

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-5 lg:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col h-full w-full">
      <div className="flex items-center gap-3 mb-6">
        <Mic size={22} className="text-red-500" />
        <h2 className="text-lg font-bold text-gray-900">Voice Quality Overview</h2>
        {loading && (
          <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-auto mb-auto">
        {qualityMetrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
              <span className="text-sm font-bold text-orange-500">{metric.score}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-700"
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
