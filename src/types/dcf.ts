export interface CashFlowYear {
  year: number;
  label: string;
  fcf: number; // in billions or absolute USD
  discountFactor: number;
  pv: number;
  growthRate: number;
}

export interface DCFAssumptions {
  growthLT: number;          // Terminal growth rate (e.g. 0.05 = 5%)
  growthTransition: number;  // Transition growth rate (e.g. 0.175 = 17.5%)
  growthRateShort: number;   // Short term growth rate (e.g. 0.35 = 35%)
  wacc: number;              // Weighted Average Cost of Capital (e.g. 0.1061 = 10.61%)
  costOfDebt: number;        // Cost of debt (e.g. 0.0575 = 5.75%)
  costOfEquity: number;      // CAPM Cost of equity (e.g. 0.1223 = 12.23%)
  beta: number;              // Beta (e.g. 1.25)
  rfRate: number;            // Risk-free rate (e.g. 0.0473 = 4.73%)
  marketRiskPremium: number; // Market risk premium (e.g. 0.06 = 6.0%)
  taxRate: number;           // Marginal tax rate (e.g. 0.21 = 21%)
  pctDebt: number;           // Weight of debt (e.g. 0.25 = 25%)
  pctEquity: number;         // Weight of equity (e.g. 0.75 = 75%)
  projectionYears: number;   // Number of explicit projection years (default 7)
  includeDividendReinvestment?: boolean; // Reinvest dividends in DCF intrinsic value calculation
}

export interface StockFinancials {
  symbol: string;
  companyName: string;
  currency: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  marketPrice: number;
  todaysChangePct: number;
  week52High: number;
  week52Low: number;
  marketCap: number;
  totalDebt: number;
  nonOpAssets: number; // Cash, short term investments, non-operating assets
  sharesOutstanding: number;
  epsTTM: number;
  peTTM: number;
  evEbitda?: number;
  dividendYield?: number;
  revenueTTM?: number;
  netIncomeTTM?: number;
  operatingCashFlowTTM?: number;
  baseFreeCashFlow: number; // TTM or latest fiscal year FCF in billions or dollars
  unitScale: 'billions' | 'millions' | 'exact'; // Display scale for table
  bullishFactors: string[];
  bearishFactors: string[];
}

export interface DCFResult {
  cashFlows: CashFlowYear[];
  sumPvCashFlows: number;
  terminalValue: number;
  pvTerminalValue: number;
  valueOfOperations: number;
  valueOfEquity: number;
  intrinsicValuePerShare: number;
  marketPrice: number;
  upsideDownsidePct: number;
  isUndervalued: boolean;
  includeDividendReinvestment?: boolean;
  dividendYieldUsed?: number;
  dripMultiplier?: number;
  dividendReinvestmentBoost?: number;
  sensitivityMatrix: {
    growthRates: number[];
    waccRates: number[];
    matrix: number[][]; // [waccIndex][growthIndex] -> intrinsic value per share
  };
}

export type ValuationSource =
  | 'fmp_live'
  | 'finnhub_live'
  | 'alphavantage_live'
  | 'yahoo_live'
  | 'gemini_grounded'
  | 'cache'
  | 'algorithmic';

export interface StockValuationPackage {
  financials: StockFinancials;
  assumptions: DCFAssumptions;
  timestamp: string;
  source: ValuationSource;
  providerInfo?: {
    name: string;
    description: string;
    isRealTime: boolean;
  };
}

export interface ProviderStatus {
  id: string;
  name: string;
  configured: boolean;
  freeTier: string;
  description: string;
  website: string;
  envKey: string;
}

