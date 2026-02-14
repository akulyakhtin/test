export type TikaMetadata = Record<string, any>;

export type NormalizedMp3Metadata = {
  name?: string;
  artist?: string;
  album?: string;
  duration?: string; 
  year?: string;     
};

// pick first non-empty value from many possible keys
function pick(meta: Record<string, any>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = meta[k];
    if (v === undefined || v === null) continue;

    // Tika sometimes returns arrays
    const s = Array.isArray(v) ? String(v[0] ?? '') : String(v);
    const trimmed = s.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function formatDurationSeconds(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// Try to parse duration from various Tika values:
// - "179.2" (seconds)
// - "PT2M59S" (ISO 8601)
// - "00:02:59" / "2:59"
function normalizeDuration(raw?: string): string | undefined {
  if (!raw) return undefined;

  // ISO 8601 PT#H#M#S
  const iso = raw.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i);
  if (iso) {
    const h = Number(iso[1] ?? 0);
    const m = Number(iso[2] ?? 0);
    const s = Number(iso[3] ?? 0);
    const total = h * 3600 + m * 60 + s;
    return formatDurationSeconds(total);
  }

  // "hh:mm:ss" or "mm:ss"
  const colon = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colon) {
    const a = Number(colon[1]);
    const b = Number(colon[2]);
    const c = colon[3] ? Number(colon[3]) : undefined;
    const total = c !== undefined ? a * 3600 + b * 60 + c : a * 60 + b;
    return formatDurationSeconds(total);
  }

  // seconds as number string
  const num = Number(raw);
  if (Number.isFinite(num) && num > 0) {
    return formatDurationSeconds(num);
  }

  return undefined;
}

function normalizeYear(raw?: string): string | undefined {
  if (!raw) return undefined;

  // "1977", "1977-01-01", "1977-05-12T..."
  const m = raw.match(/(19\d{2}|20\d{2})/);
  return m ? m[1] : undefined;
}

export function normalizeFromTika(meta: Record<string, any>): NormalizedMp3Metadata {
  const name = pick(meta, [
    'title',
    'dc:title',
    'xmpDM:title',
    'meta:title',
    'TIT2',                  
    'ID3:Title',            
  ]);

  const artist = pick(meta, [
    'xmpDM:artist',
    'artist',
    'dc:creator',
    'meta:author',
    'ID3:Artist',
    'TPE1',
  ]);

  const album = pick(meta, [
    'xmpDM:album',
    'album',
    'ID3:Album',
    'TALB',
  ]);

  const durationRaw = pick(meta, [
    'xmpDM:duration',
    'duration',
    'tika:duration',
  ]);

  const yearRaw = pick(meta, [
    'xmpDM:releaseDate',
    'meta:creation-date',
    'dcterms:created',
    'Creation-Date',
    'date',
    'xmp:CreateDate',
    'xmpDM:releaseDate', 
    'TYER',
    'TDRC',
    'ID3:Year',
  ]);

  return {
    name,
    artist,
    album,
    duration: normalizeDuration(durationRaw),
    year: normalizeYear(yearRaw),
  };
}