import { DCFAssumptions, DCFResult, StockFinancials } from '../types/dcf';

export function exportDCFToCsv(
  financials: StockFinancials,
  assumptions: DCFAssumptions,
  dcfResult: DCFResult
): void {
  const lines: string[] = [];

  lines.push(`DCF VALUATION MODEL - ${financials.companyName} (${financials.symbol})`);
  lines.push(`Exported on,${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
  lines.push('');

  // Top Table: Cash Flows
  lines.push('CASH FLOW PROJECTIONS & PRESENT VALUE');
  const yearsHeader = ['Metric', ...dcfResult.cashFlows.map(c => `Year ${c.year}`)];
  lines.push(yearsHeader.join(','));

  const fcfRow = ['Free Cash Flows ($B)', ...dcfResult.cashFlows.map(c => c.fcf.toFixed(4))];
  lines.push(fcfRow.join(','));

  const pvRow = ['PV of cash flows ($B)', dcfResult.sumPvCashFlows.toFixed(4), ...dcfResult.cashFlows.slice(1).map(c => c.pv.toFixed(4))];
  lines.push(pvRow.join(','));

  lines.push(`PV of Terminal value ($B),${dcfResult.pvTerminalValue.toFixed(4)}`);
  lines.push(`Value of operations ($B),${dcfResult.valueOfOperations.toFixed(4)}`);
  lines.push('');

  // Assumptions & Valuation Summary Side by Side
  lines.push('ASSUMPTIONS & WACC,VALUATION SUMMARY,MARKET MULTIPLES');
  lines.push(`Growth LT,${(assumptions.growthLT * 100).toFixed(2)}%,Value of operations,$${(dcfResult.valueOfOperations * 1_000_000_000).toLocaleString()},EPS (TTM),$${financials.epsTTM.toFixed(2)}`);
  lines.push(`Growth Transition,${(assumptions.growthTransition * 100).toFixed(2)}%,Non-op-assets,$${financials.nonOpAssets.toLocaleString()},PE (TTM),${financials.peTTM.toFixed(2)}x`);
  lines.push(`Growth Rate Short,${(assumptions.growthRateShort * 100).toFixed(2)}%,Total Debt,$${financials.totalDebt.toLocaleString()},Today's Change %,${financials.todaysChangePct.toFixed(2)}%`);
  lines.push(`WACC,${(assumptions.wacc * 100).toFixed(2)}%,# of shares,${financials.sharesOutstanding.toLocaleString()},52 Week High,$${financials.week52High.toFixed(2)}`);
  lines.push(`Cost of Debt,${(assumptions.costOfDebt * 100).toFixed(2)}%,Value of Equity,$${dcfResult.valueOfEquity.toLocaleString()},52 Week Low,$${financials.week52Low.toFixed(2)}`);
  lines.push(`CAPM,${(assumptions.costOfEquity * 100).toFixed(2)}%,Intrinsic value per share,$${dcfResult.intrinsicValuePerShare.toFixed(2)},Market Cap,$${financials.marketCap.toLocaleString()}`);
  lines.push(`Beta,${assumptions.beta.toFixed(2)},Market Price,$${financials.marketPrice.toFixed(2)}`);
  lines.push(`RF rate,${(assumptions.rfRate * 100).toFixed(2)}%,Upside/Downside %,${dcfResult.upsideDownsidePct.toFixed(2)}%`);
  lines.push(`Market Risk Premium,${(assumptions.marketRiskPremium * 100).toFixed(2)}%`);
  lines.push(`% Debt,${(assumptions.pctDebt * 100).toFixed(1)}%`);
  lines.push(`% Equity,${(assumptions.pctEquity * 100).toFixed(1)}%`);
  lines.push('');

  // Bullish & Bearish Factors
  lines.push('BULLISH FACTORS,BEARISH FACTORS');
  const maxFactors = Math.max(financials.bullishFactors.length, financials.bearishFactors.length);
  for (let i = 0; i < maxFactors; i++) {
    const bull = (financials.bullishFactors[i] || '').replace(/,/g, ';');
    const bear = (financials.bearishFactors[i] || '').replace(/,/g, ';');
    lines.push(`"${bull}","${bear}"`);
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${financials.symbol}_DCF_Valuation.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
