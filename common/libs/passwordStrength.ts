// Penilaian kekuatan kata sandi sisi klien (heuristik sederhana, bukan
// pengganti isValidPassword di security.ts yang tetap jadi aturan minimum).

export type StrengthTier = 0 | 1 | 2;

export const STRENGTH_LABEL: Record<StrengthTier, string> = {
  0: "Lemah",
  1: "Sedang",
  2: "Kuat",
};

// Warna mengikuti token desain yang sudah ada (bukan warna baru).
export const STRENGTH_COLOR_VAR: Record<StrengthTier, string> = {
  0: "var(--color-destructive)",
  1: "var(--color-warning)",
  2: "var(--color-success)",
};

/** null = input masih kosong -> jangan tampilkan indikator sama sekali. */
export function scorePassword(pw: string): StrengthTier | null {
  if (!pw) return null;
  let points = 0;
  if (pw.length >= 8) points++;
  if (pw.length >= 12) points++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) points++;
  if (/[0-9]/.test(pw)) points++;
  if (/[^A-Za-z0-9]/.test(pw)) points++;
  if (points <= 1) return 0;
  if (points <= 3) return 1;
  return 2;
}
