// Konfigurasi internasionalisasi (i18n) sederhana. Pesan disimpan pada folder
// messages/ per bahasa. Bahasa default mengikuti METADATA.locale.
import id from "@/messages/id.json";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export type Locale = "id" | "en" | "ar";

export const LOCALES: Locale[] = ["id", "en", "ar"];
export const DEFAULT_LOCALE: Locale = "id";

// Bendera bahasa dirender lewat komponen <FlagIcon locale=.../> (SVG asli,
// bukan emoji) - lihat components/FlagIcon.tsx untuk alasannya.
export const LOCALE_META: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  id: { label: "Indonesia", dir: "ltr" },
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
};

const DICTIONARIES: Record<Locale, Record<string, string>> = { id, en, ar };

// Menerjemahkan sebuah kunci pesan ke bahasa terpilih.
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return DICTIONARIES[locale]?.[key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
}
