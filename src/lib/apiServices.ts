import { ApiIntegrationsConfig, SmartHomeDevice, ActiveStream, ActiveTorrent, HomelabService } from '../types';

/**
 * Perform a real HTTP ping check to a service URL.
 * Uses fetch with no-cors or standard fetch with a timeout.
 */
export async function pingService(service: HomelabService): Promise<{ status: 'online' | 'offline'; latencyMs: number }> {
  const startTime = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    // Attempt real HTTP fetch
    await fetch(service.url, {
      method: 'GET',
      mode: 'no-cors', // Avoid CORS block for simple availability ping
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    const latencyMs = Math.max(1, Math.round(performance.now() - startTime));
    return { status: 'online', latencyMs };
  } catch (err) {
    clearTimeout(timeoutId);
    // Fallback: If fetch failed due to CORS or network error, test image/favicon or mark offline if aborted
    if (err instanceof Error && err.name === 'AbortError') {
      return { status: 'offline', latencyMs: 0 };
    }
    
    // For many local HTTP services without CORS headers, no-cors still resolves opaque response (status online)
    // If it threw network error (e.g. refused connection), mark offline
    return { status: 'offline', latencyMs: 0 };
  }
}

/**
 * Fetch live Home Assistant entity states
 */
export async function fetchHomeAssistantEntities(config: ApiIntegrationsConfig): Promise<SmartHomeDevice[] | null> {
  if (!config.homeAssistantUrl || !config.homeAssistantToken) return null;

  try {
    const url = `${config.homeAssistantUrl.replace(/\/$/, '')}/api/states`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.homeAssistantToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return null;
    const states = await res.json();

    if (!Array.isArray(states)) return null;

    // Filter relevant entities (light, switch, climate, sensor)
    const devices: SmartHomeDevice[] = states
      .filter((e: any) => 
        e.entity_id.startsWith('light.') || 
        e.entity_id.startsWith('switch.') || 
        e.entity_id.startsWith('climate.') ||
        e.entity_id.startsWith('sensor.')
      )
      .slice(0, 15)
      .map((e: any) => ({
        id: e.entity_id,
        name: e.attributes.friendly_name || e.entity_id,
        room: e.attributes.area_id || 'Home Assistant',
        type: e.entity_id.startsWith('light') ? 'light' : 
              e.entity_id.startsWith('climate') ? 'thermostat' :
              e.entity_id.startsWith('sensor') ? 'sensor' : 'plug',
        state: e.state === 'on' ? true : e.state === 'off' ? false : e.state,
        unit: e.attributes.unit_of_measurement
      }));

    return devices;
  } catch (e) {
    console.warn('Home Assistant API fetch error:', e);
    return null;
  }
}

/**
 * Fetch live Jellyfin streaming sessions
 */
export async function fetchJellyfinSessions(config: ApiIntegrationsConfig): Promise<ActiveStream[] | null> {
  if (!config.jellyfinUrl || !config.jellyfinApiKey) return null;

  try {
    const baseUrl = config.jellyfinUrl.replace(/\/$/, '');
    const url = `${baseUrl}/Sessions?api_key=${config.jellyfinApiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!Array.isArray(data)) return null;

    const streams: ActiveStream[] = data
      .filter((s: any) => s.NowPlayingItem)
      .map((s: any, idx: number) => {
        const item = s.NowPlayingItem;
        const ticks = s.PlayState?.PositionTicks || 0;
        const totalTicks = item.RunTimeTicks || 1;
        const progress = Math.min(100, Math.round((ticks / totalTicks) * 100));

        return {
          id: s.Id || `jfin_${idx}`,
          user: s.UserName || s.DeviceName || 'Unknown User',
          mediaTitle: item.SeriesName ? `${item.SeriesName} - ${item.Name}` : item.Name,
          type: item.Type === 'Episode' ? 'Series' : 'Movie',
          quality: s.TranscodingInfo ? `Transcoding (${s.TranscodingInfo.VideoCodec})` : 'Direct Play',
          transcodeReason: s.TranscodingInfo?.TranscodeReasons?.join(', '),
          progressPercent: progress
        };
      });

    return streams;
  } catch (e) {
    console.warn('Jellyfin API fetch error:', e);
    return null;
  }
}

/**
 * Fetch live qBittorrent active downloads
 */
export async function fetchQbitTorrents(config: ApiIntegrationsConfig): Promise<ActiveTorrent[] | null> {
  if (!config.qbitUrl) return null;

  try {
    const baseUrl = config.qbitUrl.replace(/\/$/, '');
    const url = `${baseUrl}/api/v2/torrents/info?filter=all`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();

    if (!Array.isArray(data)) return null;

    const torrents: ActiveTorrent[] = data.slice(0, 10).map((t: any) => ({
      id: t.hash || t.name,
      name: t.name,
      sizeGB: parseFloat((t.size / (1024 * 1024 * 1024)).toFixed(1)),
      progressPercent: Math.round(t.progress * 100),
      downloadSpeedMBs: parseFloat((t.dlspeed / (1024 * 1024)).toFixed(1)),
      uploadSpeedMBs: parseFloat((t.upspeed / (1024 * 1024)).toFixed(1)),
      eta: t.eta > 864000 ? '∞' : `${Math.round(t.eta / 60)}m`,
      category: t.category?.toLowerCase().includes('sonarr') ? 'sonarr' :
                t.category?.toLowerCase().includes('radarr') ? 'radarr' : 'manual',
      status: t.state.includes('downloading') ? 'downloading' :
              t.state.includes('uploading') || t.state.includes('stalledUP') ? 'seeding' : 'paused'
    }));

    return torrents;
  } catch (e) {
    console.warn('qBittorrent API fetch error:', e);
    return null;
  }
}
