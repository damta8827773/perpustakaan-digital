import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, BookOpen, AlertCircle, Users } from "lucide-react";
import { ADMIN_STATS, ADMIN_ACTIVITIES, POPULAR_CATEGORIES } from "@/common/constants/catalog";
import { Badge, Card } from "@/components/ui";
import { CountUp } from "@/components/CountUp";

function PopularCategoryBar({ name, count, max }: { name: string; count: number; max: number }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="group">
      <div className="flex items-center justify-between">
        <span className="font-display text-[17px] font-bold">{name}</span>
        <span className="text-[15px] font-semibold text-primary">{count}</span>
      </div>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out group-hover:bg-primary-dark"
          style={{ width: grown ? `${(count / max) * 100}%` : "0%" }}
        />
      </div>
    </div>
  );
}

const STATS = [
  { icon: Copy, value: ADMIN_STATS.totalCollection, label: "Total Koleksi", bg: "bg-primary-light", fg: "text-primary" },
  { icon: BookOpen, value: ADMIN_STATS.borrowedToday, label: "Dipinjam Hari Ini", bg: "bg-[#fdf3d8]", fg: "text-[#b7791f]" },
  { icon: AlertCircle, value: ADMIN_STATS.lateReturns, label: "Terlambat Dikembalikan", bg: "bg-destructive-light", fg: "text-destructive" },
  { icon: Users, value: ADMIN_STATS.activeMembers, label: "Anggota Aktif", bg: "bg-success-light", fg: "text-success" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const max = Math.max(...POPULAR_CATEGORIES.map((c) => c.count));
  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label, bg, fg }) => (
          <Card key={label} className="p-6">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg} ${fg}`}>
              <Icon size={24} />
            </div>
            <div className="mt-5 font-display text-[32px] font-bold">
              <CountUp value={value} />
            </div>
            <div className="mt-1 text-[15px] leading-snug text-muted-fg">{label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Aktivitas Terkini</h2>
          <button
            onClick={() => navigate("/admin/peminjaman")}
            className="cursor-pointer text-[15px] font-semibold text-primary hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        <table className="mt-5 w-full text-left">
          <thead>
            <tr className="border-b border-line text-sm uppercase tracking-wider text-muted-fg">
              <th className="py-3.5 pr-4 font-semibold">No</th>
              <th className="py-3.5 pr-4 font-semibold">Judul Buku</th>
              <th className="py-3.5 pr-4 font-semibold">Peminjam</th>
              <th className="py-3.5 pr-4 font-semibold">Tgl Pinjam</th>
              <th className="py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ADMIN_ACTIVITIES.map((a) => (
              <tr key={a.no}>
                <td className="py-4.5 pr-4 text-muted-fg">{a.no}</td>
                <td className="py-4.5 pr-4 font-display text-[17px] font-bold">
                  {a.bookTitle}
                </td>
                <td className="py-4.5 pr-4">{a.borrower}</td>
                <td className="py-4.5 pr-4 text-muted-fg">{a.date}</td>
                <td className="py-4.5">
                  {a.status === "aktif" ? (
                    <Badge tone="primary" className="uppercase">Aktif</Badge>
                  ) : (
                    <Badge tone="destructive" className="uppercase">
                      Terlambat +{a.lateHours}H
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="p-7">
        <h2 className="font-display text-xl font-bold">Kategori Populer</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-6 lg:grid-cols-5">
          {POPULAR_CATEGORIES.map((c) => (
            <PopularCategoryBar key={c.name} name={c.name} count={c.count} max={max} />
          ))}
        </div>
      </Card>
    </div>
  );
}
