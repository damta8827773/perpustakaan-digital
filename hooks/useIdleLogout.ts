import { useEffect } from "react";

// Logout otomatis ketika pengguna tidak aktif selama durasi tertentu.
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
