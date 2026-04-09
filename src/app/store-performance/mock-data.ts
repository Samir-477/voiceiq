// KPI Cards
export const mockStoreKpis = {
  activeStores: { value: '25', subtitle: '4 need attention', trendUp: true },
  zeroCallStores: { value: '5', subtitle: 'No activity — investigate', trendUp: false },
  totalCalls: { value: '16,155', subtitle: '6,880 qualified', trendUp: true },
  avgConversion: { value: '29%', subtitle: 'Below target', trendUp: false },
  avgHandleTime: { value: '2m 41s', subtitle: '88% satisfaction', trendUp: true },
};

// Customer Persona Breakdown
export const mockPersonaBreakdown = [
  { persona: 'Office Professionals', calls: 14, conversions: 1, conversionPct: 7 },
  { persona: 'Fashion Seekers', calls: 11, conversions: 1, conversionPct: 9 },
  { persona: 'Sports Enthusiasts', calls: 11, conversions: 2, conversionPct: 18 },
  { persona: 'Students', calls: 9, conversions: 1, conversionPct: 11 },
  { persona: 'Budget Shoppers', calls: 5, conversions: 0, conversionPct: 0 },
];

// Product Category Performance
export const mockProductCategoryPerformance = [
  { category: "Men's Casual", calls: 12, conversions: 1 },
  { category: 'Sandals', calls: 11, conversions: 1 },
  { category: 'Sports Shoes', calls: 9, conversions: 1 },
  { category: "Kids' Shoes", calls: 9, conversions: 1 },
  { category: "Women's Casual", calls: 8, conversions: 1 },
  { category: "Men's Formal", calls: 8, conversions: 1 },
];

// Store Details Table
export const mockStoreDetails = [
  { name: 'Koramangala Flagship', region: 'West', state: 'Maharashtra', city: 'Mumbai', totalCalls: 845, qualified: 380, junk: 95, avgHandle: '3m 5s', conversion: '42%', csat: '88%', status: 'Active' },
  { name: 'Indiranagar Hub', region: 'South', state: 'Karnataka', city: 'Mysore', totalCalls: 720, qualified: 310, junk: 110, avgHandle: '3m 30s', conversion: '38%', csat: '82%', status: 'Active' },
  { name: 'MG Road Central', region: 'South', state: 'Tamil Nadu', city: 'Chennai', totalCalls: 930, qualified: 420, junk: 80, avgHandle: '2m 45s', conversion: '45%', csat: '91%', status: 'Active' },
  { name: 'Andheri West', region: 'North', state: 'Delhi NCR', city: 'New Delhi', totalCalls: 580, qualified: 250, junk: 140, avgHandle: '4m 0s', conversion: '28%', csat: '72%', status: 'Needs Attention' },
  { name: 'Bandra Link', region: 'North', state: 'Uttar Pradesh', city: 'Lucknow', totalCalls: 790, qualified: 340, junk: 105, avgHandle: '3m 15s', conversion: '36%', csat: '85%', status: 'Active' },
  { name: 'Connaught Place', region: 'East', state: 'West Bengal', city: 'Howrah', totalCalls: 1050, qualified: 490, junk: 70, avgHandle: '2m 35s', conversion: '48%', csat: '93%', status: 'Active' },
  { name: 'Gurgaon Cyber Hub', region: 'South', state: 'Telangana', city: 'Hyderabad', totalCalls: 610, qualified: 200, junk: 160, avgHandle: '4m 20s', conversion: '22%', csat: '68%', status: 'Needs Attention' },
  { name: 'Noida Sector 18', region: 'West', state: 'Gujarat', city: 'Surat', totalCalls: 870, qualified: 370, junk: 90, avgHandle: '3m 10s', conversion: '40%', csat: '86%', status: 'Active' },
  { name: 'Jubilee Hills', region: 'West', state: 'Maharashtra', city: 'Nagpur', totalCalls: 950, qualified: 440, junk: 75, avgHandle: '2m 50s', conversion: '46%', csat: '90%', status: 'Active' },
  { name: 'Hitech City', region: 'South', state: 'Karnataka', city: 'Mysore', totalCalls: 810, qualified: 350, junk: 100, avgHandle: '3m 20s', conversion: '35%', csat: '83%', status: 'Active' },
  { name: 'Anna Nagar', region: 'South', state: 'Tamil Nadu', city: 'Chennai', totalCalls: 740, qualified: 280, junk: 120, avgHandle: '3m 40s', conversion: '32%', csat: '78%', status: 'Active' },
  { name: 'T Nagar Elite', region: 'North', state: 'Delhi NCR', city: 'Noida', totalCalls: 980, qualified: 460, junk: 95, avgHandle: '2m 40s', conversion: '47%', csat: '92%', status: 'Active' },
];

