import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { resolveSsoProfile, SSO_MODE, UIN_SSO_PORTAL } from "../lib/sso";
import { registerSsoMember } from "../lib/membersStore";

const STEPS = [
  "Menghubungkan ke SSO UIN Jakarta",
  "Memverifikasi identitas mahasiswa",
  "Menyinkronkan data ke sistem perpustakaan",
];

export default function SsoCallback() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const stepTimers = [
      window.setTimeout(() => setStep(1), 500),
      window.setTimeout(() => setStep(2), 1000),
    ];

    resolveSsoProfile().then((profile) => {
      // Data mahasiswa otomatis terinput ke Data Anggota panel admin.
      registerSsoMember({
        nim: profile.nim,
        name: profile.name,
        faculty: profile.faculty,
        program: profile.program,
        status: "aktif",
        activeLoans: 0,
      });
      setName(profile.name);
      setDone(true);
      window.setTimeout(() => navigate("/app", { replace: true }), 900);
    });

    return () => stepTimers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-[440px] rounded-2xl bg-card px-8 py-10 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
          <BookOpen size={32} />
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold">
          {done ? "Berhasil Masuk" : "Masuk dengan SSO UIN"}
        </h1>
        <p className="mt-2 text-[15px] text-muted-fg">
          {done
            ? `Selamat datang, ${name}. Mengalihkan ke beranda...`
            : "Mohon tunggu, sesi Anda sedang disiapkan."}
        </p>

        <div className="mt-8 space-y-3 text-left">
          {STEPS.map((label, i) => {
            const active = i === step && !done;
            const finished = done || i < step;
            return (
              <div key={label} className="flex items-center gap-3">
                {finished ? (
                  <CheckCircle2 size={20} className="shrink-0 text-success" />
                ) : active ? (
                  <Loader2 size={20} className="shrink-0 animate-spin text-primary" />
                ) : (
                  <div className="h-5 w-5 shrink-0 rounded-full border-2 border-line" />
                )}
                <span
                  className={`text-[15px] ${finished || active ? "text-fg" : "text-muted-fg"}`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-fg">
          <ShieldCheck size={16} className="text-success" />
          {SSO_MODE === "portal-uin"
            ? "Portal SSO UIN dibuka di tab baru"
            : SSO_MODE === "simulasi"
              ? "Mode simulasi SSO untuk pengembangan"
              : "Koneksi terenkripsi ke SSO UIN"}
        </div>

        {SSO_MODE === "portal-uin" && (
          <a
            href={UIN_SSO_PORTAL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm font-semibold text-primary hover:underline"
          >
            Buka e-semesta.uinjkt.ac.id secara manual
          </a>
        )}
      </div>
    </div>
  );
}
