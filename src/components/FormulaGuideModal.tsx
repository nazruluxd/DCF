import React from 'react';
import { X, BookOpen, Calculator, Layers, HelpCircle } from 'lucide-react';

interface FormulaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaGuideModal: React.FC<FormulaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">DCF Valuation Methodology & Formulas</h2>
              <p className="text-xs text-slate-400">Complete mathematical reference behind the model</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulas list */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* 1. Present Value Discounting */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-bold text-sm text-emerald-400 mb-1 flex items-center gap-1.5">
              <span>1. Present Value of Projected Cash Flows</span>
            </h3>
            <p className="text-slate-400 mb-2">
              Each future cash flow is discounted back to today's purchasing power using the Weighted Average Cost of Capital (WACC).
            </p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-emerald-300 text-sm border border-slate-800">
              PV(t) = FCF(t) / (1 + WACC)^t
            </div>
          </div>

          {/* 2. Gordon Growth Terminal Value */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-bold text-sm text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>2. Terminal Value (Gordon Growth Model)</span>
            </h3>
            <p className="text-slate-400 mb-2">
              Captures all cash flows beyond Year 7 assuming the company grows in perpetuity at a steady long-term rate (g).
            </p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-cyan-300 text-sm border border-slate-800">
              Terminal Value = [ FCF₇ × (1 + g_LT) ] / (WACC - g_LT)
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-cyan-300 text-sm border border-slate-800 mt-2">
              PV of Terminal Value = Terminal Value / (1 + WACC)^7
            </div>
          </div>

          {/* 3. Value of Operations & Equity Value Bridge */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-bold text-sm text-amber-400 mb-1 flex items-center gap-1.5">
              <span>3. Value of Operations & Value of Equity</span>
            </h3>
            <p className="text-slate-400 mb-2">
              Value of Operations is the core productive power. Non-operating assets (cash & short-term investments) are added, and total debt is deducted.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-amber-300 text-sm border border-slate-800">
              Value of Operations = Sum(PV of Cash Flows) + PV(Terminal Value)
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-amber-300 text-sm border border-slate-800 mt-2">
              Value of Equity = Value of Operations + Non-Op Assets - Total Debt
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-amber-300 text-sm border border-slate-800 mt-2">
              Intrinsic Value Per Share = Value of Equity / Shares Outstanding
            </div>
          </div>

          {/* 4. CAPM Cost of Equity & WACC */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
            <h3 className="font-bold text-sm text-purple-400 mb-1 flex items-center gap-1.5">
              <span>4. CAPM & WACC (Weighted Average Cost of Capital)</span>
            </h3>
            <p className="text-slate-400 mb-2">
              Cost of equity is calculated via the Capital Asset Pricing Model (CAPM). WACC blends the cost of equity and after-tax cost of debt.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-purple-300 text-sm border border-slate-800">
              Cost of Equity (Ke) = Risk-Free Rate + Beta × Equity Risk Premium (ERP)
            </div>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-purple-300 text-sm border border-slate-800 mt-2">
              WACC = (% Equity × Ke) + [ % Debt × Cost of Debt × (1 - Tax Rate) ]
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/80">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
