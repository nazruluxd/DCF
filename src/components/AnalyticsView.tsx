import React from 'react';
import { DCFAssumptions, DCFResult, StockFinancials } from '../types/dcf';
import { formatCurrency, formatPercent, formatDividendYield } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  Layers,
  ArrowRight,
  PieChart,
  Activity,
  Award,
  CandlestickChart
} from 'lucide-react';

interface AnalyticsViewProps {
  financials: StockFinancials;
  assumptions: DCFAssumptions;
  dcfResult: DCFResult;
  onSwitchToChart?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  financials,
  assumptions,
  dcfResult,
  onSwitchToChart,
}) => {
  const maxFcf = Math.max(...dcfResult.cashFlows.map((c) => c.fcf), 1);

  // Enterprise Value components
  const opValueDollars = dcfResult.valueOfOperations * 1_000_000_000;
  const totalEnterpriseValue = opValueDollars + financials.nonOpAssets;

  return (
    <div className="space-y-6">
      
      {/* Top Hero Cards: Valuation Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Intrinsic Value vs Market Price Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            DCF Valuation Verdict
          </span>
          <div className="flex items-baseline justify-between my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                ${dcfResult.intrinsicValuePerShare.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">Intrinsic / Share</span>
            </div>
            {assumptions.includeDividendReinvestment && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-semibold" title={`Includes DRIP +$${dcfResult.dividendReinvestmentBoost?.toFixed(2) || '0.00'}`}>
                DRIP Active
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Market Price: <strong className="text-slate-200">${financials.marketPrice.toFixed(2)}</strong></span>
            <span
              className={`font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                dcfResult.isUndervalued
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {dcfResult.isUndervalued ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {dcfResult.upsideDownsidePct > 0 ? '+' : ''}
              {dcfResult.upsideDownsidePct.toFixed(1)}% {dcfResult.isUndervalued ? 'Upside' : 'Downside'}
            </span>
          </div>
        </div>

        {/* Value Composition Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Enterprise to Equity Bridge
          </span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-100">
              {formatCurrency(dcfResult.valueOfEquity, 1, true)}
            </span>
            <span className="text-xs text-slate-400 ml-2">Total Equity Value</span>
          </div>

          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Operations</span>
              <strong className="text-emerald-400">{formatCurrency(opValueDollars, 1, true)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">+ Cash/Assets</span>
              <strong className="text-sky-400">+{formatCurrency(financials.nonOpAssets, 1, true)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">- Total Debt</span>
              <strong className="text-rose-400">-{formatCurrency(financials.totalDebt, 1, true)}</strong>
            </div>
          </div>
        </div>

        {/* Cost of Capital & Discount Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Cost of Capital (WACC)
          </span>
          <div className="flex items-baseline gap-2 my-2">
            <span className="text-3xl font-black text-cyan-400">
              {formatPercent(assumptions.wacc, 2)}
            </span>
            <span className="text-xs text-slate-400">Discount Rate</span>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span>Beta: <strong>{assumptions.beta.toFixed(2)}</strong></span>
            <span>Div Yield: <strong className="text-amber-300">{formatDividendYield(financials.dividendYield)}</strong></span>
            <span>Terminal g: <strong>{formatPercent(assumptions.growthLT, 1)}</strong></span>
          </div>
        </div>

      </div>

      {/* Real-Time TradingView Chart Quick Banner */}
      {onSwitchToChart && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CandlestickChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>TradingView Advanced Real-Time Chart</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  LIVE
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Switch to full interactive candlestick charts, multi-asset comparison, technical indicators & volume profiles for {financials.symbol}.
              </p>
            </div>
          </div>
          <button
            onClick={onSwitchToChart}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
          >
            <span>Open Real-Time Chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chart 1: Cash Flow Projection & PV Discounting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Projected Free Cash Flows ($B) & Present Values
            </h3>
            <p className="text-xs text-slate-400">
              Future cash flows discounted back to present value using WACC of {formatPercent(assumptions.wacc, 2)}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-300">Nominal FCF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-600/70 border border-teal-400/50"></span>
              <span className="text-slate-300">Present Value (PV)</span>
            </div>
          </div>
        </div>

        {/* SVG/HTML Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
          {dcfResult.cashFlows.map((cf) => {
            const nominalHeightPct = Math.min(100, Math.max(12, (cf.fcf / maxFcf) * 90));
            const pvHeightPct = Math.min(100, Math.max(8, (cf.pv / maxFcf) * 90));

            return (
              <div key={cf.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Nominal FCF Bar */}
                  <div
                    style={{ height: `${nominalHeightPct}%` }}
                    className="w-1/2 max-w-[36px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300 relative group-hover:brightness-110 shadow-sm"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-slate-950 px-1 py-0.5 rounded border border-emerald-800">
                      ${cf.fcf.toFixed(2)}B
                    </span>
                  </div>

                  {/* PV Bar */}
                  <div
                    style={{ height: `${pvHeightPct}%` }}
                    className="w-1/2 max-w-[36px] bg-gradient-to-t from-teal-800 to-teal-500 rounded-t-sm transition-all duration-300 relative group-hover:brightness-110 shadow-sm border-t border-teal-300/40"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-teal-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap bg-slate-950 px-1 py-0.5 rounded border border-teal-800">
                      ${cf.pv.toFixed(2)}B
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-xs font-mono font-semibold text-slate-300 block">{cf.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">{(cf.growthRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary underneath chart */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block">7-Yr FCF Total:</span>
            <strong className="text-white font-mono text-sm">
              ${dcfResult.cashFlows.reduce((a, b) => a + b.fcf, 0).toFixed(2)}B
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Sum of PVs:</span>
            <strong className="text-emerald-400 font-mono text-sm">
              ${dcfResult.sumPvCashFlows.toFixed(2)}B
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">PV of Terminal Value:</span>
            <strong className="text-teal-400 font-mono text-sm">
              ${dcfResult.pvTerminalValue.toFixed(2)}B
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block">Terminal Value Share:</span>
            <strong className="text-slate-200 font-mono text-sm">
              {((dcfResult.pvTerminalValue / dcfResult.valueOfOperations) * 100).toFixed(1)}%
            </strong>
          </div>
        </div>
      </div>

      {/* Section 2: Sensitivity Heatmap Matrix (WACC vs Terminal Growth) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              2D Valuation Sensitivity Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Intrinsic Value per share under varying combinations of Terminal Growth (columns) and WACC (rows).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500"></span> Undervalued
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500"></span> Overvalued
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-300">
                <th className="p-2.5 text-left border border-slate-800 font-sans font-bold text-slate-400">
                  WACC \ Terminal g
                </th>
                {dcfResult.sensitivityMatrix.growthRates.map((g) => {
                  const isCurrentG = Math.abs(g - assumptions.growthLT) < 0.003;
                  return (
                    <th
                      key={g}
                      className={`p-2.5 text-center border border-slate-800 font-bold ${
                        isCurrentG ? 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60' : 'text-slate-300'
                      }`}
                    >
                      {(g * 100).toFixed(1)}% {isCurrentG && '(Base)'}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dcfResult.sensitivityMatrix.waccRates.map((w, wIdx) => {
                const isCurrentW = Math.abs(w - assumptions.wacc) < 0.003;
                return (
                  <tr key={w} className="hover:bg-slate-800/40">
                    <td
                      className={`p-2.5 font-bold border border-slate-800 ${
                        isCurrentW ? 'bg-cyan-950/70 text-cyan-300 border-cyan-700/60' : 'text-slate-400 bg-slate-950/60'
                      }`}
                    >
                      {(w * 100).toFixed(1)}% {isCurrentW && '(Base)'}
                    </td>

                    {dcfResult.sensitivityMatrix.growthRates.map((g, gIdx) => {
                      const iv = dcfResult.sensitivityMatrix.matrix[wIdx]?.[gIdx] || 0;
                      const isCurrentCell = isCurrentW && Math.abs(g - assumptions.growthLT) < 0.003;
                      const isOver = iv < financials.marketPrice;

                      let cellBg = 'bg-slate-800/30 text-slate-300';
                      if (iv > 0) {
                        if (iv > financials.marketPrice * 1.2) {
                          cellBg = 'bg-emerald-950/50 text-emerald-300 border-emerald-900/60';
                        } else if (iv > financials.marketPrice) {
                          cellBg = 'bg-emerald-950/30 text-emerald-400';
                        } else if (iv < financials.marketPrice * 0.8) {
                          cellBg = 'bg-rose-950/50 text-rose-300 border-rose-900/60';
                        } else {
                          cellBg = 'bg-rose-950/30 text-rose-400';
                        }
                      }

                      return (
                        <td
                          key={g}
                          className={`p-2.5 text-center font-bold border border-slate-800 transition ${cellBg} ${
                            isCurrentCell ? 'ring-2 ring-amber-400 font-black text-amber-300 shadow-md' : ''
                          }`}
                          title={`WACC: ${(w * 100).toFixed(1)}%, Growth: ${(g * 100).toFixed(1)}% => $${iv.toFixed(2)}`}
                        >
                          {iv > 0 ? `$${iv.toFixed(2)}` : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
