import React, { useState } from 'react';
import { DashboardSettings, ApiIntegrationsConfig } from '../types';
import { X, Sliders, RotateCcw, Download, Palette, Link2, Key, Check, Server, Sparkles, Tv, Download as DownloadIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onUpdateSettings: (newSettings: DashboardSettings) => void;
  onResetDefaults: () => void;
  onExportConfig: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
  onExportConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'api'>('appearance');
  const [apiConfig, setApiConfig] = useState<ApiIntegrationsConfig>(settings.apiConfig || {
    homeAssistantUrl: 'http://10.10.20.10:8123',
    jellyfinUrl: 'http://10.10.20.20:8096',
    qbitUrl: 'http://10.10.20.26:8080'
  });

  if (!isOpen) return null;

  const handleSaveApiConfig = () => {
    onUpdateSettings({ ...settings, apiConfig });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Dashboard Settings & API Integrations</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 my-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`pb-2 px-4 border-b-2 transition-all ${
              activeTab === 'appearance'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Appearance & Search
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`pb-2 px-4 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'api'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Service API Credentials (Live Data)</span>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 pr-1 space-y-5 text-xs">
          
          {activeTab === 'appearance' && (
            <>
              {/* Accent Color Picker */}
              <div>
                <label className="block font-medium text-slate-300 mb-2 flex items-center space-x-1.5">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Cyber Dark Theme Accent</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
                    { id: 'sapphire', label: 'Sapphire', color: 'bg-blue-500' },
                    { id: 'violet', label: 'Violet', color: 'bg-violet-500' },
                    { id: 'amber', label: 'Amber', color: 'bg-amber-500' },
                    { id: 'cyan', label: 'Cyan', color: 'bg-cyan-500' }
                  ].map((accent) => (
                    <button
                      key={accent.id}
                      onClick={() => onUpdateSettings({ ...settings, themeAccent: accent.id as any })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                        settings.themeAccent === accent.id
                          ? 'bg-slate-800 border-slate-600 text-white font-bold ring-2 ring-slate-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${accent.color}`}></span>
                      <span className="text-[10px]">{accent.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="block font-medium text-slate-300 mb-2">Card Layout Density</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onUpdateSettings({ ...settings, layoutDensity: 'comfortable' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.layoutDensity === 'comfortable'
                        ? 'bg-slate-800 border-emerald-500/50 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Comfortable Cards</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Spacious grid with tags & detailed status</div>
                  </button>

                  <button
                    onClick={() => onUpdateSettings({ ...settings, layoutDensity: 'compact' })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.layoutDensity === 'compact'
                        ? 'bg-slate-800 border-emerald-500/50 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs">Compact Row List</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">High density list view for maximum visibility</div>
                  </button>
                </div>
              </div>

              {/* Web Search Engine Fallback */}
              <div>
                <label className="block font-medium text-slate-300 mb-1">Unified Search Web Fallback</label>
                <select
                  value={settings.defaultSearchEngine}
                  onChange={(e) => onUpdateSettings({ ...settings, defaultSearchEngine: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="google">Google Search</option>
                  <option value="duckduckgo">DuckDuckGo Privacy Search</option>
                  <option value="searxng">SearXNG Local Engine</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 text-[11px] text-emerald-200 leading-relaxed">
                <span className="font-bold block mb-1">🔌 Connect Live Services</span>
                Enter your local service URLs and API keys below to replace static demo metrics with live data from Home Assistant, Jellyfin, qBittorrent, Proxmox, and more. Keys are saved strictly in your browser's local storage.
              </div>

              {/* Home Assistant */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-200">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Home Assistant Integration</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Host URL</label>
                    <input
                      type="text"
                      placeholder="http://10.10.20.10:8123"
                      value={apiConfig.homeAssistantUrl || ''}
                      onChange={(e) => setApiConfig({ ...apiConfig, homeAssistantUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Long-Lived Access Token</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1Ni..."
                      value={apiConfig.homeAssistantToken || ''}
                      onChange={(e) => setApiConfig({ ...apiConfig, homeAssistantToken: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Jellyfin */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-200">
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span>Jellyfin / Media Server</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Server URL</label>
                    <input
                      type="text"
                      placeholder="http://10.10.20.20:8096"
                      value={apiConfig.jellyfinUrl || ''}
                      onChange={(e) => setApiConfig({ ...apiConfig, jellyfinUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">API Key</label>
                    <input
                      type="password"
                      placeholder="e.g. 7d8f9a2b..."
                      value={apiConfig.jellyfinApiKey || ''}
                      onChange={(e) => setApiConfig({ ...apiConfig, jellyfinApiKey: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* qBittorrent */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-200">
                  <DownloadIcon className="w-4 h-4 text-blue-400" />
                  <span>qBittorrent WebUI</span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">WebUI Endpoint URL</label>
                  <input
                    type="text"
                    placeholder="http://10.10.20.26:8080"
                    value={apiConfig.qbitUrl || ''}
                    onChange={(e) => setApiConfig({ ...apiConfig, qbitUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Save API Config Button */}
              <button
                onClick={handleSaveApiConfig}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Save API Credentials</span>
              </button>
            </div>
          )}

          {/* Export / Reset Configuration */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onExportConfig}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Backup JSON Config</span>
              </button>

              <button
                onClick={onResetDefaults}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/30 text-slate-300 hover:text-rose-300 font-semibold border border-slate-700"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

