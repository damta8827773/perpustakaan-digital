// Lapisan keamanan sisi klien: validasi input, pembatasan percobaan login,
// dan logout otomatis saat sesi menganggur.
import { useEffect } from "react";

// ---------- Validasi input ----------

export const isValidNim = (nim: string) => /^[0-9]{8,14}$/.test(nim.trim());
export const isValidUsername = (u: string) => /^[a-zA-Z0-9_.-]{3,32}$/.test(u.trim());
export const isValidPassword = (pw: string) => pw.length >= 8 && pw.length <= 128;

// ---------- Pembatasan percobaan login (anti brute-force) ----------

const ATTEMPT_KEY = "perpus.login.failures";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60_000; // jendela hitung kegagalan: 10 menit
const LOCK_MS = 5 * 60_000; // durasi kunci: 5 menit

function readFailures(): number[] {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

/** Sisa detik terkunci; 0 jika boleh mencoba login. */
export function loginLockSeconds(): number {
  const now = Date.now();
  const recent = readFailures().filter((t) => now - t < WINDOW_MS);
  if (recent.length < MAX_ATTEMPTS) return 0;
  const lockedUntil = Math.max(...recent) + LOCK_MS;
  return Math.max(0, Math.ceil((lockedUntil - now) / 1000));
}

export function recordLoginFailure(): void {
  const now = Date.now();
  const recent = readFailures().filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(recent));
}

export function clearLoginFailures(): void {
  sessionStorage.removeItem(ATTEMPT_KEY);
}

// ---------- Logout otomatis saat idle ----------

const IDLE_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

export function useIdleLogout(onIdle: () => void, timeoutMs = 15 * 60_000): void {
  useEffect(() => {
    let timer = window.setTimeout(onIdle, timeoutMs);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onIdle, timeoutMs);
    };
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [onIdle, timeoutMs]);
}
