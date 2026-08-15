import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, ShieldCheck } from "lucide-react";
import { loginAdminWithGoogle } from "@/services/admin";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    setError("");
    setBusy(true);
    try {
      await loginAdminWithGoogle();
      navigate("/admin", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Gagal masuk.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-[460px] rounded-2xl bg-card px-8 py-12 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-primary text-white">
            <BookOpen size={34} />
          </div>
          <h1 className="mt-6 font-display text-[28px] font-bold">Perpustakaan Digital</h1>
          <p className="mt-1 text-lg text-muted-fg">UIN Syarif Hidayatullah Jakarta</p>
          <span className="mt-3 rounded-full bg-[#fdf3d8] px-5 py-1.5 font-display text-sm font-bold tracking-wide text-warning">
            PANEL ADMIN
          </span>
        </div>

        <p className="mt-8 text-center text-[15px] leading-relaxed text-muted-fg">
          Masuk menggunakan akun Google resmi administrator. Identitas
          diverifikasi langsung oleh Google, sehingga tidak dapat dipalsukan
          hanya dengan menebak email.
        </p>

        <button
          onClick={google}
          disabled={busy}
          className="mt-7 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-line bg-card py-4 font-display text-[16px] font-semibold hover:bg-muted disabled:opacity-60"
        >
          <GoogleIcon /> {busy ? "Memproses..." : "Masuk dengan Google"}
        </button>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-muted px-4 py-3 text-sm text-muted-fg">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
          <span>
            Akses panel admin dibatasi untuk akun Google tertentu yang telah
            didaftarkan. Akun lain akan ditolak secara otomatis.
          </span>
        </div>

        <Link
          to="/"
          className="mt-7 flex items-center justify-center gap-2 text-[15px] text-muted-fg hover:text-fg"
        >
          <ArrowLeft size={16} /> Kembali ke pilihan peran
        </Link>
      </div>
    </div>
  );
}
