import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, Clock, Lock, Globe, HelpCircle, LogOut, ChevronRight, BookOpen, Mail, ShieldCheck, Camera,
  Pencil, Check,
} from "lucide-react";
import { bookById } from "@/common/constants/catalog";
import { RemoteCover, Button, Card, Modal, Avatar } from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/services/auth";
import { useLibrary, getActiveLoans } from "@/services/libraryStore";
import { useCurrentStudent, clearCurrentStudent, updateCurrentStudent } from "@/services/sessionStore";
import { changePasswordSecure } from "@/services/accounts";
import { sendHelpToAdmin } from "@/services/notificationsStore";
import { useFeedback, inboxFor } from "@/services/feedbackStore";
import { PasswordField } from "@/components/PasswordField";
import { uploadAvatar, isAvatarUploadAvailable } from "@/services/avatarStore";
import { auth } from "@/common/libs/firebase";
import { useLocale, setLocale, useTranslate } from "@/services/localeStore";
import { LOCALES, LOCALE_META } from "@/i18n";
import { syncStudentProfile } from "@/services/userDoc";

type Sheet = "wishlist" | "password" | "bantuan" | "inbox" | "bahasa" | "editProfil" | null;

const PLACEHOLDER_VALUES = new Set(["-", "umum", "uin jakarta"]);
const isPlaceholder = (v: string) => !v || PLACEHOLDER_VALUES.has(v.trim().toLowerCase());

