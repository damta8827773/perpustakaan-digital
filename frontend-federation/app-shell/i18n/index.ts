// Konfigurasi internasionalisasi (i18n) sederhana. Pesan disimpan pada folder
// messages/ per bahasa. Bahasa default mengikuti METADATA.locale.
import id from "@/messages/id.json";
import en from "@/messages/en.json";

export type Locale = "id" | "en";

export const LOCALES: Locale[] = ["id", "en"];
export const DEFAULT_LOCALE: Locale = "id";

const DICTIONARIES: Record<Locale, Record<string, string>> = { id, en };

// Menerjemahkan sebuah kunci pesan ke bahasa terpilih.
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  return DICTIONARIES[locale]?.[key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key;
}
