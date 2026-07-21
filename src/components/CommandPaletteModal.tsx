import React, { useState, useEffect, useRef } from 'react';
import { HomelabService, VLANNetwork } from '../types';
import { ServiceIcon } from './ServiceIcon';
import { 
  Search, 
  ExternalLink, 
  Server, 
  Network, 
  Globe, 
  ArrowRight, 
  X, 
  Sparkles,
  Command
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: HomelabService[];
  vlans: VLANNetwork[];
  defaultEngine?: string;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  services,
  vlans,
  defaultEngine = 'google'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter services
  const filteredServices = services.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.ip.includes(q) ||
      s.vlan.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Filter VLAN host devices
  const filteredHosts: { hostName: string; ip: string; vlanName: string; desc: string }[] = [];
  if (query.trim().length >= 2) {
    vlans.forEach((vlan) => {
      vlan.hosts.forEach((h) => {
        if (
          h.name.toLowerCase().includes(query.toLowerCase()) ||
          h.description.toLowerCase().includes(query.toLowerCase()) ||
          h.ip.includes(query)
        ) {
          filteredHosts.push({
            hostName: h.name,
            ip: h.ip,
            vlanName: vlan.name,
            desc: h.description
          });
        }
      });
    });
  }

  const allItemsCount = filteredServices.length + filteredHosts.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItemsCount > 0 ? (prev + 1) % allItemsCount : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItemsCount > 0 ? (prev - 1 + allItemsCount) % allItemsCount : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredServices.length > 0 && selectedIndex < filteredServices.length) {
        const item = filteredServices[selectedIndex];
        window.open(item.url, '_blank');
        onClose();
      } else if (query.trim()) {
        // Trigger web search fallback
        triggerWebSearch(query);
        onClose();
      }
    }
  };

  const triggerWebSearch = (searchQuery: string) => {
    let url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    if (defaultEngine === 'duckduckgo') {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Command Box */}
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-emerald-400 mr-3 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a service name, IP (10.10.20.20), host, or web search query..."
            className="w-full bg-transparent text-slate-100 text-sm placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 space-y-4 max-h-[55vh] scrollbar-thin">
          
          {/* Services Results */}
          {filteredServices.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Services ({filteredServices.length})
              </div>
              <div className="space-y-1">
                {filteredServices.map((service, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={service.id}
                      onClick={() => {
                        window.open(service.url, '_blank');
                        onClose();
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-white' 
                          : 'hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${service.accentColor || 'from-slate-700 to-slate-800'} text-white shrink-0`}>
                          <ServiceIcon name={service.iconName} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold truncate">{service.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                              {service.ip}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{service.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 ml-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {service.vlan}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Network Host Devices Matches */}
          {filteredHosts.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                VLAN Host Devices ({filteredHosts.length})
              </div>
              <div className="space-y-1">
                {filteredHosts.map((host, idx) => {
                  const globalIdx = filteredServices.length + idx;
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <div
                      key={host.hostName + idx}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white' 
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Network className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{host.hostName}</span>
                            <span className="text-xs font-mono text-slate-400">({host.ip})</span>
                          </div>
                          <p className="text-xs text-slate-400">{host.desc} • <span className="text-cyan-400">{host.vlanName}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* External Web Search Fallback */}
          {query.trim() && (
            <div className="pt-2 border-t border-slate-800">
              <div
                onClick={() => {
                  triggerWebSearch(query);
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/80 text-emerald-400 cursor-pointer border border-slate-800 transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Search web for &quot;{query}&quot;</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-400">
                  <span>Google / DuckDuckGo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredServices.length === 0 && filteredHosts.length === 0 && !query.trim() && (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Command className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>Type to search across services, IPs, VLAN hardware, or web links.</p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center space-x-3">
            <span><strong className="text-slate-300">↑↓</strong> Navigate</span>
            <span><strong className="text-slate-300">↵</strong> Launch</span>
            <span><strong className="text-slate-300">ESC</strong> Close</span>
          </div>
          <span className="text-[11px] text-slate-400">17 Homelab Services Indexed</span>
        </div>
      </div>
    </div>
  );
};
