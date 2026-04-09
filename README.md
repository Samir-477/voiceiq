# VoiceIQ — Call Analytics Intelligence Platform

A full-stack-ready, production-quality **call analytics dashboard** built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. VoiceIQ gives retail call-center teams real-time AI-processed insights across agent performance, store operations, customer experience, revenue intelligence, and more.

---

## ✨ Features

### 📊 8 Dashboard Pages
| Page | Description |
|---|---|
| **Executive Overview** | KPI cards, region table, weekly call breakdown, intent distribution, missed products |
| **Revenue Intelligence** | Revenue loss chart, product category demand, AI recovery insights |
| **Agent Performance** | Agent leaderboard with clickable modal (5-tab deep-dive per agent) |
| **Store Performance** | Store details table with clickable modal (maps, analytics, agents, products, trends) |
| **Customer Experience** | Sentiment trends, persona conversion, audience split, voice quality, complaint categories |
| **Operations** | Geographic breakdown (region/city/store views), weekly call volume, operations intelligence |
| **Call Explorer** | Full call logs table with clickable modal (transcript, quality scorecard, product mentions) |
| **Reports** | AI insights, weekly performance trend, complaints by region, generated reports |

### 🧩 Modal System
All three core modals (Agent, Call, Store) are built with:
- **React Portals** (`createPortal`) — renders on `document.body` to escape any parent `overflow`/`transform` context
- **Deterministic seeded data** — all random values are seeded by a stable ID so data never changes on re-open
- **Keyboard support** — `Escape` closes the modal
- **Backdrop click** — clicking outside closes the modal
- **Internal scroll** — content scrolls without affecting the page

### 🎨 Design System
- Red (`#ef4444`) primary accent throughout
- Consistent card system: `rounded-xl`, `border border-gray-100`, `shadow-sm`
- Shared `LocationFilterBar` with cascading Region → State → City → Store dropdowns
- Recharts for all data visualizations (bar, line, pie, radar)
- Lucide React icons

---

## 🗂️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Executive Overview
│   ├── mock-data.ts              # Overview mock data
│   ├── agent-performance/
│   ├── call-explorer/
│   ├── customer-experience/
│   ├── operations/
│   ├── reports/
│   ├── revenue/
│   ├── store-performance/
│   └── login/
│
├── components/
│   ├── layout/                   # Header, Sidebar, LayoutWrapper
│   ├── shared/                   # LocationFilterBar (used on all 8 pages)
│   ├── dashboard/                # Overview page components
│   ├── agent-performance/        # Leaderboard + AgentModal
│   ├── call-explorer/            # CallLogsTable + CallModal
│   ├── store-performance/        # StoreDetailsTable + StoreModal
│   ├── customer-experience/      # CX charts
│   ├── operations/               # Ops charts
│   ├── revenue/                  # Revenue charts
│   ├── reports/                  # Report components
│   └── ui/                       # Shared primitives (Select)
│
├── hooks/
│   ├── use-filters.tsx           # Global filter state (Region/State/City/Store)
│   └── use-is-mounted.ts         # SSR-safe Recharts mount guard
│
├── lib/
│   ├── utils.ts                  # cn() Tailwind helper
│   └── trend-utils.ts            # calculateTrend() for KPI trends
│
└── types/
    ├── index.ts                  # Domain types (KpiMetric, AgentLeaderboardRecord…)
    └── api.ts                    # API response shapes for backend integration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Samir-477/voiceiq.git
cd voiceiq

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 Backend Integration Readiness

The codebase is structured for clean API integration:

- **`src/types/api.ts`** — Contains all typed API response shapes (`DashboardFilters`, `KPIOverview`, `CallReviewResponse`, etc.)
- **`src/hooks/use-filters.tsx`** — Global filter state, ready to trigger data re-fetches via React Query / SWR
- **Mock data** — Each page has its own `mock-data.ts`. Replace imports with API calls to plug in the backend

### Next Steps for Backend Integration
1. Create `src/lib/api-client.ts` — centralized fetch client with auth headers
2. Connect `use-filters.tsx` to trigger re-fetches on filter change
3. Replace each page's `mock-data.ts` import with API call
4. Delete the `mock-data.ts` file once the route is wired

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| UI Primitives | Radix UI (Select) |
| State | React Context (filters) |

---

## 📸 Pages at a Glance

- **Overview** — Executive KPI summary with trend badges
- **Agent Leaderboard** — Click any row → 5-tab agent profile modal
- **Call Logs** — Click any row → call analysis modal with transcript & quality scorecard
- **Store Details** — Click any store name → store detail modal with embedded Google Maps

---

## 📄 License

MIT © 2024 VoiceIQ
