import React from 'react';
import { HomelabService } from '../types';
import { ServiceIcon } from './ServiceIcon';
import { ExternalLink, Star, Edit3, ShieldAlert, Wifi, Globe } from 'lucide-react';

interface ServiceCardProps {
  service: HomelabService;
  onToggleFavorite: (id: string) => void;
  onEdit: (service: HomelabService) => void;
  layoutDensity?: 'comfortable' | 'compact';
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onToggleFavorite,
  onEdit,
  layoutDensity = 'comfortable'
}) => {
  const getStatusBadge = () => {
    switch (service.status) {
      case 'online':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{service.latencyMs ? `${service.latencyMs}ms` : '200 OK'}</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Slow ({service.latencyMs}ms)</span>
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Unreachable</span>
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span>Ping...</span>
          </span>
        );
    }
  };

  if (layoutDensity === 'compact') {
    return (
      <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md">
        <div className="flex items-center space-x-3 min-w-0">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${service.accentColor || 'from-slate-700 to-slate-800'} text-white shadow-sm shrink-0`}>
            <ServiceIcon name={service.iconName} className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
                {service.name}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.2 rounded border border-slate-800 shrink-0">
                {service.ip}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{service.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-3">
          {getStatusBadge()}
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={`Open ${service.name}`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-0.5">
      
      {/* Top Card Bar */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${service.accentColor || 'from-slate-700 to-slate-800'} text-white shadow-md group-hover:scale-105 transition-transform`}>
            <ServiceIcon name={service.iconName} className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                {service.name}
              </h3>
              {service.pinned && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center space-x-1 mt-0.5">
              <span>{service.ip}</span>
              {service.port && <span>:{service.port}</span>}
            </p>
          </div>
        </div>

        {/* Favorite & Edit Actions */}
        <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(service.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              service.isFavorite 
                ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={service.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${service.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onEdit(service)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            title="Edit service details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
        {service.description}
      </p>

      {/* Tags & VLAN Info */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-950 text-slate-400 border border-slate-800">
          {service.vlan}
        </span>
        {service.tags.map((tag) => (
          <span 
            key={tag} 
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Bar */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between mt-auto">
        {getStatusBadge()}

        <a
          href={service.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-md"
        >
          <span>Launch</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
