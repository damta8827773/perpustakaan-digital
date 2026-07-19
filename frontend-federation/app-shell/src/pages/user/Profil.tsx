import { useNavigate } from "react-router-dom";
import {
  Heart, Clock, Lock, Globe, HelpCircle, LogOut, ChevronRight,
} from "lucide-react";
import { STUDENT } from "../../lib/data";
import { Card } from "../../components/ui";
import { CountUp } from "../../components/CountUp";
import { useToast } from "../../components/Toast";
import { useAuth } from "../../lib/auth";

const MENU = [
  { icon: Heart, title: "Wishlist Saya", sub: `${STUDENT.wishlist} buku tersimpan` },
  { icon: Clock, title: "Riwayat Baca", sub: `${STUDENT.readHistory} buku telah dibaca` },
  { icon: Lock, title: "Ubah Password", sub: "" },
  { icon: Globe, title: "Bahasa", sub: "Indonesia" },
  { icon: HelpCircle, title: "Bantuan", sub: "" },
];

export default function Profil() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { notify } = useToast();

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold">Profil Saya</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <div>
          <Card className="flex flex-col items-center p-9 text-center">
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary font-display text-4xl font-bold text-white">
              AF
            </div>
            <h2 className="mt-6 font-display text-[26px] font-bold">{STUDENT.name}</h2>
            <p className="mt-1 text-lg text-muted-fg">{STUDENT.nim}</p>
            <span className="mt-4 rounded-full bg-primary-light px-5 py-2 text-sm font-semibold text-primary">
              {STUDENT.faculty} · {STUDENT.program}
            </span>
          </Card>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              [STUDENT.totalLoans, "Total Pinjaman"] as const,
              [STUDENT.activeLoans, "Sedang Dipinjam"] as const,
              [STUDENT.favorites, "Favorit"] as const,
            ].map(([v, l]) => (
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
            {MENU.map(({ icon: Icon, title, sub }) => (
              <button
                key={title}
                onClick={() => {
                  if (title === "Wishlist Saya") navigate("/app/cari");
                  else if (title === "Riwayat Baca") navigate("/app/pinjaman");
                  else notify(`Membuka "${title}"...`, "info");
                }}
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
    </div>
  );
}
