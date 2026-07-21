export type ServiceCategory = 
  | 'end_user' 
  | 'management' 
  | 'arr_stack' 
  | 'monitoring' 
  | 'networking';

export type ServiceStatus = 'online' | 'degraded' | 'offline' | 'checking';

export interface HomelabService {
  id: string;
  name: string;
  category: ServiceCategory;
  url: string;
  ip: string;
  port?: number;
  vlan: string;
  iconName: string;
  description: string;
  status: ServiceStatus;
  latencyMs?: number;
  isFavorite?: boolean;
  tags: string[];
  pinned?: boolean;
  accentColor?: string;
}

export interface StoragePool {
  id: string;
  name: string;
  path: string;
  type: 'ZFS RaidZ2' | 'ZFS Mirror' | 'NVMe Pool' | 'Ext4';
  host: string;
  totalTB: number;
  usedTB: number;
  health: 'ONLINE' | 'DEGRADED' | 'SCRUBBING' | 'FAULTED';
  arcHitRatioPercent: number;
  drivesCount: number;
  driveTempsAvgC: number;
  lastScrubDate: string;
  smartStatus: 'ALL_PASSED' | 'WARNING' | 'FAILED';
}

export interface HealthAlert {
  id: string;
  title: string;
  source: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  message: string;
  acknowledged: boolean;
  actionUrl?: string;
}

export interface VLANNetwork {
  id: string;
  vlanId: number | 'LAN';
  name: string;
  code: string;
  subnet: string;
  gateway: string;
  description: string;
  hosts: {
    name: string;
    ip: string;
    type: 'hypervisor' | 'vm' | 'container' | 'switch' | 'ap' | 'client' | 'iot';
    description: string;
    mac?: string;
    status?: 'online' | 'offline';
  }[];
}

export interface SystemMetricPoint {
  time: string;
  pveCpu: number;
  pveRam: number;
  pvesenseCpu: number;
  pvesenseRam: number;
  wanRxMbps: number;
  wanTxMbps: number;
}

export interface ActiveStream {
  id: string;
  user: string;
  mediaTitle: string;
  type: 'Movie' | 'Series';
  quality: string;
  transcodeReason?: string;
  progressPercent: number;
}

export interface ActiveTorrent {
  id: string;
  name: string;
  sizeGB: number;
  progressPercent: number;
  downloadSpeedMBs: number;
  uploadSpeedMBs: number;
  eta: string;
  category: 'radarr' | 'sonarr' | 'manual';
  status: 'downloading' | 'seeding' | 'paused';
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  room: string;
  type: 'light' | 'thermostat' | 'sensor' | 'plug';
  state: boolean | number | string;
  unit?: string;
}

export interface DashboardSettings {
  themeAccent: 'emerald' | 'sapphire' | 'violet' | 'amber' | 'cyan';
  layoutDensity: 'comfortable' | 'compact';
  autoPingIntervalSeconds: number;
  openLinksInNewTab: boolean;
  defaultSearchEngine: 'google' | 'duckduckgo' | 'searxng' | 'internal_only';
  customDomainPrefix: string;
}
