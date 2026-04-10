'use client';

import { useState, useEffect } from 'react';
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
} from '@/types/api';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

export default function CustomerExperiencePage() {
  const [cxSummary,     setCxSummary]     = useState<CxSummaryResponse | null>(null);
  const [sentimentTrend, setSentimentTrend] = useState<SentimentTrendItem[]>([]);
  const [complaintCats,  setComplaintCats]  = useState<ComplaintCategoryItem[]>([]);
  const [personaConv,    setPersonaConv]    = useState<PersonaConversionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json',
        };

        // Fetch all 4 CX APIs in parallel
        const [summaryRes, sentimentRes, complaintRes, personaRes] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/cx/summary`,              { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/cx/sentiment-trend`,      { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/cx/complaint-categories`, { headers }),
          fetch(`${BASE_URL}/api/v1/analytics/cx/persona-conversion`,   { headers }),
        ]);

        if (!summaryRes.ok || !sentimentRes.ok || !complaintRes.ok || !personaRes.ok) {
          throw new Error('Failed to fetch customer experience data');
        }

        const summaryData   = await summaryRes.json();
        const sentimentData = await sentimentRes.json();
        const complaintData = await complaintRes.json();
        const personaData   = await personaRes.json();

        // API responses may be wrapped in an array — handle both cases
        setCxSummary(Array.isArray(summaryData) ? summaryData[0] : summaryData);
        setSentimentTrend(Array.isArray(sentimentData[0]) ? sentimentData[0] : sentimentData);
        setComplaintCats(Array.isArray(complaintData[0]) ? complaintData[0] : complaintData);
        setPersonaConv(Array.isArray(personaData[0]) ? personaData[0] : personaData);

      } catch (err: any) {
        console.error('CX API Error:', err);
        setError(err.message || 'An unexpected error occurred');
        toast.error('Failed to load customer experience data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Customer Experience" subtitle="Track satisfaction, personas, and voice quality metrics" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />

          <CxKpis data={cxSummary} loading={loading} />

          {/* Row 1: Split 50/50 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AudienceSplitChart />
            <VoiceQualityChart />
          </div>

          {/* Row 2: Split 60/40 approx */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <SentimentTrendsChart data={sentimentTrend} loading={loading} />
            </div>
            <div className="lg:col-span-2">
              <ComplaintCategoriesChart data={complaintCats} loading={loading} />
            </div>
          </div>

          {/* Row 3: Full Width */}
          <div className="mb-6">
            <PersonaConversionChart data={personaConv} loading={loading} />
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
