import React from 'react';
import { HealthAlert, SystemMetricPoint } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  Plus, 
  Cpu, 
  Wifi, 
  Server, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';

interface HealthAlertsWidgetProps {
  alerts: HealthAlert[];
  telemetry: SystemMetricPoint[];
  onAcknowledgeAlert: (id: string) => void;
  onClearAlerts: () => void;
  onSimulateAlert: () => void;
}

export const HealthAlertsWidget: React.FC<HealthAlertsWidgetProps> = ({
  alerts,
  telemetry,
  onAcknowledgeAlert,
  onClearAlerts,
  onSimulateAlert
}) => {
  return (
    <div className="space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">System Telemetry & Health Alerts</h2>
            <p className="text-xs text-slate-400">
              Live monitoring feed for Proxmox Nodes, pfSense Gateway, and TrueNAS storage events.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSimulateAlert}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Test Alert</span>
          </button>
          {alerts.length > 0 && (
            <button
              onClick={onClearAlerts}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-400 transition-all border border-slate-700"
              title="Clear all alerts"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Health Alerts Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>Health Event Feed</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-amber-400">
              {alerts.length} Active
            </span>
          </h3>
        </div>

        {alerts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-mono bg-slate-950/60 rounded-xl border border-slate-800">
            <Check className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <p>All homelab services are healthy. No active warnings or errors.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const isCritical = alert.severity === 'critical';
              const isWarning = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {isCritical && <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />}
                      {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
                      {!isCritical && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold">{alert.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                          {alert.source}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-3"
                    title="Acknowledge alert"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Recharts Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Proxmox Hypervisor CPU & RAM */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">Proxmox PVE Node 1 CPU (%)</h3>
                <p className="text-[11px] text-slate-400 font-mono">Intel Host (10.10.10.2) • 64GB RAM</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              21% CPU Avg
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetry}>
                <defs>
                  <linearGradient id="pveCpuColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(val: number) => [`${val}%`, 'CPU Utilization']}
                />
                <Area type="monotone" dataKey="pveCpu" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#pveCpuColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: WAN Bandwidth Throughput */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">pfSense WAN Throughput (Mbps)</h3>
                <p className="text-[11px] text-slate-400 font-mono">pvesense Futro Node (192.168.10.1)</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              1 Gbps PPPoE
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="wanRxMbps" name="Download (Rx)" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="wanTxMbps" name="Upload (Tx)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
