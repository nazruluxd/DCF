import React, { useState } from 'react';
import {
  DCFAssumptions,
  DCFResult,
  StockFinancials
} from '../types/dcf';
import { formatCurrency, formatNumber, formatPercent, formatRawPercent, formatDividendYield } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SpreadsheetViewProps {
  financials: StockFinancials;
  assumptions: DCFAssumptions;
  dcfResult: DCFResult;
  onUpdateAssumption: <K extends keyof DCFAssumptions>(key: K, value: DCFAssumptions[K]) => void;
  onUpdateFinancial: <K extends keyof StockFinancials>(key: K, value: StockFinancials[K]) => void;
  customYearFcfs: number[];
  onUpdateYearFcf: (yearIndex: number, value: number) => void;
  onResetCustomFcfs: () => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  financials,
  assumptions,
  dcfResult,
  onUpdateAssumption,
  onUpdateFinancial,
  customYearFcfs,
  onUpdateYearFcf,
  onResetCustomFcfs,
}) => {
  const [activeCellTooltip, setActiveCellTooltip] = useState<string | null>(null);
  const [editingFcfIndex, setEditingFcfIndex] = useState<number | null>(null);
  const [editingFcfVal, setEditingFcfVal] = useState<string>('');

  const handleStartEditFcf = (index: number, currentVal: number) => {
    setEditingFcfIndex(index);
    setEditingFcfVal(currentVal.toString());
  };

  const handleSaveFcf = (index: number) => {
    const parsed = parseFloat(editingFcfVal);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateYearFcf(index, parsed);
    }
    setEditingFcfIndex(null);
  };

  const hasCustomFcfs = customYearFcfs.length > 0;

  // Sensitivity growth rates for bottom table (Various Growth Rates row in image)
  const growthVariations = [0.06, 0.05, 0.04, 0.03, 0.02];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-900">
      
      {/* Spreadsheet Control Banner */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white">Interactive Model Sheet:</span>
          <span className="text-slate-400">Click any blue or white cell to edit inputs. DCF recalculates in real-time.</span>
        </div>

        {hasCustomFcfs && (
          <button
            onClick={onResetCustomFcfs}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded hover:bg-amber-500/30 transition text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Custom Cash Flows</span>
          </button>
        )}
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="overflow-x-auto p-4 bg-white font-mono text-[13px] leading-tight select-none">
        
        {/* Table 1: Top Cash Flows & PV Projection Table */}
        <div className="mb-6 border border-slate-400 shadow-sm bg-white overflow-hidden">
          <table className="w-full border-collapse border border-slate-400">
            {/* Column Header Letters: A, B, C, D, E, F, G, H */}
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs font-semibold text-center border-b border-slate-400">
                <th className="w-10 border-r border-slate-400 py-1 bg-slate-200">#</th>
                <th className="w-48 border-r border-slate-400 px-2 py-1 text-left">A</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">B (Yr 1)</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">C (Yr 2)</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">D (Yr 3)</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">E (Yr 4)</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">F (Yr 5)</th>
                <th className="w-32 border-r border-slate-400 px-2 py-1">G (Yr 6)</th>
                <th className="w-32 border-slate-400 px-2 py-1">H (Yr 7)</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Free Cash Flows */}
              <tr className="border-b border-slate-400 hover:bg-amber-50/40">
                <td className="bg-slate-100 text-slate-500 text-center font-bold border-r border-slate-400 text-xs py-1.5">1</td>
                <td className="bg-[#ffeb9c] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 flex items-center justify-between">
                  <span>Free Cash Flows ($B)</span>
                  <Edit3 className="w-3 h-3 text-amber-800 opacity-60" />
                </td>

                {dcfResult.cashFlows.map((cf, idx) => (
                  <td
                    key={cf.year}
                    onClick={() => handleStartEditFcf(idx, cf.fcf)}
                    className="border-r border-slate-400 px-2 py-1.5 text-right font-medium cursor-pointer hover:bg-amber-100/70 transition group relative"
                    title="Click to edit Free Cash Flow value"
                  >
                    {editingFcfIndex === idx ? (
                      <input
                        type="number"
                        step="0.01"
                        autoFocus
                        value={editingFcfVal}
                        onChange={(e) => setEditingFcfVal(e.target.value)}
                        onBlur={() => handleSaveFcf(idx)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveFcf(idx);
                          if (e.key === 'Escape') setEditingFcfIndex(null);
                        }}
                        className="w-full text-right bg-white border border-amber-500 rounded px-1 text-slate-900 focus:outline-none"
                      />
                    ) : (
                      <span className="flex items-center justify-end gap-1">
                        <span>${cf.fcf.toFixed(4)}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-700">✎</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 2: PV of cash flows */}
              <tr className="border-b border-slate-400 hover:bg-amber-50/40">
                <td className="bg-slate-100 text-slate-500 text-center font-bold border-r border-slate-400 text-xs py-1.5">2</td>
                <td className="bg-[#ffeb9c] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400">
                  PV of cash flows
                </td>
                {/* Column B has the sum in the spreadsheet: $139.2082 */}
                <td className="border-r border-slate-400 px-2 py-1.5 text-right font-bold text-slate-950 bg-amber-50" title="Sum of all projected PVs">
                  ${dcfResult.sumPvCashFlows.toFixed(4)}
                </td>
                {/* Columns C through H: PV of each year */}
                {dcfResult.cashFlows.slice(1).map((cf) => (
                  <td key={cf.year} className="border-r border-slate-400 px-2 py-1.5 text-right text-slate-700">
                    ${cf.pv.toFixed(4)}
                  </td>
                ))}
              </tr>

              {/* Row 3: PV of Terminal value */}
              <tr className="border-b border-slate-400 hover:bg-amber-50/40">
                <td className="bg-slate-100 text-slate-500 text-center font-bold border-r border-slate-400 text-xs py-1.5">3</td>
                <td className="bg-[#ffeb9c] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400">
                  PV of Terminal valu
                </td>
                <td className="border-r border-slate-400 px-2 py-1.5 text-right font-bold text-slate-950 bg-amber-50">
                  ${dcfResult.pvTerminalValue.toFixed(4)}
                </td>
                <td colSpan={6} className="bg-slate-50/80 border-slate-400 text-slate-400 text-xs px-2 py-1.5 italic">
                  Gordon Growth TV = FCF₇ × (1+g) / (WACC - g), discounted back 7 years
                </td>
              </tr>

              {/* Row 4: Value of operations */}
              <tr className="hover:bg-amber-50/40">
                <td className="bg-slate-100 text-slate-500 text-center font-bold border-r border-slate-400 text-xs py-1.5">4</td>
                <td className="bg-[#ffeb9c] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400">
                  Value of operations
                </td>
                <td className="border-r border-slate-400 px-2 py-1.5 text-right font-black text-slate-950 bg-[#ffeb9c]">
                  ${dcfResult.valueOfOperations.toFixed(4)}
                </td>
                <td colSpan={6} className="bg-slate-50/80 border-slate-400 text-slate-400 text-xs px-2 py-1.5 italic">
                  PV of Cash Flows (${dcfResult.sumPvCashFlows.toFixed(2)}B) + PV of Terminal Value (${dcfResult.pvTerminalValue.toFixed(2)}B)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Three-Panel Layout (Left Blue Assumptions, Center Red Valuation, Right Purple Multiples) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT PANEL: Blue Inputs & WACC Assumptions (Cols 1-4) */}
          <div className="lg:col-span-4 border border-slate-400 shadow-sm bg-white">
            <div className="bg-[#bdd7ee] px-3 py-1.5 font-bold text-slate-900 border-b border-slate-400 text-xs uppercase tracking-wide flex items-center justify-between">
              <span>Assumptions & WACC Model</span>
              <span className="text-[10px] text-blue-900 font-semibold">Inputs</span>
            </div>

            <table className="w-full border-collapse">
              <tbody>
                {/* Growth LT */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs w-44">
                    Growth LT
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.005"
                      min="0.01"
                      max="0.10"
                      value={assumptions.growthLT}
                      onChange={(e) => onUpdateAssumption('growthLT', parseFloat(e.target.value) || 0.04)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* Growth Transition */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Growth Transition
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.005"
                      value={assumptions.growthTransition}
                      onChange={(e) => onUpdateAssumption('growthTransition', parseFloat(e.target.value) || 0.15)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* Growth Rate Short 1 */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Growth Rate Short 1
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.01"
                      value={assumptions.growthRateShort}
                      onChange={(e) => onUpdateAssumption('growthRateShort', parseFloat(e.target.value) || 0.25)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* WACC */}
                <tr className="border-b border-slate-300 bg-blue-100/40 font-bold">
                  <td className="bg-[#bdd7ee] text-slate-900 font-bold px-3 py-1 border-r border-slate-400 text-xs">
                    WACC
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.001"
                      value={assumptions.wacc}
                      onChange={(e) => onUpdateAssumption('wacc', parseFloat(e.target.value) || 0.10)}
                      className="w-20 text-right bg-blue-100/70 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-black text-slate-950"
                    />
                  </td>
                </tr>

                {/* Cost of Debt */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Cost of Debt
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.0025"
                      value={assumptions.costOfDebt}
                      onChange={(e) => onUpdateAssumption('costOfDebt', parseFloat(e.target.value) || 0.05)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* CAPM */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    CAPM
                  </td>
                  <td className="px-2 py-1 text-right font-bold text-slate-900">
                    {assumptions.costOfEquity.toFixed(4)}
                  </td>
                </tr>

                {/* Beta */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Beta
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.05"
                      value={assumptions.beta}
                      onChange={(e) => {
                        const newBeta = parseFloat(e.target.value) || 1.0;
                        onUpdateAssumption('beta', newBeta);
                        // recalculate CAPM: Rf + Beta * ERP
                        const newCAPM = assumptions.rfRate + newBeta * assumptions.marketRiskPremium;
                        onUpdateAssumption('costOfEquity', Number(newCAPM.toFixed(4)));
                      }}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* RF rate */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    RF rate
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.001"
                      value={assumptions.rfRate}
                      onChange={(e) => onUpdateAssumption('rfRate', parseFloat(e.target.value) || 0.04)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* Market Risk Premium */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Market Risk Premiu
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.005"
                      value={assumptions.marketRiskPremium}
                      onChange={(e) => onUpdateAssumption('marketRiskPremium', parseFloat(e.target.value) || 0.06)}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* Market Cap */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Market Cap
                  </td>
                  <td className="px-2 py-1 text-right font-medium text-slate-800">
                    {formatCurrency(financials.marketCap, 0)}
                  </td>
                </tr>

                {/* Total Debt */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    Total Debt
                  </td>
                  <td className="px-2 py-1 text-right font-medium text-slate-800">
                    {formatCurrency(financials.totalDebt, 0)}
                  </td>
                </tr>

                {/* % Debt */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    % Debt
                  </td>
                  <td className="px-2 py-1 text-right">
                    <input
                      type="number"
                      step="0.025"
                      min="0"
                      max="1"
                      value={assumptions.pctDebt}
                      onChange={(e) => {
                        const d = parseFloat(e.target.value) || 0.2;
                        onUpdateAssumption('pctDebt', d);
                        onUpdateAssumption('pctEquity', Number((1 - d).toFixed(3)));
                      }}
                      className="w-20 text-right bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent focus:border-blue-500 rounded px-1 font-bold text-slate-900"
                    />
                  </td>
                </tr>

                {/* % Equity */}
                <tr>
                  <td className="bg-[#bdd7ee] text-slate-900 font-semibold px-3 py-1 border-r border-slate-400 text-xs">
                    % Equity
                  </td>
                  <td className="px-2 py-1 text-right font-bold text-slate-900">
                    {assumptions.pctEquity.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CENTER PANEL: Salmon/Red Valuation Summary & Catalysts (Cols 5-9) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Core Valuation Summary Table */}
            <div className="border border-slate-400 shadow-sm bg-white">
              <table className="w-full border-collapse">
                <tbody>
                  {/* Value of operations */}
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#f8cbad] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs w-48">
                      Value of operations
                    </td>
                    <td className="px-3 py-1.5 text-right font-black text-slate-950">
                      {formatCurrency(dcfResult.valueOfOperations * 1_000_000_000, 0)}
                    </td>
                  </tr>

                  {/* Non-op-assets */}
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#f8cbad] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                      Non-op-assets
                    </td>
                    <td className="px-3 py-1.5 text-right font-medium text-slate-800">
                      {formatCurrency(financials.nonOpAssets, 0)}
                    </td>
                  </tr>

                  {/* Debt */}
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#f8cbad] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                      Debt
                    </td>
                    <td className="px-3 py-1.5 text-right font-medium text-rose-800">
                      {formatCurrency(financials.totalDebt, 0)}
                    </td>
                  </tr>

                  {/* # of shares */}
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#f8cbad] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                      # of shares
                    </td>
                    <td className="px-3 py-1.5 text-right font-medium text-slate-800">
                      {formatNumber(financials.sharesOutstanding)}
                    </td>
                  </tr>

                  {/* Value of Equity */}
                  <tr className="border-b border-slate-300 bg-orange-50/60">
                    <td className="bg-[#f8cbad] text-slate-900 font-black px-3 py-1.5 border-r border-slate-400 text-xs">
                      Value of Equity
                    </td>
                    <td className="px-3 py-1.5 text-right font-black text-slate-950 text-sm">
                      {formatCurrency(dcfResult.valueOfEquity, 0)}
                    </td>
                  </tr>

                  {/* Annual Dividend Yield */}
                  <tr className="border-b border-slate-300 bg-amber-50/60">
                    <td className="bg-amber-100/80 text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                      Annual dividend yield
                    </td>
                    <td className="px-3 py-1.5 text-right font-bold text-amber-900 text-xs font-mono">
                      {formatDividendYield(financials.dividendYield)}
                    </td>
                  </tr>

                  {/* Dividend Reinvestment (DRIP) if active */}
                  {assumptions.includeDividendReinvestment && (
                    <tr className="border-b border-slate-300 bg-emerald-50/70">
                      <td className="bg-emerald-100 text-emerald-950 font-bold px-3 py-1.5 border-r border-slate-400 text-xs flex items-center justify-between">
                        <span>Dividend Reinvestment (DRIP)</span>
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-right font-bold text-emerald-800 text-xs font-mono">
                        +{(( (dcfResult.dripMultiplier || 1) - 1) * 100).toFixed(1)}% (+${dcfResult.dividendReinvestmentBoost?.toFixed(2) || '0.00'})
                      </td>
                    </tr>
                  )}

                  {/* Intrinsic value per share - Prominent Red Row */}
                  <tr className="bg-[#f4b084] border-t-2 border-b-2 border-slate-500">
                    <td className="text-slate-950 font-black px-3 py-2 border-r border-slate-500 text-xs uppercase tracking-wider">
                      Intrinsic value per share
                    </td>
                    <td className="px-3 py-2 text-right font-black text-slate-950 text-base">
                      ${dcfResult.intrinsicValuePerShare.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Market Price & Upside/Downside Bar (matches screenshot) */}
            <div className="border border-slate-400 bg-white p-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Company / Asset</span>
                <span className="text-sm font-extrabold text-slate-900">{financials.companyName} ({financials.symbol})</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Market Price</span>
                <span className="text-sm font-black text-slate-900">${financials.marketPrice.toFixed(2)}</span>
              </div>

              <div className="text-right pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Annual Div Yield</span>
                <span className="text-sm font-bold text-amber-700 font-mono">
                  {formatDividendYield(financials.dividendYield)}
                </span>
              </div>

              <div className="text-right pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Upside / Downside</span>
                <span
                  className={`text-sm font-black flex items-center justify-end gap-1 ${
                    dcfResult.isUndervalued ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {dcfResult.isUndervalued ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {dcfResult.upsideDownsidePct > 0 ? '+' : ''}
                  {dcfResult.upsideDownsidePct.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Bullish & Bearish Factors (side-by-side as in image) */}
            <div className="border border-slate-400 bg-white p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bullish Factors */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-emerald-800 flex items-center gap-1.5 mb-2 pb-1 border-b border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Bullish Factor(s)
                  </h4>
                  <ul className="space-y-1.5">
                    {financials.bullishFactors.map((factor, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bearish Factors */}
                <div>
                  <h4 className="font-bold text-xs uppercase text-rose-800 flex items-center gap-1.5 mb-2 pb-1 border-b border-rose-100">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Bearish Factor(s)
                  </h4>
                  <ul className="space-y-1.5">
                    {financials.bearishFactors.map((factor, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-snug">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Table: "Various Growth Rates" Sensitivity Row (from image) */}
            <div className="border border-slate-400 bg-white">
              <div className="bg-[#29b6f6]/30 px-3 py-1 font-bold text-slate-900 border-b border-slate-400 text-xs uppercase flex items-center justify-between">
                <span>Various Growth Rates (Terminal Sensitivity)</span>
                <span className="text-[10px] text-cyan-900">Intrinsic Value / Share</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="px-3 py-1.5 text-left font-bold text-slate-700 border-r border-slate-300">Terminal Growth Rate</th>
                      {growthVariations.map((g) => (
                        <th key={g} className="px-2 py-1.5 text-center font-bold text-slate-800 border-r border-slate-300">
                          {(g * 100).toFixed(0)}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="bg-[#b3e5fc]/40 px-3 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                        Implied Share Value
                      </td>
                      {growthVariations.map((g) => {
                        // calculate sensitivity intrinsic value for this terminal growth rate
                        const finalFcf = dcfResult.cashFlows[dcfResult.cashFlows.length - 1]?.fcf || financials.baseFreeCashFlow;
                        const effWacc = Math.max(assumptions.wacc, g + 0.005);
                        const tv = (finalFcf * (1 + g)) / (effWacc - g);
                        const pvTv = tv / Math.pow(1 + assumptions.wacc, assumptions.projectionYears || 7);
                        const valOpsDollars = (dcfResult.sumPvCashFlows + pvTv) * 1_000_000_000;
                        const equity = valOpsDollars + financials.nonOpAssets - financials.totalDebt;
                        const iv = Math.max(0, equity / financials.sharesOutstanding);
                        const isCurrent = Math.abs(g - assumptions.growthLT) < 0.005;

                        return (
                          <td
                            key={g}
                            className={`px-2 py-1.5 text-center font-bold border-r border-slate-300 ${
                              isCurrent ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800'
                            }`}
                          >
                            ${iv.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Purple Multiples Table (Cols 10-12) */}
          <div className="lg:col-span-3 border border-slate-400 shadow-sm bg-white">
            <div className="bg-[#d9d2e9] px-3 py-1.5 font-bold text-slate-900 border-b border-slate-400 text-xs uppercase tracking-wide flex items-center justify-between">
              <span>Market Stats & Multiples</span>
              <span className="text-[10px] text-purple-900 font-semibold">TTM</span>
            </div>

            <table className="w-full border-collapse">
              <tbody>
                {/* EPS (TTM) */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#d9d2e9] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                    EPS (TTM)
                  </td>
                  <td className="px-3 py-1.5 text-right font-black text-slate-950">
                    ${financials.epsTTM.toFixed(2)}
                  </td>
                </tr>

                {/* PE (TTM) */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#d9d2e9] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                    PE (TTM)
                  </td>
                  <td className="px-3 py-1.5 text-right font-black text-slate-950">
                    {financials.peTTM.toFixed(2)}x
                  </td>
                </tr>

                {/* Today's Change % */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#d9d2e9] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                    Today's Change %
                  </td>
                  <td
                    className={`px-3 py-1.5 text-right font-bold ${
                      financials.todaysChangePct >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {financials.todaysChangePct > 0 ? '+' : ''}
                    {financials.todaysChangePct.toFixed(2)}%
                  </td>
                </tr>

                {/* 52 Week High */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#d9d2e9] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                    52 Week High
                  </td>
                  <td className="px-3 py-1.5 text-right font-medium text-slate-800">
                    ${financials.week52High.toFixed(2)}
                  </td>
                </tr>

                {/* 52 Week Low */}
                <tr className="border-b border-slate-300">
                  <td className="bg-[#d9d2e9] text-slate-900 font-bold px-3 py-1.5 border-r border-slate-400 text-xs">
                    52 Week Low
                  </td>
                  <td className="px-3 py-1.5 text-right font-medium text-slate-800">
                    ${financials.week52Low.toFixed(2)}
                  </td>
                </tr>

                {/* Extra metrics */}
                {financials.evEbitda !== undefined && (
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#e7e1f4] text-slate-800 font-medium px-3 py-1 border-r border-slate-400 text-xs">
                      EV / EBITDA
                    </td>
                    <td className="px-3 py-1 text-right text-slate-700 font-medium">
                      {financials.evEbitda.toFixed(1)}x
                    </td>
                  </tr>
                )}

                {financials.revenueTTM !== undefined && (
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#e7e1f4] text-slate-800 font-medium px-3 py-1 border-r border-slate-400 text-xs">
                      Revenue (TTM)
                    </td>
                    <td className="px-3 py-1 text-right text-slate-700 font-medium">
                      {formatCurrency(financials.revenueTTM, 1, true)}
                    </td>
                  </tr>
                )}

                {financials.operatingCashFlowTTM !== undefined && (
                  <tr className="border-b border-slate-300">
                    <td className="bg-[#e7e1f4] text-slate-800 font-medium px-3 py-1 border-r border-slate-400 text-xs">
                      Oper. Cash Flow
                    </td>
                    <td className="px-3 py-1 text-right text-slate-700 font-medium">
                      {formatCurrency(financials.operatingCashFlowTTM, 1, true)}
                    </td>
                  </tr>
                )}

                {financials.dividendYield !== undefined && (
                  <tr>
                    <td className="bg-[#e7e1f4] text-slate-800 font-medium px-3 py-1 border-r border-slate-400 text-xs">
                      Dividend Yield
                    </td>
                    <td className="px-3 py-1 text-right text-slate-700 font-medium">
                      {formatRawPercent(financials.dividendYield, 2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
