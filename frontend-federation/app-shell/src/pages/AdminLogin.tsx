import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useAuth, loginErrorMessage } from "../lib/auth";

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginAdmin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-[900px] rounded-2xl bg-card px-6 py-12 shadow-sm"
      >
        <div className="mx-auto max-w-[460px]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-primary text-white">
              <BookOpen size={34} />
            </div>
            <h1 className="mt-6 font-display text-[28px] font-bold">
              Perpustakaan Digital
            </h1>
            <p className="mt-1 text-lg text-muted-fg">UIN Syarif Hidayatullah Jakarta</p>
            <span className="mt-3 rounded-full bg-[#fdf3d8] px-5 py-1.5 font-display text-sm font-bold tracking-wide text-warning">
              ADMIN
            </span>
          </div>

          <label className="mt-10 block font-display text-[17px] font-semibold">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan username admin"
            className="mt-2.5 w-full rounded-xl border border-line bg-card px-5 py-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
          />

          <label className="mt-6 block font-display text-[17px] font-semibold">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2.5 w-full rounded-xl border border-line bg-card px-5 py-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
          />

          {error && (
            <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-8 w-full cursor-pointer rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Masuk"}
          </button>

          <Link
            to="/"
            className="mt-7 flex items-center justify-center gap-2 text-[15px] text-muted-fg hover:text-fg"
          >
            <ArrowLeft size={16} /> Kembali ke pilihan peran
          </Link>

          <p className="mt-5 text-center text-[15px] text-muted-fg">
            Hubungi administrator untuk akses
          </p>
        </div>
      </form>
    </div>
  );
}
