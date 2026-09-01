import type { Locale } from "@/i18n";

// SVG asli, bukan emoji bendera Unicode - emoji bendera sering tampil sebagai
// kode huruf polos (mis. "ID", "GB") di Windows karena keterbatasan font
// bawaan, bukan gambar bendera berwarna. SVG tampil konsisten di semua OS.
//
// Bahasa Arab diwakili bendera Arab Saudi (bendera negara paling identik
// dengan Bahasa Arab). Teks Syahadat ditulis lewat elemen SVG <text> dengan
// karakter Unicode Arab asli - dirender oleh mesin font Arab milik browser
// sendiri (sama seperti label "العربية" yang sudah tampil benar di menu
// bahasa), BUKAN digambar ulang manual sebagai jalur vektor - jadi bentuk
// hurufnya tetap akurat meski ukurannya kecil.
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
    <svg viewBox="0 0 300 200" className={common} aria-hidden>
      <rect width="300" height="200" fill="#006C35" />
      <text
        x="150"
        y="95"
        textAnchor="middle"
        dominantBaseline="middle"
        direction="rtl"
        fontFamily="'Traditional Arabic','Arial Unicode MS',Tahoma,sans-serif"
        fontSize="24"
        textLength="230"
        lengthAdjust="spacingAndGlyphs"
        fill="#FFFFFF"
      >
        لا إله إلا الله محمد رسول الله
      </text>
      <g stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round">
        <line x1="85" y1="132" x2="205" y2="132" />
      </g>
      <path d="M85,132 L102,124 L102,140 Z" fill="#FFFFFF" />
    </svg>
  );
}
