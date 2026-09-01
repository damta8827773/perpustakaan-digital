// Bahasa aktif aplikasi - persisten (localStorage) dan reaktif di semua
// komponen lewat useSyncExternalStore, menggantikan toggle "Bahasa" lama di
// Profil.tsx yang cuma useState lokal (makanya sebelumnya tidak benar-benar
// mengubah apa pun). Juga mengatur `dir="rtl"` otomatis untuk bahasa Arab.
import { useSyncExternalStore } from "react";
import { t as translate, DEFAULT_LOCALE, LOCALE_META, type Locale } from "@/i18n";

const KEY = "perpus.locale";
type Listener = () => void;
const listeners = new Set<Listener>();

function isLocale(v: string | null): v is Locale {
  return v === "id" || v === "en" || v === "ar";
}

function read(): Locale {
  try {
    const raw = localStorage.getItem(KEY);
    return isLocale(raw) ? raw : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function applyDocumentAttrs(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALE_META[locale].dir;
}

let cache: Locale = read();
applyDocumentAttrs(cache);

export function setLocale(locale: Locale): void {
  cache = locale;
  localStorage.setItem(KEY, locale);
  applyDocumentAttrs(locale);
  listeners.forEach((l) => l());
}

export function getLocale(): Locale {
  return cache;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale);
}

export type Translate = (key: string) => string;

/** Pintasan terjemahan yang otomatis ikut bahasa aktif saat ini. */
export function useTranslate(): Translate {
  const locale = useLocale();
  return (key: string) => translate(key, locale);
}
