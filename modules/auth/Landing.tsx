import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, GraduationCap, ArrowRight, Copy, Users, Star, Shield,
  BookMarked, Tablet, History, BellRing, MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui";
import { CountUp } from "@/components/CountUp";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const FEATURES = [
  "Pinjam & kembalikan buku online",
  "Baca e-book langsung di browser",
  "Pantau riwayat peminjaman",
  "Notifikasi jatuh tempo otomatis",
];

interface FeatureDetail {
  icon: typeof BookMarked;
  title: string;
  summary: string;
  detail: string;
  steps: string[];
}

const FEATURE_DETAILS: FeatureDetail[] = [
  {
    icon: BookMarked,
    title: "Pinjam & Kembalikan Buku Online",
    summary: "Reservasi buku fisik tanpa antre di tempat.",
    detail:
      "Cari buku yang tersedia lewat halaman Cari Buku, pilih durasi pinjam sesuai kebutuhan, lalu konfirmasi reservasi - kamu langsung dapat bukti peminjaman digital.",
    steps: [
      "Cari buku yang tersedia di halaman Cari Buku",
      "Pilih durasi pinjam, lalu konfirmasi reservasi",
      "Ambil buku fisik di perpustakaan sesuai jadwal",
      "Kembalikan sebelum tanggal jatuh tempo",
    ],
  },
  {
    icon: Tablet,
    title: "Baca E-book Langsung di Browser",
    summary: "Tanpa aplikasi tambahan, tanpa perlu ke perpustakaan.",
    detail:
      "Buku berlabel E-book bisa dibaca langsung dari browser, kapan saja, lengkap dengan pengatur kenyamanan baca.",
    steps: [
      "Buka menu Baca, pilih e-book yang sedang dipinjam",
      "Atur ukuran huruf & mode gelap sesuai selera",
      "Tandai bab yang sedang dibaca, lanjut kapan saja",
      "Akses berakhir otomatis sesuai durasi pinjam",
    ],
  },
  {
    icon: History,
    title: "Pantau Riwayat Peminjaman",
    summary: "Semua aktivitas tercatat rapi di satu tempat.",
    detail:
      "Setiap peminjaman, baik buku fisik maupun e-book, tercatat di menu Pinjaman Saya dengan status yang selalu jelas.",
    steps: [
      "Lihat status pinjaman aktif & tanggal jatuh tempo",
      "Cek riwayat peminjaman yang sudah selesai",
      "Beri rating & ulasan untuk buku yang pernah dibaca",
    ],
  },
  {
    icon: BellRing,
    title: "Notifikasi Jatuh Tempo Otomatis",
    summary: "Tidak akan lagi lupa tenggat pengembalian.",
    detail:
      "Sistem mengingatkan lewat notifikasi dalam aplikasi, jauh sebelum tenggat waktu terlewat.",
    steps: [
      "Pengingat otomatis menjelang jatuh tempo buku fisik",
      "Pemberitahuan saat masa pinjam e-book akan berakhir",
      "Semua terkumpul rapi di ikon lonceng pada header",
    ],
  },
  {
    icon: MessageCircle,
    title: "Live Chat dengan Admin",
    summary: "Bertanya langsung, dijawab cepat.",
    detail:
      "Punya pertanyaan seputar jam operasional, cara pinjam, atau kendala akun? Chat langsung dari tombol mengambang di pojok layar.",
    steps: [
      "Klik tombol chat mengambang di pojok layar",
      "Pertanyaan umum dijawab otomatis dalam hitungan detik",
      "Admin perpustakaan menindaklanjuti hal yang lebih spesifik",
      "Selalu jelas mana balasan otomatis, mana admin sungguhan",
    ],
  },
];

const STATS = [
  { icon: Copy, value: 12000, suffix: "+", label: "Koleksi", desc: "Buku, jurnal, dan e-book akademik" },
  { icon: Users, value: 5800, suffix: "+", label: "Mahasiswa", desc: "Terdaftar aktif di sistem" },
  { icon: Star, value: 4.8, decimals: 1, suffix: "", label: "Rating", desc: "Kepuasan pengguna" },
  { icon: Shield, value: 0, suffix: "", label: "SSO UIN", desc: "Login aman terintegrasi" },
];

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const active = FEATURE_DETAILS[activeFeature];

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-[88px] max-w-[1140px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Perpustakaan Digital</div>
              <div className="text-sm text-muted-fg">UIN Syarif Hidayatullah Jakarta</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-[15px] text-muted-fg">© 2026 UIN Jakarta</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-6 pb-16">
        <div className="pt-20 text-center">
          <h1 className="font-display text-[44px] font-bold leading-[1.25]">
            Akses Ribuan Koleksi Buku
            <br />
            <span className="text-primary">UIN Jakarta</span> dari Mana Saja
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-lg leading-relaxed text-muted-fg">
            Portal perpustakaan digital untuk mahasiswa UIN Syarif Hidayatullah
            Jakarta. Pinjam, baca, dan pantau koleksi dengan mudah.
          </p>
        </div>

        <Card className="mx-auto mt-14 max-w-[680px] p-9">
          <div className="flex items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
              <GraduationCap size={26} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">Portal Mahasiswa</h2>
              <p className="mt-3 leading-relaxed text-muted-fg">
                Akses koleksi buku, pinjam secara online, baca e-book, dan pantau
                status pengembalian kapan saja.
              </p>
              <ul className="mt-5 space-y-3 text-[15px] text-muted-fg">
                {FEATURES.map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 font-display text-[17px] font-bold text-white hover:bg-primary-dark"
              >
                Masuk sebagai Mahasiswa <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Card>

        <div className="mt-14">
          <h2 className="text-center font-display text-[28px] font-bold">
            Apa yang Bisa Kamu Lakukan di Sini?
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-center text-muted-fg">
            Sebelum masuk, kenali dulu fitur-fitur yang tersedia - klik salah satu
            di sebelah kiri untuk membaca penjelasan lengkapnya.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-line bg-card md:grid-cols-[280px_1fr]">
            <div className="divide-y divide-line border-b border-line md:border-b-0 md:border-r">
              {FEATURE_DETAILS.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => setActiveFeature(i)}
                  className={`flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors ${
                    i === activeFeature ? "bg-primary-light/60" : "hover:bg-muted/60"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      i === activeFeature ? "bg-primary text-white" : "bg-muted text-muted-fg"
                    }`}
                  >
                    <f.icon size={18} />
                  </div>
                  <div>
                    <div className={`font-display text-[15px] font-bold ${i === activeFeature ? "text-primary" : ""}`}>
                      {f.title}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-fg">{f.summary}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Penjelasan lengkap fitur yang dipilih, tampil di sebelah kanan daftar. */}
            <div className="p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <active.icon size={26} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{active.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-fg">{active.detail}</p>

              <div className="mt-6 space-y-3.5 border-t border-line pt-6">
                {active.steps.map((step, i) => (
                  <div key={step} className="flex items-start gap-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light font-display text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, suffix, decimals, label, desc }) => (
            <Card key={label} className="flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon size={22} />
              </div>
              <div>
                <div className="font-display text-[17px] font-bold leading-snug">
                  {value > 0 ? (
                    <>
                      <CountUp value={value} decimals={decimals ?? 0} suffix={suffix} />{" "}
                      {label}
                    </>
                  ) : (
                    label
                  )}
                </div>
                <div className="mt-1 text-sm leading-snug text-muted-fg">{desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
