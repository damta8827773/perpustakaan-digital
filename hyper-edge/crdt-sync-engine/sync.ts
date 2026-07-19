// Sinkronisasi state real-time offline-first (gaya Yjs/Automerge). Bahasa: TypeScript.
export type Clock = Record<string, number>;

export function mergeClock(a: Clock, b: Clock): Clock {
  const out: Clock = { ...a };
  for (const [site, tick] of Object.entries(b)) {
    out[site] = Math.max(out[site] ?? 0, tick);
  }
  return out;
}
