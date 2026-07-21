import { 
  HomelabService, 
  StoragePool, 
  HealthAlert, 
  VLANNetwork, 
  SystemMetricPoint, 
  ActiveStream, 
  ActiveTorrent, 
  SmartHomeDevice 
} from '../types';

export const INITIAL_SERVICES: HomelabService[] = [
  // End User Services
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    category: 'end_user',
    url: 'http://10.10.20.20:8096',
    ip: '10.10.20.20',
    port: 8096,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Tv',
    description: 'Media Streaming & Transcoding Server (jfin)',
    status: 'online',
    latencyMs: 3,
    isFavorite: true,
    tags: ['media', 'movies', 'tv', 'streaming'],
    pinned: true,
    accentColor: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'home_assistant',
    name: 'Home Assistant',
    category: 'end_user',
    url: 'http://10.10.20.10:8123',
    ip: '10.10.20.10',
    port: 8123,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Sparkles',
    description: 'Smart Home Automation & Control Hub (hass)',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['smart home', 'iot', 'automation', 'tado'],
    pinned: true,
    accentColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'seer',
    name: 'Seer',
    category: 'end_user',
    url: 'http://10.10.20.21:5055',
    ip: '10.10.20.21',
    port: 5055,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Popcorn',
    description: 'Jellyseerr Media Discovery & Request Management',
    status: 'online',
    latencyMs: 4,
    isFavorite: true,
    tags: ['media', 'requests', 'movies', 'tv'],
    pinned: true,
    accentColor: 'from-amber-500 to-red-500'
  },

  // Arr Stack (Media Automation)
  {
    id: 'sonarr',
    name: 'Sonarr',
    category: 'arr_stack',
    url: 'http://10.10.20.23:8989',
    ip: '10.10.20.23',
    port: 8989,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Film',
    description: 'TV Series Management & Automation',
    status: 'online',
    latencyMs: 5,
    isFavorite: true,
    tags: ['arr', 'tv', 'downloads'],
    accentColor: 'from-sky-500 to-blue-700'
  },
  {
    id: 'radarr',
    name: 'Radarr',
    category: 'arr_stack',
    url: 'http://10.10.20.22:7878',
    ip: '10.10.20.22',
    port: 7878,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Clapperboard',
    description: 'Movie Management & Automation',
    status: 'online',
    latencyMs: 4,
    isFavorite: true,
    tags: ['arr', 'movies', 'downloads'],
    accentColor: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'qbit',
    name: 'qBit',
    category: 'arr_stack',
    url: 'http://10.10.20.26:8080',
    ip: '10.10.20.26',
    port: 8080,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Download',
    description: 'qBittorrent Web Client & Download Handler',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['torrent', 'downloads', 'arr'],
    accentColor: 'from-blue-600 to-teal-500'
  },
  {
    id: 'jackett',
    name: 'Jackett',
    category: 'arr_stack',
    url: 'http://10.10.20.25:9117',
    ip: '10.10.20.25',
    port: 9117,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Compass',
    description: 'API Support & Torrent Indexer Proxy',
    status: 'online',
    latencyMs: 6,
    isFavorite: false,
    tags: ['indexers', 'arr', 'torrents'],
    accentColor: 'from-emerald-500 to-teal-700'
  },

  // Management Services
  {
    id: 'proxmox_pve',
    name: 'Proxmox PVE (Node 1)',
    category: 'management',
    url: 'https://10.10.10.2:8006',
    ip: '10.10.10.2',
    port: 8006,
    vlan: 'MGT (VLAN 10)',
    iconName: 'Server',
    description: 'Primary Intel Hypervisor Host for Apps, Storage & LXCs',
    status: 'online',
    latencyMs: 1,
    isFavorite: true,
    tags: ['pve', 'hypervisor', 'proxmox', 'lxc'],
    pinned: true,
    accentColor: 'from-orange-500 to-amber-600'
  },
  {
    id: 'proxmox_pvesense',
    name: 'pvesense (Node 2)',
    category: 'management',
    url: 'https://10.10.10.3:8006',
    ip: '10.10.10.3',
    port: 8006,
    vlan: 'MGT (VLAN 10)',
    iconName: 'Cpu',
    description: 'Dedicated Futro Hardware Node running pfSense Gateway',
    status: 'online',
    latencyMs: 1,
    isFavorite: true,
    tags: ['pve', 'pfSense', 'hardware', 'futro'],
    accentColor: 'from-orange-600 to-red-600'
  },
  {
    id: 'portainer_arr',
    name: 'Arr Portainer',
    category: 'management',
    url: 'https://10.10.20.15:9443',
    ip: '10.10.20.15',
    port: 9443,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Boxes',
    description: 'Docker Container Management for Arr & Media Stack',
    status: 'online',
    latencyMs: 3,
    isFavorite: false,
    tags: ['docker', 'portainer', 'containers'],
    accentColor: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'portainer_dev',
    name: 'Dev Portainer',
    category: 'management',
    url: 'https://10.10.20.18:9443',
    ip: '10.10.20.18',
    port: 9443,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Box',
    description: 'Docker Container Management for Development Sandbox',
    status: 'online',
    latencyMs: 3,
    isFavorite: false,
    tags: ['docker', 'dev', 'containers'],
    accentColor: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'nginx_pm',
    name: 'Nginx PM',
    category: 'management',
    url: 'http://10.10.10.5:81',
    ip: '10.10.10.5',
    port: 81,
    vlan: 'MGT (VLAN 10)',
    iconName: 'ShieldCheck',
    description: 'Nginx Proxy Manager & SSL Certificate Proxy',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['proxy', 'nginx', 'ssl', 'routing'],
    accentColor: 'from-emerald-600 to-green-700'
  },
  {
    id: 'omada',
    name: 'Omada Controller',
    category: 'management',
    url: 'https://192.168.10.5:8043',
    ip: '192.168.10.5',
    port: 8043,
    vlan: 'LAN (Core)',
    iconName: 'Wifi',
    description: 'TP-Link Omada SDN Controller for Switches & EAPs',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['network', 'omada', 'wifi', 'switches'],
    accentColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'truenas',
    name: 'TrueNAS Core',
    category: 'management',
    url: 'http://10.10.20.2',
    ip: '10.10.20.2',
    port: 80,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Database',
    description: 'ZFS Storage Array & Network Attached Storage (truenas)',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['nas', 'zfs', 'truenas', 'storage'],
    pinned: true,
    accentColor: 'from-sky-600 to-cyan-700'
  },

  // System Monitoring & Dashboards
  {
    id: 'pulse',
    name: 'Pulse Dashboard',
    category: 'monitoring',
    url: 'http://10.10.10.15:8000',
    ip: '10.10.10.15',
    port: 8000,
    vlan: 'MGT (VLAN 10)',
    iconName: 'Activity',
    description: 'Realtime Infrastructure & Network Monitoring Dashboard',
    status: 'online',
    latencyMs: 2,
    isFavorite: true,
    tags: ['monitoring', 'metrics', 'pulse', 'telemetry'],
    pinned: true,
    accentColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'pfsense_gateway',
    name: 'pfSense Firewall',
    category: 'networking',
    url: 'https://192.168.10.1',
    ip: '192.168.10.1',
    port: 443,
    vlan: 'LAN (Core)',
    iconName: 'Shield',
    description: 'Core Gateway, PPPoE WAN, Firewall & Inter-VLAN Router',
    status: 'online',
    latencyMs: 1,
    isFavorite: true,
    tags: ['router', 'pfsense', 'firewall', 'gateway'],
    accentColor: 'from-red-600 to-rose-700'
  },
  {
    id: 'dashy',
    name: 'Dashy',
    category: 'monitoring',
    url: 'http://10.10.20.12:8080',
    ip: '10.10.20.12',
    port: 8080,
    vlan: 'SRV (VLAN 20)',
    iconName: 'LayoutGrid',
    description: 'Alternative Homelab Dashboard Interface',
    status: 'online',
    latencyMs: 4,
    isFavorite: false,
    tags: ['dashboard', 'ui', 'dashy'],
    accentColor: 'from-violet-500 to-fuchsia-600'
  },
  {
    id: 'homepage_mirror',
    name: 'Homepage Secondary',
    category: 'monitoring',
    url: 'http://10.10.20.5:3000',
    ip: '10.10.20.5',
    port: 3000,
    vlan: 'SRV (VLAN 20)',
    iconName: 'Home',
    description: 'Secondary Backup Landing Page Mirror',
    status: 'online',
    latencyMs: 3,
    isFavorite: false,
    tags: ['homepage', 'backup', 'landing'],
    accentColor: 'from-slate-600 to-gray-700'
  }
];

