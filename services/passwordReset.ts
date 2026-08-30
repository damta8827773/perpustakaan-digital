// Reset password TERPICU OLEH ADMIN, dengan alasan wajib yang dicatat
// sebagai audit log. Admin tidak pernah melihat atau menyentuh password
// asli - ini murni memicu sendPasswordResetEmail bawaan Firebase.
//
// CATATAN KEAMANAN (dari tinjauan ulang): dua hal berikut sengaja dibuat
// KETAT, bukan cuma validasi UI -
// 1. Peran admin dicek eksplisit di sini (bukan cuma "ada yang login"),
//    supaya pesan errornya jelas kalau bukan admin, dan tidak bergantung
//    semata pada Firestore Rules menolak diam-diam.
// 2. Penulisan audit log sekarang WAJIB berhasil (kalau gagal, seluruh
//    operasi dianggap gagal) - sebelumnya kegagalan audit log ditelan diam-
//    diam, artinya reset bisa "berhasil" tanpa jejak audit sama sekali,
//    melemahkan jaminan "landasan kuat" yang jadi inti fitur ini.
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/common/libs/firebase";

const DEMO = import.meta.env.VITE_DEMO === "1";
const MIN_REASON_LENGTH = 20;

export function isPasswordResetAvailable(): boolean {
  return !DEMO;
}

export async function adminTriggerPasswordReset(
  target: { name: string; email: string },
  reason: string,
): Promise<void> {
  const cleanReason = reason.trim();
  if (cleanReason.length < MIN_REASON_LENGTH) {
    throw new Error(`Alasan minimal ${MIN_REASON_LENGTH} karakter.`);
  }
  if (DEMO) {
    throw new Error("Fitur reset password memerlukan konfigurasi Firebase (nonaktif di mode demo).");
  }
  const admin = auth.currentUser;
  if (!admin) throw new Error("Sesi admin tidak ditemukan.");

  const adminDoc = await getDoc(doc(db, "users", admin.uid)).catch(() => null);
  if (adminDoc?.data()?.role !== "admin") {
    throw new Error("Akun ini tidak memiliki hak admin untuk memicu reset password.");
  }

  // Audit log ditulis DULU, sebelum email reset dikirim - kalau langkah ini
  // gagal (mis. Firestore rules menolak / offline), seluruh operasi
  // dibatalkan. Tidak pernah ada reset yang "berhasil" tanpa jejak audit.
  await addDoc(collection(db, "passwordResetRequests"), {
    requestedByUid: admin.uid,
    requestedByEmail: admin.email ?? "",
    targetName: target.name,
    targetEmail: target.email,
    reason: cleanReason,
    status: "requested",
    createdAt: serverTimestamp(),
  });

  try {
    await sendPasswordResetEmail(auth, target.email, {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    });
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    throw new Error(
      code === "auth/user-not-found"
        ? "Email ini tidak terdaftar di Firebase Authentication."
        : "Gagal mengirim tautan reset (sudah tercatat di audit log sebagai permintaan).",
    );
  }
}
