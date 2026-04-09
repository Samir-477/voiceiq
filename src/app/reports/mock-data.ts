export const mockQuickPrompts = [
  "Revenue loss in South",
  "Top complaint stores",
  "Best performing agents",
  "Stockout impact analysis",
  "Weekly call trends"
];

export const mockGeneratedReports = [
  {
    report: "Weekly Performance Summary",
    date: "Apr 3, 2026",
    type: "Auto",
    status: "Ready"
  },
  {
    report: "South Region Revenue Report",
    date: "Apr 2, 2026",
    type: "Custom",
    status: "Ready"
  },
  {
    report: "Revenue Leakage Analysis",
    date: "Apr 1, 2026",
    type: "Auto",
    status: "Ready"
  },
  {
    report: "Agent Performance Q1",
    date: "Mar 31, 2026",
    type: "Auto",
    status: "Ready"
  }
];

export const mockWeeklyPerformanceTrend = [
  { week: "W1", metric1: 5200, metric2: 300 },
  { week: "W2", metric1: 5800, metric2: 300 },
  { week: "W3", metric1: 6200, metric2: 250 },
  { week: "W4", metric1: 5900, metric2: 300 }
];

export const mockComplaintsByRegion = [
  { region: "North", complaints: 320 },
  { region: "South", complaints: 280 },
  { region: "East", complaints: 250 },
  { region: "West", complaints: 210 }
];

export const mockReportsAiInsights = [
  {
    title: "Weekly reports show consistent revenue decline in South for 3 weeks",
    actionText: "Schedule executive review for South region"
  },
  {
    title: "Auto-reports detect anomaly: 40% spike in complaints from Delhi",
    actionText: "Generate detailed Delhi complaint analysis"
  }
];
