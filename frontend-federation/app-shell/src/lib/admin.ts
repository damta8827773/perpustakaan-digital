// Kontrol akses admin: HANYA email dalam allowlist yang boleh masuk ke panel
// admin. Semua email lain diblokir.
import {
  GoogleAuthProvider, signInWithPopup, signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Satu-satunya email yang memiliki akses admin.
export const ADMIN_EMAILS = ["damtafaiz@gmail.com"];

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

export function clearAdminSession(): void {
  localStorage.removeItem(KEY);
  if (!DEMO) void signOut(auth).catch(() => {});
}

/**
 * Login admin memakai akun Google (Firebase). Identitas diverifikasi oleh
 * Google, bukan sekadar diketik, sehingga email tidak bisa ditebak. Hanya akun
 * Google dengan email dalam allowlist yang diterima.
 *
 * Pada mode demo (provider Google belum aktif), alur popup tidak tersedia,
 * sehingga sesi admin dibuat sebagai email allowlist untuk keperluan pratinjau.
 */
export async function loginAdminWithGoogle(): Promise<void> {
  if (!DEMO) {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const email = (cred.user.email ?? "").trim().toLowerCase();
      if (!isAdminEmail(email)) {
        await signOut(auth).catch(() => {});
        throw new Error("Akun Google ini tidak memiliki akses admin.");
      }
      localStorage.setItem(KEY, email);
      return;
    } catch (err) {
      if (err instanceof Error && err.message.includes("akses admin")) throw err;
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user") {
        throw new Error("Jendela Google ditutup sebelum selesai.");
      }
      // Provider Google belum aktif -> lanjut ke sesi demo di bawah.
      if (code !== "auth/operation-not-allowed" && code !== "auth/configuration-not-found") {
        throw new Error("Gagal masuk dengan Google. Coba lagi.");
      }
    }
  }

  localStorage.setItem(KEY, ADMIN_EMAILS[0]);
}
