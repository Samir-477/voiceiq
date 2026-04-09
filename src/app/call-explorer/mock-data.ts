export const explorerKpis = [
  {
    id: 'total-calls',
    label: 'Total Calls',
    value: '50',
    subLabel: 'Filtered results',
    icon: 'phone',
    iconColor: 'bg-red-50 text-red-500',
  },
  {
    id: 'qualified',
    label: 'Qualified',
    value: '23',
    subLabel: '46%',
    subLabelColor: 'text-emerald-500',
    icon: 'check-circle',
    iconColor: 'bg-red-50 text-red-500',
  },
  {
    id: 'junk',
    label: 'Junk',
    value: '14',
    subLabel: '28%',
    subLabelColor: 'text-red-500',
    icon: 'x-circle',
    iconColor: 'bg-red-50 text-red-500',
  },
  {
    id: 'avg-duration',
    label: 'Avg Duration',
    value: '3m 17s',
    subLabel: 'Per call',
    icon: 'clock',
    iconColor: 'bg-red-50 text-red-500',
  },
  {
    id: 'purchase-intent',
    label: 'Purchase Intent',
    value: '50%',
    subLabel: '25 calls',
    subLabelColor: 'text-emerald-500',
    icon: 'shopping-cart',
    iconColor: 'bg-red-50 text-red-500',
  },
  {
    id: 'avg-ai-confidence',
    label: 'Avg AI Confidence',
    value: '84%',
    subLabel: 'Classification',
    subLabelColor: 'text-emerald-500',
    icon: 'check-circle',
    iconColor: 'bg-red-50 text-red-500',
  },
];

export const intentDistributionData = [
  { name: 'Buy sneakers', value: 26, fill: '#3b82f6' }, // Blue
  { name: 'Price inquiry', value: 24, fill: '#22c55e' }, // Green
  { name: 'Return item', value: 18, fill: '#f59e0b' }, // Orange/Yellow
  { name: 'Check availability', value: 16, fill: '#a855f7' }, // Purple
  { name: 'Complaint about delivery', value: 16, fill: '#ef4444' }, // Red
];

export const intentVsSentimentData = [
  { name: 'Buy sneakers', positive: 18, neutral: 5, negative: 3 },
  { name: 'Price inquiry', positive: 15, neutral: 6, negative: 3 },
  { name: 'Return item', positive: 4, neutral: 2, negative: 12 },
  { name: 'Complaint about delivery', positive: 0, neutral: 2, negative: 14 },
  { name: 'Check availability', positive: 10, neutral: 4, negative: 2 },
];

export const callLogsData = [
  { id: 'CALL-00001', store: 'Koramangala Flagship', agent: 'Agent 1', duration: '2m 56s', type: 'Complaint', persona: 'Budget Shoppers', category: "Men's Formal", sentiment: 'Negative', converted: '-' },
  { id: 'CALL-00002', store: 'Indiranagar Hub', agent: 'Agent 2', duration: '4m 35s', type: 'Purchase Intent', persona: 'Fashion Seekers', category: "Women's Casual", sentiment: 'Positive', converted: 'Yes' },
  { id: 'CALL-00003', store: 'MG Road Central', agent: 'Agent 3', duration: '2m 36s', type: 'Purchase Intent', persona: 'Fashion Seekers', category: 'Sports Shoes', sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00004', store: 'Andheri West', agent: 'Agent 4', duration: '5m 2s', type: 'Junk', persona: 'Students', category: "Women's Casual", sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00005', store: 'Bandra Link', agent: 'Agent 5', duration: '3m 7s', type: 'Junk', persona: 'Budget Shoppers', category: "Women's Casual", sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00006', store: 'Connaught Place', agent: 'Agent 6', duration: '4m 2s', type: 'Purchase Intent', persona: 'Sports Enthusiasts', category: "Men's Formal", sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00007', store: 'Gurgaon Cyber Hub', agent: 'Agent 7', duration: '1m 53s', type: 'Inquiry', persona: 'Office Professionals', category: 'Sandals', sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00008', store: 'Noida Sector 18', agent: 'Agent 8', duration: '4m 39s', type: 'Complaint', persona: 'Office Professionals', category: "Men's Formal", sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00009', store: 'Jubilee Hills', agent: 'Agent 9', duration: '5m 12s', type: 'Complaint', persona: 'Sports Enthusiasts', category: 'Sports Shoes', sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00010', store: 'Hitech City', agent: 'Agent 10', duration: '3m 6s', type: 'Complaint', persona: 'Fashion Seekers', category: "Men's Formal", sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00011', store: 'Anna Nagar', agent: 'Agent 11', duration: '3m 46s', type: 'Inquiry', persona: 'Budget Shoppers', category: 'Sports Shoes', sentiment: 'Negative', converted: '-' },
  { id: 'CALL-00015', store: 'SG Highway', agent: 'Agent 15', duration: '4m 54s', type: 'Purchase Intent', persona: 'Budget Shoppers', category: "Men's Formal", sentiment: 'Negative', converted: 'Yes' },
  { id: 'CALL-00016', store: 'Ashram Road', agent: 'Agent 1', duration: '1m 48s', type: 'Purchase Intent', persona: 'Students', category: "Men's Formal", sentiment: 'Negative', converted: '-' },
  { id: 'CALL-00017', store: 'Kothrud', agent: 'Agent 2', duration: '2m 28s', type: 'Purchase Intent', persona: 'Office Professionals', category: "Men's Formal", sentiment: 'Negative', converted: 'Yes' },
  { id: 'CALL-00018', store: 'FC Road', agent: 'Agent 3', duration: '2m 11s', type: 'Junk', persona: 'Office Professionals', category: "Men's Formal", sentiment: 'Neutral', converted: '-' },
  { id: 'CALL-00019', store: 'Varanasi Cantt', agent: 'Agent 4', duration: '2m 16s', type: 'Junk', persona: 'Budget Shoppers', category: 'Sports Shoes', sentiment: 'Positive', converted: '-' },
  { id: 'CALL-00020', store: 'Lucknow Hazratganj', agent: 'Agent 5', duration: '1m 22s', type: 'Complaint', persona: 'Fashion Seekers', category: "Men's Formal", sentiment: 'Positive', converted: '-' },
];
