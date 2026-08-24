// Reset password TERPICU OLEH ADMIN, dengan alasan wajib yang dicatat
// sebagai audit log. Admin tidak pernah melihat atau menyentuh password
// asli — ini murni memicu sendPasswordResetEmail bawaan Firebase; "landasan
// kuat"-nya adalah jejak audit (siapa, kapan, kenapa), ditegakkan juga di
// firestore.rules (reason minimal 20 karakter), bukan cuma validasi UI.
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

  let sendError: string | null = null;
  try {
    await sendPasswordResetEmail(auth, target.email);
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    sendError = code === "auth/user-not-found"
      ? "Email ini tidak terdaftar di Firebase Authentication."
      : "Gagal mengirim tautan reset.";
  }

  try {
    await addDoc(collection(db, "passwordResetRequests"), {
      requestedByUid: admin.uid,
      requestedByEmail: admin.email ?? "",
      targetName: target.name,
      targetEmail: target.email,
      reason: cleanReason,
      status: sendError ? "failed" : "sent",
      createdAt: serverTimestamp(),
    });
  } catch {
    // Firestore belum aktif -> audit log tidak tersimpan, tapi jangan
    // sembunyikan hasil kirim reset dari admin.
  }

  if (sendError) throw new Error(sendError);
}