export const INITIAL_STORAGE_POOLS: StoragePool[] = [
  {
    id: 'pool_tank',
    name: 'tank (Main ZFS Pool)',
    path: '/mnt/tank',
    type: 'ZFS RaidZ2',
    host: 'truenas (10.10.20.2)',
    totalTB: 24.0,
    usedTB: 18.4,
    health: 'ONLINE',
    arcHitRatioPercent: 96.8,
    drivesCount: 6,
    driveTempsAvgC: 34,
    lastScrubDate: '2026-07-19 (0 errors)',
    smartStatus: 'ALL_PASSED'
  },
  {
    id: 'pool_nvme_pve',
    name: 'local-nvme (PVE Boot & VMs)',
    path: '/dev/nvme0n1',
    type: 'NVMe Pool',
    host: 'pve (10.10.10.2)',
    totalTB: 2.0,
    usedTB: 0.82,
    health: 'ONLINE',
    arcHitRatioPercent: 99.1,
    drivesCount: 1,
    driveTempsAvgC: 41,
    lastScrubDate: '2026-07-15',
    smartStatus: 'ALL_PASSED'
  },
  {
    id: 'pool_pvesense',
    name: 'local-ssd (Futro Node 2)',
    path: '/dev/sda',
    type: 'Ext4',
    host: 'pvesense (10.10.10.3)',
    totalTB: 0.256,
    usedTB: 0.048,
    health: 'ONLINE',
    arcHitRatioPercent: 98.4,
    drivesCount: 1,
    driveTempsAvgC: 32,
    lastScrubDate: 'N/A',
    smartStatus: 'ALL_PASSED'
  }
];

