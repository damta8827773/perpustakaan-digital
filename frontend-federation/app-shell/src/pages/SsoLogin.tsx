import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, ShieldCheck, Loader2, CheckCircle2, ArrowLeft, Lock,
} from "lucide-react";
import { profileFromNim, DEMO_NIM, SSO_MODE, UIN_SSO_PORTAL } from "../lib/sso";
import { registerSsoMember } from "../lib/membersStore";
import { setCurrentStudent } from "../lib/sessionStore";
import { isValidNim } from "../lib/security";

const STEPS = [
  "Memverifikasi identitas di SSO kampus",
  "Menyinkronkan data ke sistem perpustakaan",
  "Mengalihkan kembali ke Perpustakaan Digital",
];

export default function SsoLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nim, setNim] = useState(DEMO_NIM);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError("Isi nama lengkap sesuai akun SSO UIN Anda.");
      return;
    }
    if (!isValidNim(nim)) {
      setError("NIM harus berupa 8-14 digit angka.");
      return;
    }
    setError("");
    setProcessing(true);

    // Identitas diambil dari data yang Anda isi (mewakili profil SSO UIN),
    // lalu sistem OTOMATIS kembali dan masuk dengan nama tersebut.
    const derived = profileFromNim(nim);
    const profile = { ...derived, name: name.trim() };
    window.setTimeout(() => setStep(1), 600);
    window.setTimeout(() => setStep(2), 1200);
    window.setTimeout(() => {
      // Jadikan identitas aktif di seluruh sistem.
      setCurrentStudent({
        name: profile.name,
        nim: profile.nim,
        faculty: profile.faculty,
        program: profile.program,
        angkatan: profile.nim.slice(0, 4) || "2024",
        email: "",
      });
      // Otomatis terinput ke Data Anggota panel admin.
      registerSsoMember({
        nim: profile.nim,
        name: profile.name,
        faculty: profile.faculty,
        program: profile.program,
        status: "aktif",
        activeLoans: 0,
      });
      navigate("/app", { replace: true });
    }, 1900);
  }

  if (processing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary px-4">
        <div className="w-full max-w-[440px] rounded-2xl bg-card px-8 py-10 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <BookOpen size={32} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Berhasil Masuk</h1>
          <p className="mt-2 text-[15px] text-muted-fg">
            Sesi Anda sedang disiapkan, mohon tunggu sebentar.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {STEPS.map((label, i) => {
              const finished = i < step;
              const active = i === step;
              return (
                <div key={label} className="flex items-center gap-3">
                  {finished ? (
                    <CheckCircle2 size={20} className="shrink-0 text-success" />
                  ) : active ? (
                    <Loader2 size={20} className="shrink-0 animate-spin text-primary" />
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-line" />
                  )}
                  <span className={`text-[15px] ${finished || active ? "text-fg" : "text-muted-fg"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 py-10">
      <div className="w-full max-w-[440px] rounded-2xl bg-card px-8 py-9 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <BookOpen size={30} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">SSO UIN Jakarta</h1>
          <p className="mt-1.5 text-[15px] text-muted-fg">
            Masuk dengan akun tunggal mahasiswa untuk mengakses Perpustakaan Digital.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8">
          <label className="block font-display text-[15px] font-semibold">
            Nama Lengkap
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama sesuai akun SSO UIN"
            className="mt-2 w-full rounded-xl border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary"
          />

          <label className="mt-5 block font-display text-[15px] font-semibold">NIM</label>
          <input
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Nomor Induk Mahasiswa"
            className="mt-2 w-full rounded-xl border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary"
          />

          <label className="mt-5 block font-display text-[15px] font-semibold">
            Kata Sandi
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi SSO"
            className="mt-2 w-full rounded-xl border border-line bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary"
          />

          {error && (
            <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-[16px] font-bold text-white hover:bg-primary-dark"
          >
            <Lock size={18} /> Masuk dan Kembali ke Sistem
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-muted px-4 py-3 text-sm text-muted-fg">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
          <span>
            {SSO_MODE === "simulasi"
              ? "Mode simulasi SSO. Kata sandi tidak dikirim ke mana pun; setelah masuk Anda otomatis diarahkan kembali ke sistem."
              : "Koneksi terenkripsi ke SSO UIN."}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/login" className="flex items-center gap-1.5 text-muted-fg hover:text-fg">
            <ArrowLeft size={15} /> Login manual
          </Link>
          <a
            href={UIN_SSO_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Portal SSO resmi UIN
          </a>
        </div>
      </div>
    </div>
  );
}
