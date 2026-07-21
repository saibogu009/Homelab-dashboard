import React, { useState, useEffect } from 'react';
import { HomelabService, ServiceCategory } from '../types';
import { X, Save, Plus, Globe, Server } from 'lucide-react';

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: HomelabService) => void;
  serviceToEdit?: HomelabService | null;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('end_user');
  const [url, setUrl] = useState('');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState<number | undefined>(undefined);
  const [vlan, setVlan] = useState('SRV (VLAN 20)');
  const [iconName, setIconName] = useState('Globe');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setUrl(serviceToEdit.url);
      setIp(serviceToEdit.ip);
      setPort(serviceToEdit.port);
      setVlan(serviceToEdit.vlan);
      setIconName(serviceToEdit.iconName);
      setDescription(serviceToEdit.description);
      setTagsInput(serviceToEdit.tags.join(', '));
    } else {
      setName('');
      setCategory('end_user');
      setUrl('http://10.10.20.');
      setIp('10.10.20.');
      setPort(8080);
      setVlan('SRV (VLAN 20)');
      setIconName('Globe');
      setDescription('');
      setTagsInput('homelab, app');
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const newService: HomelabService = {
      id: serviceToEdit ? serviceToEdit.id : `srv_${Date.now()}`,
      name,
      category,
      url,
      ip,
      port: port ? Number(port) : undefined,
      vlan,
      iconName,
      description,
      status: serviceToEdit ? serviceToEdit.status : 'online',
      latencyMs: serviceToEdit ? serviceToEdit.latencyMs : Math.floor(Math.random() * 5) + 1,
      isFavorite: serviceToEdit ? serviceToEdit.isFavorite : false,
      tags
    };

    onSave(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              {serviceToEdit ? 'Edit Homelab Service' : 'Add New Service'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Service Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jellyfin, Portainer, Vaultwarden"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="end_user">End User Services</option>
                <option value="arr_stack">Arr Media Stack</option>
                <option value="management">Management & Admin</option>
                <option value="monitoring">System Monitoring</option>
                <option value="networking">Networking & Core</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">VLAN Subnet</label>
              <select
                value={vlan}
                onChange={(e) => setVlan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="LAN (Core)">LAN (Core 192.168.10.x)</option>
                <option value="MGT (VLAN 10)">MGT (VLAN 10 10.10.10.x)</option>
                <option value="SRV (VLAN 20)">SRV (VLAN 20 10.10.20.x)</option>
                <option value="TRS (VLAN 30)">TRS (VLAN 30 10.10.30.x)</option>
                <option value="GST (VLAN 40)">GST (VLAN 40 10.10.40.x)</option>
                <option value="IOT (VLAN 50)">IOT (VLAN 50 10.10.50.x)</option>
                <option value="WG_LAN (VLAN 60)">WG_LAN (VLAN 60 10.10.60.x)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-medium text-slate-300 mb-1">Target URL</label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://10.10.20.20:8096"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Port</label>
              <input
                type="number"
                value={port || ''}
                onChange={(e) => setPort(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="8096"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">IP Address</label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="10.10.20.20"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Icon Name</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Tv">Tv (Media)</option>
                <option value="Sparkles">Sparkles (Smart Home)</option>
                <option value="Popcorn">Popcorn (Seer)</option>
                <option value="Film">Film (Sonarr)</option>
                <option value="Clapperboard">Clapperboard (Radarr)</option>
                <option value="Download">Download (qBit)</option>
                <option value="Compass">Compass (Jackett)</option>
                <option value="Server">Server (Proxmox)</option>
                <option value="Cpu">Cpu (Hypervisor)</option>
                <option value="Boxes">Boxes (Portainer)</option>
                <option value="ShieldCheck">ShieldCheck (NPM)</option>
                <option value="Wifi">Wifi (Omada)</option>
                <option value="Database">Database (TrueNAS)</option>
                <option value="Activity">Activity (Pulse)</option>
                <option value="Shield">Shield (pfSense)</option>
                <option value="Globe">Globe (Default)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of function or LXC container"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="media, arr, streaming, docker"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