export const INITIAL_HEALTH_ALERTS: HealthAlert[] = [
  {
    id: 'alert_1',
    title: 'ZFS Scrub Completed',
    source: 'TrueNAS Core (truenas)',
    severity: 'info',
    timestamp: '2 hours ago',
    message: 'Scrub of pool /mnt/tank finished with 0 checksum errors across 6 drives.',
    acknowledged: false
  },
  {
    id: 'alert_2',
    title: 'SSL Certificate Renewal Notice',
    source: 'Nginx Proxy Manager',
    severity: 'warning',
    timestamp: '5 hours ago',
    message: 'Let\'s Encrypt certificate for *.srv.homelab expiring in 12 days. Auto-renew queued.',
    acknowledged: false
  },
  {
    id: 'alert_3',
    title: 'PPPoE Bandwidth Spike',
    source: 'pfSense Gateway',
    severity: 'info',
    timestamp: '12 mins ago',
    message: 'WAN throughput hit 890 Mbps down during qBittorrent active ISO download.',
    acknowledged: false
  }
];

export const HOMELAB_VLANS: VLANNetwork[] = [
  {
    id: 'lan_core',
    vlanId: 'LAN',
    name: 'Native LAN (Core Infra)',
    code: 'LAN',
    subnet: '192.168.10.0/24',
    gateway: '192.168.10.1',
    description: 'Core physical hardware, network switches, and Omada access points.',
    hosts: [
      { name: 'pfSense Gateway', ip: '192.168.10.1', type: 'hypervisor', description: 'Primary Firewall & PPPoE Router' },
      { name: 'Omada Controller (omada)', ip: '192.168.10.5', type: 'vm', description: 'SDN Controller' },
      { name: 'eap650-d (Ceiling AP)', ip: '192.168.10.20', type: 'ap', description: 'AX3000 Wi-Fi 6 Access Point' },
      { name: 'eap653-1 (Wall AP)', ip: '192.168.10.21', type: 'ap', description: 'AX3000 Compact Access Point' },
      { name: 'sg608e (Managed Switch 1)', ip: '192.168.10.10', type: 'switch', description: '8-Port Gigabit Smart Switch' },
      { name: 'es208g (Managed Switch 2)', ip: '192.168.10.11', type: 'switch', description: '8-Port Managed Switch' }
    ]
  },
  {
    id: 'vlan_10',
    vlanId: 10,
    name: 'Management Network',
    code: 'MGT',
    subnet: '10.10.10.0/24',
    gateway: '10.10.10.1',
    description: 'Hypervisor management interfaces, proxy routing, and Pulse monitoring.',
    hosts: [
      { name: 'pve (Proxmox Node 1)', ip: '10.10.10.2', type: 'hypervisor', description: 'Intel Hardware App & Storage Host' },
      { name: 'pvesense (Proxmox Node 2)', ip: '10.10.10.3', type: 'hypervisor', description: 'Futro Hardware Host for pfSense' },
      { name: 'Nginx Proxy Manager (npm)', ip: '10.10.10.5', type: 'container', description: 'Reverse Proxy & SSL Manager' },
      { name: 'Pulse (pulse)', ip: '10.10.10.15', type: 'container', description: 'Active Network Monitoring' }
    ]
  },
  {
    id: 'vlan_20',
    vlanId: 20,
    name: 'Services & Storage',
    code: 'SRV',
    subnet: '10.10.20.0/24',
    gateway: '10.10.20.1',
    description: 'Storage pools, media stack, automation apps, and Home Assistant.',
    hosts: [
      { name: 'TrueNAS Core (truenas)', ip: '10.10.20.2', type: 'vm', description: 'ZFS Storage Appliance' },
      { name: 'Home Assistant (hass)', ip: '10.10.20.10', type: 'container', description: 'Home Automation Engine' },
      { name: 'Jellyfin (jfin)', ip: '10.10.20.20', type: 'container', description: 'Media Server' },
      { name: 'Seer (jellyseerr)', ip: '10.10.20.21', type: 'container', description: 'Media Requests' },
      { name: 'Radarr', ip: '10.10.20.22', type: 'container', description: 'Movie Arr Stack' },
      { name: 'Sonarr', ip: '10.10.20.23', type: 'container', description: 'TV Arr Stack' },
      { name: 'Jackett', ip: '10.10.20.25', type: 'container', description: 'Torrent Indexer' },
      { name: 'qBittorrent (qbit)', ip: '10.10.20.26', type: 'container', description: 'Download Manager' },
      { name: 'Arr Portainer', ip: '10.10.20.15', type: 'container', description: 'Docker Stack Manager' },
      { name: 'Dev Environment (dev)', ip: '10.10.20.18', type: 'container', description: 'Development Workspace' },
      { name: 'Dashy', ip: '10.10.20.12', type: 'container', description: 'Dashboard Mirror' }
    ]
  },
  {
    id: 'vlan_30',
    vlanId: 30,
    name: 'Trusted Devices',
    code: 'TRS',
    subnet: '10.10.30.0/24',
    gateway: '10.10.30.1',
    description: 'Personal workstations, media clients, and personal mobile hardware.',
    hosts: [
      { name: 'FDR Desktop (sknt009)', ip: '10.10.30.15', type: 'client', description: 'Primary Workstation' },
      { name: 'sknt-t730', ip: '10.10.30.22', type: 'client', description: 'Living Room Media PC' },
      { name: 'LG WebOS TV', ip: '10.10.30.45', type: 'client', description: 'Home Cinema TV' },
      { name: 'iPhones & iPad', ip: '10.10.30.50-55', type: 'client', description: 'Personal Mobile Devices' },
      { name: 'Note 9 Phone', ip: '10.10.30.60', type: 'client', description: 'Secondary Mobile Client' }
    ]
  },
  {
    id: 'vlan_40',
    vlanId: 40,
    name: 'Guest & Work Isolation',
    code: 'GST',
    subnet: '10.10.40.0/24',
    gateway: '10.10.40.1',
    description: 'Isolated environment for corporate laptops and untrusted guest devices.',
    hosts: [
      { name: 'FDR Work (uk-l2rmszh3)', ip: '10.10.40.10', type: 'client', description: 'Isolated Corporate Laptop 1' },
      { name: 'Mojo Work (DESKTOP-S4PNTA7)', ip: '10.10.40.12', type: 'client', description: 'Isolated Corporate Laptop 2' }
    ]
  },
  {
    id: 'vlan_50',
    vlanId: 50,
    name: 'Smart Home IoT',
    code: 'IOT',
    subnet: '10.10.50.0/24',
    gateway: '10.10.50.1',
    description: 'Smart lighting switches, Tado heating, displays, and smart meters.',
    hosts: [
      { name: 'Smart Lighting Hub', ip: '10.10.50.10-30', type: 'iot', description: 'Living room, Studio, Loft, Desk lights' },
      { name: 'Tado Heating Thermostat', ip: '10.10.50.35', type: 'iot', description: 'Smart Thermostat Controller' },
      { name: 'OVO Smart Meter', ip: '10.10.50.38', type: 'iot', description: 'Utility Energy Monitor' },
      { name: 'Epson ET-2720 Printer', ip: '10.10.50.40', type: 'iot', description: 'EcoTank Wireless Printer' },
      { name: 'Lenovo M10 Kitchen Display', ip: '10.10.50.50', type: 'iot', description: 'Wall-mounted Home Dashboard' },
      { name: 'Google Home Mini', ip: '10.10.50.60', type: 'iot', description: 'Voice Assistant Appliance' }
    ]
  },
  {
    id: 'vlan_60',
    vlanId: 60,
    name: 'WireGuard VPN Network',
    code: 'WG_LAN',
    subnet: '10.10.60.0/24',
    gateway: '10.10.60.1',
    description: 'Encrypted tunnel VLAN interface routing remote endpoints.',
    hosts: [
      { name: 'sknt009 Remote Tunnel', ip: '10.10.60.5', type: 'client', description: 'Mobile WireGuard Connection' },
      { name: 'Corporate Secure Link', ip: '10.10.60.10', type: 'client', description: 'Encrypted VPN Session' }
    ]
  }
];

