export const mockOperationsKpis = {
  totalCalls: {
    value: '14,700',
    trend: '+8.2% vs yesterday',
    trendUp: true,
  },
  qualifiedCalls: {
    value: '5,490',
    subtitle: '37.3% of total',
    trendUp: true,
  },
  junkCalls: {
    value: '1,695',
    subtitle: '11.5% of total',
    trendUp: false,
  },
  avgDuration: {
    value: '3m 42s',
    trend: '-12s vs last week',
    trendUp: true,
  },
  disconnectRate: {
    value: '4.2%',
    trend: '+0.3%',
    trendUp: false,
  },
  flaggedIssues: {
    value: '12',
    subtitle: '5 high priority',
    trendUp: false,
  },
  weekdayCalls: {
    value: '2,140',
    subtitle: 'Mon-Fri average',
  },
  weekendCalls: {
    value: '2,000',
    subtitle: 'Sat 2,800 • Sun 1,200',
  },
  peakHour: {
    value: '11 AM - 1 PM',
    subtitle: '38% of daily volume',
  },
  repeatCallers: {
    value: '1,240',
    subtitle: '8.4% of total calls',
  },
};

export const mockWeeklyCallVolume = [
  { day: 'Mon', qualified: 700, junk: 300, total: 1000 },
  { day: 'Tue', qualified: 800, junk: 250, total: 1050 },
  { day: 'Wed', qualified: 750, junk: 200, total: 950 },
  { day: 'Thu', qualified: 880, junk: 350, total: 1230 },
  { day: 'Fri', qualified: 980, junk: 400, total: 1380 },
  { day: 'Sat', qualified: 1100, junk: 250, total: 1350 },
  { day: 'Sun', qualified: 450, junk: 100, total: 550 },
];

export const mockCallsByRegion = [
  { name: 'North', value: 4200, color: '#ef4444' },
  { name: 'South', value: 3800, color: '#3b82f6' },
  { name: 'East', value: 3500, color: '#d1d5db' },
  { name: 'West', value: 3200, color: '#e5e7eb' },
];

export const mockGeographicBreakdown = [
  { state: 'Maharashtra', region: 'West', totalCalls: '1,743', qualified: '817', junk: '777', complaints: '67', stores: '8' },
  { state: 'Karnataka', region: 'South', totalCalls: '2,558', qualified: '1,993', junk: '467', complaints: '207', stores: '4' },
  { state: 'Tamil Nadu', region: 'South', totalCalls: '2,045', qualified: '838', junk: '435', complaints: '176', stores: '6' },
  { state: 'Delhi NCR', region: 'North', totalCalls: '2,554', qualified: '1,421', junk: '678', complaints: '78', stores: '6' },
  { state: 'Uttar Pradesh', region: 'North', totalCalls: '4,421', qualified: '958', junk: '527', complaints: '227', stores: '5' },
  { state: 'West Bengal', region: 'East', totalCalls: '3,392', qualified: '1,977', junk: '704', complaints: '106', stores: '6' },
  { state: 'Telangana', region: 'South', totalCalls: '4,248', qualified: '956', junk: '581', complaints: '231', stores: '6' },
  { state: 'Gujarat', region: 'West', totalCalls: '3,771', qualified: '1,179', junk: '643', complaints: '73', stores: '6' },
];

export const mockCityWiseBreakdown = [
  { city: 'Mumbai',      state: 'Maharashtra',   totalCalls: '1,363', qualified: '212', junk: '154', topDemand: 'Canvas Shoes' },
  { city: 'Pune',        state: 'Maharashtra',   totalCalls: '583',   qualified: '701', junk: '347', topDemand: 'White Sneakers' },
  { city: 'Nagpur',      state: 'Maharashtra',   totalCalls: '897',   qualified: '785', junk: '59',  topDemand: 'White Sneakers' },
  { city: 'Bangalore',   state: 'Karnataka',     totalCalls: '1,178', qualified: '743', junk: '310', topDemand: 'Canvas Shoes' },
  { city: 'Mysore',      state: 'Karnataka',     totalCalls: '1,850', qualified: '879', junk: '230', topDemand: 'Canvas Shoes' },
  { city: 'Chennai',     state: 'Tamil Nadu',    totalCalls: '1,140', qualified: '286', junk: '209', topDemand: 'Sports Sandals' },
  { city: 'Coimbatore',  state: 'Tamil Nadu',    totalCalls: '1,024', qualified: '270', junk: '96',  topDemand: 'Running Shoes' },
  { city: 'New Delhi',   state: 'Delhi NCR',     totalCalls: '1,401', qualified: '407', junk: '136', topDemand: 'White Sneakers' },
  { city: 'Gurgaon',     state: 'Delhi NCR',     totalCalls: '885',   qualified: '350', junk: '105', topDemand: 'Sports Sandals' },
  { city: 'Noida',       state: 'Delhi NCR',     totalCalls: '886',   qualified: '381', junk: '55',  topDemand: 'White Sneakers' },
  { city: 'Lucknow',     state: 'Uttar Pradesh', totalCalls: '868',   qualified: '764', junk: '154', topDemand: 'Running Shoes' },
  { city: 'Kanpur',      state: 'Uttar Pradesh', totalCalls: '1,200', qualified: '360', junk: '88',  topDemand: 'Canvas Shoes' },
  { city: 'Kolkata',     state: 'West Bengal',   totalCalls: '2,100', qualified: '980', junk: '310', topDemand: 'Formal Shoes' },
  { city: 'Howrah',      state: 'West Bengal',   totalCalls: '1,050', qualified: '480', junk: '70',  topDemand: 'Sports Sandals' },
  { city: 'Hyderabad',   state: 'Telangana',     totalCalls: '2,800', qualified: '560', junk: '310', topDemand: 'Running Shoes' },
  { city: 'Surat',       state: 'Gujarat',       totalCalls: '1,170', qualified: '370', junk: '90',  topDemand: 'White Sneakers' },
];

