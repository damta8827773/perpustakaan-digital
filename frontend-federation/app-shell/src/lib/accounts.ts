// Sistem akun khusus Perpustakaan Digital (pendaftaran mandiri + login email).
//
// Cara kerja: mendukung Firebase Authentication (email/password) untuk mode
// produksi, dengan cadangan penyimpanan lokal agar tetap berfungsi saat mode
// demo atau ketika provider Email/Password belum diaktifkan di Firebase.
//
// Profil lengkap (nama, NIM, prodi, fakultas, angkatan) disimpan lokal per
// email karena tidak semua proyek mengaktifkan Firestore. Saat Firestore siap,
// bagian penyimpanan profil dapat dipindahkan ke koleksi "members".
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const DEMO = import.meta.env.VITE_DEMO === "1";

export interface MemberProfile {
  name: string;
  nim: string;
  faculty: string;
  program: string;
  angkatan: string;
  email: string;
}

interface StoredAccount extends MemberProfile {
  password: string; // hanya untuk cadangan lokal mode demo
}

const KEY = "perpus.accounts";

function readAll(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: StoredAccount[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function firebaseAuthMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan masuk.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah (minimal 6 karakter).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau kata sandi salah.";
    default:
      return "";
  }
}

// ---------- Pendaftaran ----------

export async function registerAccount(
  data: MemberProfile,
  password: string,
): Promise<MemberProfile> {
  const email = data.email.trim().toLowerCase();
  const profile: MemberProfile = { ...data, email };
  const list = readAll();

  if (list.some((a) => a.email === email)) {
    throw new Error("Email sudah terdaftar. Silakan masuk.");
  }

  if (!DEMO) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: data.name });
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      // Bila provider belum diaktifkan, jatuh ke penyimpanan lokal.
      if (code !== "auth/operation-not-allowed") {
        const msg = firebaseAuthMessage(code);
        throw new Error(msg || "Gagal mendaftar. Coba lagi.");
      }
    }
  }

  writeAll([...list, { ...profile, password }]);
  return profile;
}

// ---------- Login dengan email ----------

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<MemberProfile> {
  const clean = email.trim().toLowerCase();

  if (!DEMO) {
    try {
      await signInWithEmailAndPassword(auth, clean, password);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code !== "auth/operation-not-allowed") {
        const msg = firebaseAuthMessage(code);
        throw new Error(msg || "Gagal masuk. Coba lagi.");
      }
    }
  }

  const account = readAll().find((a) => a.email === clean);
  if (!account || account.password !== password) {
    throw new Error("Email atau kata sandi salah, atau belum terdaftar.");
  }
  const { password: _pw, ...profile } = account;
  void _pw;
  return profile;
}

// ---------- Login email tanpa kata sandi ----------
// Sesuai permintaan: cukup memasukkan email yang sudah terdaftar untuk masuk,
// tanpa mengetik kata sandi lagi. (Untuk keamanan penuh di produksi, gunakan
// Email Link / passwordless sign-in Firebase agar tautan dikirim ke email.)

export async function loginWithEmailOnly(email: string): Promise<MemberProfile> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) throw new Error("Format email tidak valid.");
  const account = readAll().find((a) => a.email === clean);
  if (!account) {
    throw new Error("Email belum terdaftar. Silakan daftar terlebih dahulu.");
  }
  const { password: _pw, ...profile } = account;
  void _pw;
  return profile;
}

// ---------- Masuk dengan Google ----------

export async function loginWithGoogle(): Promise<MemberProfile> {
  if (!DEMO) {
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      const u = cred.user;
      const email = (u.email ?? "").trim().toLowerCase();
      const existing = readAll().find((a) => a.email === email);
      if (existing) {
        const { password: _pw, ...profile } = existing;
        void _pw;
        return profile;
      }
      const profile: MemberProfile = {
        name: u.displayName ?? "Pengguna Google",
        nim: "-",
        faculty: "UIN Jakarta",
        program: "Umum",
        angkatan: String(new Date().getFullYear()),
        email,
      };
      writeAll([...readAll(), { ...profile, password: "" }]);
      return profile;
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      // Provider Google belum diaktifkan -> pakai sesi demo di bawah.
      if (
        code !== "auth/operation-not-allowed" &&
        code !== "auth/configuration-not-found"
      ) {
        if (code === "auth/popup-closed-by-user") {
          throw new Error("Jendela Google ditutup sebelum selesai.");
        }
        throw new Error("Gagal masuk dengan Google. Coba lagi.");
      }
    }
  }

  // Mode demo / provider belum aktif: buat sesi Google contoh.
  const demo: MemberProfile = {
    name: "Pengguna Google",
    nim: "-",
    faculty: "UIN Jakarta",
    program: "Umum",
    angkatan: String(new Date().getFullYear()),
    email: "pengguna.google@gmail.com",
  };
  const list = readAll();
  if (!list.some((a) => a.email === demo.email)) {
    writeAll([...list, { ...demo, password: "" }]);
  }
  return demo;
}

// ---------- Lupa kata sandi ----------

export async function sendResetPassword(email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) throw new Error("Format email tidak valid.");

  if (!DEMO) {
    try {
      await sendPasswordResetEmail(auth, clean);
      return;
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code !== "auth/operation-not-allowed") {
        if (code === "auth/user-not-found") {
          throw new Error("Email tidak terdaftar di sistem.");
        }
        throw new Error("Gagal mengirim tautan reset. Coba lagi.");
      }
    }
  }

  // Mode demo: pastikan email terdaftar (seolah tautan reset dikirim).
  const exists = readAll().some((a) => a.email === clean);
  if (!exists) throw new Error("Email tidak terdaftar di sistem.");
}

// ---------- Ubah kata sandi ----------

export function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
): void {
  const clean = email.trim().toLowerCase();
  const list = readAll();
  const idx = list.findIndex((a) => a.email === clean);
  if (idx === -1) throw new Error("Akun tidak ditemukan.");
  if (list[idx].password !== oldPassword) {
    throw new Error("Kata sandi lama salah.");
  }
  if (newPassword.length < 6) {
    throw new Error("Kata sandi baru minimal 6 karakter.");
  }
  list[idx] = { ...list[idx], password: newPassword };
  writeAll(list);
}
