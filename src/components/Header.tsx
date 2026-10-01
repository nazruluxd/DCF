import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Download,
  Printer,
  Table as TableIcon,
  BarChart3,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  Database,
  Globe2,
  CandlestickChart
} from 'lucide-react';
import { StockFinancials } from '../types/dcf';

interface HeaderProps {
  currentFinancials: StockFinancials;
  onSearch: (symbolOrName: string, forceAi?: boolean) => void;
  isLoading: boolean;
  viewMode: 'spreadsheet' | 'analytics' | 'chart';
  onToggleViewMode: (mode: 'spreadsheet' | 'analytics' | 'chart') => void;
  activeScenario: 'base' | 'bull' | 'bear';
  onSelectScenario: (scenario: 'base' | 'bull' | 'bear') => void;
  onOpenFormulas: () => void;
  onOpenAssumptions: () => void;
  onOpenDataSources: () => void;
  onReset: () => void;
  onExportCsv: () => void;
  sourceType?: string;
  providerInfo?: {
    name: string;
    description: string;
    isRealTime: boolean;
  };
}

const QUICK_STOCKS = [
  { symbol: 'NFLX', label: 'Netflix' },
  { symbol: 'AAPL', label: 'Apple' },
  { symbol: 'NVDA', label: 'Nvidia' },
  { symbol: 'TSLA', label: 'Tesla' },
  { symbol: 'MSFT', label: 'Microsoft' },
  { symbol: 'AMZN', label: 'Amazon' },
  { symbol: 'GOOGL', label: 'Alphabet' },
  { symbol: 'META', label: 'Meta' },
  { symbol: 'PLTR', label: 'Palantir' },
];

export const Header: React.FC<HeaderProps> = ({
  currentFinancials,
  onSearch,
  isLoading,
  viewMode,
  onToggleViewMode,
  activeScenario,
  onSelectScenario,
  onOpenFormulas,
  onOpenAssumptions,
  onOpenDataSources,
  onReset,
  onExportCsv,
  sourceType,
  providerInfo,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with static fallback for GitHub Pages
  useEffect(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const staticList = [
      { symbol: 'NFLX', name: 'Netflix, Inc.', sector: 'Communication Services' },
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors' },
      { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Automotive & Clean Energy' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Software' },
      { symbol: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Cyclical' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services' },
      { symbol: 'META', name: 'Meta Platforms, Inc.', sector: 'Communication Services' },
      { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'Software & AI' },
      { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Defensive' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
      { symbol: 'BABA', name: 'Alibaba Group', sector: 'Consumer Cyclical' },
      { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Entertainment' },
      { symbol: 'ASML', name: 'ASML Holding N.V.', sector: 'Semiconductors' },
    ];

    fetch(`/api/stock-search?q=${encodeURIComponent(searchInput)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Static environment');
        return res.json();
      })
      .then((data) => {
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      })
      .catch(() => {
        // Fallback for GitHub Pages static hosting
        const filtered = staticList.filter(
          (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        );
        setSuggestions(filtered);
      });
  }, [searchInput]);

  const handleSubmit = (e: React.FormEvent, forceAi = false) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowSuggestions(false);
      onSearch(searchInput.trim(), forceAi);
    }
  };

  const handleSelectQuick = (sym: string) => {
    setSearchInput(sym);
    setShowSuggestions(false);
    onSearch(sym, false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Top Bar: Brand, Stock Search, Global Actions */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg shadow-md flex items-center justify-center text-slate-950 font-black">
            <TableIcon className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ValuMetrics DCF
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                PRO TERMINAL
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Discounted Cash Flow Valuation & Intrinsic Price Engine
            </p>
          </div>
        </div>

        {/* Search Bar with Autocomplete */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md min-w-[260px]">
          <form onSubmit={(e) => handleSubmit(e, false)} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type any stock name or symbol (e.g., Netflix, Apple, NVDA)..."
              className="w-full pl-9 pr-24 py-2 text-sm bg-slate-800/90 border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 placeholder-slate-400 text-white shadow-inner transition-all"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="submit"
                disabled={isLoading || !searchInput.trim()}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded transition shadow"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
              {suggestions.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => {
                    setSearchInput(item.symbol);
                    setShowSuggestions(false);
                    onSearch(item.symbol, false);
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                      {item.symbol}
                    </span>
                    <span className="text-sm font-medium text-slate-200">{item.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{item.sector}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Switcher, Scenario, Export Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Spreadsheet vs Analytics */}
          <div className="bg-slate-800/90 p-0.5 rounded-lg border border-slate-700 flex items-center">
            <button
              onClick={() => onToggleViewMode('spreadsheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'spreadsheet'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Spreadsheet View (matches attached financial model)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Spreadsheet</span>
            </button>
            <button
              onClick={() => onToggleViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'analytics'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Visual Analytics & DCF Charts View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => onToggleViewMode('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'chart'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Advanced Real-Time TradingView Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              <span>Real-Time Chart</span>
            </button>
          </div>

          {/* Assumptions fine-tune drawer button */}
          <button
            onClick={onOpenAssumptions}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition"
            title="Adjust DCF Assumptions & Sliders"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Tune Inputs</span>
          </button>

          {/* Real Data Providers / APIs Modal Button */}
          <button
            onClick={onOpenDataSources}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 rounded-lg text-xs font-semibold text-emerald-300 transition shadow-sm hover:border-emerald-400"
            title="Configure or Connect Live Financial Data Providers (FMP, Finnhub, Alpha Vantage, Yahoo, Gemini)"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Data APIs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Formula Reference */}
          <button
            onClick={onOpenFormulas}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition"
            title="DCF Formulas & Mathematical Explanations"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline">Formulas</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 transition"
            title="Export DCF Table as Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          {/* Reset / Reload */}
          <button
            onClick={onReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
            title="Reset to default model values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub Bar: Quick Stock Chips & Active Stock Info & Scenario Pills */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 py-1.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Quick Tickers */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-500" /> Quick:
          </span>
          {QUICK_STOCKS.map((item) => {
            const isActive = currentFinancials.symbol === item.symbol;
            return (
              <button
                key={item.symbol}
                onClick={() => handleSelectQuick(item.symbol)}
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.symbol}
              </button>
            );
          })}
        </div>

        {/* Scenario Selectors & Source badge */}
        <div className="flex items-center gap-2">
          {/* Source / Provider indicator badge */}
          <button
            onClick={onOpenDataSources}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-emerald-500/50 transition cursor-pointer shadow-sm"
            title="Click to view connected APIs or configure new keys"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{providerInfo?.name || (sourceType === 'yahoo_live' ? 'Yahoo Live Quote' : sourceType === 'fmp_live' ? 'FMP Institutional' : sourceType === 'finnhub_live' ? 'Finnhub Live' : sourceType === 'gemini_grounded' ? 'Gemini AI Grounding' : 'Institutional Dataset')}</span>
          </button>

          {/* Scenario Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800">
            <button
              onClick={() => onSelectScenario('bear')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition flex items-center gap-1 ${
                activeScenario === 'bear'
                  ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingDown className="w-3 h-3 text-rose-400" /> Bear
            </button>
            <button
              onClick={() => onSelectScenario('base')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                activeScenario === 'base'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Base
            </button>
            <button
              onClick={() => onSelectScenario('bull')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition flex items-center gap-1 ${
                activeScenario === 'bull'
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Bull
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