export const INITIAL_SYSTEM_TELEMETRY: SystemMetricPoint[] = [
  { time: '12:00', pveCpu: 18, pveRam: 42, pvesenseCpu: 6, pvesenseRam: 28, wanRxMbps: 120, wanTxMbps: 15 },
  { time: '12:05', pveCpu: 22, pveRam: 43, pvesenseCpu: 8, pvesenseRam: 28, wanRxMbps: 340, wanTxMbps: 22 },
  { time: '12:10', pveCpu: 35, pveRam: 45, pvesenseCpu: 12, pvesenseRam: 29, wanRxMbps: 780, wanTxMbps: 45 },
  { time: '12:15', pveCpu: 28, pveRam: 44, pvesenseCpu: 9, pvesenseRam: 28, wanRxMbps: 510, wanTxMbps: 30 },
  { time: '12:20', pveCpu: 19, pveRam: 43, pvesenseCpu: 7, pvesenseRam: 28, wanRxMbps: 180, wanTxMbps: 18 },
  { time: '12:25', pveCpu: 24, pveRam: 43, pvesenseCpu: 8, pvesenseRam: 28, wanRxMbps: 260, wanTxMbps: 24 },
  { time: '12:30', pveCpu: 21, pveRam: 43, pvesenseCpu: 7, pvesenseRam: 28, wanRxMbps: 195, wanTxMbps: 19 }
];

