// Nada halus (Web Audio, tanpa file audio) yang dibunyikan saat tingkat
// kekuatan kata sandi berubah. Sengaja sangat pendek & pelan ("ga norak"):
// ~140ms, volume puncak ~5%. AudioContext baru dibuat saat dipakai pertama
// kali (dipicu dari keystroke) supaya memenuhi syarat "user gesture" browser.
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

const TIER_FREQUENCY_HZ: Record<number, number> = { 0: 220, 1: 330, 2: 494 };

export function playStrengthTone(tier: number): void {
  const audio = getContext();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sine";
  osc.frequency.value = TIER_FREQUENCY_HZ[tier] ?? 330;
  const now = audio.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}
