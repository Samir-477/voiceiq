import { RevenueIntelligenceData } from '@/types';

export const mockRevenueData: RevenueIntelligenceData = {
  kpis: {
    estRevenueLoss: '₹4.27L',
    estRevenueLossSubLabel: 'This week',
    missedDemand: 856,
    missedDemandTrend: '+12% vs last week',
    topCategory: "Men's Formal",
    topCategorySubLabel: 'Highest unmet demand',
    altSuggestions: 62,
    altSuggestionsSubLabel: 'Success rate',
  },
  regionLoss: [
    { region: 'North', amount: 127000 },
    { region: 'South', amount: 85000 },
    { region: 'East', amount: 103000 },
    { region: 'West', amount: 74000 },
  ],
  topProducts: [
    { id: '1', name: 'Running Shoes – Size 9', requests: 245, fulfillmentPct: 68 },
    { id: '2', name: 'White Sneakers – Size 8', requests: 198, fulfillmentPct: 55 },
    { id: '3', name: 'Sports Sandals – Size 10', requests: 167, fulfillmentPct: 42 },
    { id: '4', name: 'Canvas Shoes – Size 7', requests: 134, fulfillmentPct: 36 },
    { id: '5', name: 'Formal Shoes – Size 9', requests: 112, fulfillmentPct: 30 },
  ],
};