export const INITIAL_JELLYFIN_STREAMS: ActiveStream[] = [
  {
    id: 'str_1',
    user: 'FDR Workstation',
    mediaTitle: 'Dune: Part Two (2024)',
    type: 'Movie',
    quality: '4K HDR (Direct Play)',
    progressPercent: 68
  },
  {
    id: 'str_2',
    user: 'Lenovo Kitchen Display',
    mediaTitle: 'Severance S02E01',
    type: 'Series',
    quality: '1080p -> 720p 4Mbps',
    transcodeReason: 'Bandwidth Limit',
    progressPercent: 32
  }
];

export const INITIAL_TORRENTS: ActiveTorrent[] = [
  {
    id: 'tor_1',
    name: 'Ubuntu-24.04.1-LTS-desktop-amd64.iso',
    sizeGB: 5.8,
    progressPercent: 88,
    downloadSpeedMBs: 14.2,
    uploadSpeedMBs: 2.1,
    eta: '1m 20s',
    category: 'manual',
    status: 'downloading'
  },
  {
    id: 'tor_2',
    name: 'The.Bear.S03.1080p.Web-DL.x265',
    sizeGB: 18.4,
    progressPercent: 100,
    downloadSpeedMBs: 0.0,
    uploadSpeedMBs: 4.8,
    eta: 'Seeding',
    category: 'sonarr',
    status: 'seeding'
  }
];

export const INITIAL_SMART_DEVICES: SmartHomeDevice[] = [
  { id: 'dev_lr_lamp', name: 'Living Room Floor Lamp', room: 'Living Room', type: 'light', state: true },
  { id: 'dev_tv_backlight', name: 'TV Backlight LED', room: 'Living Room', type: 'light', state: true },
  { id: 'dev_desk_lamp', name: 'Office Desk Lamp', room: 'Office', type: 'light', state: false },
  { id: 'dev_studio_light', name: 'Studio Softbox Light', room: 'Studio', type: 'light', state: true },
  { id: 'dev_tado_temp', name: 'Tado Thermostat Target', room: 'Climate', type: 'thermostat', state: 20.5, unit: '°C' },
  { id: 'dev_ovo_meter', name: 'Current Power Consumption', room: 'Utilities', type: 'sensor', state: 420, unit: 'W' }
];
