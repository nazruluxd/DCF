import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Coins, Info } from 'lucide-react';
import { DCFAssumptions, StockFinancials } from '../types/dcf';
import { formatDividendYield, getDividendYieldDecimal } from '../utils/formatters';

interface AssumptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assumptions: DCFAssumptions;
  financials: StockFinancials;
  onUpdateAssumption: <K extends keyof DCFAssumptions>(key: K, value: DCFAssumptions[K]) => void;
  onUpdateFinancial: <K extends keyof StockFinancials>(key: K, value: StockFinancials[K]) => void;
  onReset: () => void;
}

export const AssumptionsDrawer: React.FC<AssumptionsDrawerProps> = ({
  isOpen,
  onClose,
  assumptions,
  financials,
  onUpdateAssumption,
  onUpdateFinancial,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-white h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base text-slate-100">Tune DCF Assumptions</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sliders */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          
          {/* Growth Section */}
          <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
              Cash Flow Growth Rates
            </h3>

            {/* Short Term Growth */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Short-Term Growth Rate (Y1-2):</span>
                <span className="font-mono text-emerald-300">{(assumptions.growthRateShort * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.60"
                step="0.01"
                value={assumptions.growthRateShort}
                onChange={(e) => onUpdateAssumption('growthRateShort', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Transition Growth */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Transition Growth Rate (Y3-5):</span>
                <span className="font-mono text-emerald-300">{(assumptions.growthTransition * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.40"
                step="0.005"
                value={assumptions.growthTransition}
                onChange={(e) => onUpdateAssumption('growthTransition', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Terminal Growth */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Terminal Growth Rate (g):</span>
                <span className="font-mono text-emerald-300">{(assumptions.growthLT * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.08"
                step="0.0025"
                value={assumptions.growthLT}
                onChange={(e) => onUpdateAssumption('growthLT', parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Typically matches long-term GDP growth (2.5% - 4.5%).
              </p>
            </div>
          </div>

          {/* Discount Rate / WACC Section */}
          <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm text-cyan-400 uppercase tracking-wider">
              Cost of Capital & WACC
            </h3>

            {/* WACC slider */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>WACC (Discount Rate):</span>
                <span className="font-mono text-cyan-300">{(assumptions.wacc * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.18"
                step="0.001"
                value={assumptions.wacc}
                onChange={(e) => onUpdateAssumption('wacc', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Beta */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Stock Beta (Volatility):</span>
                <span className="font-mono text-slate-200">{assumptions.beta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={assumptions.beta}
                onChange={(e) => {
                  const b = parseFloat(e.target.value);
                  onUpdateAssumption('beta', b);
                  const ke = assumptions.rfRate + b * assumptions.marketRiskPremium;
                  onUpdateAssumption('costOfEquity', Number(ke.toFixed(4)));
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Risk-free Rate */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Risk-Free Rate (10Y UST):</span>
                <span className="font-mono text-slate-200">{(assumptions.rfRate * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.07"
                step="0.001"
                value={assumptions.rfRate}
                onChange={(e) => onUpdateAssumption('rfRate', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Market Risk Premium */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Equity Risk Premium:</span>
                <span className="font-mono text-slate-200">{(assumptions.marketRiskPremium * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.04"
                max="0.08"
                step="0.002"
                value={assumptions.marketRiskPremium}
                onChange={(e) => onUpdateAssumption('marketRiskPremium', parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Capital Structure Section */}
          <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm text-purple-400 uppercase tracking-wider">
              Capital Weights & Debt
            </h3>

            {/* % Debt / % Equity */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Weight of Debt (% Debt):</span>
                <span className="font-mono text-purple-300">{(assumptions.pctDebt * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.50"
                step="0.01"
                value={assumptions.pctDebt}
                onChange={(e) => {
                  const d = parseFloat(e.target.value);
                  onUpdateAssumption('pctDebt', d);
                  onUpdateAssumption('pctEquity', Number((1 - d).toFixed(3)));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Weight of Equity:</span>
                <strong className="text-slate-200 font-mono">{(assumptions.pctEquity * 100).toFixed(1)}%</strong>
              </div>
            </div>

            {/* Cost of debt */}
            <div>
              <div className="flex justify-between font-semibold mb-1 text-slate-300">
                <span>Pre-Tax Cost of Debt:</span>
                <span className="font-mono text-slate-200">{(assumptions.costOfDebt * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.10"
                step="0.0025"
                value={assumptions.costOfDebt}
                onChange={(e) => onUpdateAssumption('costOfDebt', parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Dividend Policy & Reinvestment Section */}
          <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Dividend Reinvestment (DRIP)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Compound intrinsic equity value via DRIP
                </p>
              </div>

              {/* The Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(assumptions.includeDividendReinvestment)}
                  onChange={(e) => onUpdateAssumption('includeDividendReinvestment', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Dividend Yield Details */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Stock Annual Div Yield:</span>
                <span className="font-mono font-bold text-amber-300">
                  {formatDividendYield(financials.dividendYield)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Projection Horizon:</span>
                <span className="font-mono text-slate-200">
                  {assumptions.projectionYears || 7} Years
                </span>
              </div>

              {assumptions.includeDividendReinvestment && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">DRIP Compounding Factor:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {Math.pow(1 + getDividendYieldDecimal(financials.dividendYield), assumptions.projectionYears || 7).toFixed(3)}x
                      {' '}
                      (+{((Math.pow(1 + getDividendYieldDecimal(financials.dividendYield), assumptions.projectionYears || 7) - 1) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Automatically reinvests annual dividend payouts into equity shares, compounding intrinsic value over the {assumptions.projectionYears || 7}-year holding period.
                  </p>
                </div>
              )}
            </div>

            {/* If dividend yield is 0, provide an interactive test slider to simulate a dividend yield */}
            {(!financials.dividendYield || financials.dividendYield <= 0) && (
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200/90 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{financials.symbol} pays no dividend</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  You can simulate an annual dividend yield below to test DRIP compounding:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="0.08"
                    step="0.0025"
                    value={getDividendYieldDecimal(financials.dividendYield)}
                    onChange={(e) => onUpdateFinancial('dividendYield', parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <span className="font-mono font-bold text-amber-300 whitespace-nowrap">
                    {(getDividendYieldDecimal(financials.dividendYield) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply & Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};
