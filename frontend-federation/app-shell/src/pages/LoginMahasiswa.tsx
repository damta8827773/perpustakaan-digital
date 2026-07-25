import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useAuth, loginErrorMessage } from "../lib/auth";
import { CountUp } from "../components/CountUp";
import { startSso } from "../lib/sso";

export default function LoginMahasiswa() {
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginStudent(nim, password);
      navigate("/app");
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-card">
      <div className="relative hidden w-[44%] overflow-hidden bg-primary lg:block">
        <div className="absolute -left-10 top-24 h-64 w-72 rounded-3xl bg-white/10" />
        <div className="absolute bottom-10 left-24 h-72 w-80 rounded-3xl bg-white/10" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 text-center text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20">
            <BookOpen size={40} />
          </div>
          <h1 className="mt-10 font-display text-4xl font-bold leading-snug">
            Perpustakaan<br />Digital
          </h1>
          <p className="mt-6 text-lg text-white/90">UIN Syarif Hidayatullah Jakarta</p>
          <p className="mt-4 max-w-[360px] leading-relaxed text-white/80">
            Akses ribuan koleksi buku akademik, jurnal, dan e-book langsung dari
            browser Anda.
          </p>
          <div className="mt-12 flex items-center gap-10">
            {[
              { value: 12000, suffix: "+", label: "Koleksi" },
              { value: 5800, suffix: "+", label: "Mahasiswa" },
              { value: 4.8, decimals: 1, suffix: "★", label: "Rating" },
            ].map(({ value, suffix, decimals, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-bold">
                  <CountUp value={value} decimals={decimals ?? 0} suffix={suffix} />
                </div>
                <div className="mt-1 text-white/80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6">
        <form onSubmit={submit} className="w-full max-w-[440px]">
          <h2 className="font-display text-[34px] font-bold">Selamat Datang</h2>
          <p className="mt-2 text-lg text-muted-fg">
            Masuk dengan akun mahasiswa UIN Jakarta
          </p>

          <button
            type="button"
            onClick={() => startSso(navigate)}
            className="mt-9 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
          >
            <BookOpen size={20} /> Masuk dengan SSO UIN
          </button>

          <div className="my-8 flex items-center gap-4 text-muted-fg">
            <div className="h-px flex-1 bg-line" />
            atau masuk manual
            <div className="h-px flex-1 bg-line" />
          </div>

          <label className="block font-display text-[17px] font-semibold">NIM</label>
          <input
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Nomor Induk Mahasiswa"
            className="mt-2.5 w-full rounded-xl border border-line bg-card px-5 py-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
          />

          <label className="mt-6 block font-display text-[17px] font-semibold">Password</label>
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
            className="mt-8 w-full cursor-pointer rounded-xl border border-primary py-4 font-display text-[17px] font-bold text-primary transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Masuk"}
          </button>

          <Link
            to="/"
            className="mt-7 flex items-center justify-center gap-2 text-[15px] text-muted-fg hover:text-fg"
          >
            <ArrowLeft size={16} /> Kembali ke pilihan peran
          </Link>
        </form>
      </div>
    </div>
  );
}
