import React from 'react';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  Sliders, 
  Server, 
  Activity, 
  Database, 
  Network, 
  CheckCircle2, 
  ShieldCheck,
  LayoutDashboard,
  Grid
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'topology' | 'storage' | 'widgets' | 'alerts';
  setActiveTab: (tab: 'dashboard' | 'topology' | 'storage' | 'widgets' | 'alerts') => void;
  onOpenSearch: () => void;
  onOpenAddModal: () => void;
  onOpenSettingsModal: () => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  onlineCount: number;
  totalServices: number;
  unacknowledgedAlertsCount: number;
  accentColor: string;
  setAccentColor: (color: 'emerald' | 'sapphire' | 'violet' | 'amber' | 'cyan') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAddModal,
  onOpenSettingsModal,
  onRefreshAll,
  isRefreshing,
  onlineCount,
  totalServices,
  unacknowledgedAlertsCount,
  accentColor,
  setAccentColor,
}) => {
  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'emerald': return 'border-emerald-500/30 text-emerald-400';
      case 'sapphire': return 'border-blue-500/30 text-blue-400';
      case 'violet': return 'border-violet-500/30 text-violet-400';
      case 'amber': return 'border-amber-500/30 text-amber-400';
      case 'cyan': return 'border-cyan-500/30 text-cyan-400';
      default: return 'border-emerald-500/30 text-emerald-400';
    }
  };

  const getAccentBgClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-500';
      case 'sapphire': return 'bg-blue-500';
      case 'violet': return 'bg-violet-500';
      case 'amber': return 'bg-amber-500';
      case 'cyan': return 'bg-cyan-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className={`p-2 rounded-xl bg-slate-900 border ${getAccentBorderClass()} shadow-lg flex items-center justify-center`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none">
                  HomeLab <span className="text-slate-400 font-normal">Command Center</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  pve1 • pvesense
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">
                pfSense • TrueNAS Core • 7 VLANs • Omada
              </p>
            </div>
          </div>

          {/* Unified Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex-1 max-w-md hidden sm:flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              <span className="text-sm font-medium">Search services, VLANs, IPs or web...</span>
            </div>
            <div className="flex items-center space-x-1 font-mono text-[11px] text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>

          {/* Right Action Controls & Health Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* System Ping Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getAccentBgClass()} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${getAccentBgClass()}`}></span>
              </span>
              <span className="text-slate-300 font-medium font-mono">
                {onlineCount}/{totalServices} Online
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              title="Ping all services and check latency"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* Add Service Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Service</span>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              title="Dashboard Settings & Accent Theme"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/50 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Service Landing</span>
          </button>

          <button
            onClick={() => setActiveTab('topology')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>VLAN Topology Map</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'storage'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Storage & Pools</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'widgets'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-violet-400" />
            <span>Live Widgets & IoT</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'alerts'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Health & Telemetry</span>
            {unacknowledgedAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {unacknowledgedAlertsCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
