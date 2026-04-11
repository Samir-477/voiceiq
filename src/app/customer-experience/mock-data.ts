export const cxKpis = [
  {
    id: 'complaint-rate',
    label: 'Complaint Rate',
    value: '8.2%',
    subLabel: '-0.5% vs last week',
    subLabelColor: 'text-emerald-500',
    icon: 'alert-triangle',
    iconColor: 'bg-red-50 text-red-500',
    iconStroke: 'text-red-500'
  },
  {
    id: 'resolution-rate',
    label: 'Resolution Rate',
    value: '91%',
    subLabel: '+2% this month',
    subLabelColor: 'text-emerald-500',
    icon: 'heart',
    iconColor: 'bg-red-50 text-red-500',
    iconStroke: 'text-red-500'
  },
  {
    id: 'repeat-complaints',
    label: 'Repeat Complaints',
    value: '124',
    subLabel: '14% of total',
    subLabelColor: 'text-red-500',
    icon: 'refresh-ccw',
    iconColor: 'bg-red-50 text-red-500',
    iconStroke: 'text-red-500'
  },
  {
    id: 'negative-sentiment',
    label: 'Negative Sentiment',
    value: '18%',
    subLabel: '-2% improving',
    subLabelColor: 'text-emerald-500',
    icon: 'trending-down',
    iconColor: 'bg-red-50 text-red-500',
    iconStroke: 'text-red-500'
  },
];


export const voiceQualityData = [
  { name: 'Tone', value: 77 },
  { name: 'Efficiency', value: 77 },
  { name: 'Problem Solving', value: 77 },
  { name: 'Professionalism', value: 79 },
  { name: 'Brand Representation', value: 76 },
];

export const sentimentTrendsData = [
  { week: 'W1', Positive: 45, Neutral: 35, Negative: 20 },
  { week: 'W2', Positive: 48, Neutral: 32, Negative: 20 },
  { week: 'W3', Positive: 42, Neutral: 38, Negative: 20 },
  { week: 'W4', Positive: 50, Neutral: 32, Negative: 18 },
];

export const complaintCategoriesData = [
  { name: 'Delivery', value: 145 },
  { name: 'Product Quality', value: 98 },
  { name: 'Staff Behavior', value: 65 },
  { name: 'Wrong Item', value: 58 },
  { name: 'Refund', value: 42 },
];

export const personaConversionData = [
  { name: 'Budget Shoppers', calls: 11, converted: 3 },
  { name: 'Students', calls: 11, converted: 2 },
  { name: 'Sports Enthusiasts', calls: 10, converted: 1 },
  { name: 'Office Professionals', calls: 10, converted: 4 },
  { name: 'Fashion Seekers', calls: 8, converted: 2 },
];
