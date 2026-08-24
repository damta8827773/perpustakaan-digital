import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft, UserPlus } from "lucide-react";
import { registerAccount, isValidEmail } from "@/services/accounts";
import { setCurrentStudent } from "@/services/sessionStore";
import { registerSsoMember } from "@/services/membersStore";
import { isValidNim, isValidPassword } from "@/common/libs/security";
import { PasswordField } from "@/components/PasswordField";

const FACULTIES = [
  "Adab dan Humaniora", "Syariah dan Hukum", "Ushuluddin", "Tarbiyah dan Keguruan",
  "Dakwah dan Ilmu Komunikasi", "Dirasat Islamiyah", "Psikologi",
  "Ekonomi dan Bisnis (FEB)", "Sains dan Teknologi (FST)",
  "Kedokteran", "Ilmu Sosial dan Ilmu Politik (FISIP)",
];

const currentYear = new Date().getFullYear();
const ANGKATAN = Array.from({ length: 8 }, (_, i) => String(currentYear - i));

export default function Daftar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", nim: "", program: "", faculty: FACULTIES[8],
    angkatan: ANGKATAN[0], email: "", password: "", confirm: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const input =
    "mt-2 w-full rounded-xl border border-line bg-card px-4 py-3 text-[15px] outline-none focus:border-primary";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError("Isi nama lengkap Anda.");
    if (!isValidNim(form.nim)) return setError("NIM harus 8-14 digit angka.");
    if (form.program.trim().length < 2) return setError("Isi program studi Anda.");
    if (!isValidEmail(form.email)) return setError("Format email tidak valid.");
    if (!isValidPassword(form.password)) return setError("Kata sandi minimal 8 karakter.");
    if (form.password !== form.confirm) return setError("Konfirmasi kata sandi tidak sama.");

    setError("");
    setBusy(true);
    try {
      const profile = await registerAccount(
        {
          name: form.name.trim(),
          nim: form.nim.trim(),
          faculty: form.faculty,
          program: form.program.trim(),
          angkatan: form.angkatan,
          email: form.email.trim().toLowerCase(),
        },
        form.password,
      );
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
      navigate("/app", { replace: true });
    } catch (err) {
      setError((err as Error).message || "Gagal mendaftar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-[560px] rounded-2xl bg-card px-8 py-9 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
            <BookOpen size={30} />
          </div>
          <h1 className="mt-5 font-display text-[26px] font-bold">Daftar Anggota Perpustakaan</h1>
          <p className="mt-1.5 text-[15px] text-muted-fg">
            Buat akun perpustakaan untuk meminjam buku dan mengakses e-book.
          </p>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="font-display text-[15px] font-semibold">Nama Lengkap</label>
            <input value={form.name} onChange={set("name")} placeholder="Nama lengkap sesuai KTM" className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-display text-[15px] font-semibold">NIM</label>
              <input value={form.nim} onChange={set("nim")} placeholder="Nomor Induk Mahasiswa" className={input} />
            </div>
            <div>
              <label className="font-display text-[15px] font-semibold">Angkatan</label>
              <select value={form.angkatan} onChange={set("angkatan")} className={input}>
                {ANGKATAN.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Fakultas</label>
            <select value={form.faculty} onChange={set("faculty")} className={input}>
              {FACULTIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Program Studi</label>
            <input value={form.program} onChange={set("program")} placeholder="Contoh: Sistem Informasi" className={input} />
          </div>
          <div>
            <label className="font-display text-[15px] font-semibold">Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="nama@email.com" className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-display text-[15px] font-semibold">Kata Sandi</label>
              <PasswordField
                value={form.password}
                onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                placeholder="Minimal 8 karakter"
                className={input}
                showStrength
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="font-display text-[15px] font-semibold">Ulangi Sandi</label>
              <PasswordField
                value={form.confirm}
                onChange={(v) => setForm((f) => ({ ...f, confirm: v }))}
                placeholder="Ulangi kata sandi"
                className={input}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-display text-[16px] font-bold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          <UserPlus size={18} /> {busy ? "Memproses..." : "Daftar & Masuk"}
        </button>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/login" className="flex items-center gap-1.5 text-muted-fg hover:text-fg">
            <ArrowLeft size={15} /> Sudah punya akun? Masuk
          </Link>
          <Link to="/" className="text-muted-fg hover:text-fg">Beranda</Link>
        </div>
      </form>
    </div>
  );
}