export default function Profil() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();
  const lib = useLibrary();
  const student = useCurrentStudent();
  useFeedback(); // berlangganan agar balasan admin langsung muncul
  const [sheet, setSheet] = useState<Sheet>(null);
  const locale = useLocale();
  const t = useTranslate();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      notify("Tidak bisa mengganti foto: sesi tidak ditemukan.");
      return;
    }
    setUploadingPhoto(true);
    try {
      const photoURL = await uploadAvatar(uid, file);
      updateCurrentStudent({ photoURL });
      notify("Foto profil berhasil diperbarui.");
    } catch (err) {
      notify((err as Error).message || "Gagal mengunggah foto.");
    } finally {
      setUploadingPhoto(false);
    }
  }

  const email = student.email || `${student.nim}@mahasiswa.uinjkt.ac.id`;
  const inbox = inboxFor(email);

  const activeLoans = getActiveLoans();
  const stats: [number, string][] = [
    [activeLoans.length, "Total Pinjaman"],
    [activeLoans.length, "Sedang Dipinjam"],
    [lib.wishlist.length, "Favorit"],
  ];

  const MENU = [
    { key: "inbox", icon: Mail, title: t("profile.inbox"), sub: inbox.length > 0 ? `${inbox.length} balasan dari admin` : "Belum ada balasan" },
    { key: "wishlist", icon: Heart, title: t("profile.wishlist"), sub: `${lib.wishlist.length} buku tersimpan` },
    { key: "riwayat", icon: Clock, title: t("profile.history"), sub: "Lihat aktivitas peminjaman" },
    { key: "password", icon: Lock, title: t("profile.changePassword"), sub: "" },
    { key: "bahasa", icon: Globe, title: t("profile.language"), sub: `${LOCALE_META[locale].flag} ${LOCALE_META[locale].label}` },
    { key: "bantuan", icon: HelpCircle, title: t("profile.help"), sub: "Kirim pesan ke admin" },
  ];

  function onMenu(key: string) {
    if (key === "inbox") setSheet("inbox");
    else if (key === "wishlist") setSheet("wishlist");
    else if (key === "riwayat") navigate("/app/pinjaman");
    else if (key === "password") setSheet("password");
    else if (key === "bantuan") setSheet("bantuan");
    else if (key === "bahasa") setSheet("bahasa");
  }

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">{t("profile.title")}</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <div>
          <Card className="flex flex-col items-center p-9 text-center">
            <div className="relative">
              <Avatar
                photoURL={student.photoURL}
                name={student.name}
                className="h-[120px] w-[120px]"
                textClass="text-4xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto || !isAvatarUploadAvailable()}
                title={isAvatarUploadAvailable() ? "Ganti foto profil" : "Fitur perlu konfigurasi Firebase"}
                className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-fg text-white shadow-sm transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="mt-6 flex items-center gap-2">
              <h2 className="font-display text-[26px] font-bold uppercase">{student.name}</h2>
              <button
                onClick={() => setSheet("editProfil")}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-fg hover:bg-primary-light hover:text-primary"
                aria-label="Edit profil"
                title="Edit profil"
              >
                <Pencil size={14} />
              </button>
            </div>
            {isPlaceholder(student.nim) ? (
              <button
                onClick={() => setSheet("editProfil")}
                className="mt-1 cursor-pointer text-[15px] font-semibold text-primary hover:underline"
              >
                Lengkapi NIM &amp; data akademik
              </button>
            ) : (
              <p className="mt-1 text-lg uppercase text-muted-fg">{student.nim}</p>
            )}
            {!isPlaceholder(student.faculty) && !isPlaceholder(student.program) && (
              <span className="mt-4 rounded-full bg-primary-light px-5 py-2 text-sm font-semibold uppercase text-primary">
                {student.faculty} · {student.program}
              </span>
            )}
            {student.angkatan && !isPlaceholder(student.angkatan) && (
              <span className="mt-2 text-sm text-muted-fg">Angkatan {student.angkatan}</span>
            )}
            {student.email && (
              <span className="mt-1 text-sm lowercase text-muted-fg">{student.email}</span>
            )}
          </Card>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {stats.map(([v, l]) => (
              <Card key={l} className="p-5 text-center">
                <div className="font-display text-[28px] font-bold">
                  <CountUp value={v} />
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-fg">{l}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="divide-y divide-line">
            {MENU.map(({ key, icon: Icon, title, sub }) => (
              <button
                key={key}
                onClick={() => onMenu(key)}
                className="flex w-full cursor-pointer items-center gap-5 px-7 py-5 text-left transition-colors hover:bg-muted/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-fg">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-[17px] font-bold">{title}</div>
                  {sub && <div className="mt-0.5 text-[15px] text-muted-fg">{sub}</div>}
                </div>
                <ChevronRight size={20} className="text-muted-fg" />
              </button>
            ))}
          </Card>

          <Card>
            <button
              onClick={async () => {
                clearCurrentStudent();
                await logout();
                navigate("/");
              }}
              className="flex w-full cursor-pointer items-center gap-5 px-7 py-5 text-left transition-colors hover:bg-destructive-light/40"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive-light text-destructive">
                <LogOut size={20} />
              </div>
              <span className="font-display text-[17px] font-bold text-destructive">
                Keluar dari Akun
              </span>
            </button>
          </Card>
        </div>
      </div>

      {sheet === "inbox" && (
        <Modal title="Kotak Masuk" onClose={() => setSheet(null)}>
          <p className="text-[15px] text-muted-fg">
            Balasan dari admin perpustakaan atas komentar Anda.
          </p>
          {inbox.length === 0 ? (
            <p className="py-6 text-center text-muted-fg">Belum ada balasan masuk.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {inbox.map((c) => (
                <div key={c.id} className="rounded-xl border border-line p-4">
                  <div className="text-sm text-muted-fg">
                    Komentar Anda pada <strong className="text-fg">{c.bookTitle}</strong>
                  </div>
                  <p className="mt-1 text-[15px] italic text-muted-fg">"{c.text}"</p>
                  <div className="mt-3 rounded-lg bg-primary-light/60 p-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <ShieldCheck size={14} /> Balasan Admin
                    </div>
                    <p className="mt-1 text-[15px]">{c.reply!.text}</p>
                    <div className="mt-1 text-xs text-muted-fg">{c.reply!.date} · {c.reply!.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {sheet === "wishlist" && (
        <Modal title="Wishlist Saya" onClose={() => setSheet(null)}>
          {lib.wishlist.length === 0 ? (
            <p className="py-4 text-center text-muted-fg">
              Belum ada buku di wishlist. Simpan buku dari halaman detail.
            </p>
          ) : (
            <div className="space-y-3">
              {lib.wishlist.map((id) => {
                const b = bookById(id);
                if (!b) return null;
                return (
                  <Link
                    key={id}
                    to={`/app/buku/${b.id}`}
                    onClick={() => setSheet(null)}
                    className="flex items-center gap-4 rounded-xl border border-line p-3 hover:bg-muted/50"
                  >
                    <RemoteCover title={b.title} author={b.author} initials={b.initials} color={b.color} className="h-14 w-12 rounded-lg" textClass="text-sm" />
                    <div>
                      <div className="font-display font-bold">{b.title}</div>
                      <div className="text-sm text-muted-fg">{b.author}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Modal>
      )}

      {sheet === "password" && (
        <ChangePasswordModal
          email={student.email}
          onClose={() => setSheet(null)}
          onDone={() => {
            setSheet(null);
            notify("Kata sandi berhasil diperbarui.");
          }}
        />
      )}

      {sheet === "bahasa" && (
        <LanguageModal
          current={locale}
          onClose={() => setSheet(null)}
          onSelect={(next) => {
            setLocale(next);
            setSheet(null);
            notify(`${LOCALE_META[next].flag} Bahasa diubah ke ${LOCALE_META[next].label}.`);
          }}
        />
      )}

      {sheet === "editProfil" && (
        <EditProfileModal
          student={student}
          onClose={() => setSheet(null)}
          onSave={(patch) => {
            updateCurrentStudent(patch);
            const uid = auth.currentUser?.uid;
            if (uid) void syncStudentProfile(uid, patch);
            setSheet(null);
            notify("Profil berhasil diperbarui.");
          }}
        />
      )}

      {sheet === "bantuan" && (
        <BantuanModal
          onClose={() => setSheet(null)}
          onSend={(msg) => {
            sendHelpToAdmin(student.name, msg);
            setSheet(null);
            notify("Pesan bantuan terkirim ke admin.");
          }}
        />
      )}
    </div>
  );
}

function ChangePasswordModal({
  email, onClose, onDone,
}: { email: string; onClose: () => void; onDone: () => void }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input =
    "mt-2 w-full rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return setError("Ubah sandi hanya untuk akun email. Akun SSO dikelola oleh UIN.");
    if (newPw !== confirm) return setError("Konfirmasi kata sandi tidak sama.");
    setError("");
    setBusy(true);
    try {
      await changePasswordSecure(email, oldPw, newPw);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Ubah Password" onClose={onClose}>
      <form onSubmit={submit}>
        <label className="font-display text-[15px] font-semibold">Kata Sandi Lama</label>
        <PasswordField value={oldPw} onChange={setOldPw} className={input} autoComplete="current-password" />
        <label className="mt-4 block font-display text-[15px] font-semibold">Kata Sandi Baru</label>
        <PasswordField value={newPw} onChange={setNewPw} className={input} showStrength autoComplete="new-password" />
        <label className="mt-4 block font-display text-[15px] font-semibold">Ulangi Sandi Baru</label>
        <PasswordField value={confirm} onChange={setConfirm} className={input} autoComplete="new-password" />
        {error && <p className="mt-4 rounded-lg bg-destructive-light px-4 py-3 text-sm text-destructive">{error}</p>}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="outline" className="py-3.5" onClick={onClose}>Batal</Button>
          <Button type="submit" className="py-3.5" disabled={busy}>{busy ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function LanguageModal({
  current, onClose, onSelect,
}: { current: (typeof LOCALES)[number]; onClose: () => void; onSelect: (locale: (typeof LOCALES)[number]) => void }) {
  return (
    <Modal title="Pilih Bahasa" onClose={onClose}>
      <div className="space-y-2.5">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            onClick={() => onSelect(loc)}
            className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${
              current === loc ? "border-primary bg-primary-light/60" : "border-line hover:bg-muted"
            }`}
          >
            <span className="text-2xl">{LOCALE_META[loc].flag}</span>
            <span className="flex-1 font-display text-[16px] font-bold">{LOCALE_META[loc].label}</span>
            {current === loc && <Check size={18} className="text-primary" />}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-fg">
        Navigasi utama dan halaman profil akan mengikuti bahasa pilihan. Sebagian
        konten (judul buku, obrolan, panel admin) masih dalam Bahasa Indonesia.
      </p>
    </Modal>
  );
}

function EditProfileModal({
  student, onClose, onSave,
}: {
  student: { name: string; nim: string; faculty: string; program: string; angkatan: string };
  onClose: () => void;
  onSave: (patch: { name: string; nim: string; faculty: string; program: string; angkatan: string }) => void;
}) {
  const clean = (v: string) => (isPlaceholder(v) ? "" : v);
  const [name, setName] = useState(student.name);
  const [nim, setNim] = useState(clean(student.nim));
  const [faculty, setFaculty] = useState(clean(student.faculty));
  const [program, setProgram] = useState(clean(student.program));
  const [angkatan, setAngkatan] = useState(clean(student.angkatan));
  const input =
    "mt-2 w-full rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-primary";

  return (
    <Modal title="Edit Profil" onClose={onClose}>
      <p className="text-sm text-muted-fg">
        Lengkapi data akademik kamu supaya identitas sebagai mahasiswa kampus ini
        tercatat benar di sistem — termasuk untuk verifikasi saat menghubungi admin.
      </p>
      <label className="mt-4 block font-display text-[15px] font-semibold">Nama Lengkap</label>
      <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
      <label className="mt-4 block font-display text-[15px] font-semibold">NIM</label>
      <input value={nim} onChange={(e) => setNim(e.target.value)} placeholder="Nomor Induk Mahasiswa" className={input} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mt-4 block font-display text-[15px] font-semibold">Fakultas</label>
          <input value={faculty} onChange={(e) => setFaculty(e.target.value)} className={input} />
        </div>
        <div>
          <label className="mt-4 block font-display text-[15px] font-semibold">Program Studi</label>
          <input value={program} onChange={(e) => setProgram(e.target.value)} className={input} />
        </div>
      </div>
      <label className="mt-4 block font-display text-[15px] font-semibold">Angkatan</label>
      <input value={angkatan} onChange={(e) => setAngkatan(e.target.value)} className={input} />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button variant="outline" className="py-3.5" onClick={onClose}>Batal</Button>
        <Button
          className="py-3.5"
          disabled={name.trim().length < 3}
          onClick={() =>
            onSave({
              name: name.trim(),
              nim: nim.trim() || "-",
              faculty: faculty.trim() || "UIN Jakarta",
              program: program.trim() || "Umum",
              angkatan: angkatan.trim(),
            })
          }
        >
          Simpan
        </Button>
      </div>
    </Modal>
  );
}

function BantuanModal({
  onClose, onSend,
}: { onClose: () => void; onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");
  return (
    <Modal title="Bantuan" onClose={onClose}>
      <p className="text-[15px] text-muted-fg">
        Sampaikan kendala atau pertanyaan Anda. Pesan ini dikirim ke admin
        perpustakaan dan akan muncul di notifikasi admin.
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder="Tulis pesan Anda untuk admin..."
        className="mt-4 w-full resize-none rounded-xl border border-line px-4 py-3.5 text-[15px] outline-none focus:border-primary"
      />
      <div className="mt-5 grid grid-cols-2 gap-4">
        <Button variant="outline" className="py-3.5" onClick={onClose}>Batal</Button>
        <Button
          className="py-3.5"
          disabled={message.trim().length < 5}
          onClick={() => onSend(message.trim())}
        >
          <span className="flex items-center justify-center gap-2"><BookOpen size={16} /> Kirim ke Admin</span>
        </Button>
      </div>
    </Modal>
  );
}