export const mockStoreDetails = [
  { store: 'Karamangala Flagship', city: 'Mumbai',     state: 'Maharashtra',   total: 845,  qualified: 380, junk: 95,  conv: '42%', csat: '88%', status: 'Active' },
  { store: 'Indiranagar Hub',      city: 'Mysore',     state: 'Karnataka',     total: 720,  qualified: 310, junk: 110, conv: '36%', csat: '82%', status: 'Active' },
  { store: 'MG Road Central',      city: 'Chennai',    state: 'Tamil Nadu',    total: 930,  qualified: 420, junk: 30,  conv: '45%', csat: '91%', status: 'Active' },
  { store: 'Andheri West',         city: 'New Delhi',  state: 'Delhi NCR',     total: 680,  qualified: 250, junk: 140, conv: '28%', csat: '72%', status: 'Needs Attention' },
  { store: 'Bandra Link',          city: 'Lucknow',    state: 'Uttar Pradesh', total: 790,  qualified: 340, junk: 105, conv: '36%', csat: '95%', status: 'Active' },
  { store: 'Connaught Place',      city: 'Howrah',     state: 'West Bengal',   total: 1050, qualified: 480, junk: 70,  conv: '48%', csat: '93%', status: 'Active' },
  { store: 'Gurgaon Cyber Hub',    city: 'Hyderabad',  state: 'Telangana',     total: 610,  qualified: 200, junk: 160, conv: '22%', csat: '68%', status: 'Needs Attention' },
  { store: 'Noida Sector 18',      city: 'Surat',      state: 'Gujarat',       total: 1170, qualified: 370, junk: 90,  conv: '40%', csat: '86%', status: 'Active' },
  { store: 'Jubilee Hills',        city: 'Nagpur',     state: 'Maharashtra',   total: 950,  qualified: 440, junk: 75,  conv: '46%', csat: '90%', status: 'Active' },
  { store: 'Hitech City',          city: 'Mysore',     state: 'Karnataka',     total: 810,  qualified: 350, junk: 100, conv: '35%', csat: '83%', status: 'Active' },
  { store: 'Anna Nagar',           city: 'Chennai',    state: 'Tamil Nadu',    total: 740,  qualified: 290, junk: 120, conv: '32%', csat: '78%', status: 'Active' },
  { store: 'T Nagar Elite',        city: 'Noida',      state: 'Delhi NCR',     total: 980,  qualified: 460, junk: 65,  conv: '47%', csat: '92%', status: 'Active' },
];

export const mockOperationsInsights = [
  "Saturday call volume is 52% higher than weekday average - weekend staffing gap detected.",
  "North region disconnect rate spiked 18% in last 2 hours - anomaly flagged for client review.",
  "Store 5 and Store 8 have 3x average complaint rate today - delivery delays are the top theme.",
  "South region has highest junk call rate at 24% - caller screening may help.",
  "Maharashtra leads in qualified calls with 37% conversion rate.",
];

export const mockOperationsActions = [
  {
    title: "Weekend staffing alert",
    description: "Saturday volumes 52% above weekday average – 18% callers disconnect before reaching agent",
    priority: "high"
  },
  {
    title: "North disconnect anomaly",
    description: "Disconnect rate spiked 18% in North region – possible routing issue on client side",
    priority: "high"
  },
  {
    title: "Store 5 complaint cluster",
    description: "3x average complaint rate today – 80% mention delivery delays",
    priority: "medium"
  }
];
