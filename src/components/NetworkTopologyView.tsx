import React, { useState } from 'react';
import { VLANNetwork } from '../types';
import { 
  Network, 
  Server, 
  Wifi, 
  Shield, 
  Laptop, 
  Smartphone, 
  Tv, 
  Printer, 
  Cpu, 
  Lock, 
  Radio, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NetworkTopologyViewProps {
  vlans: VLANNetwork[];
}

export const NetworkTopologyView: React.FC<NetworkTopologyViewProps> = ({ vlans }) => {
  const [selectedVlanId, setSelectedVlanId] = useState<string>('all');
  const [expandedVlans, setExpandedVlans] = useState<Record<string, boolean>>({
    lan_core: true,
    vlan_10: true,
    vlan_20: true,
    vlan_30: true,
    vlan_40: true,
    vlan_50: true,
    vlan_60: true
  });

  const toggleExpand = (id: string) => {
    setExpandedVlans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredVlans = selectedVlanId === 'all' 
    ? vlans 
    : vlans.filter((v) => v.id === selectedVlanId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hypervisor': return <Server className="w-4 h-4 text-orange-400" />;
      case 'vm': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'container': return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'switch': return <Radio className="w-4 h-4 text-blue-400" />;
      case 'ap': return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'client': return <Laptop className="w-4 h-4 text-amber-400" />;
      case 'iot': return <Tv className="w-4 h-4 text-fuchsia-400" />;
      default: return <Network className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Architecture Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Inter-VLAN Architecture & Service Mapping</h2>
              <p className="text-xs text-slate-400">
                Managed by pfSense (192.168.10.1) with PPPoE WAN & TP-Link Omada SDN switches.
              </p>
            </div>
          </div>

          {/* VLAN Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedVlanId('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedVlanId === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All 7 Subnets
            </button>
            {vlans.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVlanId(v.id)}
                className={`px-2.5 py-1.5 rounded-xl font-mono transition-all ${
                  selectedVlanId === v.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {v.code} ({v.vlanId})
              </button>
            ))}
          </div>
        </div>

        {/* Network Hardware Overview Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Core Router</span>
            <span className="font-bold text-slate-200 font-mono">pfSense (pvesense Node 2)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Primary Node 1</span>
            <span className="font-bold text-slate-200 font-mono">pve (Intel Hardware)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">Network Controller</span>
            <span className="font-bold text-slate-200 font-mono">Omada (192.168.10.5)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-slate-500 block mb-0.5">ZFS Storage Host</span>
            <span className="font-bold text-slate-200 font-mono">truenas (10.10.20.2)</span>
          </div>
        </div>
      </div>

      {/* VLAN Subnet Cards */}
      <div className="space-y-4">
        {filteredVlans.map((vlan) => {
          const isExpanded = expandedVlans[vlan.id];

          return (
            <div 
              key={vlan.id} 
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all"
            >
              {/* VLAN Header Row */}
              <div 
                onClick={() => toggleExpand(vlan.id)}
                className="p-4 bg-slate-900 hover:bg-slate-850 cursor-pointer flex items-center justify-between border-b border-slate-800/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <button className="p-1 rounded bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {vlan.code} ({vlan.vlanId})
                      </span>
                      <h3 className="text-base font-bold text-slate-100">{vlan.name}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{vlan.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono text-slate-300 shrink-0">
                  <span className="hidden sm:inline-block bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    Subnet: <strong>{vlan.subnet}</strong>
                  </span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    GW: <strong>{vlan.gateway}</strong>
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold">
                    {vlan.hosts.length} Devices
                  </span>
                </div>
              </div>

              {/* Host Devices Table */}
              {isExpanded && (
                <div className="p-4 bg-slate-950/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vlan.hosts.map((host, idx) => (
                      <div 
                        key={host.name + idx}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-3 flex items-start justify-between shadow-sm transition-all"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                            {getTypeIcon(host.type)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">{host.name}</h4>
                            <span className="text-[11px] font-mono font-semibold text-cyan-400">{host.ip}</span>
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{host.description}</p>
                          </div>
                        </div>

                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" title="Online"></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
