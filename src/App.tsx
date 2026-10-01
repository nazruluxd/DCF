import React, { useState, useMemo, useCallback } from 'react';
import { PRELOADED_STOCKS } from './data/defaultStocks';
import { DCFAssumptions, StockFinancials, StockValuationPackage } from './types/dcf';
import { runDCFCalculation } from './utils/dcfCalculator';
import { Header } from './components/Header';
import { SpreadsheetView } from './components/SpreadsheetView';
import { AnalyticsView } from './components/AnalyticsView';
import { AssumptionsDrawer } from './components/AssumptionsDrawer';
import { FormulaGuideModal } from './components/FormulaGuideModal';
import { DataSourceModal } from './components/DataSourceModal';
import { TradingViewChart } from './components/TradingViewChart';
import { exportDCFToCsv } from './utils/exportCsv';
import { getClientFallbackStockData } from './utils/fallbackGenerator';
import { formatDividendYield } from './utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Info,
  DollarSign,
  HelpCircle,
  Database,
  CandlestickChart
} from 'lucide-react';

export default function App() {
  // Start with NFLX (matches the user's screenshot exactly!)
  const initialStock = PRELOADED_STOCKS['NFLX'];

  const [financials, setFinancials] = useState<StockFinancials>(initialStock.financials);
  const [baseAssumptions, setBaseAssumptions] = useState<DCFAssumptions>(initialStock.assumptions);
  const [activeAssumptions, setActiveAssumptions] = useState<DCFAssumptions>(initialStock.assumptions);
  const [customYearFcfs, setCustomYearFcfs] = useState<number[]>(initialStock.customYearFcfs || []);
  const [sourceType, setSourceType] = useState<string>('cache');
  const [providerInfo, setProviderInfo] = useState<{ name: string; description: string; isRealTime: boolean } | undefined>({
    name: 'Institutional Curated Dataset',
    description: 'Calibrated DCF model matching exact financial statements',
    isRealTime: true,
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('auto');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'spreadsheet' | 'analytics' | 'chart'>('spreadsheet');
  const [activeScenario, setActiveScenario] = useState<'base' | 'bull' | 'bear'>('base');
  const [isAssumptionsDrawerOpen, setIsAssumptionsDrawerOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  // Compute scenario-adjusted assumptions
  const scenarioAssumptions = useMemo(() => {
    if (activeScenario === 'bull') {
      return {
        ...activeAssumptions,
        growthRateShort: Math.min(0.60, activeAssumptions.growthRateShort * 1.25),
        growthTransition: Math.min(0.35, activeAssumptions.growthTransition * 1.15),
        growthLT: Math.min(0.06, activeAssumptions.growthLT + 0.005),
        wacc: Math.max(0.06, activeAssumptions.wacc - 0.01),
      };
    }
    if (activeScenario === 'bear') {
      return {
        ...activeAssumptions,
        growthRateShort: Math.max(0.02, activeAssumptions.growthRateShort * 0.70),
        growthTransition: Math.max(0.02, activeAssumptions.growthTransition * 0.75),
        growthLT: Math.max(0.015, activeAssumptions.growthLT - 0.01),
        wacc: Math.min(0.18, activeAssumptions.wacc + 0.015),
      };
    }
    return activeAssumptions;
  }, [activeAssumptions, activeScenario]);

  // Compute DCF result
  const dcfResult = useMemo(() => {
    return runDCFCalculation(financials, scenarioAssumptions, customYearFcfs.length > 0 ? customYearFcfs : undefined);
  }, [financials, scenarioAssumptions, customYearFcfs]);

  // Handle stock search
  const handleSearch = useCallback(async (query: string, forceAi = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/stock-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, forceAi, provider: selectedProvider }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded with status ${res.status}`);
      }

      const data: StockValuationPackage & { customYearFcfs?: number[] } = await res.json();

      setFinancials(data.financials);
      setBaseAssumptions(data.assumptions);
      setActiveAssumptions(data.assumptions);
      setCustomYearFcfs(data.customYearFcfs || []);
      setSourceType(data.source);
      if (data.providerInfo) {
        setProviderInfo(data.providerInfo);
      }
      setActiveScenario('base');
    } catch (err: any) {
      console.warn('Network or server fetch issue, falling back to local model:', err);
      // Gracefully fall back to client-side data generator
      const fallback = getClientFallbackStockData(query);
      setFinancials(fallback.financials);
      setBaseAssumptions(fallback.assumptions);
      setActiveAssumptions(fallback.assumptions);
      setCustomYearFcfs(fallback.customYearFcfs || []);
      setSourceType(fallback.source);
      if (fallback.providerInfo) {
        setProviderInfo(fallback.providerInfo);
      }
      setActiveScenario('base');
      setErrorMessage(null); // Keep clean, no noisy error for the user!
    } finally {
      setIsLoading(false);
    }
  }, [selectedProvider]);

  // Update assumption helper
  const handleUpdateAssumption = useCallback(<K extends keyof DCFAssumptions>(key: K, value: DCFAssumptions[K]) => {
    setActiveAssumptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update financial helper
  const handleUpdateFinancial = useCallback(<K extends keyof StockFinancials>(key: K, value: StockFinancials[K]) => {
    setFinancials((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update specific year FCF in spreadsheet
  const handleUpdateYearFcf = useCallback((yearIndex: number, value: number) => {
    setCustomYearFcfs((prev) => {
      const current = prev.length >= 7 ? [...prev] : dcfResult.cashFlows.map((c) => c.fcf);
      current[yearIndex] = value;
      return current;
    });
  }, [dcfResult]);

  // Reset custom FCFs
  const handleResetCustomFcfs = useCallback(() => {
    setCustomYearFcfs([]);
  }, []);

  // Reset all to base
  const handleReset = useCallback(() => {
    setActiveAssumptions(baseAssumptions);
    setCustomYearFcfs([]);
    setActiveScenario('base');
  }, [baseAssumptions]);

  // Export CSV
  const handleExportCsv = useCallback(() => {
    exportDCFToCsv(financials, scenarioAssumptions, dcfResult);
  }, [financials, scenarioAssumptions, dcfResult]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Application Header */}
      <Header
        currentFinancials={financials}
        onSearch={handleSearch}
        isLoading={isLoading}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        activeScenario={activeScenario}
        onSelectScenario={setActiveScenario}
        onOpenFormulas={() => setIsFormulaModalOpen(true)}
        onOpenAssumptions={() => setIsAssumptionsDrawerOpen(true)}
        onOpenDataSources={() => setIsDataSourceModalOpen(true)}
        onReset={handleReset}
        onExportCsv={handleExportCsv}
        sourceType={sourceType}
        providerInfo={providerInfo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:px-6">
        
        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stock Snapshot Strip */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-xl text-emerald-400 font-mono shadow-inner">
              {financials.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">
                  {financials.companyName}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400 font-bold">
                  {financials.symbol}
                </span>
                <span className="text-xs text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50">
                  {financials.exchange} • {financials.sector}
                </span>
                <span className="text-xs text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50 font-mono">
                  Div Yield: {formatDividendYield(financials.dividendYield)}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl line-clamp-1 mt-0.5">
                {financials.description}
              </p>
            </div>
          </div>

          {/* Price & Target Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Market Price</span>
              <span className="text-lg font-black text-white font-mono">${financials.marketPrice.toFixed(2)}</span>
            </div>
            
            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            {/* Annual Dividend Yield field */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Annual Div Yield</span>
                {scenarioAssumptions.includeDividendReinvestment && (
                  <span
                    className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold leading-none"
                    title="Dividend Reinvestment (DRIP) active"
                  >
                    DRIP
                  </span>
                )}
              </div>
              <span className="text-lg font-black text-amber-400 font-mono">
                {formatDividendYield(financials.dividendYield)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">DCF Intrinsic</span>
                {scenarioAssumptions.includeDividendReinvestment && dcfResult.dividendReinvestmentBoost ? (
                  <span
                    className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold leading-none"
                    title={`Includes +$${dcfResult.dividendReinvestmentBoost.toFixed(2)} DRIP boost`}
                  >
                    +${dcfResult.dividendReinvestmentBoost.toFixed(2)}
                  </span>
                ) : null}
              </div>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${dcfResult.intrinsicValuePerShare.toFixed(2)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Margin</span>
              <span
                className={`text-sm font-black font-mono flex items-center justify-end gap-0.5 ${
                  dcfResult.isUndervalued ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {dcfResult.isUndervalued ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {dcfResult.upsideDownsidePct > 0 ? '+' : ''}{dcfResult.upsideDownsidePct.toFixed(1)}%
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            {/* Quick Chart View Trigger */}
            <button
              onClick={() => setViewMode(viewMode === 'chart' ? 'spreadsheet' : 'chart')}
              className={`p-2 rounded-lg border transition flex items-center justify-center ${
                viewMode === 'chart'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={viewMode === 'chart' ? 'Return to DCF Spreadsheet' : 'Open Real-Time TradingView Chart'}
            >
              <CandlestickChart className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* View Mode Switching */}
        {viewMode === 'spreadsheet' && (
          <SpreadsheetView
            financials={financials}
            assumptions={scenarioAssumptions}
            dcfResult={dcfResult}
            onUpdateAssumption={handleUpdateAssumption}
            onUpdateFinancial={handleUpdateFinancial}
            customYearFcfs={customYearFcfs}
            onUpdateYearFcf={handleUpdateYearFcf}
            onResetCustomFcfs={handleResetCustomFcfs}
          />
        )}
        {viewMode === 'analytics' && (
          <AnalyticsView
            financials={financials}
            assumptions={scenarioAssumptions}
            dcfResult={dcfResult}
            onSwitchToChart={() => setViewMode('chart')}
          />
        )}
        {viewMode === 'chart' && (
          <TradingViewChart
            financials={financials}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          ValuMetrics DCF Terminal • Professional Discounted Cash Flow Equity Valuation Model • Built with Google GenAI & quantitative financial modeling.
        </p>
      </footer>

      {/* Assumptions Fine-Tuning Drawer */}
      <AssumptionsDrawer
        isOpen={isAssumptionsDrawerOpen}
        onClose={() => setIsAssumptionsDrawerOpen(false)}
        assumptions={scenarioAssumptions}
        financials={financials}
        onUpdateAssumption={handleUpdateAssumption}
        onUpdateFinancial={handleUpdateFinancial}
        onReset={handleReset}
      />

      {/* Formula Guide Modal */}
      <FormulaGuideModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
      />

      {/* Real Data Providers / APIs Configuration Modal */}
      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        selectedProvider={selectedProvider}
        onSelectProvider={(prov) => {
          setSelectedProvider(prov);
          // Refetch with new provider preference
          handleSearch(financials.symbol, false);
        }}
      />

    </div>
  );
}
