'use client';

import { Header } from '@/components/layout/header';
import { LocationFilterBar } from '@/components/shared/location-filter-bar';
import { CxKpis } from '@/components/customer-experience/cx-kpis';
import { AudienceSplitChart } from '@/components/customer-experience/audience-split-chart';
import { VoiceQualityChart } from '@/components/customer-experience/voice-quality-chart';
import { SentimentTrendsChart } from '@/components/customer-experience/sentiment-trends-chart';
import { ComplaintCategoriesChart } from '@/components/customer-experience/complaint-categories-chart';
import { PersonaConversionChart } from '@/components/customer-experience/persona-conversion-chart';
import { CxIntelligence } from '@/components/customer-experience/cx-intelligence';

export default function CustomerExperiencePage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header title="Customer Experience" subtitle="Track satisfaction, personas, and voice quality metrics" />

      <div className="px-8 pb-8">
        <div className="space-y-0 animate-fade-in-up">
          <LocationFilterBar />
          <CxKpis />
          
          {/* Row 1: Split 50/50 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AudienceSplitChart />
            <VoiceQualityChart />
          </div>

          {/* Row 2: Split 60/40 approx */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
            <div className="lg:col-span-3">
              <SentimentTrendsChart />
            </div>
            <div className="lg:col-span-2">
              <ComplaintCategoriesChart />
            </div>
          </div>

          {/* Row 3: Full Width */}
          <div className="mb-6">
            <PersonaConversionChart />
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
