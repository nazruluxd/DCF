import React, { useEffect, useState } from 'react';
import {
  X,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Sparkles,
  Zap,
  Info,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { ProviderStatus } from '../types/dcf';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  selectedProvider,
  onSelectProvider,
}) => {
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [activeDetected, setActiveDetected] = useState<string>('yahoo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/providers/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.providers) {
            setProviderStatuses(data.providers);
            setActiveDetected(data.activeProvider);
          }
        })
        .catch((err) => console.error('Failed to load provider status:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">Real Financial Data APIs & Providers</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PLUGGABLE ARCHITECTURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connect live stock APIs or use built-in real-time Yahoo Finance & Google Gemini grounding
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Status Overview Alert */}
          <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-1">
                Real Data is Active Out-of-the-Box
              </h4>
              <p className="text-slate-400 leading-relaxed">
                The app currently uses <strong>real-time Yahoo Finance market quotes</strong> combined with <strong>Google Gemini financial statement analysis</strong>.
                You can also add any popular external market data API key (free or paid) at any time. The server will automatically detect it and query institutional SEC filings!
              </p>
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <h3 className="font-bold text-sm text-slate-100 mb-3 flex items-center justify-between">
              <span>Supported Financial Data Providers</span>
              <span className="text-xs font-normal text-slate-400">Select active provider preference</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Option 1: Auto (Best Available) */}
              <div
                onClick={() => onSelectProvider('auto')}
                className={`p-3.5 rounded-xl border cursor-pointer transition relative ${
                  selectedProvider === 'auto'
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> Auto-Select (Recommended)
                  </span>
                  {selectedProvider === 'auto' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Automatically cascades to FMP, Finnhub, or Alpha Vantage if configured, and falls back to live Yahoo Finance quotes with Gemini AI.
                </p>
              </div>

              {/* Providers from Backend */}
              {providerStatuses.map((p) => {
                const isSelected = selectedProvider === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProvider(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-100 flex items-center gap-1.5">
                        {p.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                          p.configured
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {p.configured ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
                          </>
                        ) : (
                          'Not Set'
                        )}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
                      <span>Free Tier: <strong className="text-slate-300">{p.freeTier}</strong></span>
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        API Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

          {/* How to Add Your API Key Guide */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              How to Add Your API Keys in Seconds:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
              <li>
                Sign up for any provider of your choice (e.g., <strong>Financial Modeling Prep</strong>, <strong>Finnhub</strong>, or <strong>Alpha Vantage</strong>) to get a free API key.
              </li>
              <li>
                Open the project's <code className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-emerald-300">.env</code> file (or add it in your Cloud Secrets panel).
              </li>
              <li>
                Add the key for the provider you want:
              </li>
            </ol>

            <div className="mt-3 bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-emerald-300 border border-slate-800 space-y-1">
              <p className="text-slate-500"># For Financial Modeling Prep (Complete SEC Statements & DCF):</p>
              <p>FMP_API_KEY=&quot;your_fmp_api_key_here&quot;</p>
              <p className="text-slate-500 mt-2"># For Finnhub (Live Quotes & Ratios):</p>
              <p>FINNHUB_API_KEY=&quot;your_finnhub_api_key_here&quot;</p>
              <p className="text-slate-500 mt-2"># For Alpha Vantage:</p>
              <p>ALPHA_VANTAGE_API_KEY=&quot;your_alpha_vantage_key_here&quot;</p>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              ⚡ The backend server automatically detects the new key without restarting, immediately switching to that provider's live institutional feed!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
          <span className="text-xs text-slate-400">
            Active Provider Mode: <strong className="text-emerald-400 uppercase font-mono">{selectedProvider}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
