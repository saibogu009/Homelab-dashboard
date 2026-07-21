import React from 'react';
import { StoragePool } from '../types';
import { 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Thermometer, 
  RefreshCw, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface StorageStatsWidgetProps {
  pools: StoragePool[];
}

export const StorageStatsWidget: React.FC<StorageStatsWidgetProps> = ({ pools }) => {

  const storageBreakdownData = [
    { name: 'Media (Jellyfin/Arrs)', value: 12.4, color: '#8b5cf6' },
    { name: 'System Backups & ProxMox', value: 3.2, color: '#3b82f6' },
    { name: 'Appdata & Docker Volumes', value: 1.8, color: '#10b981' },
    { name: 'Free Space (RaidZ2)', value: 6.6, color: '#334155' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">TrueNAS & ZFS Storage Pools</h2>
            <p className="text-xs text-slate-400">
              Live ZFS health, RaidZ2 redundancy, ARC cache hit ratio, and disk SMART telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Pool Status: <strong>ONLINE</strong></span>
        </div>
      </div>

      {/* Main Storage Pool Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {pools.map((pool) => {
          const usedPercent = Math.round((pool.usedTB / pool.totalTB) * 100);
          const isWarning = usedPercent >= 85;

          return (
            <div 
              key={pool.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Pool Title Bar */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-blue-400" />
                      <h3 className="text-base font-bold text-slate-100">{pool.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{pool.host} • {pool.path}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    pool.health === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {pool.health}
                  </span>
                </div>

                {/* Storage Capacity Bar */}
                <div className="mb-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Capacity Used</span>
                    <span className="text-slate-200 font-bold">{pool.usedTB} TB / {pool.totalTB} TB ({usedPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWarning ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${usedPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pool Telemetry Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-500 font-medium mb-1">ZFS Raid Type</div>
                    <div className="font-bold text-slate-200 flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{pool.type}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-500 font-medium mb-1">ARC Cache Hit</div>
                    <div className="font-bold text-emerald-400 flex items-center space-x-1 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{pool.arcHitRatioPercent}%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-500 font-medium mb-1">Active Drives</div>
                    <div className="font-bold text-slate-200 flex items-center space-x-1 font-mono">
                      <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{pool.drivesCount} Disks</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <div className="text-slate-500 font-medium mb-1">Avg Drive Temp</div>
                    <div className="font-bold text-amber-400 flex items-center space-x-1 font-mono">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pool.driveTempsAvgC}°C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pool Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMART: {pool.smartStatus}</span>
                </span>
                <span>Last Scrub: {pool.lastScrubDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Pie Dataset Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-slate-100 mb-1">Main Storage Dataset Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">
            Categorized storage allocation on TrueNAS ZFS Pool <code>/mnt/tank</code> (Total 24 TB)
          </p>
          <div className="space-y-3">
            {storageBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">{item.value} TB</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={storageBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {storageBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: number) => [`${val} TB`, 'Size']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs text-slate-400 font-mono">Total Capacity</span>
            <span className="text-lg font-bold text-slate-100 font-mono">24.0 TB</span>
          </div>
        </div>
      </div>

    </div>
  );
};
