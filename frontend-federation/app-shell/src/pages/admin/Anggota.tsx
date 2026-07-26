import { useState, useSyncExternalStore } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { MEMBERS, type Member } from "../../lib/data";
import { getSsoMembers, subscribe } from "../../lib/membersStore";
import { Badge, Card, Modal } from "../../components/ui";

const FACULTIES = ["Semua", "SAINTEK", "SYARIAH", "FST", "FEBI", "ADAB", "FISIP"];

export default function Anggota() {
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("Semua");
  const [filterOpen, setFilterOpen] = useState(false);
  const [detail, setDetail] = useState<Member | null>(null);
  const ssoMembers = useSyncExternalStore(subscribe, getSsoMembers);
  const all = [...ssoMembers, ...MEMBERS];
  const q = query.trim().toLowerCase();
  const rows = all.filter((m) => {
    if (q && !`${m.name} ${m.nim} ${m.faculty}`.toLowerCase().includes(q)) return false;
    if (faculty !== "Semua" && m.faculty !== faculty) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-fg" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, NIM, atau fakultas..."
            className="w-full rounded-xl border border-line bg-card py-3.5 pl-13 pr-4 text-[15px] outline-none placeholder:text-muted-fg/70 focus:border-primary"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-6 py-3.5 text-[15px] font-semibold hover:bg-muted ${
              faculty !== "Semua" ? "border-primary bg-primary-light text-primary" : "border-line bg-card"
            }`}
          >
            <Filter size={17} /> {faculty === "Semua" ? "Filter" : `Fakultas: ${faculty}`}
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-14 z-20 w-56 overflow-hidden rounded-xl border border-line bg-card py-1.5 shadow-xl">
              {FACULTIES.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFaculty(f);
                    setFilterOpen(false);
                  }}
                  className={`block w-full cursor-pointer px-5 py-2.5 text-left text-[15px] hover:bg-muted ${f === faculty ? "font-bold text-primary" : ""}`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead>
            <tr className="border-b border-line bg-bg/60 text-sm uppercase tracking-wider text-muted-fg">
              <th className="px-5 py-4 font-semibold">NIM</th>
              <th className="px-5 py-4 font-semibold">Nama</th>
              <th className="px-5 py-4 font-semibold">Fakultas</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Pinjaman Aktif</th>
              <th className="px-5 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((m) => (
              <tr key={m.nim} className="hover:bg-bg/40">
                <td className="px-5 py-4 font-mono text-sm text-muted-fg">{m.nim}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <span className="font-semibold" title={m.name}>
                      {m.name.split(" ")[0]}
                    </span>
                    {m.source === "sso" && (
                      <Badge tone="accent" className="uppercase">SSO</Badge>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-fg">{m.faculty}</td>
                <td className="px-5 py-4">
                  {m.status === "aktif" ? (
                    <Badge tone="primary" className="uppercase">Aktif</Badge>
                  ) : (
                    <Badge tone="muted" className="uppercase">Nonaktif</Badge>
                  )}
                </td>
                <td className="px-5 py-4 pl-14 font-semibold">{m.activeLoans}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setDetail(m)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-light"
                  >
                    <Eye size={15} /> Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {detail && (
        <Modal title="Detail Anggota" onClose={() => setDetail(null)}>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              {detail.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="font-display text-xl font-bold">{detail.name}</div>
              <div className="font-mono text-sm text-muted-fg">{detail.nim}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              ["Fakultas", detail.faculty],
              ["Program Studi", detail.program ?? "-"],
              ["Status", detail.status === "aktif" ? "Aktif" : "Nonaktif"],
              ["Pinjaman Aktif", `${detail.activeLoans} buku`],
              ["Sumber Data", detail.source === "sso" ? "Login SSO UIN" : "Input manual"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-bg px-5 py-4">
                <div className="text-sm text-muted-fg">{label}</div>
                <div className="mt-1 font-display font-bold">{value}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
