import { NormalizedMp3Metadata } from './tika-helper';
import { getEurekaClient } from './eureka-client';

export class SongServerClient {
  private readonly fallbackUrl: string;

  constructor(baseUrl?: string) {
    this.fallbackUrl = baseUrl || process.env.SONG_SERVER_URL || 'http://localhost:3001';
  }

  private resolveBaseUrl(): string {
    const client = getEurekaClient();
    if (client) {
      try {
        const instances = client.getInstancesByAppId('SONG-SERVICE');
        if (instances?.length > 0) {
          const inst = instances[0];
          const host = inst.hostName;
          const port = (inst.port as { '$': number })['$'];
          return `http://${host}:${port}`;
        }
      } catch {
        // fall through to fallback
      }
    }
    return this.fallbackUrl;
  }

  async createSong(metadata: NormalizedMp3Metadata): Promise<void> {
    const res = await fetch(`${this.resolveBaseUrl()}/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`song-server POST /songs failed: ${res.status} ${res.statusText} ${text}`);
    }
  }

  async deleteById(resourceId: string): Promise<void> {
    const url = `${this.resolveBaseUrl()}/songs?id=${encodeURIComponent(resourceId)}`;

    const res = await fetch(url, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `song-server DELETE /songs?resourceId failed: ${res.status} ${res.statusText} ${text}`,
      );
    }
  }
}
