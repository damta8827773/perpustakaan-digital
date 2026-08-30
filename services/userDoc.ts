// Dokumen `users/{uid}` di Firestore: satu sumber kebenaran untuk role
// (student/admin) yang bisa diverifikasi di Security Rules sisi server -
// dipakai fitur foto profil, live chat, dan audit reset password oleh admin.
//
// Role TETAP dihitung dari allowlist (isAdminEmail / roleHint), dokumen ini
// hanya "mengekspos" hasilnya ke Firestore. Kalau Firestore belum diaktifkan
// di Firebase Console, fungsi ini gagal secara diam-diam (fallback ke role
// hasil hitungan lokal) supaya login tetap berjalan.
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/common/libs/firebase";
import { isAdminEmail } from "@/services/admin";

const DEMO = import.meta.env.VITE_DEMO === "1";

export type UserRole = "student" | "admin";

export interface UserDoc {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  nim?: string;
  faculty?: string;
  program?: string;
  angkatan?: string;
}

/**
 * Sinkronkan field profil mahasiswa (NIM/fakultas/prodi/angkatan) ke
 * users/{uid} - dipakai admin di panel verifikasi identitas live chat
 * (lihat modules/admin/Pesan.tsx) untuk mencocokkan klaim identitas
 * sebelum memproses reset password. Gagal secara diam-diam kalau
 * Firestore belum aktif, konsisten dengan pola di seluruh services/.
 */
export async function syncStudentProfile(
  uid: string,
  patch: Partial<Pick<UserDoc, "name" | "nim" | "faculty" | "program" | "angkatan">>,
): Promise<void> {
  if (import.meta.env.VITE_DEMO === "1") return;
  try {
    await setDoc(doc(db, "users", uid), patch, { merge: true });
  } catch (err) {
    console.error("syncStudentProfile gagal:", err);
  }
}

/**
 * Baca profil users/{uid} secara real-time - dipakai panel "Info Akun" admin
 * di live chat (modules/admin/Pesan.tsx) untuk verifikasi identitas sebelum
 * memproses reset password.
 */
export function useUserProfile(uid: string | null): UserDoc | null {
  const [profile, setProfile] = useState<UserDoc | null>(null);
  useEffect(() => {
    if (DEMO || !uid) {
      setProfile(null);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "users", uid),
      (snap) => setProfile(snap.exists() ? (snap.data() as UserDoc) : null),
      () => setProfile(null),
    );
    return unsub;
  }, [uid]);
  return profile;
}

export interface BasicIdentity {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
}

/**
 * Pastikan `users/{uid}` ada dan role-nya sinkron dengan allowlist saat ini.
 * `roleHint` dipakai untuk jalur NIM/username (email sintetis, tidak pernah
 * cocok dengan allowlist Gmail) di mana role sudah pasti dari domain email.
 */
export async function ensureUserDoc(
  identity: BasicIdentity,
  roleHint?: UserRole,
): Promise<UserDoc> {
  const email = identity.email.trim().toLowerCase();
  const computedRole: UserRole = roleHint ?? (isAdminEmail(email) ? "admin" : "student");

  if (DEMO) {
    return { uid: identity.uid, email, name: identity.name, role: computedRole };
  }

  try {
    const ref = doc(db, "users", identity.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as UserDoc;
      if (data.role !== computedRole) {
        await setDoc(ref, { role: computedRole }, { merge: true });
        return { ...data, role: computedRole };
      }
      return data;
    }
    const data: UserDoc = {
      uid: identity.uid,
      email,
      name: identity.name,
      role: computedRole,
      ...(identity.photoURL ? { photoURL: identity.photoURL } : {}),
    };
    await setDoc(ref, { ...data, createdAt: serverTimestamp() });
    return data;
  } catch {
    // Firestore belum aktif/di-deploy, atau rules belum sinkron dengan
    // allowlist admin - jangan blokir login, cukup pakai role hasil hitungan.
    return { uid: identity.uid, email, name: identity.name, role: computedRole };
  }
}
