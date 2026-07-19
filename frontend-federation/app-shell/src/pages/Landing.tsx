import { Link } from "react-router-dom";
import {
  BookOpen, GraduationCap, ArrowRight, Copy, Users, Star, Shield,
} from "lucide-react";
import { Card } from "../components/ui";
import { CountUp } from "../components/CountUp";

const FEATURES = [
  "Pinjam & kembalikan buku online",
  "Baca e-book langsung di browser",
  "Pantau riwayat peminjaman",
  "Notifikasi jatuh tempo otomatis",
];

const STATS = [
  { icon: Copy, value: 12000, suffix: "+", label: "Koleksi", desc: "Buku, jurnal, dan e-book akademik" },
  { icon: Users, value: 5800, suffix: "+", label: "Mahasiswa", desc: "Terdaftar aktif di sistem" },
  { icon: Star, value: 4.8, decimals: 1, suffix: "", label: "Rating", desc: "Kepuasan pengguna" },
  { icon: Shield, value: 0, suffix: "", label: "SSO UIN", desc: "Login aman terintegrasi" },
];

export default function Landing() {
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
          <span className="text-[15px] text-muted-fg">© 2026 UIN Jakarta</span>
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
