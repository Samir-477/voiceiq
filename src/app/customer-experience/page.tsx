'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { CxKpis } from '@/components/customer-experience/cx-kpis';
import { AudienceSplitChart } from '@/components/customer-experience/audience-split-chart';
import { VoiceQualityChart } from '@/components/customer-experience/voice-quality-chart';
import { SentimentTrendsChart } from '@/components/customer-experience/sentiment-trends-chart';
import { ComplaintCategoriesChart } from '@/components/customer-experience/complaint-categories-chart';
import { PersonaConversionChart } from '@/components/customer-experience/persona-conversion-chart';
import { CxIntelligence } from '@/components/customer-experience/cx-intelligence';
import type {
  CxSummaryResponse,
  SentimentTrendItem,
  ComplaintCategoryItem,
  PersonaConversionItem,
  VoiceQualityResponse,
} from '@/types/api';
import { useFilters } from '@/hooks/use-filters';
import { buildQueryString } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/api-client';

export default function CustomerExperiencePage() {
  const { filters } = useFilters();
  const qs = buildQueryString(filters);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: cxSummary, isLoading: loadingSummary } = useQuery<CxSummaryResponse>({
    queryKey: ['cx-summary', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/cx/summary${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const { data: sentimentTrend, isLoading: loadingSentiment } = useQuery<SentimentTrendItem[]>({
    queryKey: ['cx-sentiment-trend', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/cx/sentiment-trend${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: complaintCats, isLoading: loadingComplaints } = useQuery<ComplaintCategoryItem[]>({
    queryKey: ['cx-complaints', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/cx/complaint-categories${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: personaConv, isLoading: loadingPersona } = useQuery<PersonaConversionItem[]>({
    queryKey: ['cx-persona', filters],
    queryFn: () => fetchWithAuth(`/api/v1/analytics/cx/persona-conversion${qs}`).then(d => Array.isArray(d[0]) ? d[0] : d),
  });

  const { data: voiceRaw, isLoading: loadingVoice } = useQuery<VoiceQualityResponse>({
    queryKey: ['kpi-voice', filters], // Reusing key from Overview for shared cache
    queryFn: () => fetchWithAuth(`/api/v1/analytics/kpi/voice-quality${qs}`).then(d => Array.isArray(d) ? d[0] : d),
  });

  const loading = loadingSummary || loadingSentiment || loadingComplaints || loadingPersona || loadingVoice;

  // Transform voiceRaw for display
  const voiceQuality = useMemo(() => {
    if (!voiceRaw) return [];
    return [
      { name: 'Tone', value: Number(voiceRaw.tone) || 0 },
      { name: 'Efficiency', value: Number(voiceRaw.efficiency) || 0 },
      { name: 'Problem Solving', value: Number(voiceRaw.problem_solving) || 0 },
      { name: 'Professionalism', value: Number(voiceRaw.professionalism) || 0 },
      { name: 'Brand Rep', value: Number(voiceRaw.brand_representation) || 0 },
    ];
  }, [voiceRaw]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Customer Experience" subtitle="Track satisfaction, personas, and voice quality metrics" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <CxKpis data={cxSummary || null} loading={loadingSummary} />

          {/* Row 1: Split 50/50 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AudienceSplitChart />
            <VoiceQualityChart data={voiceQuality} loading={loadingVoice} />
          </div>

          {/* Row 2: Split 60/40 approx */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <SentimentTrendsChart data={sentimentTrend || []} loading={loadingSentiment} />
            </div>
            <div className="lg:col-span-2">
              <ComplaintCategoriesChart data={complaintCats || []} loading={loadingComplaints} />
            </div>
          </div>

          {/* Row 3: Full Width */}
          <div className="mb-6">
            <PersonaConversionChart data={personaConv || []} loading={loadingPersona} />
          </div>

          {/* Row 4: Full Width */}
          <div>
            <CxIntelligence />
          </div>
        </div>
      </div>
    </div>
  );
}
