import React, { useEffect, useRef, useState, memo } from 'react';
import {
  CandlestickChart,
  LineChart,
  ExternalLink,
  Sparkles,
  Maximize2,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { StockFinancials } from '../types/dcf';

interface TradingViewChartProps {
  financials: StockFinancials;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = memo(({ financials }) => {
  const [chartMode, setChartMode] = useState<'advanced' | 'overview'>('advanced');
  const [chartInterval, setChartInterval] = useState<string>('D');
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize exchange for TradingView syntax
  const rawExchange = (financials.exchange || 'NASDAQ').toUpperCase();
  const exchange = rawExchange.includes('NYSE')
    ? 'NYSE'
    : rawExchange.includes('AMEX')
    ? 'AMEX'
    : 'NASDAQ';

  const fullSymbol = `${exchange}:${financials.symbol.toUpperCase()}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget content to prevent duplicate iframes
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';
    container.appendChild(widgetDiv);

    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    copyrightDiv.style.fontSize = '11px';
    copyrightDiv.style.padding = '4px 8px';
    copyrightDiv.style.color = '#64748b';
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/symbols/${fullSymbol}/" rel="noopener nofollow" target="_blank" style="color: #10b981; text-decoration: none; font-weight: 600;">${financials.symbol} Live Chart</a> by TradingView`;
    container.appendChild(copyrightDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;

    if (chartMode === 'advanced') {
      // 1. TradingView Advanced Real-Time Chart
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.innerHTML = JSON.stringify({
        allow_symbol_change: true,
        calendar: false,
        details: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        hide_legend: false,
        hide_volume: false,
        hotlist: false,
        interval: chartInterval,
        locale: 'en',
        save_image: true,
        style: '1', // Candlestick style
        symbol: fullSymbol,
        theme: 'dark',
        timezone: 'Etc/UTC',
        backgroundColor: '#0F0F0F',
        gridColor: 'rgba(242, 242, 242, 0.08)',
        watchlist: [],
        withdateranges: true,
        compareSymbols: [
          { symbol: 'NASDAQ:AAPL', title: 'Apple' },
          { symbol: 'NASDAQ:MSFT', title: 'Microsoft' },
          { symbol: 'NASDAQ:NVDA', title: 'Nvidia' },
        ],
        support_host: 'https://www.tradingview.com',
        studies: ['STD;SMA'],
        autosize: true,
      });
    } else {
      // 2. TradingView Symbol Overview (Area comparison chart)
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
      script.innerHTML = JSON.stringify({
        lineWidth: 2,
        lineType: 0,
        chartType: 'area',
        fontColor: 'rgb(148, 163, 184)',
        gridLineColor: 'rgba(242, 242, 242, 0.06)',
        volumeUpColor: 'rgba(34, 197, 94, 0.5)',
        volumeDownColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: '#0F0F0F',
        widgetFontColor: '#e2e8f0',
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
        colorTheme: 'dark',
        isTransparent: false,
        locale: 'en',
        chartOnly: false,
        scalePosition: 'right',
        scaleMode: 'Normal',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, sans-serif",
        valuesTracking: '1',
        changeMode: 'price-and-percent',
        symbols: [
          [financials.companyName, fullSymbol + '|1D'],
          ['Apple', 'NASDAQ:AAPL|1D'],
          ['Microsoft', 'NASDAQ:MSFT|1D'],
          ['Nvidia', 'NASDAQ:NVDA|1D'],
        ],
        dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
        fontSize: '11',
        headerFontSize: 'medium',
        autosize: true,
        width: '100%',
        height: '100%',
        noTimeScale: false,
        hideDateRanges: false,
        hideMarketStatus: false,
        hideSymbolLogo: false,
      });
    }

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [financials.symbol, financials.exchange, financials.companyName, chartMode, chartInterval, fullSymbol]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
      {/* Chart Control Bar */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-black text-sm text-white tracking-wide flex items-center gap-1.5 font-mono">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{fullSymbol}</span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {financials.companyName} • Real-Time Market Feed
          </span>
        </div>

        {/* View Mode & Interval Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart Engine Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setChartMode('advanced')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition ${
                chartMode === 'advanced'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              <span>Advanced Candlestick</span>
            </button>
            <button
              onClick={() => setChartMode('overview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition ${
                chartMode === 'overview'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Symbol Overview</span>
            </button>
          </div>

          {/* Timeframe intervals for Advanced mode */}
          {chartMode === 'advanced' && (
            <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700 text-xs font-mono">
              {[
                { label: '1m', value: '1' },
                { label: '5m', value: '5' },
                { label: '1h', value: '60' },
                { label: '1D', value: 'D' },
                { label: '1W', value: 'W' },
                { label: '1M', value: 'M' },
              ].map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setChartInterval(tf.value)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    chartInterval === tf.value
                      ? 'bg-slate-700 text-emerald-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}

          {/* Direct link to TradingView */}
          <a
            href={`https://www.tradingview.com/symbols/${fullSymbol}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition"
            title="Open Full Page on TradingView"
          >
            <span className="hidden lg:inline">TradingView</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Widget Container */}
      <div className="relative w-full h-[620px] bg-[#0F0F0F]">
        <div
          ref={containerRef}
          className="tradingview-widget-container w-full h-full"
        />
      </div>

      {/* Technical Footer Indicator Info */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Real-time interactive charting engine with SMA indicators, volume profiles, and drawing toolsets.
          </span>
        </div>
        <div className="text-slate-400 font-mono">
          Interactive DCF & Technical Analysis Suite
        </div>
      </div>
    </div>
  );
});
