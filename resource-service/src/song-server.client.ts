import { NormalizedMp3Metadata } from './tika-helper';

export class SongServerClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.SONG_SERVER_URL || 'http://localhost:3001';
  }

  async createSong(metadata: NormalizedMp3Metadata): Promise<void> {
    const res = await fetch(`${this.baseUrl}/songs`, {
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
    const url = `${this.baseUrl}/songs?id=${encodeURIComponent(resourceId)}`;

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
