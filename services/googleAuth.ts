// Satu jalur Google Sign-In untuk SELURUH app. Sebelumnya halaman mahasiswa
// dan halaman admin masing-masing punya signInWithPopup sendiri, sehingga
// email admin yang login lewat tombol Google di halaman mahasiswa tidak
// pernah dicek ke allowlist admin. Dengan satu fungsi ini, popup Google
// hanya dipanggil sekali dan hasilnya (identitas) dipakai kedua halaman
// untuk menentukan role lewat `ensureUserDoc`.
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/common/libs/firebase";
import type { BasicIdentity } from "@/services/userDoc";

const DEMO = import.meta.env.VITE_DEMO === "1";

/**
 * `demoIdentity` dipakai saat VITE_DEMO=1 ATAU provider Google belum
 * diaktifkan di Firebase Console - tiap halaman (mahasiswa/admin) memberi
 * identitas contoh sendiri karena role yang mau dipratinjau berbeda.
 */
export async function signInWithGooglePopup(demoIdentity: BasicIdentity): Promise<BasicIdentity> {
  if (!DEMO) {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const u = cred.user;
      return {
        uid: u.uid,
        email: (u.email ?? "").trim().toLowerCase(),
        name: u.displayName ?? "Pengguna Google",
        ...(u.photoURL ? { photoURL: u.photoURL } : {}),
      };
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user") {
        throw new Error("Jendela Google ditutup sebelum selesai.");
      }
      if (code !== "auth/operation-not-allowed" && code !== "auth/configuration-not-found") {
        throw new Error("Gagal masuk dengan Google. Coba lagi.");
      }
      // Provider Google belum aktif di Firebase Console -> pakai sesi demo.
    }
  }

  return demoIdentity;
}
