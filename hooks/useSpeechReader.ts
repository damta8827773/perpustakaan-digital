import { useEffect, useRef, useState } from "react";

// Dengarkan teks bab lewat Web Speech API bawaan browser - tanpa server,
// tanpa API key, tanpa biaya. Berhenti otomatis kalau teksnya berganti
// (pindah bab) atau komponennya di-unmount.
export type SpeechStatus = "idle" | "speaking" | "paused";

export function useSpeechReader(text: string) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  function play() {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = rate;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setStatus("speaking");
  }

  function pause() {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }

  function resume() {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus("speaking");
  }

  // Berhenti otomatis saat teks berganti (pindah bab) atau unmount.
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [text, supported]);

  return { supported, status, rate, setRate, play, pause, resume, stop };
}
