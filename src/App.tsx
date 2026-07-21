import React, { useState, useEffect, useCallback } from 'react';
import { 
  HomelabService, 
  ServiceCategory, 
  StoragePool, 
  HealthAlert, 
  VLANNetwork, 
  DashboardSettings 
} from './types';
import { 
  INITIAL_SERVICES, 
  INITIAL_STORAGE_POOLS, 
  INITIAL_HEALTH_ALERTS, 
  HOMELAB_VLANS, 
  INITIAL_SYSTEM_TELEMETRY,
  INITIAL_JELLYFIN_STREAMS,
  INITIAL_TORRENTS,
  INITIAL_SMART_DEVICES
} from './data/homelabData';

import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { StorageStatsWidget } from './components/StorageStatsWidget';
import { HealthAlertsWidget } from './components/HealthAlertsWidget';
import { NetworkTopologyView } from './components/NetworkTopologyView';
import { LiveWidgets } from './components/LiveWidgets';
import { EditServiceModal } from './components/EditServiceModal';
import { SettingsModal } from './components/SettingsModal';

import { 
  Tv, 
  Boxes, 
  Film, 
  Activity, 
  Shield, 
  Star, 
  Server, 
  Pin, 
  Grid, 
  List, 
  Search,
  Filter,
  CheckCircle2,
  HardDrive,
  Network
} from 'lucide-react';

