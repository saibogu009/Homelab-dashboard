import React from 'react';
import { DashboardSettings } from '../types';
import { X, Sliders, RotateCcw, Download, Upload, Check, Palette } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Dashboard & Theme Customization</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs">
          
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
