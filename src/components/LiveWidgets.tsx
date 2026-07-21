import React, { useState, useEffect } from 'react';
import { SmartHomeDevice, ActiveTorrent, ActiveStream, ApiIntegrationsConfig } from '../types';
import { fetchHomeAssistantEntities, fetchJellyfinSessions, fetchQbitTorrents } from '../lib/apiServices';
import { 
  Sparkles, 
  Tv, 
  Download, 
  Zap, 
  Thermometer, 
  Power, 
  Play, 
  Pause, 
  Film, 
  RefreshCw,
  ArrowDown, 
  ArrowUp,
  Key
} from 'lucide-react';

interface LiveWidgetsProps {
  smartDevices: SmartHomeDevice[];
  torrents: ActiveTorrent[];
  streams: ActiveStream[];
  apiConfig?: ApiIntegrationsConfig;
  onOpenSettingsModal?: () => void;
}

export const LiveWidgets: React.FC<LiveWidgetsProps> = ({
  smartDevices: initialDevices,
  torrents: initialTorrents,
  streams: initialStreams,
  apiConfig,
  onOpenSettingsModal
}) => {
  const [smartDevices, setSmartDevices] = useState<SmartHomeDevice[]>(initialDevices);
  const [torrents, setTorrents] = useState<ActiveTorrent[]>(initialTorrents);
  const [streams, setStreams] = useState<ActiveStream[]>(initialStreams);
  const [isLiveFetching, setIsLiveFetching] = useState(false);
  const [lastLiveUpdated, setLastLiveUpdated] = useState<string | null>(null);

  // Poll or refresh live service APIs if configured
  const loadLiveApiData = async () => {
    if (!apiConfig) return;
    setIsLiveFetching(true);

    try {
      if (apiConfig.homeAssistantUrl && apiConfig.homeAssistantToken) {
        const liveDevices = await fetchHomeAssistantEntities(apiConfig);
        if (liveDevices && liveDevices.length > 0) setSmartDevices(liveDevices);
      }

      if (apiConfig.jellyfinUrl && apiConfig.jellyfinApiKey) {
        const liveStreams = await fetchJellyfinSessions(apiConfig);
        if (liveStreams) setStreams(liveStreams);
      }

      if (apiConfig.qbitUrl) {
        const liveTorrents = await fetchQbitTorrents(apiConfig);
        if (liveTorrents) setTorrents(liveTorrents);
      }

      setLastLiveUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Error fetching live widgets:', e);
    } finally {
      setIsLiveFetching(false);
    }
  };

  useEffect(() => {
    if (apiConfig && (apiConfig.homeAssistantToken || apiConfig.jellyfinApiKey || apiConfig.qbitUrl)) {
      loadLiveApiData();
    }
  }, [apiConfig]);

  const toggleDevice = (id: string) => {
    setSmartDevices((prev) =>
      prev.map((dev) =>
        dev.id === id ? { ...dev, state: !dev.state } : dev
      )
    );
  };

  const adjustThermostat = (delta: number) => {
    setSmartDevices((prev) =>
      prev.map((dev) =>
        dev.type === 'thermostat'
          ? { ...dev, state: Math.round(((dev.state as number) + delta) * 10) / 10 }
          : dev
      )
    );
  };

  const toggleTorrentStatus = (id: string) => {
    setTorrents((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'downloading' ? 'paused' : 'downloading' }
          : t
      )
    );
  };

  const totalDlSpeed = torrents.reduce((acc, t) => acc + (t.downloadSpeedMBs || 0), 0).toFixed(1);
  const totalUlSpeed = torrents.reduce((acc, t) => acc + (t.uploadSpeedMBs || 0), 0).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Live Homelab Service Widgets & Smart Controls</h2>
            <p className="text-xs text-slate-400">
              Interactive live integrations for Home Assistant (hass), qBittorrent, and Jellyfin media streams.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {lastLiveUpdated && (
            <span className="text-[11px] font-mono text-emerald-400">
              Live updated: {lastLiveUpdated}
            </span>
          )}

          <button
            onClick={loadLiveApiData}
            disabled={isLiveFetching}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLiveFetching ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Fetch API Data</span>
          </button>

          {onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 border border-emerald-500/30"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure API Keys</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Home Assistant Controls */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">Home Assistant Core</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {apiConfig?.homeAssistantUrl ? apiConfig.homeAssistantUrl.replace(/^https?:\/\//, '') : '10.10.20.10:8123'}
              </span>
            </div>

            {/* Smart Lights Toggles */}
            <div className="space-y-2.5 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Smart Devices & Lighting
              </div>
              {smartDevices.filter((d) => d.type === 'light' || d.type === 'plug').slice(0, 5).map((dev) => (
                <div 
                  key={dev.id}
                  onClick={() => toggleDevice(dev.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    dev.state 
                      ? 'bg-amber-500/10 border-amber-500/30 text-slate-100' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Power className={`w-4 h-4 ${dev.state ? 'text-amber-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="text-xs font-bold">{dev.name}</div>
                      <div className="text-[10px] text-slate-500">{dev.room}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    dev.state ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {dev.state ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>

            {/* Climate Tado Controls */}
            {smartDevices.find((d) => d.type === 'thermostat') && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-medium flex items-center space-x-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tado Heating Target</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {smartDevices.find((d) => d.type === 'thermostat')?.state}°C
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => adjustThermostat(-0.5)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                  >
                    - 0.5°
                  </button>
                  <button 
                    onClick={() => adjustThermostat(0.5)}
                    className="flex-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30"
                  >
                    + 0.5°
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>OVO Smart Meter</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>420 Watts</span>
            </span>
          </div>
        </div>

        {/* Widget 2: qBittorrent Active Downloads */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">qBittorrent (qBit)</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-emerald-400 flex items-center space-x-0.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>{totalDlSpeed} MB/s</span>
                </span>
                <span className="text-amber-400 flex items-center space-x-0.5">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{totalUlSpeed} MB/s</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {torrents.map((tor) => (
                <div key={tor.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{tor.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {tor.sizeGB} GB • ETA: {tor.eta} • <span className="uppercase text-cyan-400">{tor.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTorrentStatus(tor.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {tor.status === 'downloading' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>{tor.status}</span>
                      <span>{tor.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full ${
                          tor.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${tor.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href={apiConfig?.qbitUrl || "http://10.10.20.26:8080"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center block transition-colors"
          >
            Open qBittorrent Web UI →
          </a>
        </div>

        {/* Widget 3: Jellyfin Active Streams */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-slate-100">Jellyfin Now Playing</h3>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {streams.length} Active Streams
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {streams.map((str) => (
                <div key={str.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Film className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-200 truncate">{str.mediaTitle}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {str.user}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{str.quality}</span>
                    {str.transcodeReason && <span className="text-amber-400">Transcoding</span>}
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${str.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {streams.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-8">
                  No active media streams playing on Jellyfin.
                </div>
              )}
            </div>
          </div>

          <a
            href={apiConfig?.jellyfinUrl || "http://10.10.20.20:8096"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold text-center block transition-colors border border-purple-500/30"
          >
            Launch Jellyfin Media Player →
          </a>
        </div>

      </div>

    </div>
  );
};

