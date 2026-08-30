import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import {
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  auth, studentEmail, adminEmail,
  STUDENT_EMAIL_DOMAIN, ADMIN_EMAIL_DOMAIN,
} from "@/common/libs/firebase";
import {
  isValidNim, isValidUsername, isValidPassword,
  loginLockSeconds, recordLoginFailure, clearLoginFailures,
} from "@/common/libs/security";
import { isAdminEmail } from "@/services/admin";
import { ensureUserDoc } from "@/services/userDoc";

export type Role = "student" | "admin" | null;

interface AuthState {
  user: User | null;
  role: Role;
  loading: boolean;
  loginStudent: (nim: string, password: string) => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function roleFromEmail(email: string | null): Role {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  // Email Google asli yang terdaftar di allowlist admin harus tetap dikenali
  // sebagai admin di sini juga - bukan cuma di jalur login Google - supaya
  // sesi admin yang nyasar ke area /app tidak dianggap mahasiswa biasa.
  if (isAdminEmail(clean) || clean.endsWith(`@${ADMIN_EMAIL_DOMAIN}`)) return "admin";
  if (clean.endsWith(`@${STUDENT_EMAIL_DOMAIN}`)) return "student";
  return "student";
}

class LoginBlockedError extends Error {
  seconds: number;

  constructor(seconds: number) {
    super("login-locked");
    this.seconds = seconds;
  }
}

async function guardedSignIn(email: string, password: string): Promise<void> {
  const locked = loginLockSeconds();
  if (locked > 0) throw new LoginBlockedError(locked);
  try {
    // Sesi hanya bertahan selama tab terbuka (bukan localStorage permanen).
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    clearLoginFailures();
  } catch (err) {
    recordLoginFailure();
    throw err;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      }),
    [],
  );

  const value: AuthState = {
    user,
    role: roleFromEmail(user?.email ?? null),
    loading,
    loginStudent: async (nim, password) => {
      if (!isValidNim(nim)) throw new Error("invalid-nim");
      if (!isValidPassword(password)) throw new Error("invalid-password");
      await guardedSignIn(studentEmail(nim), password);
      // Email sintetis (@mahasiswa...) tidak pernah cocok allowlist admin,
      // jadi role dipaksa "student" di sini (bukan dihitung dari email).
      const u = auth.currentUser;
      if (u) void ensureUserDoc({ uid: u.uid, email: studentEmail(nim), name: u.displayName ?? "" }, "student");
    },
    loginAdmin: async (username, password) => {
      if (!isValidUsername(username)) throw new Error("invalid-username");
      if (!isValidPassword(password)) throw new Error("invalid-password");
      await guardedSignIn(adminEmail(username), password);
      const u = auth.currentUser;
      if (u) void ensureUserDoc({ uid: u.uid, email: adminEmail(username), name: u.displayName ?? "" }, "admin");
    },
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}

export function loginErrorMessage(err: unknown): string {
  if (err instanceof LoginBlockedError) {
    return `Terlalu banyak percobaan gagal. Coba lagi dalam ${err.seconds} detik.`;
  }
  const message = (err as { message?: string })?.message ?? "";
  if (message === "invalid-nim") return "NIM harus berupa 8-14 digit angka.";
  if (message === "invalid-username") {
    return "Username hanya boleh huruf, angka, titik, strip, atau garis bawah (3-32 karakter).";
  }
  if (message === "invalid-password") return "Password minimal 8 karakter.";

  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "NIM/username atau password salah. Periksa kembali.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi beberapa saat.";
    case "auth/network-request-failed":
      return "Gagal terhubung. Periksa koneksi internet Anda.";
    default:
      return "Gagal masuk. Coba lagi.";
  }
}
