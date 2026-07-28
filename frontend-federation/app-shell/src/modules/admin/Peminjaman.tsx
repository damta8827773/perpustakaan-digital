import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { ADMIN_LOANS } from "@/common/constants/catalog";
import { Badge, Card } from "@/components/ui";
import { useToast } from "@/components/Toast";

const FILTERS = ["Semua", "Aktif", "Terlambat", "Dikembalikan"] as const;

export default function Peminjaman() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Semua");
  const { notify } = useToast();

  const rows = ADMIN_LOANS.filter((l) => {
    if (filter === "Aktif") return l.status === "aktif";
    if (filter === "Terlambat") return l.status === "terlambat";
    if (filter === "Dikembalikan") return l.status === "dikembalikan";
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => notify("Rentang tanggal: 01 Jun s.d. 17 Jun 2026.", "info")}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-3 text-[15px] text-muted-fg hover:bg-muted"
        >
          <Calendar size={16} /> 01 Jun s.d. 17 Jun 2026
        </button>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-xl px-5 py-3 text-[15px] font-semibold transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "border border-line bg-card hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => notify("Form catat peminjaman baru dibuka.", "info")}
          className="ml-auto flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-[15px] font-bold text-white hover:bg-primary-dark"
        >
          <Plus size={18} /> Catat Peminjaman
        </button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-line bg-bg/60 text-sm uppercase tracking-wider text-muted-fg">
              <th className="px-5 py-4 font-semibold">No</th>
              <th className="px-5 py-4 font-semibold">NIM</th>
              <th className="px-5 py-4 font-semibold">Nama Anggota</th>
              <th className="px-5 py-4 font-semibold">Judul Buku</th>
              <th className="px-5 py-4 font-semibold">Tgl Pinjam</th>
              <th className="px-5 py-4 font-semibold">Tgl Kembali</th>
              <th className="px-5 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((l) => (
              <tr key={l.no} className="hover:bg-bg/40">
                <td className="px-5 py-4 text-muted-fg">{l.no}</td>
                <td className="px-5 py-4 font-mono text-sm text-muted-fg">{l.nim}</td>
                <td className="px-5 py-4 font-semibold">{l.name}</td>
                <td className="px-5 py-4 font-display text-[15px] font-bold">{l.bookTitle}</td>
                <td className="px-5 py-4 text-muted-fg">{l.borrowDate}</td>
                <td className={`px-5 py-4 font-semibold ${l.late ? "text-destructive" : "text-muted-fg"}`}>
                  {l.dueDate}
                </td>
                <td className="px-5 py-4">
                  {l.status === "aktif" && <Badge tone="primary">Aktif</Badge>}
                  {l.status === "terlambat" && <Badge tone="destructive">Terlambat</Badge>}
                  {l.status === "dikembalikan" && <Badge tone="success">Dikembalikan</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
