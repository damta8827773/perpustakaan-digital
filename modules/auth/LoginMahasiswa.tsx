import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useAuth, loginErrorMessage } from "@/services/auth";
import { CountUp } from "@/components/CountUp";
import { Button, BusyLabel, Modal } from "@/components/ui";
import { startSso } from "@/common/libs/sso";
import {
  loginWithEmailOnly, loginWithGoogle, sendResetPassword,
} from "@/services/accounts";
import { setCurrentStudent } from "@/services/sessionStore";
import { registerSsoMember } from "@/services/membersStore";
import { submitHelpTicket } from "@/services/passwordResetHelp";

type Method = "email" | "nim";

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

export default function LoginMahasiswa() {
  const { loginStudent } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("email");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  function enter(profileApplied: boolean) {
    void profileApplied;
    navigate("/app");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (method === "email") {
        const profile = await loginWithEmailOnly(email);
        setCurrentStudent(profile);
      } else {
        await loginStudent(nim, password);
      }
      enter(true);
    } catch (err) {
      setError((err as Error).message || loginErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError("");
    setBusy(true);
    try {
      const { profile, role } = await loginWithGoogle();
      if (role === "admin") {
        // Email ini terdaftar di allowlist admin - arahkan ke panel admin
        // meskipun masuknya lewat tombol Google di halaman mahasiswa.
        navigate("/admin", { replace: true });
        return;
      }
      setCurrentStudent(profile);
      registerSsoMember({
        nim: profile.nim,
        name: profile.name,
        faculty: profile.faculty,
        program: profile.program,
        status: "aktif",
        activeLoans: 0,
        email: profile.email,
      });
      navigate("/app");
    } catch (err) {
      setError((err as Error).message || "Gagal masuk dengan Google.");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "mt-2.5 w-full rounded-xl border border-line bg-card px-5 py-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary";

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

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-[440px]">
          <h2 className="font-display text-[34px] font-bold">Selamat Datang</h2>
          <p className="mt-2 text-lg text-muted-fg">
            Masuk ke Perpustakaan Digital UIN Jakarta
          </p>

          <button
            type="button"
            onClick={() => startSso(navigate)}
            className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-primary py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
          >
            <BookOpen size={20} /> Masuk dengan SSO UIN
          </button>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-line bg-card py-4 font-display text-[16px] font-semibold hover:bg-muted disabled:opacity-60"
          >
            <GoogleIcon /> Masuk dengan Google
          </button>

          <div className="my-7 flex items-center gap-4 text-muted-fg">
            <div className="h-px flex-1 bg-line" />
            atau masuk manual
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="flex gap-2 rounded-xl bg-muted p-1">
            {(["email", "nim"] as Method[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMethod(m); setError(""); }}
                className={`flex-1 cursor-pointer rounded-lg py-2.5 font-display text-sm font-semibold transition-colors ${
                  method === m ? "bg-card text-primary shadow-sm" : "text-muted-fg"
                }`}
              >
                {m === "email" ? "Email" : "NIM"}
              </button>
            ))}
          </div>

          {method === "email" ? (
            <>
              <label className="mt-5 block font-display text-[17px] font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={field}
              />
              <p className="mt-2 text-sm text-muted-fg">
                Cukup email yang sudah terdaftar, tanpa kata sandi.
              </p>
            </>
          ) : (
            <>
              <label className="mt-5 block font-display text-[17px] font-semibold">NIM</label>
              <input
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Nomor Induk Mahasiswa"
                className={field}
              />
              <label className="mt-5 block font-display text-[17px] font-semibold">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={field}
              />
              <button
                type="button"
                onClick={() => { setShowForgot(true); setError(""); }}
                className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
              >
                Lupa sandi?
              </button>
            </>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full cursor-pointer rounded-xl border border-primary py-4 font-display text-[17px] font-bold text-primary transition-colors hover:bg-primary-light disabled:opacity-60"
          >
            {busy ? <BusyLabel text="Memproses..." /> : "Masuk"}
          </button>

          <p className="mt-5 text-center text-[15px] text-muted-fg">
            Belum punya akun?{" "}
            <Link to="/daftar" className="font-semibold text-primary hover:underline">
              Daftar di sini
            </Link>
          </p>

          <Link
            to="/"
            className="mt-4 flex items-center justify-center gap-2 text-[15px] text-muted-fg hover:text-fg"
          >
            <ArrowLeft size={16} /> Kembali ke pilihan peran
          </Link>
        </form>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
}

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"reset" | "reset-sent" | "help" | "help-sent">("reset");
  const [email, setEmail] = useState("");
  const [nimOrEmail, setNimOrEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitReset(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendResetPassword(email);
      setMode("reset-sent");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function submitHelp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await submitHelpTicket(nimOrEmail, message);
      setMode("help-sent");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (mode === "reset-sent") {
    return (
      <Modal title="Lupa Kata Sandi" onClose={onClose}>
        <div className="py-2 text-center">
          <p className="text-[15px] text-muted-fg">
            Tautan atur ulang kata sandi telah dikirim ke
          </p>
          <p className="mt-1 font-display text-lg font-bold">{email}</p>
          <p className="mt-3 text-sm text-muted-fg">
            Silakan periksa kotak masuk email Anda.
          </p>
          <Button className="mt-6 w-full py-3.5" onClick={onClose}>Tutup</Button>
        </div>
      </Modal>
    );
  }

  if (mode === "help-sent") {
    return (
      <Modal title="Pesan Terkirim" onClose={onClose}>
        <div className="py-2 text-center">
          <p className="text-[15px] text-muted-fg">
            Permintaan bantuan Anda sudah diteruskan ke admin perpustakaan.
          </p>
          <p className="mt-3 text-sm text-muted-fg">
            Admin akan menghubungi/memproses berdasarkan data yang Anda kirim.
          </p>
          <Button className="mt-6 w-full py-3.5" onClick={onClose}>Tutup</Button>
        </div>
      </Modal>
    );
  }

  if (mode === "help") {
    return (
      <Modal title="Hubungi Admin" onClose={onClose}>
        <form onSubmit={submitHelp}>
          <p className="text-[15px] text-muted-fg">
            Untuk akun yang emailnya tidak bisa menerima tautan reset (mis.
            akun NIM), isi data berikut agar admin bisa membantu.
          </p>
          <label className="mt-4 block font-display text-[15px] font-semibold">NIM atau Email</label>
          <input
            value={nimOrEmail}
            onChange={(e) => setNimOrEmail(e.target.value)}
            placeholder="NIM atau email terdaftar"
            className="mt-2 w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-primary"
          />
          <label className="mt-4 block font-display text-[15px] font-semibold">Pesan (opsional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Jelaskan kendala Anda..."
            className="mt-2 w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-primary"
          />
          {error && (
            <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" className="py-3.5" onClick={() => setMode("reset")} type="button">
              Kembali
            </Button>
            <Button type="submit" className="py-3.5" disabled={busy || !nimOrEmail.trim()}>
              {busy ? <BusyLabel text="Mengirim..." /> : "Kirim ke Admin"}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal title="Lupa Kata Sandi" onClose={onClose}>
      <form onSubmit={submitReset}>
        <p className="text-[15px] text-muted-fg">
          Masukkan email terdaftar. Kami akan mengirim tautan untuk mengatur
          ulang kata sandi Anda.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          className="mt-4 w-full rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-primary"
        />
        {error && (
          <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="outline" className="py-3.5" onClick={onClose} type="button">Batal</Button>
          <Button type="submit" className="py-3.5" disabled={busy}>
            {busy ? <BusyLabel text="Mengirim..." /> : "Kirim Tautan"}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => { setError(""); setMode("help"); }}
          className="mt-4 w-full cursor-pointer text-center text-sm font-semibold text-muted-fg hover:text-primary"
        >
          Tidak bisa menerima email? Hubungi admin
        </button>
      </form>
    </Modal>
  );
}
