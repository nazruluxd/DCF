import { CashFlowYear, DCFAssumptions, DCFResult, StockFinancials } from '../types/dcf';

/**
 * Calculates CAPM Cost of Equity: Ke = Rf + Beta * ERP
 */
export function calculateCostOfEquity(rfRate: number, beta: number, erp: number): number {
  return rfRate + beta * erp;
}

/**
 * Calculates WACC: We * Ke + Wd * Kd * (1 - T)
 */
export function calculateWACC(
  pctEquity: number,
  costOfEquity: number,
  pctDebt: number,
  costOfDebt: number,
  taxRate: number = 0
): number {
  return pctEquity * costOfEquity + pctDebt * costOfDebt * (1 - taxRate);
}

/**
 * Generates projected cash flows for N years
 */
export function generateProjectedCashFlows(
  baseFCF: number,
  assumptions: DCFAssumptions,
  customYearFcfs?: number[]
): CashFlowYear[] {
  const years = assumptions.projectionYears || 7;
  const cashFlows: CashFlowYear[] = [];
  const wacc = assumptions.wacc;

  let currentFCF = baseFCF;

  for (let year = 1; year <= years; year++) {
    let growthRate: number;

    if (year <= 2) {
      growthRate = assumptions.growthRateShort;
    } else if (year <= 4) {
      growthRate = assumptions.growthTransition;
    } else {
      // Fade towards terminal growth rate
      const step = (year - 4) / Math.max(1, years - 4);
      growthRate = assumptions.growthTransition - step * (assumptions.growthTransition - assumptions.growthLT);
    }

    // Allow user override if customYearFcfs provided for this year
    let fcfValue: number;
    if (customYearFcfs && customYearFcfs[year - 1] !== undefined && customYearFcfs[year - 1] !== null) {
      fcfValue = customYearFcfs[year - 1];
      currentFCF = fcfValue;
    } else {
      currentFCF = currentFCF * (1 + growthRate);
      fcfValue = currentFCF;
    }

    const discountFactor = Math.pow(1 + wacc, year);
    const pv = fcfValue / discountFactor;

    cashFlows.push({
      year,
      label: `Year ${year}`,
      fcf: fcfValue,
      discountFactor,
      pv,
      growthRate,
    });
  }

  return cashFlows;
}

/**
 * Core DCF Calculation Function
 */
export function runDCFCalculation(
  financials: StockFinancials,
  assumptions: DCFAssumptions,
  customYearFcfs?: number[]
): DCFResult {
  const years = assumptions.projectionYears || 7;
  const cashFlows = generateProjectedCashFlows(financials.baseFreeCashFlow, assumptions, customYearFcfs);

  // Sum of PV of explicit cash flows
  const sumPvCashFlows = cashFlows.reduce((sum, item) => sum + item.pv, 0);

  // Terminal Value (Gordon Growth Model)
  const finalYearFCF = cashFlows[cashFlows.length - 1]?.fcf || financials.baseFreeCashFlow;
  const effectiveWacc = Math.max(assumptions.wacc, assumptions.growthLT + 0.005); // Prevent divide by zero or negative
  
  const terminalValue = (finalYearFCF * (1 + assumptions.growthLT)) / (effectiveWacc - assumptions.growthLT);
  const pvTerminalValue = terminalValue / Math.pow(1 + assumptions.wacc, years);

  // Value of Operations
  const valueOfOperations = sumPvCashFlows + pvTerminalValue;

  // Scale factor: convert from billions to absolute USD if needed
  const multiplier = financials.unitScale === 'billions' ? 1_000_000_000 : financials.unitScale === 'millions' ? 1_000_000 : 1;
  const valueOfOperationsTotalDollars = valueOfOperations * multiplier;

  // Value of Equity = Value of Operations + NonOpAssets - TotalDebt
  const valueOfEquity = valueOfOperationsTotalDollars + financials.nonOpAssets - financials.totalDebt;

  // Intrinsic Value Per Share
  const shares = Math.max(1, financials.sharesOutstanding);
  const intrinsicValuePerShare = Math.max(0, valueOfEquity / shares);

  // Margin of safety / upside percentage
  const marketPrice = Math.max(0.01, financials.marketPrice);
  const upsideDownsidePct = ((intrinsicValuePerShare - marketPrice) / marketPrice) * 100;
  const isUndervalued = intrinsicValuePerShare > marketPrice;

  // Sensitivity Matrix (Growth rates: [LT - 2%, LT - 1%, LT, LT + 1%, LT + 2%] vs WACC: [WACC - 2%, WACC - 1%, WACC, WACC + 1%, WACC + 2%])
  const baseGrowth = assumptions.growthLT;
  const baseWacc = assumptions.wacc;

  const growthRates = [
    Math.max(0.01, baseGrowth - 0.02),
    Math.max(0.015, baseGrowth - 0.01),
    baseGrowth,
    baseGrowth + 0.01,
    baseGrowth + 0.02,
  ];

  const waccRates = [
    Math.max(0.04, baseWacc - 0.02),
    Math.max(0.05, baseWacc - 0.01),
    baseWacc,
    baseWacc + 0.01,
    baseWacc + 0.02,
  ];

  const matrix: number[][] = [];

  for (let wIndex = 0; wIndex < waccRates.length; wIndex++) {
    const w = waccRates[wIndex];
    const row: number[] = [];

    for (let gIndex = 0; gIndex < growthRates.length; gIndex++) {
      const g = growthRates[gIndex];

      if (w <= g + 0.002) {
        // Asymptote safeguard
        row.push(0);
        continue;
      }

      // Re-discount cashflows with test WACC
      let testSumPv = 0;
      cashFlows.forEach((item, idx) => {
        const yr = idx + 1;
        testSumPv += item.fcf / Math.pow(1 + w, yr);
      });

      const testTV = (finalYearFCF * (1 + g)) / (w - g);
      const testPvTV = testTV / Math.pow(1 + w, years);
      const testValOps = (testSumPv + testPvTV) * multiplier;
      const testEquity = testValOps + financials.nonOpAssets - financials.totalDebt;
      const testIV = Math.max(0, testEquity / shares);

      row.push(Number(testIV.toFixed(2)));
    }

    matrix.push(row);
  }

  return {
    cashFlows,
    sumPvCashFlows,
    terminalValue,
    pvTerminalValue,
    valueOfOperations,
    valueOfEquity,
    intrinsicValuePerShare,
    marketPrice,
    upsideDownsidePct,
    isUndervalued,
    sensitivityMatrix: {
      growthRates,
      waccRates,
      matrix,
    },
  };
}
