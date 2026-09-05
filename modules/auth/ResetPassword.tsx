import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  confirmPasswordReset, verifyPasswordResetCode,
} from "firebase/auth";
import { BookOpen, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/common/libs/firebase";
import { PasswordField } from "@/components/PasswordField";
import { Button, BusyLabel } from "@/components/ui";
import { isValidPassword } from "@/common/libs/security";

type Status = "checking" | "valid" | "invalid" | "done";

function messageForCode(code: string): string {
  switch (code) {
    case "auth/expired-action-code":
      return "Tautan reset ini sudah kedaluwarsa. Silakan minta tautan baru lewat \"Lupa sandi?\" di halaman masuk.";
    case "auth/invalid-action-code":
      return "Tautan ini tidak valid atau sudah pernah dipakai sebelumnya. Silakan minta tautan reset yang baru.";
    case "auth/user-disabled":
      return "Akun ini telah dinonaktifkan. Hubungi admin perpustakaan untuk bantuan lebih lanjut.";
    case "auth/user-not-found":
      return "Akun untuk tautan ini tidak ditemukan. Mungkin akun sudah dihapus.";
    case "auth/weak-password":
      return "Kata sandi baru terlalu lemah. Gunakan minimal 8 karakter.";
    default:
      return "Terjadi kesalahan saat memproses tautan reset. Silakan coba lagi atau minta tautan baru.";
  }
}

export default function ResetPassword() {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode") ?? "";
  const mode = params.get("mode");

  const [status, setStatus] = useState<Status>("checking");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== "resetPassword" || !oobCode) {
      setError("Tautan tidak lengkap - pastikan kamu membuka tautan dari email apa adanya, tanpa memotong bagian mana pun.");
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((resolvedEmail) => {
        setEmail(resolvedEmail);
        setStatus("valid");
      })
      .catch((err) => {
        setError(messageForCode((err as { code?: string })?.code ?? ""));
        setStatus("invalid");
      });
  }, [mode, oobCode]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isValidPassword(newPw)) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPw !== confirm) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPw);
      setStatus("done");
    } catch (err) {
      setError(messageForCode((err as { code?: string })?.code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  const input =
    "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none focus:border-primary";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-[460px] rounded-2xl bg-card px-8 py-12 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-primary text-white">
            <BookOpen size={34} />
          </div>
          <h1 className="mt-6 font-display text-[26px] font-bold">Atur Ulang Kata Sandi</h1>
          <p className="mt-1 text-muted-fg">Perpustakaan Digital UIN Syarif Hidayatullah Jakarta</p>
        </div>

        {status === "checking" && (
          <p className="mt-8 text-center text-[15px] text-muted-fg">Memeriksa tautan...</p>
        )}

        {status === "invalid" && (
          <div className="mt-8 text-center">
            <XCircle size={40} className="mx-auto text-destructive" />
            <p className="mt-4 text-[15px] leading-relaxed text-muted-fg">{error}</p>
            <Link
              to="/login"
              className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-[16px] font-bold text-white hover:bg-primary-dark"
            >
              <ArrowLeft size={17} /> Kembali ke Halaman Masuk
            </Link>
          </div>
        )}

        {status === "valid" && (
          <form onSubmit={submit} className="mt-7">
            <p className="text-center text-[15px] text-muted-fg">
              Membuat kata sandi baru untuk <strong className="text-fg">{email}</strong>
            </p>
            <label className="mt-6 block font-display text-[15px] font-semibold">Kata Sandi Baru</label>
            <PasswordField
              value={newPw}
              onChange={setNewPw}
              placeholder="Minimal 8 karakter"
              className={input}
              showStrength
              autoComplete="new-password"
            />
            <label className="mt-4 block font-display text-[15px] font-semibold">Ulangi Kata Sandi Baru</label>
            <PasswordField
              value={confirm}
              onChange={setConfirm}
              placeholder="Ulangi kata sandi baru"
              className={input}
              autoComplete="new-password"
            />
            {error && (
              <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="mt-6 w-full py-3.5" disabled={busy}>
              {busy ? <BusyLabel text="Menyimpan..." /> : "Simpan Kata Sandi Baru"}
            </Button>
          </form>
        )}

        {status === "done" && (
          <div className="mt-8 text-center">
            <CheckCircle2 size={40} className="mx-auto text-success" />
            <h2 className="mt-4 font-display text-xl font-bold">Kata Sandi Berhasil Diperbarui</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-fg">
              Silakan masuk kembali menggunakan kata sandi baru kamu.
            </p>
            <Link
              to="/login"
              className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-[16px] font-bold text-white hover:bg-primary-dark"
            >
              Masuk Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
