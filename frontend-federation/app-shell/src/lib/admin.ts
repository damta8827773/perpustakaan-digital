// Kontrol akses admin: HANYA email dalam allowlist yang boleh masuk ke panel
// admin. Semua email lain diblokir.
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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
 * Login admin. Menolak email di luar allowlist. Pada produksi memverifikasi
 * kata sandi lewat Firebase; pada mode demo cukup email yang diizinkan.
 */
export async function loginAdmin(email: string, password: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!isAdminEmail(clean)) {
    throw new Error("Email ini tidak memiliki akses admin.");
  }

  if (!DEMO) {
    try {
      await signInWithEmailAndPassword(auth, clean, password);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      // Bila provider belum aktif, lanjut dengan sesi lokal.
      if (code !== "auth/operation-not-allowed") {
        throw new Error("Email atau kata sandi admin salah.");
      }
    }
  }

  localStorage.setItem(KEY, clean);
}
