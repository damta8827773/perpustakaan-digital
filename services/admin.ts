// Kontrol akses admin: HANYA email dalam allowlist yang boleh masuk ke panel
// admin. Semua email lain diblokir.
import { signOut } from "firebase/auth";
import { auth } from "@/common/libs/firebase";
import { signInWithGooglePopup } from "@/services/googleAuth";
import { ensureUserDoc } from "@/services/userDoc";

// Daftar email yang memiliki akses admin. Diisi dari environment variable
// (VITE_ADMIN_EMAILS, dipisah koma) agar email asli tidak tersimpan di
// repository. Nilai contoh dipakai bila belum diatur.
export const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAILS ?? "admin@perpusdigital.web.id"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const DEMO = import.meta.env.VITE_DEMO === "1";
const KEY = "perpus.admin.session";

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export function currentAdminEmail(): string | null {
  return localStorage.getItem(KEY);
}

/** True hanya jika sesi admin aktif DAN emailnya termasuk allowlist. */
export function isAdminAuthed(): boolean {
  const email = currentAdminEmail();
  return !!email && isAdminEmail(email);
}

/**
 * Tandai sesi admin aktif di localStorage (dibaca oleh Guard need="admin" di
 * app/App.tsx). Diekspor supaya bisa dipanggil dari jalur login mana pun yang
 * berhasil mengonfirmasi role admin - bukan cuma dari halaman /admin/login.
 */
export function setAdminSession(email: string): void {
  localStorage.setItem(KEY, email.trim().toLowerCase());
}

export function clearAdminSession(): void {
  localStorage.removeItem(KEY);
  if (!DEMO) void signOut(auth).catch(() => {});
}

/**
 * Login admin memakai akun Google (Firebase). Popup Google yang sama dipakai
 * di halaman mahasiswa (lihat services/accounts.ts::loginWithGoogle) supaya
 * cuma ada SATU jalur pengecekan allowlist admin, bukan dua yang bisa beda
 * hasil. Hanya akun Google dengan email dalam allowlist yang diterima.
 *
 * Pada mode demo (provider Google belum aktif), alur popup tidak tersedia,
 * sehingga sesi admin dibuat sebagai email allowlist untuk keperluan pratinjau.
 */
export async function loginAdminWithGoogle(): Promise<void> {
  const identity = await signInWithGooglePopup({
    uid: "demo-admin-user",
    email: ADMIN_EMAILS[0],
    name: "Admin Demo",
  });
  const userDoc = await ensureUserDoc(identity);

  if (userDoc.role !== "admin") {
    if (!DEMO) await signOut(auth).catch(() => {});
    throw new Error("Akun Google ini tidak memiliki akses admin.");
  }

  setAdminSession(identity.email);
}
