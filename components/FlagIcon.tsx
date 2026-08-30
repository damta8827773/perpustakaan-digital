import type { Locale } from "@/i18n";

// SVG asli, bukan emoji bendera Unicode - emoji bendera sering tampil sebagai
// kode huruf polos (mis. "ID", "GB") di Windows karena keterbatasan font
// bawaan, bukan gambar bendera berwarna. SVG tampil konsisten di semua OS.
//
// Bahasa Arab diwakili bendera Uni Emirat Arab (bukan Arab Saudi) supaya
// tidak perlu mereproduksi kaligrafi Syahadat pada bendera Arab Saudi di
// ikon kecil - berisiko salah/tidak hormat kalau digambar tidak presisi.
export function FlagIcon({ locale, className = "h-4 w-6" }: { locale: Locale; className?: string }) {
  const common = `overflow-hidden rounded-[2px] ${className}`;

  if (locale === "id") {
    return (
      <svg viewBox="0 0 3 2" className={common} aria-hidden>
        <rect width="3" height="1" fill="#DC2626" />
        <rect y="1" width="3" height="1" fill="#FFFFFF" />
      </svg>
    );
  }

  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 36" className={common} aria-hidden>
        <rect width="60" height="36" fill="#00247D" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#CF142B" strokeWidth="3" />
        <path d="M30,0 V36 M0,18 H60" stroke="#FFFFFF" strokeWidth="12" />
        <path d="M30,0 V36 M0,18 H60" stroke="#CF142B" strokeWidth="7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 3 2" className={common} aria-hidden>
      <rect x="1" width="2" height="0.6667" fill="#00732F" />
      <rect x="1" y="0.6667" width="2" height="0.6667" fill="#FFFFFF" />
      <rect x="1" y="1.3333" width="2" height="0.6667" fill="#000000" />
      <rect width="1" height="2" fill="#EF3340" />
    </svg>
  );
}
