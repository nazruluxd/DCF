import { DCFAssumptions, StockFinancials } from '../types/dcf';

export interface PreloadedStock {
  financials: StockFinancials;
  assumptions: DCFAssumptions;
  customYearFcfs?: number[];
}

export const PRELOADED_STOCKS: Record<string, PreloadedStock> = {
  NFLX: {
    financials: {
      symbol: 'NFLX',
      companyName: 'Netflix, Inc.',
      currency: 'USD',
      exchange: 'NASDAQ',
      sector: 'Communication Services',
      industry: 'Entertainment & Streaming',
      description: 'Netflix is the world\'s leading streaming entertainment service with over 280 million paid memberships in over 190 countries.',
      marketPrice: 82.34, // Matches user screenshot
      todaysChangePct: 1.88,
      week52High: 126.71,
      week52Low: 65.10,
      marketCap: 343129388212,
      totalDebt: 15000000000,
      nonOpAssets: 12222400000,
      sharesOutstanding: 4167225992,
      epsTTM: 3.17,
      peTTM: 25.97,
      evEbitda: 21.4,
      dividendYield: 0.0,
      revenueTTM: 37580000000,
      netIncomeTTM: 7100000000,
      operatingCashFlowTTM: 7850000000,
      baseFreeCashFlow: 7.125, // Billions (Year 1: 7.1250)
      unitScale: 'billions',
      bullishFactors: [
        'Streaming tailwind and global market leadership',
        'Proprietary recommendation algorithms and machine learning',
        'Paid sharing enforcement and high-margin ad tier ramp',
        'Strong operating leverage and content amortization scale'
      ],
      bearishFactors: [
        'Consumer behavior shifts and churn risk',
        'Investor sentiment regarding peak subscriber penetration',
        'Rising production budgets and competitive bidding for live sports',
        'FX headwinds in emerging markets'
      ]
    },
    assumptions: {
      growthLT: 0.05,           // 5.0% Terminal Growth
      growthTransition: 0.175,  // 17.5% Transition
      growthRateShort: 0.35,    // 35.0% Short-term
      wacc: 0.1061,             // 10.61% WACC
      costOfDebt: 0.0575,       // 5.75%
      costOfEquity: 0.1223,     // 12.23% CAPM
      beta: 1.25,               // 1.25
      rfRate: 0.0473,           // 4.73% Risk-free rate
      marketRiskPremium: 0.06,  // 6.0% ERP
      taxRate: 0.21,
      pctDebt: 0.25,            // 25% Debt
      pctEquity: 0.75,          // 75% Equity
      projectionYears: 7
    },
    customYearFcfs: [7.1250, 9.6188, 13.1700, 14.26, 16.96, 22.00, 25.85]
  },
  AAPL: {
    financials: {
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      currency: 'USD',
      exchange: 'NASDAQ',
      sector: 'Information Technology',
      industry: 'Consumer Electronics & Services',
      description: 'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and sells a variety of related services.',
      marketPrice: 228.50,
      todaysChangePct: 0.75,
      week52High: 237.23,
      week52Low: 164.08,
      marketCap: 3480000000000,
      totalDebt: 104000000000,
      nonOpAssets: 65000000000,
      sharesOutstanding: 15200000000,
      epsTTM: 6.60,
      peTTM: 34.62,
      evEbitda: 25.1,
      dividendYield: 0.44,
      revenueTTM: 391000000000,
      netIncomeTTM: 100000000000,
      operatingCashFlowTTM: 118000000000,
      baseFreeCashFlow: 108.8,
      unitScale: 'billions',
      bullishFactors: [
        'Massive recurring services ecosystem revenue (App Store, Cloud, Pay)',
        'Apple Intelligence on-device AI supercycle upgrade potential',
        'Tremendous brand loyalty and pricing power',
        'World-class balance sheet and aggressive share buyback program'
      ],
      bearishFactors: [
        'Regulatory antitrust scrutiny in EU and US Department of Justice',
        'Smartphone replacement cycles lengthening globally',
        'Hardware manufacturing concentration in Asia'
      ]
    },
    assumptions: {
      growthLT: 0.035,
      growthTransition: 0.08,
      growthRateShort: 0.12,
      wacc: 0.085,
      costOfDebt: 0.045,
      costOfEquity: 0.098,
      beta: 1.05,
      rfRate: 0.042,
      marketRiskPremium: 0.055,
      taxRate: 0.16,
      pctDebt: 0.15,
      pctEquity: 0.85,
      projectionYears: 7
    },
    customYearFcfs: [118.0, 131.0, 144.5, 157.0, 170.0, 183.0, 196.0]
  },
  NVDA: {
    financials: {
      symbol: 'NVDA',
      companyName: 'NVIDIA Corporation',
      currency: 'USD',
      exchange: 'NASDAQ',
      sector: 'Information Technology',
      industry: 'Semiconductors & AI Hardware',
      description: 'NVIDIA pioneers GPU-accelerated computing, AI data center platforms, CUDA software stack, and autonomous machinery.',
      marketPrice: 122.40,
      todaysChangePct: 2.45,
      week52High: 140.76,
      week52Low: 45.11,
      marketCap: 3010000000000,
      totalDebt: 9800000000,
      nonOpAssets: 34800000000,
      sharesOutstanding: 24500000000,
      epsTTM: 2.85,
      peTTM: 42.9,
      evEbitda: 32.5,
      dividendYield: 0.03,
      revenueTTM: 115000000000,
      netIncomeTTM: 65000000000,
      operatingCashFlowTTM: 68000000000,
      baseFreeCashFlow: 58.5,
      unitScale: 'billions',
      bullishFactors: [
        'Unrivaled Blackwell and Hopper AI architecture leadership',
        'CUDA proprietary software ecosystem creates immense switching costs',
        'Hyperscaler CapEx expansion from Microsoft, Meta, Google, Amazon',
        'Expansion into sovereign AI, enterprise robotics, and networking (Infiniband)'
      ],
      bearishFactors: [
        'Geopolitical export restrictions to China and international markets',
        'Hyperscaler custom silicon ASIC development (TPU, Trainium, Maia)',
        'Cyclical data center buildout digestion periods'
      ]
    },
    assumptions: {
      growthLT: 0.045,
      growthTransition: 0.22,
      growthRateShort: 0.40,
      wacc: 0.112,
      costOfDebt: 0.05,
      costOfEquity: 0.125,
      beta: 1.65,
      rfRate: 0.043,
      marketRiskPremium: 0.055,
      taxRate: 0.15,
      pctDebt: 0.08,
      pctEquity: 0.92,
      projectionYears: 7
    },
    customYearFcfs: [78.0, 105.0, 132.0, 158.0, 185.0, 212.0, 240.0]
  },
  TSLA: {
    financials: {
      symbol: 'TSLA',
      companyName: 'Tesla, Inc.',
      currency: 'USD',
      exchange: 'NASDAQ',
      sector: 'Consumer Discretionary',
      industry: 'Automobile & Clean Energy',
      description: 'Tesla designs, develops, manufactures, sells, and leases electric vehicles, energy storage systems, and solar panels.',
      marketPrice: 245.20,
      todaysChangePct: -1.15,
      week52High: 271.00,
      week52Low: 138.80,
      marketCap: 780000000000,
      totalDebt: 12500000000,
      nonOpAssets: 30700000000,
      sharesOutstanding: 3180000000,
      epsTTM: 3.82,
      peTTM: 64.1,
      evEbitda: 45.2,
      dividendYield: 0.0,
      revenueTTM: 97000000000,
      netIncomeTTM: 12500000000,
      operatingCashFlowTTM: 14200000000,
      baseFreeCashFlow: 6.8,
      unitScale: 'billions',
      bullishFactors: [
        'Megapack utility energy storage growth exceeding 100% YoY',
        'Full Self-Driving (FSD) v12 end-to-end neural network monetization',
        'Next-generation low cost platform and robotaxi deployment',
        'Optimus humanoid robot long-term industrial robotics optionality'
      ],
      bearishFactors: [
        'Global EV competition and margin compression from Chinese manufacturers',
        'Automotive gross margins under pressure from price cuts',
        'Capital expenditure requirements for AI compute clusters'
      ]
    },
    assumptions: {
      growthLT: 0.04,
      growthTransition: 0.20,
      growthRateShort: 0.30,
      wacc: 0.118,
      costOfDebt: 0.06,
      costOfEquity: 0.132,
      beta: 1.85,
      rfRate: 0.043,
      marketRiskPremium: 0.055,
      taxRate: 0.18,
      pctDebt: 0.10,
      pctEquity: 0.90,
      projectionYears: 7
    },
    customYearFcfs: [9.5, 13.0, 17.5, 23.0, 29.5, 37.0, 45.0]
  },
  MSFT: {
    financials: {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      currency: 'USD',
      exchange: 'NASDAQ',
      sector: 'Information Technology',
      industry: 'Software - Infrastructure & Cloud',
      description: 'Microsoft develops and supports software, services, devices, and solutions including Azure cloud, Microsoft 365, LinkedIn, and Gaming.',
      marketPrice: 428.15,
      todaysChangePct: 1.10,
      week52High: 468.35,
      week52Low: 309.45,
      marketCap: 3180000000000,
      totalDebt: 67000000000,
      nonOpAssets: 80000000000,
      sharesOutstanding: 7430000000,
      epsTTM: 11.80,
      peTTM: 36.28,
      evEbitda: 24.3,
      dividendYield: 0.75,
      revenueTTM: 245000000000,
      netIncomeTTM: 88000000000,
      operatingCashFlowTTM: 118000000000,
      baseFreeCashFlow: 74.0,
      unitScale: 'billions',
      bullishFactors: [
        'Azure Cloud rapid market share expansion with OpenAI integration',
        'Copilot monetization across commercial enterprise seats',
        'Strong recurring enterprise subscription moats',
        'AAA gaming and Activision Blizzard portfolio revenue synergies'
      ],
      bearishFactors: [
        'Massive AI infrastructure capital expenditure commitments',
        'Cloud growth deceleration law of large numbers',
        'Enterprise IT budget scrutiny'
      ]
    },
    assumptions: {
      growthLT: 0.035,
      growthTransition: 0.12,
      growthRateShort: 0.18,
      wacc: 0.088,
      costOfDebt: 0.045,
      costOfEquity: 0.096,
      beta: 0.95,
      rfRate: 0.042,
      marketRiskPremium: 0.055,
      taxRate: 0.19,
      pctDebt: 0.12,
      pctEquity: 0.88,
      projectionYears: 7
    },
    customYearFcfs: [86.0, 99.5, 114.0, 129.0, 144.5, 160.0, 176.0]
  }
};