// Top Stores by Conversion (for bar chart)
export const mockTopStoresByConversion = [
  { store: 'T Nagar Elit..', conversionRate: 92, avgHandle: 45 },
  { store: 'MG Road Cen..', conversionRate: 88, avgHandle: 47 },
  { store: 'SG Highway', conversionRate: 84, avgHandle: 43 },
  { store: 'Kozhikode', conversionRate: 81, avgHandle: 41 },
];

// Call Quality Breakdown (Pie)
export const mockCallQualityBreakdown = [
  { name: 'Qualified', value: 43, color: '#ef4444' },
  { name: 'Junk', value: 13, color: '#f97316' },
  { name: 'Other', value: 44, color: '#fbbf24' },
];

// Zero Call Stores
export const mockZeroCallStores = [
  { name: 'Rajouri Garden', location: 'Lucknow, Uttar Pradesh • North' },
  { name: 'Dwarka Mall', location: 'Howrah, West Bengal • East' },
  { name: 'Whitefield Plaza', location: 'Hyderabad, Telangana • South' },
  { name: 'Marathahalli Corner', location: 'Surat, Gujarat • West' },
  { name: 'Powai Lake', location: 'Mumbai, Maharashtra • West' },
];

// Conversion Attribution Analysis
export const mockConversionDrivers = [
  { driver: 'Product Availability Confirmed', conversions: 132, pct: '22.8%' },
  { driver: 'Size/Variant Match Found', conversions: 118, pct: '20.5%' },
  { driver: 'Store Pickup Offered', conversions: 92, pct: '18.2%' },
];

export const mockPeakConversionTimes = [
  { time: 'Tuesday 10–11 AM', count: 47, pct: '28.5%' },
  { time: 'Thursday 10–11 AM', count: 41, pct: '25.3%' },
  { time: 'Saturday 11 AM–1 PM', count: 43, pct: '26.7%' },
  { time: 'Friday 3–4 PM', count: 38, pct: '23.8%' },
];

export const mockCallOutcomes = [
  { outcome: 'Purchase Intent Detected', count: 342, pct: 48.2, barWidth: 75 },
  { outcome: 'Inquiry Only (No Intent)', count: 238, pct: 33.5, barWidth: 55 },
  { outcome: 'Complaint / Escalation', count: 130, pct: 18.3, barWidth: 35 },
];

export const mockConversionKeyInsights = [
  { title: 'High-intent calls peak midweek:', body: 'Tuesday–Thursday calls show 35% higher purchase intent signals than weekends' },
  { title: 'Call duration correlates with conversion:', body: 'Calls over 3 minutes are 2.4× more likely to indicate purchase intent' },
  { title: 'Missed opportunity window:', body: '18% of high-intent calls go unanswered during 12–2 PM lunch hours across stores' },
];

// Weekly Performance Trend
export const mockWeeklyTrend = [
  { week: 'W1', avgConversion: 28, avgCsat: 72 },
  { week: 'W2', avgConversion: 29, avgCsat: 74 },
  { week: 'W3', avgConversion: 27, avgCsat: 73 },
  { week: 'W4', avgConversion: 31, avgCsat: 79 },
  { week: 'W5', avgConversion: 33, avgCsat: 81 },
  { week: 'W6', avgConversion: 30, avgCsat: 78 },
];

// Store Performance Intelligence
export const mockStoreIntelligence = [
  '3 stores have conversion rates below 20% – high junk call ratios and low qualified calls detected.',
  'Top 5 stores convert at 44% vs 28% network average – faster call handling is the common pattern.',
  'Weekend call volume drops 31% — stores should consider adjusted staffing models.',
];
