/**
 * Fast, non-decoding MP3 validation.
 *
 * Accepts:
 *  - ID3v2 header
 *  - MPEG audio frame sync
 *
 * Rejects:
 *  - random binary
 *  - WAV / OGG / MP4
 */
export function isLikelyMp3(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  // ─────────────────────────────────────────────
  // 1️⃣ ID3v2 header ("ID3")
  // ─────────────────────────────────────────────
  if (
    buffer[0] === 0x49 && // I
    buffer[1] === 0x44 && // D
    buffer[2] === 0x33    // 3
  ) {
    return true;
  }

  // ─────────────────────────────────────────────
  // 2️⃣ MPEG frame sync (0xFFE)
  // Look in the first 64 KB max
  // ─────────────────────────────────────────────
  const maxScan = Math.min(buffer.length - 1, 64 * 1024);

  for (let i = 0; i < maxScan; i++) {
    // Frame sync = 11 bits set: 0xFF E?
    if (
      buffer[i] === 0xff &&
      (buffer[i + 1] & 0xe0) === 0xe0
    ) {
      return true;
    }
  }

  return false;
}