export default function App() {
  // Persistence Keys
  const STORAGE_KEY_SERVICES = 'homelab_services_v1';
  const STORAGE_KEY_SETTINGS = 'homelab_settings_v1';
  const STORAGE_KEY_ALERTS = 'homelab_alerts_v1';

  // State
  const [services, setServices] = useState<HomelabService[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return saved ? JSON.parse(saved) : {
      themeAccent: 'emerald',
      layoutDensity: 'comfortable',
      autoPingIntervalSeconds: 30,
      openLinksInNewTab: true,
      defaultSearchEngine: 'google',
      customDomainPrefix: ''
    };
  });

  const [alerts, setAlerts] = useState<HealthAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_ALERTS;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'topology' | 'storage' | 'widgets' | 'alerts'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingService, setEditingService] = useState<HomelabService | null>(null);
  
  // Refresh & Ping Simulator State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync Local Storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  // Command Palette Cmd+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ping All Services Simulator
  const handleRefreshAllPings = useCallback(() => {
    setIsRefreshing(true);
    setServices((prev) =>
      prev.map((s) => ({ ...s, status: 'checking' }))
    );

    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          status: 'online',
          latencyMs: Math.floor(Math.random() * 6) + 1
        }))
      );
      setIsRefreshing(false);
    }, 600);
  }, []);

  // Handlers
  const handleToggleFavorite = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleSaveService = (savedService: HomelabService) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      }
      return [savedService, ...prev];
    });
    setEditingService(null);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAlerts = () => {
    setAlerts([]);
  };

  const handleSimulateAlert = () => {
    const newAlert: HealthAlert = {
      id: `alert_${Date.now()}`,
      title: 'Smart Home Battery Low',
      source: 'Home Assistant (hass)',
      severity: 'warning',
      timestamp: 'Just now',
      message: 'Living room temperature sensor CR2032 battery dropped below 15%.',
      acknowledged: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all services and settings back to original homelab configuration?')) {
      localStorage.clear();
      setServices(INITIAL_SERVICES);
      setAlerts(INITIAL_HEALTH_ALERTS);
      setSettings({
        themeAccent: 'emerald',
        layoutDensity: 'comfortable',
        autoPingIntervalSeconds: 30,
        openLinksInNewTab: true,
        defaultSearchEngine: 'google',
        customDomainPrefix: ''
      });
      setIsSettingsOpen(false);
    }
  };

  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ services, settings, alerts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'homelab-command-center-backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'favorites' && s.isFavorite) ||
      (selectedCategory === 'pinned' && s.pinned) ||
      s.category === selectedCategory;

    const q = searchFilter.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.ip.includes(q) ||
      s.vlan.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const onlineCount = services.filter((s) => s.status === 'online').length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddModal={() => {
          setEditingService(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onRefreshAll={handleRefreshAllPings}
        isRefreshing={isRefreshing}
        onlineCount={onlineCount}
        totalServices={services.length}
        unacknowledgedAlertsCount={alerts.length}
        accentColor={settings.themeAccent}
        setAccentColor={(color) => setSettings((prev) => ({ ...prev, themeAccent: color }))}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Service Landing Page */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick Hero Banner / Homelab Stats Summary */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ALL SYSTEMS OPERATIONAL • 10.10.10.0/24 & 10.10.20.0/24</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Welcome to Your Homelab Control Hub
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Quick access to Jellyfin streaming, Home Assistant smart home, Arr media automation stack, Proxmox hypervisors, and TrueNAS ZFS storage.
                </p>
              </div>

              {/* Quick Jump Stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono shrink-0">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Services</span>
                  <span className="text-lg font-bold text-emerald-400">{services.length} Active</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">ZFS Storage</span>
                  <span className="text-lg font-bold text-blue-400">18.4 TB</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Subnets</span>
                  <span className="text-lg font-bold text-cyan-400">7 VLANs</span>
                </div>
              </div>
            </div>

            {/* Service Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 shadow-md">
              
              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  All ({services.length})
                </button>

                <button
                  onClick={() => setSelectedCategory('favorites')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'favorites'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Starred</span>
                </button>

                <button
                  onClick={() => setSelectedCategory('end_user')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'end_user'
                      ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  End User Services
                </button>

                <button
                  onClick={() => setSelectedCategory('arr_stack')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'arr_stack'
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Arr Stack
                </button>

                <button
                  onClick={() => setSelectedCategory('management')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'management'
                      ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Management & Admin
                </button>

                <button
                  onClick={() => setSelectedCategory('monitoring')}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === 'monitoring'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Monitoring
                </button>
              </div>

              {/* Inline Search Filter Input */}
              <div className="relative min-w-[200px] text-xs">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter grid..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className={`grid gap-4 ${
              settings.layoutDensity === 'compact' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={(srv) => {
                    setEditingService(srv);
                    setIsAddModalOpen(true);
                  }}
                  layoutDensity={settings.layoutDensity}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="py-16 text-center text-slate-500 text-xs bg-slate-900/50 border border-slate-800 rounded-2xl">
                <p>No homelab services match the current filter query.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: VLAN Network Topology */}
        {activeTab === 'topology' && (
          <NetworkTopologyView vlans={HOMELAB_VLANS} />
        )}

        {/* Tab 3: TrueNAS & ZFS Storage Pools */}
        {activeTab === 'storage' && (
          <StorageStatsWidget pools={INITIAL_STORAGE_POOLS} />
        )}

        {/* Tab 4: Live Homelab Widgets */}
        {activeTab === 'widgets' && (
          <LiveWidgets
            smartDevices={INITIAL_SMART_DEVICES}
            torrents={INITIAL_TORRENTS}
            streams={INITIAL_JELLYFIN_STREAMS}
          />
        )}

        {/* Tab 5: Health Alerts & Telemetry */}
        {activeTab === 'alerts' && (
          <HealthAlertsWidget
            alerts={alerts}
            telemetry={INITIAL_SYSTEM_TELEMETRY}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onClearAlerts={handleClearAlerts}
            onSimulateAlert={handleSimulateAlert}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-xs text-slate-500 font-mono text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HomeLab Command Center • pve / pvesense • pfSense Gateway • TrueNAS Core</span>
          <span className="text-slate-400">10.10.10.0/24 MGT • 10.10.20.0/24 SRV</span>
        </div>
      </footer>

      {/* Modals */}
      <CommandPaletteModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        services={services}
        vlans={HOMELAB_VLANS}
        defaultEngine={settings.defaultSearchEngine}
      />

      <EditServiceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        serviceToEdit={editingService}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetDefaults={handleResetDefaults}
        onExportConfig={handleExportConfig}
      />

    </div>
  );
}
